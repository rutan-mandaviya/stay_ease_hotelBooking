import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Booking, BookingStatus } from './booking.model';
import { Room } from '../rooms/models/room.model';
import { Hotel } from '../hotels/hotel.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { buildResponse } from 'src/common/helpers/response.helper';
import { User, UserRole } from 'src/users/user.model';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { buffer } from 'rxjs/internal/operators/buffer';
import { PdfService } from 'src/common/pdf/pdf.service';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  constructor(
    @InjectModel(Booking) private bookingModel: typeof Booking,
    @InjectModel(Room) private roomModel: typeof Room,
    @InjectQueue('mail-queue') private mailQueue: Queue,
    private pdfService: PdfService,
    private sequelize: Sequelize,
  ) {}

  // 1. Create Booking (Guest)
  async create(dto: CreateBookingDto, userId: string) {
    const { room_id, check_in_date, check_out_date } = dto;
    const transaction = await this.sequelize.transaction();

    try {
      const room = await this.roomModel.findByPk(room_id, {
        transaction,
        lock: transaction.LOCK.UPDATE, // Room row lock
      });

      if (!room) throw new NotFoundException('Room not found');

      // Availability Check
      const overlap = await this.bookingModel.findOne({
        where: {
          room_id,
          status: { [Op.not]: BookingStatus.CANCELLED },
          [Op.and]: [
            { check_in_date: { [Op.lt]: check_out_date } },
            { check_out_date: { [Op.gt]: check_in_date } },
          ],
        },
        transaction,
      });

      if (overlap)
        throw new BadRequestException('Room is already booked for these dates');

      const nights = Math.ceil(
        (new Date(check_out_date).getTime() -
          new Date(check_in_date).getTime()) /
          (1000 * 3600 * 24),
      );
      const total_price = nights * room.price_per_night;

      const booking = await this.bookingModel.create(
        {
          ...dto,
          user_id: userId,
          total_price,
          status: BookingStatus.PENDING,
        } as any,
        { transaction },
      );

      await transaction.commit();
      return booking;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  // 2. List Bookings (Admin sees all, Guest sees own)
  async findAll(userId: string, role: UserRole, query: GetBookingsQueryDto) {
    const { page = 1, limit = 10, status } = query;

    const offset = (Number(page) - 1) * Number(limit);

    // Build Filter
    const where: Record<string, any> =
      role === UserRole.ADMIN ? {} : { user_id: userId };
    if (status) where.status = status;

    const { rows, count } = await this.bookingModel.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      include: [
        {
          model: Room,
          attributes: ['id', 'room_number', 'price_per_night'],
          include: [
            {
              model: Hotel,
              attributes: ['id', 'name', 'city'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return buildResponse(HttpStatus.OK, 'Bookings fetched', {
      totalItems: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: page,
      items: rows,
    });
  }

  // 3. Booking Detail
  async findOne(id: string, userId: string, role: UserRole) {
    const booking = await this.bookingModel.findByPk(id, {
      include: [
        {
          model: Room,
          attributes: ['id', 'room_number', 'price_per_night'],
          include: [
            {
              model: Hotel,
              attributes: ['id', 'name', 'city'],
            },
          ],
        },
      ],
    });

    if (!booking) throw new NotFoundException('Booking not found');

    // Authorization: Only owner of booking, hotel owner, or admin
    if (role === UserRole.GUEST && booking.user_id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return buildResponse(HttpStatus.OK, 'Booking detail', booking);
  }

  // 4. Cancel Booking (Guest)
  async cancel(id: string, userId: string) {
    const booking = await this.bookingModel.findByPk(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.user_id !== userId)
      throw new ForbiddenException('Not your booking');

    const now = new Date();
    const checkIn = new Date(booking.check_in_date);

    // 1. Check if it's too late (Already checked in or past)
    if (checkIn <= now) {
      throw new BadRequestException(
        'Cannot cancel on or after the check-in date',
      );
    }

    // 2. Calculate Refund Percentage
    const hoursDiff = (checkIn.getTime() - now.getTime()) / (1000 * 3600);
    let refundAmount = Number(booking.total_price);

    if (hoursDiff < 24) {
      refundAmount = refundAmount * 0.5; // 50% penalty
    }

    // 3. Update status and log refund (Database mein 'refund_amount' column add kar sakte hain)
    await booking.update({
      status: BookingStatus.CANCELLED,
      // total_price: refundAmount // Optional: Refund ke baad bacha hua amount update karein
    });

    return buildResponse(
      HttpStatus.OK,
      `Booking cancelled. Refund of ₹${refundAmount} initiated.`,
      { refundAmount },
    );
  }

  // 5. Confirm Booking (Admin/Owner)
  // Admin confirm logic ko Payment confirmation se sync karein
  async confirm(id: string) {
    const booking = await this.bookingModel.findByPk(id, { include: [User] });
    if (!booking) throw new NotFoundException('Booking not found');

    // Status update
    await booking.update({ status: BookingStatus.CONFIRMED, is_paid: true });

    // Use the same Queue as Payment for consistency
    await this.mailQueue.add('send-invoice', {
      bookingId: booking.id,
      email: booking.user.email,
    });

    return buildResponse(HttpStatus.OK, 'Booking confirmed manually', booking);
  }

  // bookings.service.ts

  async getInvoiceBuffer(id: string): Promise<Buffer> {
    // 1. Fetch Booking with ALL relations
    const booking = await this.bookingModel.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
        {
          model: Room,
          attributes: ['room_number', 'room_type'],
          include: [
            {
              model: Hotel,
              attributes: ['name', 'city', 'address'],
            },
          ],
        },
      ],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found to generate invoice');
    }

    if (!booking.is_paid) {
      throw new BadRequestException(
        'Invoice can only be generated for paid bookings',
      );
    }

    // 2. Use PdfService to create the actual Buffer
    // Humne wahi method use kiya jo BullMQ processor mein use ho raha hai
    try {
      const buffer = await this.pdfService.generateBookingInvoice(booking);
      return buffer;
    } catch (error) {
      this.logger.error(`PDF Generation Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to generate PDF buffer');
    }
  }
}

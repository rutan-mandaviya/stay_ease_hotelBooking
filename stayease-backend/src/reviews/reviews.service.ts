import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './review.model';
import { Booking, BookingStatus } from 'src/bookings/booking.model';
import { Room } from 'src/rooms/models/room.model';
import { CreateReviewDto } from './dto/create-review.dto';
import { buildResponse } from 'src/common/helpers/response.helper';
import { UserRole } from 'src/users/user.model';
import { User } from 'src/users/user.model';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review) private reviewModel: typeof Review,
    @InjectModel(Booking) private bookingModel: typeof Booking,
  ) {}

  async create(dto: CreateReviewDto, userId: string) {
    
    const booking = await this.bookingModel.findOne({
      where: {
        id: dto.booking_id,
        user_id: userId,
        status: BookingStatus.COMPLETED,
      },
      include: [{ model: Room, attributes: ['hotel_id'] }],
    });

    if (!booking) {
      throw new BadRequestException('Invalid booking or stay not completed.');
    }

    // Validation is now properly handled by class-validator in DTO

    
    const existing = await this.reviewModel.findOne({
      where: { booking_id: dto.booking_id },
    });
    if (existing)
      throw new BadRequestException('You already reviewed this stay.');

    
    const review = await this.reviewModel.create({
      ...dto,
      user_id: userId,
      hotel_id: booking.room.hotel_id,
    });

    return buildResponse(
      HttpStatus.CREATED,
      'Review posted successfully!',
      review,
    );
  }

  async findByHotel(hotelId: string, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.reviewModel.findAndCountAll({
      where: { hotel_id: hotelId },
      attributes: ['id', 'rating', 'comment', 'createdAt'], 
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'], 
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });

    return buildResponse(HttpStatus.OK, 'Reviews fetched', {
      reviews: rows,
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
    });
  }

  async remove(id: string, userId: string, role: UserRole) {
    const review = await this.reviewModel.findByPk(id);
    if (!review) throw new NotFoundException('Review not found');

    
    if (role !== UserRole.ADMIN && review.user_id !== userId) {
      throw new ForbiddenException('Unauthorized to delete this review.');
    }

    await review.destroy();
    return buildResponse(HttpStatus.OK, 'Review deleted');
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking, BookingStatus } from 'src/bookings/booking.model';
import { Hotel } from 'src/hotels/hotel.model';
import { Room } from 'src/rooms/models/room.model';
import { User } from 'src/users/user.model';
import { Op, Sequelize } from 'sequelize';
import { buildResponse } from 'src/common/helpers/response.helper';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(Booking) private bookingModel: typeof Booking,
    @InjectModel(Hotel) private hotelModel: typeof Hotel,
  ) {}

  async getOwnerFullDashboard(ownerId: string) {
    const hotels = await this.hotelModel.findAll({
      where: { owner_id: ownerId },
      attributes: ['id'],
    });

    const hotelIds = hotels.map((h) => h.id);
    if (hotelIds.length === 0) {
      return buildResponse(HttpStatus.OK, 'No hotels found', {
        stats: { totalRevenue: 0, totalBookings: 0 },
        breakdown: [],
        recentBookings: [],
      });
    }

    const stats = (await this.bookingModel.findOne({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('total_price')), 'revenue'],
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'totalBookings'],
      ],
      include: [
        {
          model: Room,
          where: { hotel_id: { [Op.in]: hotelIds } },
          attributes: [],
        },
      ],
      where: {
        status: { [Op.in]: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
      },
      raw: true,
    })) as any;

    const breakdown = await this.bookingModel.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'count'],
      ],
      include: [
        {
          model: Room,
          where: { hotel_id: { [Op.in]: hotelIds } },
          attributes: [],
        },
      ],
      group: ['status'],
      raw: true,
    });

    const recentBookings = await this.bookingModel.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
        {
          model: Room,
          attributes: ['room_number', 'room_type'],
          include: [{ model: Hotel, attributes: ['name'] }],
        },
      ],
      where: {
        '$room.hotel_id$': { [Op.in]: hotelIds },
      } as any,
    });

    return buildResponse(HttpStatus.OK, 'Owner dashboard data fetched', {
      stats: {
        totalRevenue: parseFloat(stats?.revenue || 0),
        totalBookings: parseInt(stats?.totalBookings || 0),
      },
      statusBreakdown: breakdown,
      recentBookings: recentBookings,
    });
  }
}

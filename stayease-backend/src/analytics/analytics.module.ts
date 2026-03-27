import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Booking } from 'src/bookings/booking.model';
import { Hotel } from 'src/hotels/hotel.model';
import { Room } from 'src/rooms/models/room.model';

@Module({
  imports: [SequelizeModule.forFeature([Booking, Hotel, Room])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

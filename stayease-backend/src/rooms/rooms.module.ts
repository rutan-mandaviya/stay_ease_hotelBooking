import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoomImage } from './models/room-image.model';
import { Room } from './models/room.model';
import { Hotel } from 'src/hotels/hotel.model';
import { RoomsController } from './rooms.controller';
import { Booking } from 'src/bookings/booking.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Room, RoomImage, Hotel, Booking, RoomImage]),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
  exports: [RoomsService, SequelizeModule],
})
export class RoomsModule {}

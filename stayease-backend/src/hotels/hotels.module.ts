import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Hotel } from './hotel.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from 'src/rooms/models/room.model';

@Module({
  imports: [SequelizeModule.forFeature([Hotel, Room])],
  providers: [HotelsService],
  controllers: [HotelsController],
  exports: [SequelizeModule],
})
export class HotelsModule {}

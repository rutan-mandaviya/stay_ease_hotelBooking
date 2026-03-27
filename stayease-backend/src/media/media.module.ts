import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoomImage } from 'src/rooms/models/room-image.model';
import { Room } from 'src/rooms/models/room.model';
import { MediaController } from './media.controller';
import { RoomsModule } from 'src/rooms/rooms.module';

// src/media/media.module.ts
@Module({
  imports: [
    RoomsModule,
    SequelizeModule.forFeature([Room, RoomImage]), // Model access
  ],
  controllers: [MediaController],
})
export class MediaModule {}

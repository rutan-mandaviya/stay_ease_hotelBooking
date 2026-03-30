import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './models/room.model';
import { RoomImage } from './models/room-image.model';
import { Hotel } from '../hotels/hotel.model';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { buildResponse } from 'src/common/helpers/response.helper';
import * as fs from 'fs';
import * as path from 'path';
import { Booking } from 'src/bookings/booking.model';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room) private roomModel: typeof Room,
    @InjectModel(RoomImage) private imageModel: typeof RoomImage,
    @InjectModel(Hotel) private hotelModel: typeof Hotel,
  ) {}

  
  async create(hotelId: string, dto: CreateRoomDto, userId: string) {
    const hotel = await this.hotelModel.findByPk(hotelId);
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (hotel.owner_id !== userId) {
      throw new ForbiddenException('You do not own this hotel');
    }

    const room = await this.roomModel.create({
      ...dto,
      hotel_id: hotelId,
    } as Room);
    return buildResponse(HttpStatus.CREATED, 'Room added successfully', room);
  }

  
  async findAll(hotelId: string) {
    const rooms = await this.roomModel.findAll({
      where: { hotel_id: hotelId, is_active: true },
      include: [{ model: RoomImage, attributes: ['id', 'image_url'] }],
    });
    return buildResponse(HttpStatus.OK, 'Rooms fetched successfully', rooms);
  }

  
  async findOne(id: string) {
    const room = await this.roomModel.findByPk(id, {
      include: [
        {
          model: RoomImage,
          attributes: ['id', 'image_url', 'created_at', 'updated_at'],
        },
        { model: Hotel, attributes: ['name', 'city'] },
      ],
    });
    if (!room) throw new NotFoundException('Room not found');
    return buildResponse(HttpStatus.OK, 'Room details fetched', room);
  }

  
  async update(id: string, dto: UpdateRoomDto, userId: string) {
    const room = await this.roomModel.findByPk(id, {
      include: [{ model: Hotel, attributes: ['owner_id', 'name', 'city'] }],
    });
    if (!room) throw new NotFoundException('Room not found');

    if (room.hotel.owner_id !== userId) {
      throw new ForbiddenException('You are not authorized to edit this room');
    }

    await room.update(dto);
    return buildResponse(HttpStatus.OK, 'Room updated successfully', room);
  }

  
  async uploadImages(
    roomId: string,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const room = await this.roomModel.findByPk(roomId, {
      include: [{ model: Hotel, attributes: ['owner_id'] }],
    });

    if (!room) throw new NotFoundException('Room not found');
    if (room.hotel.owner_id !== userId)
      throw new ForbiddenException('Access denied');

    const imageData = files.map((file) => ({
      room_id: roomId,
      image_url: `/uploads/rooms/${file.filename}`,
    }));

    const images = await this.imageModel.bulkCreate(imageData as RoomImage[]);
    return buildResponse(
      HttpStatus.CREATED,
      'Images uploaded successfully',
      images,
    );
  }

  async removeImage(imageId: string, userId: string) {
    const image = await this.imageModel.findByPk(imageId, {
      include: [
        { model: Room, include: [{ model: Hotel, attributes: ['owner_id'] }] },
      ],
    });

    if (!image) throw new NotFoundException('Image record not found');

    const filePath = path.join(process.cwd(), image.image_url);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('File deleted from storage:', filePath);
      } else {
        console.warn('File not found on disk at:', filePath);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Physical deletion error:', message);
    }

    if (image.room && image.room.hotel) {
      if (image.room.hotel.owner_id !== userId) {
        throw new ForbiddenException('You do not own this property');
      }
    } else {
      
      console.log('Cleaning up orphaned record with no linked room/hotel');
    }

    
    await image.destroy();

    const finalMessage =
      !image.room || !image.room.hotel
        ? 'Orphaned image and file removed'
        : 'Image and file removed successfully';

    return buildResponse(HttpStatus.OK, finalMessage, null);
  }

  

  

  async remove(id: string, userId: string) {
    const room = await this.roomModel.findByPk(id, {
      include: [{ model: Hotel, attributes: ['owner_id'] }],
    });

    if (!room) throw new NotFoundException('Room not found');

    
    if (room.hotel.owner_id !== userId) {
      throw new ForbiddenException('Bhai, ye aapka room nahi hai!');
    }

    
    await room.update({ is_active: false });

    return buildResponse(
      HttpStatus.OK,
      'Room is now inactive and hidden from guests.',
    );
  }
}

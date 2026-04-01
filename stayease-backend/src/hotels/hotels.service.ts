import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Hotel } from './hotel.model';
import { User } from '../users/user.model';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { UserRole } from '../users/user.model';
import { buildResponse } from 'src/common/helpers/response.helper';
import { Room } from 'src/rooms/models/room.model';
import { RoomImage } from 'src/rooms/models/room-image.model';
import { Review } from 'src/reviews/review.model';

@Injectable()
export class HotelsService {
  constructor(@InjectModel(Hotel) private hotelModel: typeof Hotel) {}

  async create(
    dto: CreateHotelDto,
    ownerId: string,
    file?: Express.Multer.File,
  ) {
    const hotel = await this.hotelModel.create({
      ...dto,
      owner_id: ownerId,
      cover_image: file ? file.filename : null,
    });

    return buildResponse(
      HttpStatus.CREATED,
      'Hotel created successfully with cover image',
      hotel,
    );
  }

  async findAll(query: HotelQueryDto) {
    const { page = 1, limit = 10, city, search, minPrice, maxPrice } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = { is_active: true };

    if (city) where.city = { [Op.like]: `%${city}%` };
    if (search) where.name = { [Op.like]: `%${search}%` };

    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || 999999;
      where.id = {
        [Op.in]: Sequelize.literal(`(
        SELECT hotel_id FROM rooms 
        WHERE price_per_night BETWEEN ${min} AND ${max}
        AND is_active = true
      )`),
      };
    }

    const { rows, count } = await this.hotelModel.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 0),
            'avg_rating',
          ],
          [
            Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('reviews.id'))),
            'total_reviews',
          ],
          [
            Sequelize.fn('MIN', Sequelize.col('rooms.price_per_night')),
            'starting_price',
          ],
        ],
      },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name'] },
        { model: Room, as: 'rooms', attributes: ['id', 'price_per_night'], include: [RoomImage] },
        { model: Review, attributes: [] },
      ],
      group: ['Hotel.id', 'owner.id', 'rooms.id', 'rooms->images.id'],
      order: [['created_at', 'DESC']],
      distinct: true,
    });

    const totalCount = Array.isArray(count) ? count.length : count;

    return buildResponse(HttpStatus.OK, 'Hotels fetched successfully', {
      hotels: rows,
      meta: {
        total: totalCount,
        page: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
      },
    });
  }

  async findOwnerHotels(ownerId: string) {
    const hotels = await this.hotelModel.findAll({
      where: { owner_id: ownerId },
      subQuery: false,
      attributes: {
        include: [
          [
            Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 0),
            'avg_rating',
          ],
          [
            Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('reviews.id'))),
            'total_reviews',
          ],
        ],
      },
      include: [
        { model: Room, as: 'rooms', attributes: ['id'] },
        { model: Review, attributes: [] },
      ],
      group: ['Hotel.id', 'rooms.id'],
      order: [['created_at', 'DESC']],
    });

    return buildResponse(HttpStatus.OK, 'Owner hotels fetched', hotels);
  }
  async findOne(id: string) {
    try {
      const hotel = await this.hotelModel.findByPk(id, {
        subQuery: false,
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Room,
            as: 'rooms',
            include: [
              { model: RoomImage, as: 'images', attributes: ['image_url'] },
            ],
          },
          { model: Review, attributes: [] },
        ],
        attributes: {
          include: [
            [
              Sequelize.fn('COALESCE', Sequelize.fn('AVG', Sequelize.col('reviews.rating')), 0),
              'avg_rating',
            ],
            [
              Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('reviews.id'))),
              'total_reviews',
            ],
          ],
        },
        group: ['Hotel.id', 'owner.id', 'rooms.id', 'rooms->images.id'],
      });

      if (!hotel) throw new NotFoundException('Hotel not found');

      return buildResponse(HttpStatus.OK, 'Hotel details retrieved', hotel);
    } catch (error) {
      console.error('DEBUG ERROR:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, dto: UpdateHotelDto, userId: string) {
    const hotel = await this.hotelModel.findByPk(id);
    if (!hotel) throw new NotFoundException('Hotel not found');

    this.checkOwnership(hotel, userId);

    await hotel.update(dto);
    return buildResponse(HttpStatus.OK, 'Hotel updated successfully', hotel);
  }

  async remove(id: string, user: { id: string; role: UserRole }) {
    const hotel = await this.hotelModel.findByPk(id);
    if (!hotel) throw new NotFoundException('Hotel not found');

    if (user.role !== UserRole.ADMIN) {
      this.checkOwnership(hotel, user.id);
    }

    await hotel.update({ is_active: false });
    return buildResponse(HttpStatus.OK, 'Hotel deactivated successfully', null);
  }

  async toggleStatus(id: string) {
    const hotel = await this.hotelModel.findByPk(id);
    if (!hotel) throw new NotFoundException('Hotel not found');

    const newStatus = !hotel.is_active;
    await hotel.update({ is_active: newStatus });

    return buildResponse(
      HttpStatus.OK,
      `Hotel is now ${newStatus ? 'active' : 'inactive'}`,
      null,
    );
  }

  private checkOwnership(hotel: Hotel, userId: string) {
    if (hotel.owner_id !== userId) {
      throw new ForbiddenException(
        'Access denied: You are not the owner of this hotel',
      );
    }
  }
}

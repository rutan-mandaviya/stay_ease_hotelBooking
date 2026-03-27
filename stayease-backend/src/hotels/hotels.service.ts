import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, WhereOptions } from 'sequelize';
import { Hotel } from './hotel.model';
import { User } from '../users/user.model';
// import { Review } from '../reviews/review.model'; // Future reference for Module 6
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { UserRole } from '../users/user.model';
import { buildResponse } from 'src/common/helpers/response.helper';
import { Room } from 'src/rooms/models/room.model';
import { RoomImage } from 'src/rooms/models/room-image.model';

@Injectable()
export class HotelsService {
  constructor(@InjectModel(Hotel) private hotelModel: typeof Hotel) {}

  // ── CREATE ──────────────────────────────────────────────
  async create(
    dto: CreateHotelDto,
    ownerId: string,
    file?: Express.Multer.File,
  ) {
    const hotel = await this.hotelModel.create({
      ...dto,
      owner_id: ownerId,
      cover_image: file ? file.filename : null, // Make sure aapke Hotel model mein 'images' column hai
    });

    return buildResponse(
      HttpStatus.CREATED,
      'Hotel created successfully with cover image',
      hotel,
    );
  }
  // ── LIST (Public with Pagination & Search) ──────────────
  async findAll(query: HotelQueryDto) {
    const { page = 1, limit = 10, city, search, minPrice, maxPrice } = query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = { is_active: true };

    if (city) where.city = { [Op.like]: `%${city}%` };
    if (search) where.name = { [Op.like]: `%${search}%` };

    // ✨ Price Filter Logic (Subquery)
    if (minPrice || maxPrice) {
      const min = minPrice || 0;
      const max = maxPrice || 999999;
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
      attributes: {
        include: [
          // Average Rating
          [
            Sequelize.literal(
              `(SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviews.hotel_id = Hotel.id)`,
            ),
            'avg_rating',
          ],
          // Total Reviews
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM reviews WHERE reviews.hotel_id = Hotel.id)`,
            ),
            'total_reviews',
          ],
          // ✨ Get Starting Price (Min Price among all active rooms)
          [
            Sequelize.literal(
              `(SELECT MIN(price_per_night) FROM rooms WHERE rooms.hotel_id = Hotel.id AND rooms.is_active = true)`,
            ),
            'starting_price',
          ],
        ],
      },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name'] },
        { model: Room, as: 'rooms', attributes: ['id'], include: [RoomImage] },
      ],
      order: [['created_at', 'DESC']],
      distinct: true,
    });

    return buildResponse(HttpStatus.OK, 'Hotels fetched successfully', {
      hotels: rows,
      meta: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  }

  // Method ka naam fixed: findOwnerHotels
  async findOwnerHotels(ownerId: string) {
    const hotels = await this.hotelModel.findAll({
      where: { owner_id: ownerId },
      attributes: {
        include: [
          [
            Sequelize.literal(
              `(SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviews.hotel_id = Hotel.id)`,
            ),
            'avg_rating',
          ],
          [
            Sequelize.literal(
              `(SELECT COUNT(*) FROM reviews WHERE reviews.hotel_id = Hotel.id)`,
            ),
            'total_reviews',
          ],
        ],
      },
      include: [{ model: Room, as: 'rooms', attributes: ['id'] }],
      order: [['created_at', 'DESC']],
    });

    return buildResponse(HttpStatus.OK, 'Owner hotels fetched', hotels);
  } // ── DETAIL (With Average Rating Logic) ──────────────────
  async findOne(id: string) {
    try {
      const hotel = await this.hotelModel.findByPk(id, {
        include: [
          {
            model: User,
            as: 'owner',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Room, // Room ko yahan include karein, User ke andar nahi
            as: 'rooms', // Ensure this alias exists in Hotel model
            include: [
              { model: RoomImage, as: 'images', attributes: ['image_url'] },
            ], // Room images ke liye
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
              SELECT COALESCE(AVG(rating), 0) 
              FROM reviews 
              WHERE reviews.hotel_id = "${id}"
            )`),
              'avg_rating',
            ],
            [
              Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM reviews 
              WHERE reviews.hotel_id = "${id}"
            )`),
              'total_reviews',
            ],
          ],
        },
      });

      if (!hotel) throw new NotFoundException('Hotel not found');

      return buildResponse(HttpStatus.OK, 'Hotel details retrieved', hotel);
    } catch (error) {
      console.error('DEBUG ERROR:', error); // Terminal mein asli error yahan dikhega
      throw new InternalServerErrorException(error.message);
    }
  }

  // ── UPDATE ──────────────────────────────────────────────
  async update(id: string, dto: UpdateHotelDto, userId: string) {
    // findByPk use karke directly model instance nikalte hain
    const hotel = await this.hotelModel.findByPk(id);
    if (!hotel) throw new NotFoundException('Hotel not found');

    this.checkOwnership(hotel, userId);

    await hotel.update(dto);
    return buildResponse(HttpStatus.OK, 'Hotel updated successfully', hotel);
  }

  // ── SOFT DELETE ─────────────────────────────────────────
  async remove(id: string, user: { id: string; role: UserRole }) {
    const hotel = await this.hotelModel.findByPk(id);
    if (!hotel) throw new NotFoundException('Hotel not found');

    // Admin can delete anything, Owner can only delete their own
    if (user.role !== UserRole.ADMIN) {
      this.checkOwnership(hotel, user.id);
    }

    await hotel.update({ is_active: false });
    return buildResponse(HttpStatus.OK, 'Hotel deactivated successfully', null);
  }

  // ── TOGGLE STATUS (Admin Only) ──────────────────────────
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

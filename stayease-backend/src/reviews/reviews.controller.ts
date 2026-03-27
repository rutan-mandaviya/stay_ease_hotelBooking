import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1. POST /reviews — Guest only, for completed bookings
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GUEST)
  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req: { user: JwtPayloadDto }) {
    return this.reviewsService.create(dto, req.user.id);
  }

  // 2. GET /reviews/hotel/:hotelId — Public reviews list for a hotel
  @Get('hotel/:hotelId')
  findByHotel(@Param('hotelId') hotelId: string) {
    return this.reviewsService.findByHotel(hotelId);
  }

  // 3. DELETE /reviews/:id — Delete own review or any if Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.GUEST, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: JwtPayloadDto }) {
    return this.reviewsService.remove(id, req.user.id, req.user.role);
  }
}

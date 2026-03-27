import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from './review.model';
import { Booking } from 'src/bookings/booking.model';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [SequelizeModule.forFeature([Review, Booking])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}

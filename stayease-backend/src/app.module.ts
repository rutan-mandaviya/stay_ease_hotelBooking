import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.model';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { Room } from './rooms/models/room.model';
import { RoomImage } from './rooms/models/room-image.model';
import { Hotel } from './hotels/hotel.model';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/booking.model';
import { ScheduleModule } from '@nestjs/schedule';
import { PdfService } from './common/pdf/pdf.service';
import { MediaModule } from './media/media.module';
import { MailModule } from './common/mail/mail.module';
import { PdfModule } from './common/pdf/pdf.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/review.model';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { AnalyticsModule } from './analytics/analytics.module';
import { BullModule } from '@nestjs/bullmq';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/payment.model';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        models: [User, Hotel, Room, RoomImage, Booking, Review, Payment],
        autoLoadModels: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        defaultOptions: {
          removeOnComplete: true,
        },  
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    HotelsModule,
    RoomsModule,
    BookingsModule,
    MediaModule,
    MailModule,
    PdfModule,
    ReviewsModule,
    AnalyticsModule,

    PaymentsModule,
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, UsersService, PdfService, AnalyticsService],
})
export class AppModule {}

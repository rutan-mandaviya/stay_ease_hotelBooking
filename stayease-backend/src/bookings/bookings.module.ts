import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { Room } from 'src/rooms/models/room.model';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Hotel } from 'src/hotels/hotel.model';
import { BookingsCronService } from './cron/bookings-cron.service';
import { MailModule } from 'src/common/mail/mail.module';
import { PdfModule } from 'src/common/pdf/pdf.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    SequelizeModule.forFeature([Booking, Room, Hotel]),
    MailModule,
    PdfModule,
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],

  controllers: [BookingsController],
  providers: [BookingsService, BookingsCronService],
  exports: [SequelizeModule, BookingsService],
})
export class BookingsModule {}

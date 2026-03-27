import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Payment } from './payment.model';
import { Booking } from 'src/bookings/booking.model';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailModule } from 'src/common/mail/mail.module';
import { PdfModule } from 'src/common/pdf/pdf.module';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Booking]),
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    MailModule,
    PdfModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailProcessor],
})
export class PaymentsModule {}

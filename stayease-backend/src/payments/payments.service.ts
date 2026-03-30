import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment, PaymentStatus } from './payment.model';
import { Booking, BookingStatus } from 'src/bookings/booking.model';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { buildResponse } from 'src/common/helpers/response.helper';
import { MailService } from 'src/common/mail/mail.service';
import { PdfService } from 'src/common/pdf/pdf.service';

import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(Booking) private bookingModel: typeof Booking,
    private config: ConfigService,
    @InjectQueue('mail-queue') private mailQueue: Queue,
    private pdfService: PdfService,
    private mailService: MailService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY')!);
  }

  async createIntent(bookingId: string) {
    const booking = await this.bookingModel.findByPk(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    let payment = await this.paymentModel.findOne({
      where: { booking_id: bookingId, status: PaymentStatus.PENDING },
    });

    let clientSecret: string | null;

    if (payment) {
      const intent = await this.stripe.paymentIntents.retrieve(
        payment.stripe_intent_id,
      );
      clientSecret = intent.client_secret;
    } else {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(booking.total_price * 100),
        currency: 'inr',
        metadata: { booking_id: booking.id },
      });

      payment = await this.paymentModel.create({
        booking_id: booking.id,
        amount: booking.total_price,
        stripe_intent_id: intent.id,
        status: PaymentStatus.PENDING,
      } as any);

      clientSecret = intent.client_secret;
    }

    return buildResponse(HttpStatus.CREATED, 'Payment intent ready', {
      clientSecret,
      paymentId: payment.id,
    });
  }

  async markAsPaid(bookingId: string) {
    const transaction = await this.bookingModel.sequelize!.transaction();

    try {
      const payment = await this.paymentModel.findOne({
        where: { booking_id: bookingId },
        include: [{ model: Booking, include: ['user'] }],
        transaction,
      });

      if (!payment) throw new NotFoundException('Payment not found');
      if (payment.status === PaymentStatus.PAID) return payment;

      const intent = await this.stripe.paymentIntents.retrieve(
        payment.stripe_intent_id,
      );
      if (intent.status !== 'succeeded')
        throw new BadRequestException('Payment not verified');

      await payment.update({ status: PaymentStatus.PAID }, { transaction });
      await payment.booking.update(
        { status: BookingStatus.CONFIRMED, is_paid: true },
        { transaction },
      );

      await transaction.commit();

      await this.mailQueue.add('send-invoice', {
        bookingId: payment.booking_id,
        email: payment.booking.user.email,
      });

      return buildResponse(
        HttpStatus.OK,
        'Payment verified and confirmed',
        payment,
      );
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getByBooking(bookingId: string) {
    const payment = await this.paymentModel.findOne({
      where: { booking_id: bookingId },
    });
    if (!payment)
      throw new NotFoundException('Payment not found for this booking');
    return buildResponse(HttpStatus.OK, 'Payment details fetched', payment);
  }

  async refund(id: string) {
    const payment = await this.paymentModel.findByPk(id);
    if (!payment || payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Only PAID payments can be refunded');
    }

    await this.stripe.refunds.create({
      payment_intent: payment.stripe_intent_id,
    });

    payment.status = PaymentStatus.REFUNDED;
    await payment.save();

    await this.bookingModel.update(
      { status: BookingStatus.CANCELLED },
      { where: { id: payment.booking_id } },
    );

    return buildResponse(
      HttpStatus.OK,
      'Refund processed and booking cancelled',
    );
  }
}

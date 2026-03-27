import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  BOOKING_CONFIRMATION_TEMPLATE,
  BookingConfirmationTemplateData,
} from '../constants/mail-templates';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  // REUSABLE GENERIC METHOD

  async sendMail(
    to: string,
    subject: string,
    template: string,
    attachments?: any[],
  ) {
    try {
      await this.transporter.sendMail({
        from: `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('MAIL_FROM_EMAIL')}>`,
        to,
        subject,
        html: template,
        attachments,
      });

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Mail Error: ${(error as Error).message}`);
      return false;
    }
  }
  // SPECIFIC WRAPPER FOR BOOKINGS
  async sendBookingConfirmation(
    to: string,
    data: BookingConfirmationTemplateData,
    pdfBuffer: Buffer,
  ) {
    const html = BOOKING_CONFIRMATION_TEMPLATE(data);
    const attachments = [
      {
        filename: `Invoice-${data.id.split('-')[0]}.pdf`,
        content: pdfBuffer,
      },
    ];
    return this.sendMail(
      to,
      'StayEase - Booking Confirmed!',
      html,
      attachments,
    );
  }
}

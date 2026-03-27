import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from 'src/bookings/booking.model';
import { User } from 'src/users/user.model';
import { Room } from 'src/rooms/models/room.model';
import { Hotel } from 'src/hotels/hotel.model';
import { PdfService } from 'src/common/pdf/pdf.service';
import { MailService } from 'src/common/mail/mail.service';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    @InjectModel(Booking) private bookingModel: typeof Booking,
    private pdfService: PdfService,
    private mailService: MailService,
  ) {
    super();
  }

  async process(job: Job<{ bookingId: string; email: string }>): Promise<any> {
    const { bookingId, email } = job.data;
    this.logger.log(`Processing invoice for Booking ID: ${bookingId}`);

    try {
      // 1. Fetch Full Booking Details (Taaki PDF mein Hotel/Room name aa sake)
      const booking = await this.bookingModel.findByPk(bookingId, {
        include: [
          { model: User, attributes: ['name', 'email'] },
          {
            model: Room,
            include: [
              { model: Hotel, attributes: ['name', 'city', 'address'] },
            ],
          },
        ],
      });

      if (!booking) {
        this.logger.error(`Booking ${bookingId} not found in processor`);
        return;
      }

      // 2. Generate PDF Buffer
      const pdfBuffer = await this.pdfService.generateBookingInvoice(booking);

      // 3. Send Email
      await this.mailService.sendBookingConfirmation(email, booking, pdfBuffer);

      this.logger.log(`✅ Invoice successfully sent to: ${email}`);
      return { status: 'success' };
    } catch (error) {
      this.logger.error(`❌ Failed to process invoice job: ${error.message}`);
      throw error; // BullMQ automatically retry karega
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Booking, BookingStatus } from '../booking.model';
import { Op } from 'sequelize';

@Injectable()
export class BookingsCronService {
  private readonly logger = new Logger(BookingsCronService.name);

  constructor(@InjectModel(Booking) private bookingModel: typeof Booking) {}

  
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCheckoutAutomation() {
    this.logger.log('Running Auto-Complete Cron Job...');

    const today = new Date().toISOString().split('T')[0];

    const [affectedCount] = await this.bookingModel.update(
      { status: BookingStatus.COMPLETED },
      {
        where: {
          status: BookingStatus.CONFIRMED,
          check_out_date: { [Op.lt]: today },
        },
      },
    );

    this.logger.log(
      `Automation Done: ${affectedCount} bookings marked as COMPLETED.`,
    );
  }
}

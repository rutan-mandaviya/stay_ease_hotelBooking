import { Controller, Get, Post, Patch, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import {
  ApiPayments,
  ApiCreateIntent,
  ApiGetPayment,
  ApiMarkPaid,
  ApiRefundPayment,
} from './payments.swagger';

@ApiPayments('Payments & Billing')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiCreateIntent()
  @Post('create-intent/:bookingId')
  createIntent(@Param('bookingId') bookingId: string) {
    return this.paymentsService.createIntent(bookingId);
  }

  @ApiGetPayment()
  @Get(':bookingId')
  getPayment(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getByBooking(bookingId);
  }

  @ApiMarkPaid()
  @Patch('booking/:bookingId/mark-paid')
  markPaid(@Param('bookingId') bookingId: string) {
    return this.paymentsService.markAsPaid(bookingId);
  }

  @ApiRefundPayment()
  @Patch('booking/:bookingId/refund')
  @Roles(UserRole.ADMIN)
  refund(@Param('bookingId') bookingId: string) {
    return this.paymentsService.refund(bookingId);
  }
}

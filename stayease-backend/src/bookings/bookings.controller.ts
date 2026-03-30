import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import {
  ApiBookings,
  ApiCreateBooking,
  ApiFindAllBookings,
  ApiFindOneBooking,
  ApiCancelBooking,
  ApiConfirmBooking,
} from './bookings.swagger';

@ApiBookings('Bookings Management')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiCreateBooking()
  @Post()
  @Roles(UserRole.GUEST)
  create(@Body() dto: CreateBookingDto, @Req() req: { user: JwtPayloadDto }) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @ApiFindAllBookings()
  @Get()
  findAll(
    @Req() req: { user: JwtPayloadDto },
    @Query() query: GetBookingsQueryDto,
  ) {
    return this.bookingsService.findAll(req.user.id, req.user.role, query);
  }

  @ApiFindOneBooking()
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: JwtPayloadDto }) {
    return this.bookingsService.findOne(id, req.user.id, req.user.role);
  }

  @ApiCancelBooking()
  @Patch(':id/cancel')
  @Roles(UserRole.GUEST)
  cancel(@Param('id') id: string, @Req() req: { user: JwtPayloadDto }) {
    return this.bookingsService.cancel(id, req.user.id);
  }

  @ApiConfirmBooking()
  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.HOTEL_OWNER)
  confirm(@Param('id') id: string) {
    return this.bookingsService.confirm(id);
  }

  

  @Get(':id/invoice')
  async downloadInvoice(@Param('id') id: string, @Res() res: any) {
    
    const buffer = await this.bookingsService.getInvoiceBuffer(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=StayEase-Invoice-${id}.pdf`,
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
}

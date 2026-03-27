import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BookingStatus } from '../booking.model';

export class GetBookingsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: BookingStatus,
    description: 'Filter bookings by their current status',
  })
  @IsOptional()
  @IsEnum(BookingStatus, { message: 'Invalid status value' })
  status?: BookingStatus;
}

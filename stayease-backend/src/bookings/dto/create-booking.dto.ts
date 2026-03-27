import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the room to be booked',
  })
  @IsUUID()
  @IsNotEmpty()
  room_id: string;

  @ApiProperty({
    example: '2026-04-01',
    description: 'Check-in date in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsNotEmpty()
  check_in_date: string;

  @ApiProperty({
    example: '2026-04-05',
    description: 'Check-out date in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsNotEmpty()
  check_out_date: string;
}

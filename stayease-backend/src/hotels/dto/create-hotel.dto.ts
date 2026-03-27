import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHotelDto {
  @ApiProperty({ example: 'Grand Hyatt', description: 'The name of the hotel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Ahmedabad',
    description: 'City where hotel is located',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'S.G. Highway, Near PVR',
    description: 'Full address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 'A luxury 5-star hotel with pool and gym.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://image.com/hotel.jpg' })
  @IsString()
  @IsOptional()
  cover_image?: string;
}

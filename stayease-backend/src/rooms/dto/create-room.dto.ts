import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoomType } from '../models/room.model';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Unique room number or name' })
  @IsString()
  @IsNotEmpty()
  room_number: string;

  @ApiProperty({
    enum: RoomType,
    example: RoomType.SUITE,
    description: 'Category of the room',
  })
  @IsEnum(RoomType, {
    message: 'Type must be either single, double, or suite',
  })
  @IsNotEmpty()
  room_type: RoomType;

  @ApiProperty({ example: 2, description: 'Maximum persons allowed' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 2500, description: 'Cost for one night stay' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price_per_night: number;

  @ApiPropertyOptional({
    example: ['WiFi', 'AC', 'Mini Bar'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];
}

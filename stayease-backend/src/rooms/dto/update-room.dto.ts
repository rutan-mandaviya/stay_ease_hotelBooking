import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'; // Changed from mapped-types to swagger
import { CreateRoomDto } from './create-room.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Whether the room is available for booking',
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

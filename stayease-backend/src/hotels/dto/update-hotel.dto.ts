import { PartialType } from '@nestjs/swagger'; // Changed from mapped-types to swagger
import { CreateHotelDto } from './create-hotel.dto';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}

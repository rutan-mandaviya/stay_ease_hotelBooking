import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/users/user.model';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import {
  ApiRooms,
  ApiCreateRoom,
  ApiFindAllRooms,
  ApiFindOneRoom,
  ApiUpdateRoom,
  ApiRemoveRoomImage,
} from './rooms.swagger';

@ApiRooms('Hotel Rooms')
@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiCreateRoom()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  @Post('hotels/:hotelId/rooms')
  create(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreateRoomDto,
    @Req() req: { user: JwtPayloadDto },
  ) {
    return this.roomsService.create(hotelId, dto, req.user.id);
  }

  @ApiFindAllRooms()
  @Get('hotels/:hotelId/rooms')
  findAll(@Param('hotelId') hotelId: string) {
    return this.roomsService.findAll(hotelId);
  }

  @ApiFindOneRoom()
  @Get('rooms/:id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @ApiUpdateRoom()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  @Patch('rooms/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoomDto,
    @Req() req: { user: JwtPayloadDto },
  ) {
    return this.roomsService.update(id, dto, req.user.id);
  }

  @ApiRemoveRoomImage()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  @Delete('rooms/:id/images/:imageId')
  removeImage(
    @Param('imageId') imageId: string,
    @Req() req: { user: JwtPayloadDto },
  ) {
    return this.roomsService.removeImage(imageId, req.user.id);
  }

  @Delete('rooms/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  RemoveRoom(@Param('id') id: string, @Req() req: { user: JwtPayloadDto }) {
    return this.roomsService.remove(id, req.user.id);
  }
}

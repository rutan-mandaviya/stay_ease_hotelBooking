import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { HotelQueryDto } from './dto/hotel-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.model';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import {
  ApiHotels,
  ApiCreateHotel,
  ApiFindAllHotels,
  ApiFindOneHotel,
  ApiUpdateHotel,
  ApiRemoveHotel,
  ApiToggleStatus,
} from './hotels.swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/media/multer-options';

@ApiHotels('Hotels Management')
@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @ApiCreateHotel()
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  @UseInterceptors(FileInterceptor('image', multerOptions('hotels'))) // 'image' field name frontend se match karega
  create(
    @Body() dto: CreateHotelDto,
    @Req() req: { user: JwtPayloadDto },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.hotelsService.create(dto, req.user.id, file);
  }

  @ApiFindAllHotels()
  @Get()
  findAll(@Query() query: HotelQueryDto) {
    return this.hotelsService.findAll(query);
  }
  // Route fixed: GET /hotels/owner/my-properties
  @Get('owner/my-properties')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  async getMyHotels(@Req() req: { user: JwtPayloadDto }) {
    return this.hotelsService.findOwnerHotels(req.user.id);
  }
  @ApiFindOneHotel()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }

  @ApiUpdateHotel()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateHotelDto,
    @Req() req: { user: JwtPayloadDto },
  ) {
    return this.hotelsService.update(id, dto, req.user.id);
  }

  @ApiRemoveHotel()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER, UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: JwtPayloadDto }) {
    return this.hotelsService.remove(id, req.user);
  }

  @ApiToggleStatus()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string) {
    return this.hotelsService.toggleStatus(id);
  }
}

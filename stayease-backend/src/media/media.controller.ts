import {
  Controller,
  Get,
  Param,
  Res,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  Post,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { JwtPayloadDto } from 'src/common/dto/jwt-payload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/user.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { multerOptions } from './multer-options';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RoomsService } from 'src/rooms/rooms.service';
import {
  ApiMedia,
  ApiGetRoomImage,
  ApiUploadRoomImages,
} from './media.swagger';

@ApiMedia('Media & Uploads')
@Controller('uploads')
export class MediaController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiGetRoomImage()
  @Get('rooms/:filename')
  getRoomImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/rooms', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Image file not found on server disk');
    }

    return res.sendFile(filename, {
      root: join(process.cwd(), 'uploads/rooms'),
    });
  }

  @ApiUploadRoomImages()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOTEL_OWNER)
  @Post('rooms/:id/images')
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions('rooms'))) // 'images' field name frontend se match karega, max 5 files
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: { user: JwtPayloadDto },
  ) {
    return this.roomsService.uploadImages(id, files, req.user.id);
  }

  @Get('hotels/:filename')
  getHotelImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads/hotels', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Hotel image not found');
    }

    return res.sendFile(filename, {
      root: join(process.cwd(), 'uploads/hotels'),
    });
  }
}

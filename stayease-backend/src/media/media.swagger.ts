import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

export function ApiMedia(tag: string) {
  return applyDecorators(ApiTags(tag));
}

export function ApiGetRoomImage() {
  return applyDecorators(
    ApiOperation({ summary: 'Serve room images from the server disk' }),
    ApiParam({
      name: 'filename',
      description: 'Name of the image file (e.g., room-123.jpg)',
    }),
    ApiResponse({ status: 200, description: 'Returns the image file.' }),
    ApiResponse({ status: 404, description: 'Image not found.' }),
  );
}

export function ApiGetHotelImage() {
  return applyDecorators(
    ApiOperation({ summary: 'Serve hotel images from the server disk' }),
    ApiParam({
      name: 'filename',
      description: 'Name of the hotel image file (e.g., hotel-123.jpg)',
    }),
    ApiResponse({ status: 200, description: 'Returns the image file.' }),
    ApiResponse({ status: 404, description: 'Image not found.' }),
  );
}

export function ApiUploadRoomImages() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Upload up to 5 images for a specific room' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          images: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
            description: 'Select up to 5 image files (jpg/png/jpeg)',
          },
        },
      },
    }),
    ApiParam({ name: 'id', description: 'UUID of the room' }),
    ApiResponse({
      status: 201,
      description: 'Images uploaded and linked successfully.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Only hotel owners can upload.',
    }),
  );
}

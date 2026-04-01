import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

export function ApiRooms(tag: string) {
  return applyDecorators(ApiTags(tag));
}

export function ApiCreateRoom() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Add a new room to a specific hotel' }),
    ApiParam({ name: 'hotelId', description: 'UUID of the hotel' }),
    ApiResponse({ status: 201, description: 'Room created successfully.' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Only hotel owners can add rooms.',
    }),
  );
}

export function ApiFindAllRooms() {
  return applyDecorators(
    ApiOperation({ summary: 'List all rooms belonging to a hotel' }),
    ApiParam({ name: 'hotelId', description: 'UUID of the hotel' }),
    ApiResponse({ status: 200, description: 'List of rooms retrieved.' }),
  );
}

export function ApiFindOneRoom() {
  return applyDecorators(
    ApiOperation({ summary: 'Get detailed information about a specific room' }),
    ApiParam({ name: 'id', description: 'Room UUID' }),
    ApiResponse({ status: 200, description: 'Room details found.' }),
    ApiResponse({ status: 404, description: 'Room not found.' }),
  );
}

export function ApiUpdateRoom() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Update room information' }),
    ApiParam({ name: 'id', description: 'Room UUID' }),
    ApiResponse({ status: 200, description: 'Room updated successfully.' }),
  );
}

export function ApiRemoveRoomImage() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Remove a specific image from a room' }),
    ApiParam({ name: 'id', description: 'Room UUID' }),
    ApiParam({ name: 'imageId', description: 'Image UUID to remove' }),
    ApiResponse({ status: 200, description: 'Image removed successfully.' }),
  );
}

export function ApiDeleteRoom() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Delete a specific room' }),
    ApiParam({ name: 'id', description: 'Room UUID' }),
    ApiResponse({ status: 200, description: 'Room deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Room not found.' }),
  );
}

export function ApiUploadRoomImages() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Upload multiple images for a room' }),
    ApiParam({ name: 'id', description: 'Room UUID' }),
    ApiResponse({ status: 201, description: 'Images uploaded successfully.' }),
    ApiResponse({ status: 403, description: 'Forbidden. Access denied.' }),
    ApiResponse({ status: 404, description: 'Room not found.' }),
  );
}

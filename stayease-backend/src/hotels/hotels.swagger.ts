import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

export function ApiHotels(tag: string) {
  return applyDecorators(ApiTags(tag));
}

export function ApiCreateHotel() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Create a new hotel listing' }),
    ApiResponse({ status: 201, description: 'Hotel created successfully' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden: Only owners can list hotels',
    }),
  );
}

export function ApiFindAllHotels() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all hotels with filters' }),
    ApiResponse({ status: 200, description: 'Returns a list of hotels' }),
  );
}

export function ApiFindOneHotel() {
  return applyDecorators(
    ApiOperation({ summary: 'Get hotel details by ID' }),
    ApiParam({ name: 'id', description: 'Hotel UUID' }),
    ApiResponse({ status: 200, description: 'Returns hotel details' }),
    ApiResponse({ status: 404, description: 'Hotel not found' }),
  );
}

export function ApiUpdateHotel() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Update existing hotel details' }),
    ApiResponse({ status: 200, description: 'Hotel updated successfully' }),
    ApiResponse({ status: 404, description: 'Hotel not found' }),
  );
}

export function ApiRemoveHotel() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Delete a hotel listing' }),
    ApiResponse({ status: 200, description: 'Hotel deleted successfully' }),
  );
}

export function ApiToggleStatus() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Toggle hotel active status (Admin only)' }),
    ApiResponse({ status: 200, description: 'Status updated' }),
  );
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

export function ApiBookings(tag: string) {
  return applyDecorators(ApiTags(tag), ApiBearerAuth('JWT-auth'));
}

export function ApiCreateBooking() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new room booking (Guest only)' }),
    ApiResponse({
      status: 201,
      description: 'Booking initiated successfully.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Only Guests can create bookings.',
    }),
  );
}

export function ApiFindAllBookings() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all bookings (Context-based)' }),
    ApiResponse({
      status: 200,
      description: 'List of bookings filtered by user role.',
    }),
  );
}

export function ApiFindOneBooking() {
  return applyDecorators(
    ApiOperation({ summary: 'Get details of a specific booking' }),
    ApiParam({ name: 'id', description: 'Booking UUID' }),
    ApiResponse({ status: 200, description: 'Booking details retrieved.' }),
    ApiResponse({ status: 404, description: 'Booking not found.' }),
  );
}

export function ApiCancelBooking() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel a booking (Guest only)' }),
    ApiParam({ name: 'id', description: 'Booking UUID' }),
    ApiResponse({
      status: 200,
      description: 'Booking cancelled successfully.',
    }),
  );
}

export function ApiConfirmBooking() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm a booking (Admin/Owner only)' }),
    ApiParam({ name: 'id', description: 'Booking UUID' }),
    ApiResponse({
      status: 200,
      description: 'Booking confirmed successfully.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Requires Admin or Owner role.',
    }),
  );
}

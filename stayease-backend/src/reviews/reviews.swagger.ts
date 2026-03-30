import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

export function ApiReviews(tag: string) {
  return applyDecorators(ApiTags(tag));
}

export function ApiCreateReview() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Create a review for a booking/hotel' }),
    ApiResponse({ status: 201, description: 'Review created successfully.' }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Guest role required.',
    }),
  );
}

export function ApiFindReviewsByHotel() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all reviews for a specific hotel' }),
    ApiParam({ name: 'hotelId', description: 'Hotel UUID' }),
    ApiResponse({
      status: 200,
      description: 'Reviews retrieved successfully.',
    }),
  );
}

export function ApiDeleteReview() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Delete a review (Guest owner or Admin)' }),
    ApiParam({ name: 'id', description: 'Review UUID' }),
    ApiResponse({ status: 200, description: 'Review deleted successfully.' }),
    ApiResponse({ status: 403, description: 'Forbidden for this review.' }),
    ApiResponse({ status: 404, description: 'Review not found.' }),
  );
}

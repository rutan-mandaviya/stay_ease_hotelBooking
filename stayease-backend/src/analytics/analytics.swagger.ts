import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

export function ApiAnalytics(tag: string) {
  return applyDecorators(ApiTags(tag), ApiBearerAuth('JWT-auth'));
}

export function ApiOwnerDashboard() {
  return applyDecorators(
    ApiOperation({ summary: 'Get business analytics for the hotel owner' }),
    ApiResponse({
      status: 200,
      description: 'Analytics data retrieved successfully.',
      schema: {
        example: {
          statusCode: 200,
          message: 'Owner analytics fetched successfully',
          data: {
            totalRevenue: 14000,
            totalBookings: 4,
            statusBreakdown: [
              { status: 'confirmed', count: 3 },
              { status: 'cancelled', count: 2 },
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Only Hotel Owners can access this.',
    }),
    ApiResponse({
      status: 404,
      description: 'No hotels found for this owner.',
    }),
  );
}

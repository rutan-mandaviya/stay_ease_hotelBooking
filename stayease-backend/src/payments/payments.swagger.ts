import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

export function ApiPayments(tag: string) {
  return applyDecorators(ApiTags(tag), ApiBearerAuth('JWT-auth'));
}

export function ApiCreateIntent() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a Stripe Payment Intent for a booking' }),
    ApiParam({ name: 'bookingId', description: 'UUID of the booking' }),
    ApiResponse({
      status: 201,
      description:
        'Intent created. Use clientSecret on frontend to show Stripe UI.',
      schema: {
        example: {
          statusCode: 201,
          message: 'Payment intent created',
          data: {
            clientSecret: 'pi_3TF8ZBEN...',
            paymentId: 'uuid-string',
          },
        },
      },
    }),
  );
}

export function ApiGetPayment() {
  return applyDecorators(
    ApiOperation({ summary: 'Get payment details by Booking ID' }),
    ApiParam({ name: 'bookingId', description: 'UUID of the booking' }),
    ApiResponse({ status: 200, description: 'Payment record retrieved.' }),
  );
}

export function ApiMarkPaid() {
  return applyDecorators(
    ApiOperation({ summary: 'Mark payment as PAID (Simulate Stripe Success)' }),
    // ApiParam({ name: 'id', description: 'Payment UUID' }),
    ApiResponse({
      status: 200,
      description: 'Payment updated and Booking confirmed.',
    }),
  );
}

export function ApiRefundPayment() {
  return applyDecorators(
    ApiOperation({ summary: 'Process a refund via Stripe (Admin only)' }),
    ApiParam({ name: 'id', description: 'Payment UUID' }),
    ApiResponse({
      status: 200,
      description: 'Amount refunded and Booking cancelled.',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden. Only Admins can refund.',
    }),
  );
}

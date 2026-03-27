import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

export function ApiAuth(tag: string) {
  return applyDecorators(ApiTags(tag));
}

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user account' }),
    ApiResponse({ status: 201, description: 'User successfully created' }),
    ApiResponse({ status: 400, description: 'Bad Request / Validation Error' }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login to get Access & Refresh tokens' }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}

export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token using refresh_token' }),
    ApiBody({ schema: { example: { refresh_token: 'uuid-string' } } }),
    ApiResponse({ status: 200, description: 'Token refreshed successfully' }),
  );
}

export function ApiGetMe() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Get profile of the currently logged-in user' }),
    ApiResponse({ status: 200, description: 'Profile retrieved successfully' }),
  );
}

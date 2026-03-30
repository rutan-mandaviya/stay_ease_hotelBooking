import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function ApiApp(tag: string) {
  return applyDecorators(ApiTags(tag));
}

export function ApiGetHello() {
  return applyDecorators(
    ApiOperation({ summary: 'Root health/welcome endpoint' }),
    ApiResponse({ status: 200, description: 'Application is running.' }),
  );
}

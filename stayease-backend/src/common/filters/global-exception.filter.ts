import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Agar HttpException hai (400, 404, etc.) toh uska status lo, nahi toh 500 (Internal Server Error)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Error message nikalne ka logic
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : 'Internal server error';

    // Logger mein error record karna (Debugging ke liye)
    this.logger.error(
      `Method: ${request.method} | URL: ${request.url} | Status: ${status} | Message: ${JSON.stringify(message)}`,
    );

    // Standard Response Format
    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message, // Array ho toh pehla error dikhao
      error: exception.name || 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

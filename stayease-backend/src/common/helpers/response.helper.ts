
import { HttpStatus } from '@nestjs/common';

export interface MetaData {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: any;
}

export function buildResponse<T = unknown>(
  statusCode: HttpStatus,
  message: string,
  data?: T,
  meta?: MetaData,
) {
  if (data !== undefined && meta) {
    return { statusCode, message, data: { items: data, meta } };
  }
  if (data !== undefined) {
    return { statusCode, message, data };
  }
  return { statusCode, message };
}

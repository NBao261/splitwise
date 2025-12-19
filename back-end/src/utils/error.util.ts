import { ZodError } from 'zod';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

/**
 * Custom Error class cho ứng dụng
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Xử lý lỗi từ Zod validation
 */
export const handleZodError = (error: ZodError): string => {
  const errors = error.issues.map(issue => {
    const field = issue.path.join('.');
    return `${field}: ${issue.message}`;
  });
  return errors.join(', ');
};

/**
 * Xác định status code dựa trên error message
 */
export const getStatusCodeFromError = (error: Error | AppError): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  const message = error.message.toLowerCase();

  // Validation errors
  if (
    message.includes('không hợp lệ') ||
    message.includes('phải có') ||
    message.includes('không được để trống') ||
    message.includes('validation')
  ) {
    return HTTP_STATUS.BAD_REQUEST;
  }

  // Authentication errors
  if (
    message.includes('email hoặc mật khẩu') ||
    message.includes('token') ||
    message.includes('unauthorized') ||
    message.includes('authentication')
  ) {
    return HTTP_STATUS.UNAUTHORIZED;
  }

  // Forbidden errors
  if (message.includes('forbidden') || message.includes('không có quyền')) {
    return HTTP_STATUS.FORBIDDEN;
  }

  // Not found errors
  if (message.includes('không tìm thấy') || message.includes('not found')) {
    return HTTP_STATUS.NOT_FOUND;
  }

  // Conflict errors
  if (
    message.includes('đã được sử dụng') ||
    message.includes('đã tồn tại') ||
    message.includes('conflict')
  ) {
    return HTTP_STATUS.CONFLICT;
  }

  // Default to 500
  return HTTP_STATUS.INTERNAL_SERVER_ERROR;
};

/**
 * Format error message cho client (ẩn thông tin nhạy cảm)
 */
export const formatErrorMessage = (
  error: Error,
  isDevelopment: boolean = false
): string => {
  if (error instanceof AppError && error.isOperational) {
    return error.message;
  }

  // Trong production, không trả về chi tiết lỗi
  if (!isDevelopment) {
    return ERROR_MESSAGES.SERVER.INTERNAL_ERROR;
  }

  return error.message;
};

import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ApiResponse as ApiResponseDto } from '../../common/dtos/response.dto';

/** 400 Bad Request - validation failed */
export function ApiBadRequestResponse(errorName?: string, message?: string) {
  return ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - validation failed',
    example: ApiResponseDto.error(
      errorName || 'VALIDATION_ERROR',
      message || 'Validation failed',
      HttpStatus.BAD_REQUEST,
    ),
  });
}

/** 409 Conflict - resource already exists */
export function ApiConflictResponse(errorName?: string, message?: string) {
  return ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflict - resource already exists',
    example: ApiResponseDto.error(
      errorName || 'RESOURCE_CONFLICT',
      message || 'Resource already exists',
      HttpStatus.CONFLICT,
    ),
  });
}

/** 503 Service Unavailable - downstream service down */
export function ApiServiceUnavailableResponse(
  errorName?: string,
  message?: string,
) {
  return ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Service unavailable - downstream service down',
    example: ApiResponseDto.error(
      errorName || 'SERVICE_UNAVAILABLE',
      message || 'Service is temporarily unavailable',
      HttpStatus.SERVICE_UNAVAILABLE,
    ),
  });
}

/** 500 Internal Server Error */
export function ApiInternalErrorResponse(errorName?: string, message?: string) {
  return ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    schema: {
      example: ApiResponseDto.error(
        errorName || 'INTERNAL_ERROR',
        message || 'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    },
  });
}

/** 401 Unauthorized - authentication required */
export function ApiUnauthorizedResponse(errorName?: string, message?: string) {
  return ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - authentication required',
    schema: {
      example: ApiResponseDto.error(
        errorName || 'UNAUTHORIZED',
        message || 'Authentication required',
        HttpStatus.UNAUTHORIZED,
      ),
    },
  });
}

/** 404 Not Found - resource not found */
export function ApiNotFoundResponse(errorName?: string, message?: string) {
  return ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found - resource not found',
    schema: {
      example: ApiResponseDto.error(
        errorName || 'NOT_FOUND',
        message || 'Resource not found',
        HttpStatus.NOT_FOUND,
      ),
    },
  });
}

/** 403 Forbidden - insufficient permissions */
export function ApiForbiddenResponse(errorName?: string, message?: string) {
  return ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - insufficient permissions',
    schema: {
      example: ApiResponseDto.error(
        errorName || 'FORBIDDEN',
        message || 'Insufficient permissions',
        HttpStatus.FORBIDDEN,
      ),
    },
  });
}

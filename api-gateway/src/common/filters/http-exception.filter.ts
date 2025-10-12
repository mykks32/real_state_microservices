import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ApiResponse } from '../dtos/response.dto';

/**
 * Global exception filter that handles all exceptions,
 * including Axios errors, HttpExceptions, and unknown errors.
 * Automatically logs errors and returns structured ApiResponse.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Type guard to check if the error is an AxiosError
   * @param error Unknown error object
   * @returns True if error is AxiosError
   */
  private isAxiosError(error: unknown): error is AxiosError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'isAxiosError' in error &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (error as any).isAxiosError === true
    );
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const requestId = req.headers['x-request-id'] as string;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorName = 'INTERNAL_ERROR';
    let message = 'An unexpected error occurred';

    if (this.isAxiosError(exception)) {
      this.logger.error('Is Axios Error running', exception);
      const axiosError = exception as AxiosError<IApiResponse<null>>;
      if (
        axiosError.code === 'ECONNREFUSED' ||
        axiosError.code === 'ENOTFOUND'
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        errorName = 'SERVICE_UNAVAILABLE';
        message = 'Service temporarily unavailable';
      } else if (axiosError.response?.data) {
        const data = axiosError.response.data;
        status = data.statusCode || axiosError.response.status;
        errorName = data.errorName || 'UPSTREAM_ERROR';
        message = data.message || 'Upstream service error';
      } else if (axiosError.response) {
        status = axiosError.response.status;
        errorName = 'HTTP_ERROR';
        message = `HTTP ${status} error`;
      } else {
        errorName = axiosError.code || 'NETWORK_ERROR';
        message = 'Network error occurred';
      }
      this.logger.error(
        `[[${req.method}] ${req.url} - ${status} - ${errorName} - ${message} requestId - requestId: ${requestId}`,
      );
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      // this.logger.log('[SERVICE_UNAVAILABLE]', exception);
      const exRes = exception.getResponse();
      if (typeof exRes === 'object' && exRes !== null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        errorName = (exRes as any).errorName || exception.name;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        message = (exRes as any).message || exception.message;
      } else {
        errorName = exception.name;
        message = exception.message;
      }
      this.logger.error(
        `[${req.method} ${req.url}] - ${status} - ${exception.name} - ${exception.message} - requestId: ${requestId}`,
      );
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${req.method}] ${req.url} - ${status} - ${exception.name} - ${exception.message} - requestId: ${requestId}`,
      );
    }

    res
      .status(status)
      .json(ApiResponse.error(errorName, message, status, requestId));
  }
}

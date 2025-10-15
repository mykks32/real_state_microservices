import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../dtos/response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      message = res?.message || res || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    const errorName =
      exception instanceof Error ? exception.constructor.name : 'Error';

    const requestId = request.headers['x-request-id'] as string;

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${message} - requestId: ${requestId}`,
    );
    response
      .status(status)
      .json(ApiResponse.error(errorName, message, status, requestId));
  }
}

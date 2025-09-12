import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
      message = res?.message || res || exception.message;
    }

    const requestId = request.headers['x-request-id'] as string;

    this.logger.error(
      `[${request.method}] ${request.url} - ${status} - ${message} - requestId: ${requestId}`,
    );
    response.status(status).json(ApiResponse.error(message, status, requestId));
  }
}

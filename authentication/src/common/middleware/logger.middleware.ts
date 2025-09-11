import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    (req as any).id = requestId;
    const start = Date.now();

    // Log incoming request
    this.logger.log(JSON.stringify({
      type: 'REQUEST',
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    }));

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(JSON.stringify({
        type: 'RESPONSE',
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      }));
    });

    res.on('close', () => {
      const duration = Date.now() - start;
      this.logger.warn(JSON.stringify({
        type: 'CONNECTION_CLOSED',
        requestId,
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      }));
    });

    next();
  }
}
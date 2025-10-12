import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

/**
 * RequestIdMiddleware
 *
 * Ensures each request has a unique `x-request-id` header.
 * Generates a UUID if missing, sets it on both request and response headers.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers['x-request-id'] || uuidv4();

    req.headers['x-request-id'] = requestId;
    res.setHeader('x-request-id', requestId);
    next();
  }
}

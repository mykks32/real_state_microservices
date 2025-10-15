import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidJwtRefreshException extends HttpException {
  constructor(message = 'Invalid JWT refresh token') {
    super(
      {
        name: InvalidJwtRefreshException.name,
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

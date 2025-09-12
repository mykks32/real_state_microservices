import { HttpException, HttpStatus } from '@nestjs/common';

export class JwtRefreshNotFoundException extends HttpException {
  constructor(message = 'JWT refresh token not found') {
    super(
      {
        name: JwtRefreshNotFoundException.name,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
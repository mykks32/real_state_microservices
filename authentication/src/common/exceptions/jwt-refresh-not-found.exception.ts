import { HttpException, HttpStatus } from '@nestjs/common';

export class JwtRefreshNotFoundException extends HttpException {
  constructor(message = 'JWT refresh token not found in cookie') {
    super(
      {
        name: JwtRefreshNotFoundException.name,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongPasswordException extends HttpException {
  constructor(message = 'Wrong password') {
    super(
      {
        name: WrongPasswordException.name,
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
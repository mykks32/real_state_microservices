import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailNotFoundException extends HttpException {
  constructor(message = 'Email not found') {
    super(
      {
        name: EmailNotFoundException.name,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
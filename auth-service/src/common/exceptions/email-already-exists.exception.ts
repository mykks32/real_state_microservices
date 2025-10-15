import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor(message = 'Email already exists') {
    super(
      {
        name: EmailAlreadyExistsException.name,
        message,
      },
      HttpStatus.CONFLICT,
    );
    this.name = EmailAlreadyExistsException.name;
  }
}

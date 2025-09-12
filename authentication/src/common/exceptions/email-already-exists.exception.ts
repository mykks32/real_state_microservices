import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyExistsException extends HttpException {
  constructor(message = 'Email already exists') {
    super(message, HttpStatus.CONFLICT);
  }
}
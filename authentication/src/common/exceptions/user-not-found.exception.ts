import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message = 'User not found') {
    super(
      {
        name: UserNotFoundException.name,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
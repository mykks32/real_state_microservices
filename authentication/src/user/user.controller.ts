import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EmailNotFoundException } from 'src/common/exceptions/email-not-found.exception';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { error } from 'console';
import { Response } from 'express';

@Controller('user')
export class userController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findById({ id });
  }

  @Get('/email/:email')
  async findUserByEmail(@Param('email') email: string, @Res() res: Response) {
    try {
      const userData = await this.userService.findByEmail({ email });

      if (!userData) throw new UserNotFoundException();

      return res.status(HttpStatus.OK).json(userData);
    } catch (err) {
      if (err instanceof UserNotFoundException)
        return res.status(HttpStatus.NOT_FOUND).json({
          message: err?.message,
        });
    }
  }
}

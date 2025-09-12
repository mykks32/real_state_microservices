import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/common/dtos/response.dto';

@Controller('user')
export class userController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async findUserById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userData = await this.userService.findById({ id });
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.ok(
          userData,
          'User retrived successfully',
          HttpStatus.OK,
          req.headers['x-request-id'] as string,
        ),
      );
  }

  @Get('/email/:email')
  async findUserByEmail(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userData = await this.userService.findByEmail({ email });

    if (!userData) throw new UserNotFoundException();

    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.ok(
          userData,
          'User retrived successfully',
          HttpStatus.OK,
          req.headers['x-request-id'] as string,
        ),
      );
  }
}

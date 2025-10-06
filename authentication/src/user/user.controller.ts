import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/common/dtos/response.dto';
import {
  // ApiResponse as SwaggerResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class userController {
  constructor(private userService: UserService) {}

  /**
   * Find a user by their ID.
   *
   * @summary Retrieves a user using the provided user ID.
   * @param {string} id - The unique identifier of the user.
   * @param req
   * @param res
   */
  @Get(':id')
  @ApiOperation({ summary: 'Find User By Id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
    example: '1243d30-d5ad-4b78-b7b8-f530881609d5',
  })
  async findUserById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    const userData = await this.userService.findById({ id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUserData } = userData;

    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.ok(
          safeUserData,
          'User retrived successfully',
          HttpStatus.OK,
          req.headers['x-request-id'] as string,
        ),
      );
  }

  /**
   * Find a user by their email address.
   *
   * @summary Retrieves a user using the provided email.
   * @param {string} email - The email of the user to retrieve.
   * @param req
   * @param res
   */
  @Get('/email/:email')
  @ApiOperation({ summary: 'Find User By Id' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email Id',
    example: 'srikri@gmail.com',
  })
  async findUserByEmail(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    const userData = await this.userService.findByEmail({ email });
    if (!userData) throw new UserNotFoundException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safeUserData } = userData;

    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.ok(
          safeUserData,
          'User retried successfully',
          HttpStatus.OK,
          req.headers['x-request-id'] as string,
        ),
      );
  }
}

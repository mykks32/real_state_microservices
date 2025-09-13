import { Controller, Get, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { Request, Response } from 'express';
import { ApiResponse } from 'src/common/dtos/response.dto';
import {
  ApiResponse as SwaggerResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class userController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find User By Id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
    example: '1243d30-d5ad-4b78-b7b8-f530881609d5',
  })
  @SwaggerResponse({
    status: 200,
    description: 'User retrived successfully',
    headers: {
      'x-request-id': {
        description: 'Unique request identifier',
        schema: {
          type: 'string',
          example: '50f87ea1-2277-4226-aafd-50721f5f4334',
        },
      },
    },
    schema: {
      example: {
        success: true,
        message: 'User retrived successfully',
        statusCode: 200,
        data: {
          id: '1f243d30-d5ad-4b78-b7b8-f530881609d5',
          email: 'srikri@gmail.com',
          username: 'srikriydv',
          IsAdmin: false,
          createdAt: '2025-09-12T08:44:18.361Z',
          lastLoginAt: null,
        },
        timestamp: '2025-09-13T05:31:22.538Z',
        requestId: '1005d338-f207-4e0f-b2a2-b73214953bd9',
      },
    },
  })
  async findUserById(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userData = await this.userService.findById({ id });

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

  @Get('/email/:email')
  @ApiOperation({ summary: 'Find User By Id' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email Id',
    example: 'srikri@gmail.com',
  })
  @SwaggerResponse({
    status: 200,
    description: 'User retrived successfully',
    headers: {
      'x-request-id': {
        description: 'Unique request identifier',
        schema: {
          type: 'string',
          example: '50f87ea1-2277-4226-aafd-50721f5f4334',
        },
      },
    },
    schema: {
      example: {
        success: true,
        message: 'User retrived successfully',
        statusCode: 200,
        data: {
          id: '1f243d30-d5ad-4b78-b7b8-f530881609d5',
          email: 'srikri@gmail.com',
          username: 'srikriydv',
          IsAdmin: false,
          createdAt: '2025-09-12T08:44:18.361Z',
          lastLoginAt: null,
        },
        timestamp: '2025-09-13T05:31:22.538Z',
        requestId: '1005d338-f207-4e0f-b2a2-b73214953bd9',
      },
    },
  })
  async findUserByEmail(
    @Param('email') email: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userData = await this.userService.findByEmail({ email });
    if (!userData) throw new UserNotFoundException();

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
}

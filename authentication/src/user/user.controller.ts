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

  /**
   * Find a user by their ID.
   *
   * @summary Retrieves a user using the provided user ID.
   * @param {string} id - The unique identifier of the user.
   * @returns {object} 200 - Successful response containing the user data.
   * @returns {object} 404 - User not found. Returned if no user exists with the given ID.
   * @returns {object} 500 - Internal Server Error. Returned if an unexpected error occurs on the server.
   */
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
  @SwaggerResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        success: false,
        errorName: 'UserNotFoundException',
        message: 'User not found',
        statusCode: 404,
        timestamp: '2025-09-13T08:06:34.982Z',
        requestId: '4bef44fc-039f-4c08-8985-47b103914720',
      },
    },
  })
  @SwaggerResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        success: false,
        errorName: 'InternalServerErrorException',
        message: 'Internal server erro',
        statusCode: 500,
        timestamp: '2025-09-12T13:45:02.372Z',
        requestId: '5651a07f-963e-4037-b4f5-605e3dc1a4e5',
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

  /**
   * Find a user by their email address.
   *
   * @summary Retrieves a user using the provided email.
   * @param {string} email - The email of the user to retrieve.
   * @returns {object} 200 - Successful response containing the user data.
   * @returns {object} 400 - Bad Request. Returned if the email format is invalid or request parameters are incorrect.
   * @returns {object} 500 - Internal Server Error. Returned if something unexpected occurs on the server.
   */
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
  @SwaggerResponse({
    status: 400,
    description: 'Bad request (e.g., email already exists)',
    schema: {
      example: {
        success: false,
        errorName: 'BadRequestException',
        message: 'Invalid user ID format',
        statusCode: 400,
        timestamp: '2025-09-13T08:07:34.235Z',
        requestId: '31e5ee4a-1349-4549-850d-540db80ddee1',
      },
    },
  })
  @SwaggerResponse({
    status: 500,
    description: 'Internal Server Error',
    schema: {
      example: {
        success: false,
        errorName: 'InternalServerErrorException',
        message: 'Internal server erro',
        statusCode: 500,
        timestamp: '2025-09-12T13:45:02.372Z',
        requestId: '5651a07f-963e-4037-b4f5-605e3dc1a4e5',
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

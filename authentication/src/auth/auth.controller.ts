import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { JwtRefreshNotFoundException } from 'src/common/exceptions/jwt-refresh-not-found.exception';
import { ApiResponse } from 'src/common/dtos/response.dto';
import {
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBody,
  ApiCookieAuth,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('auth controller');

  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   *
   * @summary Creates a new user in the system.
   * @param {CreateUserDto} createUserDto - The user data for registration.
   * @returns {object} 201 - User created successfully.
   * @returns {object} 409 - Conflict. Returned if the email already exists.
   * @returns {object} 500 - Internal Server Error. Returned if an unexpected error occurs on the server.
   */
  @Post('create')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @SwaggerResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        success: true,
        message: 'User Created Successfully',
        statusCode: 201,
        requestId: 'abc-123',
        data: {
          id: '1e5e45e9-8129-4f6d-bc54-617e784f3fb2',
          email: 'srikri5@gmail.com',
          username: 'srikriydv1',
          IsAdmin: false,
          createdAt: '2025-09-12T13:33:17.125Z',
          lastLoginAt: null,
        },
      },
    },
  })
  @SwaggerResponse({
    status: 409,
    description: 'Bad request (e.g., email already exists)',
    schema: {
      example: {
        success: false,
        errorName: 'EmailAlreadyExistsException',
        message: 'Email already exists',
        statusCode: 409,
        timestamp: '2025-09-12T13:45:02.372Z',
        requestId: '5651a07f-963e-4037-b4f5-605e3dc1a4e5',
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
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userData = await this.authService.create(createUserDto);

    return res
      .status(HttpStatus.CREATED)
      .json(
        ApiResponse.ok(
          userData,
          'User Created Successfully',
          HttpStatus.CREATED,
          req.headers['x-request-id'] as string,
        ),
      );
  }

  /**
   * Login a user.
   *
   * @summary Authenticates a user and returns access and refresh tokens.
   * @param {LoginUserDto} loginUserDto.body - Login credentials in request body.
   * @header {string} x-request-id - Unique request identifier.
   * @header {string} set-cookie - Authentication cookie (HttpOnly).
   * @returns {object} 200 - Successful login with access and refresh tokens.
   * @returns {object} 401 - Unauthorized. Incorrect password.
   * @returns {object} 404 - Not Found. Email not registered.
   * @returns {object} 500 - Internal Server Error.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @SwaggerResponse({
    status: 200,
    description: 'User created successfully',
    headers: {
      'x-request-id': {
        description: 'Unique request identifier',
        schema: {
          type: 'string',
          example: '50f87ea1-2277-4226-aafd-50721f5f4334',
        },
      },
      'set-cookie': {
        description: 'Authentication cookie',
        schema: {
          type: 'string',
          example:
            'realState_token=6bb97420-01d8-4c04-b72c-43120365c964; Max-Age=604800; Path=/; Expires=Fri, 19 Sep 2025 12:07:56 GMT; HttpOnly; SameSite=None',
        },
      },
    },
    schema: {
      example: {
        success: true,
        message: 'User Created Successfully',
        statusCode: 200,
        requestId: 'abc-123',
        data: {
          success: true,
          message: 'Login Successfull',
          statusCode: 200,
          data: {
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZjI0M2QzMC1kNWFkLTRiNzgtYjdiOC1mNTMwODgxNjA5ZDUiLCJpYXQiOjE3NTc2Nzg4NzUsImV4cCI6MTc1NzY3OTc3NX0._GS0PQnPapNGyxlsCsstMws50CehF6LkruogTFBPQ5w',
            refreshToken: '6bb97420-01d8-4c04-b72c-43120365c964',
          },
          timestamp: '2025-09-12T12:07:56.021Z',
          requestId: '50f87ea1-2277-4226-aafd-50721f5f4334',
        },
      },
    },
  })
  @SwaggerResponse({
    status: 404,
    description: 'Email not found',
    schema: {
      example: {
        success: false,
        errorName: 'EmailNotFoundException',
        message: 'Email not found',
        statusCode: 404,
        timestamp: '2025-09-13T03:24:38.756Z',
        requestId: 'b9283a59-319f-4495-ad67-2219bc851a5c',
      },
    },
  })
  @SwaggerResponse({
    status: 401,
    description: 'Wrong password',
    schema: {
      example: {
        success: false,
        errorName: 'WrongPasswordException',
        message: 'Wrong password',
        statusCode: 401,
        timestamp: '2025-09-13T04:21:48.501Z',
        requestId: 'a02f95af-a16e-436d-bb69-a064eab2421b',
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
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    res.cookie('realState_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    this.logger.log(
      `cookie set: ${res.cookie['realState_token']} & accessToken: ${accessToken}`,
    );
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.ok(
          { accessToken, refreshToken },
          'Login Successfull',
          HttpStatus.OK,
          req.headers['x-request-id'] as string,
        ),
      );
  }

  /**
   * Refreshes the access token for a user.
   *
   * @summary Uses the refresh token from the cookie to generate a new access token.
   * @param {object} body.body - Request body containing the user ID.
   * @param {string} body.body.userId - The ID of the user whose token is being refreshed.
   * @header {string} x-request-id - Unique request identifier for tracing.
   * @header {string} set-cookie - New refresh token cookie (HttpOnly).
   * @returns {object} 200 - Access token refreshed successfully with new refresh token.
   * @returns {object} 401 - Unauthorized. Invalid or expired refresh token.
   * @returns {object} 500 - Internal Server Error. Unexpected server error.
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiCookieAuth('realState_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          example: '1f243d30-d5ad-4b78-b7b8-f530881609d5',
        },
      },
      required: ['userId'],
    },
  })
  @SwaggerResponse({
    status: 200,
    description: 'User created successfully',
    headers: {
      'x-request-id': {
        description: 'Unique request identifier',
        schema: {
          type: 'string',
          example: '50f87ea1-2277-4226-aafd-50721f5f4334',
        },
      },
      'set-cookie': {
        description: 'Authentication cookie',
        schema: {
          type: 'string',
          example:
            'realState_token=6bb97420-01d8-4c04-b72c-43120365c964; Max-Age=604800; Path=/; Expires=Fri, 19 Sep 2025 12:07:56 GMT; HttpOnly; SameSite=None',
        },
      },
    },
    schema: {
      example: {
        success: true,
        message: 'Access Token refreshed successfully',
        statusCode: 200,
        requestId: 'abc-123',
        data: {
          success: true,
          message: 'Access Token refreshed successfully',
          statusCode: 200,
          data: {
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZjI0M2QzMC1kNWFkLTRiNzgtYjdiOC1mNTMwODgxNjA5ZDUiLCJpYXQiOjE3NTc3Mzc2MjMsImV4cCI6MTc1NzczODUyM30.0jitOAJiOFZ0x_dHpym7dfgk16PwYZt2gZkt2Kd_g3M',
          },
          timestamp: '2025-09-13T04:27:03.109Z',
          requestId: 'a82250b3-4abc-4be7-9957-e0911e736278',
        },
      },
    },
  })
  @SwaggerResponse({
    status: 401,
    description: 'Email not found',
    schema: {
      example: {
        success: false,
        errorName: 'UnauthorizedException',
        message: 'Invalid refresh token',
        statusCode: 401,
        timestamp: '2025-09-13T03:34:23.320Z',
        requestId: '72cae638-7005-4c1b-88d4-133a60588274',
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
  async refresh(
    @Body('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const refreshToken = req.cookies['realState_token'];
    if (!refreshToken) throw new JwtRefreshNotFoundException();

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.verify(userId, refreshToken);

    res.cookie('realState_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    this.logger.log(
      `cookie set: ${res.cookie['realState_token']} & accessToken: ${accessToken}`,
    );
    return res.status(HttpStatus.OK).json(
      ApiResponse.ok(
        {
          accessToken: accessToken,
        },
        'Access Token refreshed successfully',
        HttpStatus.OK,
        req.headers['x-request-id'] as string,
      ),
    );
  }

  /**
   * Logs out a user by clearing their refresh token cookie.
   *
   * @summary Invalidates the refresh token and removes the authentication cookie.
   * @param {object} body.body - Request body containing the user ID.
   * @param {string} body.body.userId - The ID of the user to log out.
   * @header {string} x-request-id - Unique request identifier for tracing.
   * @header {string} set-cookie - Clears the authentication cookie.
   * @returns {object} 200 - Successfully logged out.
   * @returns {object} 401 - Unauthorized. Returned if the refresh token is invalid.
   * @returns {object} 404 - Not Found. Returned if the JWT refresh token is not found in the cookie.
   * @returns {object} 500 - Internal Server Error. Unexpected server error.
   */
  @Post('logout')
  @ApiCookieAuth('realState_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          example: '1f243d30-d5ad-4b78-b7b8-f530881609d5',
        },
      },
      required: ['userId'],
    },
  })
  @SwaggerResponse({
    status: 200,
    description: 'User created successfully',
    headers: {
      'x-request-id': {
        description: 'Unique request identifier',
        schema: {
          type: 'string',
          example: '50f87ea1-2277-4226-aafd-50721f5f4334',
        },
      },
      'set-cookie': {
        description: 'Authentication cookie',
        schema: {
          type: 'string',
          example:
            'realState_token=; Max-Age=604800; Path=/; Expires=Fri, 19 Sep 2025 12:07:56 GMT; HttpOnly; SameSite=None',
        },
      },
    },
    schema: {
      example: {
        success: true,
        message: 'Successfully logged out',
        statusCode: 200,
        data: null,
        timestamp: '2025-09-13T04:37:38.652Z',
        requestId: '9b8e2bc0-9bba-43b0-a640-9b08d2a3c257',
      },
    },
  })
  @SwaggerResponse({
    status: 401,
    description: 'Invalid refresh token',
    schema: {
      example: {
        success: false,
        errorName: 'UnauthorizedException',
        message: 'Invalid refresh token',
        statusCode: 401,
        timestamp: '2025-09-13T04:39:35.907Z',
        requestId: 'f0908add-6416-4934-b390-f971db0f5926',
      },
    },
  })
  @SwaggerResponse({
    status: 404,
    description: 'JWT refresh token not found in cookie',
    schema: {
      example: {
        success: false,
        errorName: 'JwtRefreshNotFoundException',
        message: 'JWT refresh token not found in cookie',
        statusCode: 404,
        timestamp: '2025-09-13T04:38:42.387Z',
        requestId: '09222a0d-1c7d-4fcc-b3e9-bfa5bb9906e2',
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
  async logout(
    @Res() res: Response,
    @Body('userId') userId: string,
    @Req() req: Request,
  ) {
    const refreshToken = req.cookies['realState_token'];
    if (!refreshToken) throw new JwtRefreshNotFoundException();

    await this.authService.logout(userId, refreshToken);
    res.clearCookie('realState_token');

    this.logger.log(`Cookie cleared`);
    return res
      .status(HttpStatus.OK)
      .json(
        ApiResponse.ok(
          null,
          'Successfully logged out',
          HttpStatus.OK,
          req.headers['x-request-id'] as string,
        ),
      );
  }
}

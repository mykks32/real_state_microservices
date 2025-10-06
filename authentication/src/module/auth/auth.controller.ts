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
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   * @param createUserDto - User registration payload
   * @param req - Incoming request
   * @param res - Response object
   */
  @Post('create')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @SwaggerResponse({ status: 201, type: CreateUserDto })
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
   * @param loginUserDto - Login credentials
   * @param req - Incoming request
   * @param res - Response object
   */
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @SwaggerResponse({ status: 200 })
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

    this.logger.log(`User logged in successfully`);

    return {
      ...ApiResponse.ok(
        { accessToken },
        'Login Successful',
        HttpStatus.OK,
        req.headers['x-request-id'] as string,
      ),
      refreshToken, // optional if needed in response
    };
  }

  /**
   * Refresh access token using refresh token from cookie.
   * @param userId - ID of the user
   * @param req - Incoming request
   * @param res - Response object
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiCookieAuth('realState_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string', example: 'user-uuid' } },
      required: ['userId'],
    },
  })
  @SwaggerResponse({ status: 200 })
  async refresh(
    @Body('userId') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['realState_token'] as
      | string
      | undefined
      | null;
    if (!refreshToken) throw new JwtRefreshNotFoundException();

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.verify(userId, refreshToken);

    res.cookie('realState_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    this.logger.log(`Access token refreshed for user ${userId}`);

    return ApiResponse.ok(
      { accessToken },
      'Access Token refreshed successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Logout a user by clearing the refresh token cookie.
   * @param userId - ID of the user
   * @param req - Incoming request
   * @param res - Response object
   */
  @Post('logout')
  @ApiCookieAuth('realState_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string', example: 'user-uuid' } },
      required: ['userId'],
    },
  })
  @SwaggerResponse({ status: 200 })
  async logout(
    @Body('userId') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['realState_token'] as
      | string
      | undefined
      | null;
    if (!refreshToken) throw new JwtRefreshNotFoundException();

    await this.authService.logout(userId, refreshToken);

    res.clearCookie('realState_token');
    this.logger.log(`User ${userId} logged out, cookie cleared`);

    return ApiResponse.ok(
      null,
      'Successfully logged out',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }
}

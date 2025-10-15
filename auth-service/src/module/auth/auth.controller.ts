import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login.dto';
import { Request } from 'express';
import { JwtRefreshNotFoundException } from 'src/common/exceptions/jwt-refresh-not-found.exception';
import { ApiResponse } from 'src/common/dtos/response.dto';
import {
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiBody,
  ApiCookieAuth,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IUser } from '../user/user.interface';
import { IApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   * @param createUserDto User registration payload
   * @param req Incoming request
   * @returns IUser object in ApiResponse
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @SwaggerResponse({ status: 201, type: ApiResponse })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<IApiResponse<Omit<IUser, 'password'>>> {
    const requestId = req.headers['x-request-id'] as string;
    this.logger.log(
      `[${requestId}] Registration attempt for: ${createUserDto.email}`,
    );

    const user = await this.authService.create(createUserDto);

    this.logger.log(`[${requestId}] User registered successfully: ${user.id}`);

    return ApiResponse.ok(
      user,
      'User created successfully',
      HttpStatus.CREATED,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Login a user and set refresh token cookie.
   * @param loginUserDto Login credentials
   * @param req Incoming request
   * @returns Access token and refresh token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @SwaggerResponse({ status: 200 })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
  ): Promise<IApiResponse<{ accessToken: string; refreshToken: string }>> {
    const requestId = req.headers['x-request-id'] as string;
    this.logger.log(`[${requestId}] Login attempt for: ${loginUserDto.email}`);

    const { accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    this.logger.log(`[${requestId}] Login successful, tokens issued`);

    return ApiResponse.ok(
      { accessToken, refreshToken },
      'Login successful',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Refresh access token using refresh token cookie.
   * @param req Incoming request
   * @returns New access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiCookieAuth('realState_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
      required: ['userId'],
    },
  })
  @SwaggerResponse({ status: 200 })
  async refresh(
    @Req() req: Request,
  ): Promise<IApiResponse<{ accessToken: string }>> {
    const requestId = req.headers['x-request-id'] as string;
    const oldRefreshToken = req.cookies['realState_token'] as string;

    if (!oldRefreshToken) {
      this.logger.warn(`[${requestId}] Refresh token not found`);
      throw new JwtRefreshNotFoundException();
    }

    this.logger.log(
      `[${requestId}] Refresh token found, generating new tokens...`,
    );

    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(oldRefreshToken);

    this.logger.log(`[${requestId}] Tokens refreshed successfully`);

    return ApiResponse.ok(
      { accessToken, refreshToken },
      'Login successful',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Logout user and clear refresh token cookie.
   * @param userId User ID
   * @param req Incoming request
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('realState_token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { userId: { type: 'string' } },
      required: ['userId'],
    },
  })
  @SwaggerResponse({ status: 200 })
  async logout(
    @Body('userId') userId: string,
    @Req() req: Request,
  ): Promise<IApiResponse<null>> {
    const requestId = req.headers['x-request-id'] as string;
    const refreshToken = req.cookies['realState_token'] as string;

    if (!refreshToken) {
      this.logger.warn(
        `[${requestId}] Logout attempt failed — no refresh token found`,
      );
      throw new JwtRefreshNotFoundException();
    }

    this.logger.log(`[${requestId}] Logging out user ${userId}...`);
    await this.authService.logout(userId, refreshToken);

    this.logger.log(`[${requestId}] User ${userId} logged out successfully`);

    // API Gateway will clear the cookie
    return ApiResponse.ok(
      null,
      'Successfully logged out',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Verify access token manually without guard (for API Gateway).
   * @returns IUser object if token is valid
   * @param req
   * @param token
   */
  @Post('verify-access')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify access token and get user info' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { accessToken: { type: 'string' } },
      required: ['accessToken'],
    },
  })
  @ApiBearerAuth()
  @SwaggerResponse({ status: 200 })
  async verifyAccess(
    @Req() req: Request,
    @Body('token') token: string,
  ): Promise<IApiResponse<Omit<IUser, 'password'>>> {
    const requestId = req.headers['x-request-id'] as string;
    this.logger.log(`[${requestId}] Verifying access token...`);

    const user = await this.authService.verifyAccessToken(token);

    this.logger.log(`[${requestId}] Token verified. User: ${user.id}`);

    return ApiResponse.ok(user, 'Access token is valid', HttpStatus.OK);
  }
}

import {
  Body,
  Controller,
  HttpCode,
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
    const user = await this.authService.create(createUserDto);
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
   * @param res Response object
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    res.cookie('realState_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    this.logger.log('User logged in successfully');

    return ApiResponse.ok(
      { accessToken },
      'Login successful',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Refresh access token using refresh token cookie.
   * @param userId User ID
   * @param req Incoming request
   * @param res Response object
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
    @Body('userId') userId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<{ accessToken: string }>> {
    const refreshToken = req.cookies['realState_token'] as string;
    if (!refreshToken) throw new JwtRefreshNotFoundException();

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.verify(userId, refreshToken);

    res.cookie('realState_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.ok(
      { accessToken },
      'Access token refreshed successfully',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  /**
   * Logout user and clear refresh token cookie.
   * @param userId User ID
   * @param req Incoming request
   * @param res Response object
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<null>> {
    const refreshToken = req.cookies['realState_token'] as string;
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

  /**
   * Verify access token manually without guard (for API Gateway).
   * @returns IUser object if token is valid
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
    @Body('token') token: string,
  ): Promise<IApiResponse<Omit<IUser, 'password'>>> {
    const user = await this.authService.verifyAccessToken(token);
    return ApiResponse.ok(user, 'Access token is valid', HttpStatus.OK);
  }
}

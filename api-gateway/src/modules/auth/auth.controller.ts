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
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { AppConfigService } from '../../config/config.service';
import { ApiTags } from '@nestjs/swagger';
import { IUser } from './interfaces/user.interface';
import { IApiResponse } from '../../common/interfaces/api-response.interface';
import { ApiResponse } from '../../common/dtos/response.dto';
import {
  SwaggerApiLogin,
  SwaggerApiRegister,
} from './decorators/auth-swagger.decorator';

/**
 * AuthController
 *
 * Handles auth-service-related API endpoints by forwarding requests
 * to the downstream auth-service and normalizing responses.
 *
 * Routes:
 * - POST /auth/login: Authenticates user, forwards cookies.
 * - POST /auth/register: Registers a new user.
 *
 * Uses HttpService for communication and logs requests.
 * Stateless, no business logic implemented here.
 */
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  /** Logger instance scoped to AuthController. */
  private readonly logger = new Logger(AuthController.name);

  /**
   * Constructs the controller with required dependencies.
   *
   * @param {AppConfigService} configService - Service to access application configuration.
   * @param {HttpService} httpService - Used to send HTTP requests to downstream services.
   */
  constructor(
    private readonly configService: AppConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Registration URL built from the auth service base URL.
   *
   * @readonly
   * @type {string}
   */
  private get registerUrl(): string {
    return `${this.configService.authServiceUrl}/auth/create`;
  }

  /**
   * Login URL built from the auth service base URL.
   *
   * @readonly
   * @type {string}
   */
  private get loginUrl(): string {
    return `${this.configService.authServiceUrl}/auth/login`;
  }

  /**
   * Authenticates a user by forwarding credentials to the auth-service.
   *
   * @route POST /auth/login
   * @status 200 - OK
   *
   * @param {LoginUserDto} loginUserDto - User login credentials.
   * @param {Request} req - Incoming HTTP request.
   * @param {Response} res - HTTP response (used to set cookies).
   *
   * @returns {Promise<IApiResponse<{ accessToken: string; refreshToken: string }>>} Standardized response containing user data (without password).
   *
   * @remarks
   * - Forwards login data via HttpService.
   * - Propagates `Set-Cookie` header from auth-service to client.
   * - Logs requests at the controller level.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiLogin()
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<{ accessToken: string; refreshToken: string }>> {
    const requestId = req.headers['x-request-id'] as string;
    const email = loginUserDto.email;
    this.logger.log(`[${requestId}] Login attempt started for email: ${email}`);

    const response = await firstValueFrom(
      this.httpService.post<
        IApiResponse<{ accessToken: string; refreshToken: string }>
      >(this.loginUrl, loginUserDto, {
        headers: {
          'x-request-id': requestId,
        },
      }),
    );

    const data = response.data;

    if (!data?.data?.refreshToken) {
      this.logger.warn(`[${requestId}] Missing refresh token for ${email}`);
    }

    // Set refresh token as secure HTTP-only cookie
    res.cookie('realState_token', data?.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    this.logger.log(`[${requestId}] Login successful for email: ${email}`);
    return data;
  }

  /**
   * Registers a new user by forwarding registration data to the auth-service.
   *
   * @route POST /auth/register
   * @status 201 - Created
   *
   * @param req
   * @param {CreateUserDto} createUserDto - User registration details.
   * @returns {Promise<IApiResponse<Omit<IUser, 'password'>>>} Standardized response with created user data (excluding password).
   *
   * @remarks
   * - Stateless forwarding to auth-service.
   * - No business logic or middleware dependencies.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerApiRegister()
  async register(
    @Req() req: Request,
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<Omit<IUser, 'password'>>> {
    const requestId = req.headers['x-request-id'] as string;
    const email = createUserDto.email;
    this.logger.log(`[${requestId}] Registration attempt for email: ${email}`);

    const response = await firstValueFrom(
      this.httpService.post<ApiResponse<Omit<IUser, 'password'>>>(
        this.registerUrl,
        createUserDto,
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    this.logger.log(`[${requestId}] Registration successful for ${email}`);
    return response.data;
  }
}

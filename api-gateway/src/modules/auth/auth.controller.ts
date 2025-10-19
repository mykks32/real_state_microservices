import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
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
  SwaggerApiLogout,
  SwaggerApiMe,
  SwaggerApiRegister,
} from './decorators/auth-swagger.decorator';
import { JwtGatewayGuard } from '../../common/guards/jwt.guard';
import { RequestWithUserContext } from '../../common/types/request-with-context.type';

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
  private get logoutUrl(): string {
    return `${this.configService.authServiceUrl}/auth/logout`;
  }

  /**
   * Login URL built from the auth service base URL.
   *
   * @readonly
   * @type {string}
   */
  private meUrl(id: string): string {
    return `${this.configService.authServiceUrl}/user/${id}`;
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

  /**
   * Logs out a user by clearing the refresh token cookie.
   *
   * @route POST /auth/logout
   * @status 200 - OK
   *
   * @param {Request} req - Incoming HTTP request.
   * @param {Response} res - HTTP response (used to clear cookies).
   *
   * @returns {Promise<IApiResponse<null>>} Standardized response confirming logout.
   *
   * @remarks
   * - Clears the `realState_token` cookie.
   * - Stateless, does not call downstream service.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiLogout()
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<null>> {
    const requestId = req.headers['x-request-id'] as string;
    this.logger.log(`[${requestId}] Logout attempt started`);

    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<null>>(
        this.logoutUrl,
        {},
        {
          headers: {
            'x-request-id': requestId,
          },
        },
      ),
    );

    // Always clear the cookie on gateway level too
    res.clearCookie('realState_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    this.logger.log(`[${requestId}] Logout successful`);

    // Return normalized downstream response OR force standard response
    return response.data ?? ApiResponse.ok(null, 'Logged out successfully');
  }

  /**
   * Retrieves the authenticated user's profile by calling downstream user-service.
   *
   * @route GET /auth/me
   * @status 200 - OK
   *
   * @guard JwtGatewayGuard - Ensures request contains valid access token.
   *
   * @param {RequestWithUserContext} req - The incoming HTTP request containing user context from JWT.
   *
   * @returns {Promise<ApiResponse<Omit<IUser, 'password'>>>} - Standardized API response with user profile data.
   *
   * @remarks
   * - Extracts `user.id` from validated JWT payload.
   * - Forwards request to user-service `/user/:id`.
   * - Includes `x-request-id` for traceability and forwards cookies if needed.
   */
  @Get('me')
  @UseGuards(JwtGatewayGuard)
  @HttpCode(HttpStatus.OK)
  @SwaggerApiMe()
  async getMe(@Req() req: RequestWithUserContext): Promise<
    ApiResponse<{
      user: Omit<IUser, 'password'>;
      accessToken?: string | null;
    }>
  > {
    const requestId = req.headers['x-request-id'] as string;
    const userId = req.user.id;
    let accessToken: string | null = null;

    this.logger.log(`[${requestId}] Fetching user profile for ${userId}`);

    const response = await firstValueFrom(
      this.httpService.get<ApiResponse<Omit<IUser, 'password'>>>(
        this.meUrl(userId),
        {
          headers: {
            'x-request-id': requestId,
            authorization: req.headers.authorization,
            cookie: req.headers.cookie,
          },
        },
      ),
    );

    this.logger.log(
      `[${requestId}] Successfully fetched user profile for ${userId}`,
    );

    // Include new access token if guard refreshed it
    if (req.token?.newAccessTokenIssued && req.token.accessToken) {
      accessToken = req.token.accessToken;
      this.logger.debug(
        `[${requestId}] Returning new access token for user ${userId}`,
      );
    }

    return ApiResponse.ok({
      user: response.data.data!,
      accessToken,
    });
  }
}

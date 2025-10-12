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
import { IApiResponse } from '../../common/interfaces/api-response.interface';
import { IUser } from './interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';
import { AppConfigService } from '../../config/config.service';

/**
 * AuthController
 *
 * Handles authentication-related API endpoints by forwarding requests
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
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly configService: AppConfigService;

  private get registerUrl(): string {
    return `${this.configService.authServiceUrl}/auth/create`;
  }

  private get loginUrl(): string {
    return `${this.configService.authServiceUrl}/auth/login`;
  }

  constructor(private readonly httpService: HttpService) {}

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
   * @returns {Promise<IApiResponse<Omit<IUser, 'password'>>>} Standardized response containing user data (without password).
   *
   * @remarks
   * - Forwards login data via HttpService.
   * - Propagates `Set-Cookie` header from auth-service to client.
   * - Logs requests at the controller level.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<Omit<IUser, 'password'>>> {
    this.logger.log(`Login attempt for email: ${loginUserDto.email}`);

    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<Omit<IUser, 'password'>>>(
        this.loginUrl,
        loginUserDto,
      ),
    );

    const data = response.data;

    // Forward Set-Cookie header from upstream if present
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('set-cookie', setCookieHeader);
    }

    this.logger.log(`Login attempt for email: ${loginUserDto.email}`);

    return data;
  }

  /**
   * Registers a new user by forwarding registration data to the auth-service.
   *
   * @route POST /auth/register
   * @status 201 - Created
   *
   * @param {CreateUserDto} createUserDto - User registration details.
   * @returns {Promise<IApiResponse<Omit<IUser, 'password'>>>} Standardized response with created user data (excluding password).
   *
   * @remarks
   * - Stateless forwarding to auth-service.
   * - No business logic or middleware dependencies.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<Omit<IUser, 'password'>>> {
    this.logger.log(`Registration attempt for email: ${createUserDto.email}`);

    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<Omit<IUser, 'password'>>>(
        this.registerUrl,
        createUserDto,
      ),
    );

    this.logger.log(
      `Registration successful for email: ${createUserDto.email}`,
    );

    return response.data;
  }
}

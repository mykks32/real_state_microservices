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
import { IApiResponse } from '../common/interfaces/api-response.interface';
import { IUser } from './interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { LoginUserDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly REGISTER_URL = 'http://localhost:3000/auth/create';
  private readonly LOGIN_URL = 'http://localhost:3000/auth/login';

  constructor(private readonly httpService: HttpService) {}

  /**
   * Login a User
   * @param loginUserDto
   * @param req incoming request
   * @param res
   * @return IUser object in ApiResponse
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IApiResponse<Omit<IUser, 'password'>>> {
    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<Omit<IUser, 'password'>>>(
        this.LOGIN_URL,
        loginUserDto,
      ),
    );

    const data = response.data;

    // Forward Set-Cookie header from upstream if exists
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('set-cookie', setCookieHeader);
    }

    return data;
  }

  /**
   * Register User
   *
   * @return Register User detail
   * @param {CreateUserDto} createUserDto
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const response = await firstValueFrom(
      this.httpService.post<IApiResponse<Omit<IUser, 'password'>>>(
        this.REGISTER_URL,
        createUserDto,
      ),
    );

    return response.data;
  }
}

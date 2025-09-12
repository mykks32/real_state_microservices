import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login.dto';
import { Request, Response } from 'express';
import { JwtRefreshNotFoundException } from 'src/common/exceptions/jwt-refresh-not-found.exception';
import { ApiResponse } from 'src/common/dtos/response.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('auth controller');

  constructor(private readonly authService: AuthService) {}

  @Post('create')
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

  @Post('login')
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

  @Post('refresh')
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

  @Post('logout')
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

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
import { ref } from 'process';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('auth controller');
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const userData = await this.authService.create(createUserDto);
    return ApiResponse.ok(
      userData,
      'User Created Successfully',
      HttpStatus.CREATED,
      req.headers['x-request-id'] as string,
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

    this.logger.log(
      `accessToken: ${accessToken}, refreshToken: ${refreshToken}`,
    );

    res.cookie('realState_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return ApiResponse.ok(
      { accessToken, refreshToken },
      'Login Successfull',
      HttpStatus.OK,
      req.headers['x-request-id'] as string,
    );
  }

  @Post('refresh')
  async refresh(
    @Body('userId') userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<{ accessToken: string }>> {
    const refreshToken = req.cookies['realState_token'];
    if (!refreshToken) throw new JwtRefreshNotFoundException();

    // console.log("refeshTOken", refreshToken)
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.verify(userId, refreshToken);

    // console.log("access& new RefreshTOken", accessToken, "-----", refreshToken)

    res.cookie('realState_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // console.log("res cookie set")

    return res.json({
      accessToken,
    });
  }

  @Post('logout')
  async logout(
    @Res() res: Response,
    userId: string,
  ): Promise<Response<{ message: string }>> {
    await this.authService.logout(userId);
    res.clearCookie('realState_token');
    return res.json({
      message: 'Successfully logout',
    });
  }
}

import {
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
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
    return {
      accessToken,
      refreshToken,
    };
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

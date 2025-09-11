import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dtos/login.dto';
import { nestRefreshTokenService } from './refresh-token.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userServie: UserService,
    private readonly refreshTokenService: nestRefreshTokenService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const { email, username, password } = data;
      const exists = await this.userServie.findByEmail({ email });
      if (exists) throw new BadRequestException('User already Exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userServie.create({
        ...data,
        password: hashedPassword,
      });
      return user;
    } catch (err) {
      throw new BadRequestException('Registraiton failed', err?.message);
    }
  }

  async login(
    data: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { email, password } = data;

      const user = await this.userServie.findByEmail({ email });
      if (!user) throw new NotFoundException('User not Found');

      const isValid = bcrypt.compare(password, user.password);
      if (!isValid) throw new BadRequestException('Invalid credentials');

      const { accessToken, refreshToken } =
        await this.refreshTokenService.generateRefreshToken(user.id);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new BadRequestException('Login Failed', err?.message);
    }
  }

  async verify(
    userId: string,
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const valid = await this.refreshTokenService.validateRefreshToken(
        userId,
        token,
      );
      if (!valid) throw new BadRequestException('Invalid Token');

      const { accessToken, refreshToken } =
        await this.refreshTokenService.generateRefreshToken(userId);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new BadRequestException('Verify Failed', err?.message);
    }
  }

  async logout(userId: string) {
    try {
      await this.refreshTokenService.revokeRefreshToken(userId);
    } catch (err) {
      throw new BadRequestException('Logout Failed', err?.message);
    }
  }
}

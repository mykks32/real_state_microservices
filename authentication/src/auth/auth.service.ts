import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dtos/login.dto';
import { nestRefreshTokenService } from './refresh-token.service';
import { UserService } from 'src/user/user.service';
import { WrongPasswordException } from 'src/common/exceptions/wrong-password.exception';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exists.exception';
import { EmailNotFoundException } from 'src/common/exceptions/email-not-found.exception';
import { InvalidJwtRefreshException } from 'src/common/exceptions/invalid-jwt-refresh.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('auth service');
  constructor(
    private userServie: UserService,
    private readonly refreshTokenService: nestRefreshTokenService,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const { email, password } = data;
      const exists = await this.userServie.findByEmail({ email });
      if (exists) throw new EmailAlreadyExistsException();

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userServie.create({
        ...data,
        password: hashedPassword,
      });
      this.logger.log(`User created: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async login(
    data: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = data;

    const user = await this.userServie.findByEmail({ email });
    if (!user) throw new EmailNotFoundException();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new WrongPasswordException();

    const { accessToken, refreshToken } =
      await this.refreshTokenService.generateRefreshToken(user.id);

    this.logger.log(`Login Successful ${user.id}`);

    return {
      accessToken,
      refreshToken,
    };
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
      if (!valid) throw new InvalidJwtRefreshException();

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

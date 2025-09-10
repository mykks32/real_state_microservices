import {
  Body,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { IUsers } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dtos/login.dto';
import { nestRefreshTokenService } from './refresh-token.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private readonly refreshTokenService: nestRefreshTokenService,
  ) {}

  async create(data: CreateUserDto): Promise<IUsers> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async login(
    data: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, username, password } = data;

    const userData = await this.usersRepository.findOne({
      where: email ? { email } : { username },
    });

    if (!userData) {
      throw new NotFoundException('No user data found');
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password not correct');
    }
    userData.lastLoginAt = new Date();

    await this.usersRepository.save(userData);
    const { password: password1, ...user } = userData;

    const { accessToken, refreshToken } =
      await this.refreshTokenService.generateRefreshToken(user.id);

    // Set refresh token in HttpOnly cookie

    return {
      accessToken,
      refreshToken,
    };
  }

  async verify(
    userId: string,
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    await this.refreshTokenService.validateRefreshToken(userId, token);

    const { accessToken, refreshToken } =
      await this.refreshTokenService.generateRefreshToken(userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.refreshTokenService.revokeRefreshToken(userId);
  }

  async findById(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<Users> {
    const userData = await this.usersRepository.findOne({
      where: { email },
    });
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }
}

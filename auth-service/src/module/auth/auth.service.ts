import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/module/user/user.service';
import { NestRefreshTokenService } from './refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login.dto';
import { EmailAlreadyExistsException } from 'src/common/exceptions/email-already-exists.exception';
import { EmailNotFoundException } from 'src/common/exceptions/email-not-found.exception';
import { WrongPasswordException } from 'src/common/exceptions/wrong-password.exception';
import { InvalidJwtRefreshException } from 'src/common/exceptions/invalid-jwt-refresh.exception';
import { User } from 'src/database/entities/user.entity';
import { IUser } from '../user/user.interface';
import { Role } from '../../database/enums/roles.enum';

interface AccessTokenPayload {
  userId: string;
  iat: number; // issued at
  exp: number; // expiration
}

/**
 * Service responsible for auth-service and user management.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly refreshTokenService: NestRefreshTokenService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Maps a User entity to a safe user object (without password)
   * @param user User entity from database
   * @returns Safe IUser object
   */
  private mapEntityToSafeUser(user: User): Omit<IUser, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Creates a new user with hashed password.
   * @param data CreateUserDto containing email and password
   * @returns IUser object without password
   * @throws EmailAlreadyExistsException if user with email already exists
   */
  async create(data: CreateUserDto): Promise<Omit<IUser, 'password'>> {
    const { email, password } = data;
    const allowedRoles = [Role.BUYER, Role.SELLER];

    // If roles are provided, check if any invalid roles exist
    if (data.roles && data.roles.some((role) => !allowedRoles.includes(role))) {
      throw new BadRequestException('Only BUYER or SELLER roles are allowed');
    }

    // If roles not provided, assign default role
    if (!data.roles || data.roles.length === 0) {
      data.roles = [Role.BUYER];
    }
    const exists = await this.userService.findByEmail({ email });
    if (exists) throw new EmailAlreadyExistsException();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    const safeUser = this.mapEntityToSafeUser(user);
    this.logger.log(`User created: ${safeUser.id}`);
    return safeUser;
  }

  /**
   * Authenticates a user and generates access and refresh tokens.
   * @param data LoginUserDto containing email and password
   * @returns Object containing accessToken and refreshToken
   * @throws EmailNotFoundException if user not found
   * @throws WrongPasswordException if password is invalid
   */
  async login(
    data: LoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = data;
    const user = await this.userService.findByEmail({ email });
    if (!user) throw new EmailNotFoundException();

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new WrongPasswordException();

    // Update lastLoginAt before returning tokens
    user.lastLoginAt = new Date();
    await user.save();

    const { accessToken, refreshToken } =
      await this.refreshTokenService.generateRefreshToken(user.id);
    this.logger.log(`Login successful: ${user.id}`);
    return { accessToken, refreshToken };
  }

  /**
   * Verifies a refresh token and issues new access and refresh tokens.
   * @param token Refresh token
   * @returns Object containing new accessToken and refreshToken
   * @throws InvalidJwtRefreshException if refresh token is invalid
   */
  async refreshTokens(
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string; userId: string }> {
    // Get userId from the refresh token stored in Redis
    const userId = await this.refreshTokenService.getUserIdFromToken(token);

    if (!userId) {
      throw new InvalidJwtRefreshException();
    }

    // Validate the refresh token
    await this.refreshTokenService.validateRefreshToken(userId, token);

    // Generate new tokens
    const { accessToken, refreshToken } =
      await this.refreshTokenService.generateRefreshToken(userId);

    this.logger.log(`Tokens refreshed for user: ${userId}`);

    return { accessToken, refreshToken, userId };
  }

  /**
   * Logs out a user by revoking their refresh token.
   * @param userId User ID
   * @param token Refresh token
   * @throws InvalidJwtRefreshException if token is invalid
   */
  async logout(userId: string, token: string): Promise<void> {
    const valid = await this.refreshTokenService.validateRefreshToken(
      userId,
      token,
    );
    if (!valid) throw new InvalidJwtRefreshException();

    await this.refreshTokenService.revokeRefreshToken(userId);
    this.logger.log(`Refresh token revoked for user: ${userId}`);
  }

  /**
   * Verifies an access token and returns the corresponding user.
   * @param accessToken The JWT access token to verify
   * @returns IUser object of the authenticated user
   * @throws UnauthorizedException if token is invalid or user not found
   */
  async verifyAccessToken(
    accessToken: string,
  ): Promise<Omit<IUser, 'password'>> {
    let payload: AccessTokenPayload;

    try {
      payload = this.jwtService.verify<AccessTokenPayload>(accessToken);
    } catch (err) {
      this.logger.warn('Access token verification failed', err);
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.userService.findById({ id: payload.userId });
    if (!user) {
      this.logger.warn(`User not found for token payload: ${payload.userId}`);
      throw new UnauthorizedException('User not found');
    }

    return this.mapEntityToSafeUser(user);
  }
}

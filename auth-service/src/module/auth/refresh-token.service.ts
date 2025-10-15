import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '../../config/config.service';

/**
 * Service to manage JWT access tokens and refresh tokens using Redis.
 */
@Injectable()
export class NestRefreshTokenService {
  private readonly logger = new Logger(NestRefreshTokenService.name);
  private redis: Redis;

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {
    // Use environment variables for configuration
    this.redis = new Redis({
      host: this.config.redisHost || 'localhost',
      port: Number(this.config.redisPort) || 6379,
      password: this.config.redisPass || 'redis',
    });
    // Fail fast if Redis connection fails
    this.redis.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
      throw new InternalServerErrorException('Redis service not available');
    });

    this.redis.on('connect', () => {
      this.logger.log('Connected to Redis successfully');
    });
  }

  /**
   * Generates a new access token and refresh token for a user.
   * @param userId - ID of the user
   * @returns An object containing `accessToken` and `refreshToken`
   */
  async generateRefreshToken(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '15m' });
    const refreshToken = uuidv4();

    const oldRefreshToken = await this.redis.get(`refresh:${userId}`);

    // Store new tokens
    await Promise.all([
      this.redis.set(`refresh:${userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7),
      this.redis.set(
        `refresh:token:${refreshToken}`,
        userId,
        'EX',
        60 * 60 * 24 * 7,
      ),
    ]);

    // Remove old token mapping
    if (oldRefreshToken) {
      await this.redis.del(`refresh:token:${oldRefreshToken}`);
    }

    return { accessToken, refreshToken };
  }

  /**
   * Validates that the provided refresh token matches the stored token.
   * @param userId - ID of the user
   * @param token - Refresh token to validate
   * @throws UnauthorizedException if token is invalid
   */
  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redis.get(`refresh:${userId}`);
    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return true;
  }

  /**
   * Retrieves the userId associated with a refresh token.
   * @param token - Refresh token
   * @returns User ID or null if token does not exist
   */
  async getUserIdFromToken(token: string): Promise<string | null> {
    return this.redis.get(`refresh:token:${token}`);
  }

  /**
   * Revokes refresh token for a given user.
   * @param userId - ID of the user
   */
  async revokeRefreshToken(userId: string): Promise<void> {
    const refreshToken = await this.redis.get(`refresh:${userId}`);
    if (refreshToken) {
      await Promise.all([
        this.redis.del(`refresh:${userId}`),
        this.redis.del(`refresh:token:${refreshToken}`),
      ]);
    }
  }

  /**
   * Revokes refresh token by token value directly (useful for device-specific logout).
   * @param token - Refresh token to revoke
   */
  async revokeByToken(token: string): Promise<void> {
    const userId = await this.redis.get(`refresh:token:${token}`);
    if (userId) {
      await Promise.all([
        this.redis.del(`refresh:${userId}`),
        this.redis.del(`refresh:token:${token}`),
      ]);
    }
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class nestRefreshTokenService {
  private redis: Redis;

  constructor(private readonly jwtService: JwtService) {
    this.redis = new Redis();
  }

  async generateRefreshToken(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '15m' });
    const refreshToken = uuidv4();

    await this.redis.set(
      `refresh:${userId}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.redis.get(`refresh:${userId}`);

    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return true;
  }

  async revokeRefreshToken(userId: string) {
    return this.redis.del(`refresh: ${userId}`);
  }
}

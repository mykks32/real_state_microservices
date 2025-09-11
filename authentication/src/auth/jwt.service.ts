import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class nestJwtService {
  private privateKey: string;

  constructor(private readonly jwtService: JwtService) {
    this.privateKey = 'Shree Krishna Yadav';
  }

  async sign(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        userId,
      },
      {
        expiresIn: '15m',
      },
    );
  }

  async verify(token: string) {
    return await this.jwtService.verifyAsync(token);
  }
}

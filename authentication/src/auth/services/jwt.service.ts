import { Injectable } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class nestJwtService {
  private privateKey: string;

  constructor(
    private readonly jwtService: JwtService
  ) {
    this.privateKey = "Shree Krishna Yadav"
  }

  async sign(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload)
  }

  async verify(payload: string) {
    return await this.jwtService.verifyAsync(payload)
  }
}

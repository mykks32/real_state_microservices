import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  private privateKey: string;

  constructor() {
    this.privateKey = String(Math.random());
  }

  sign(payload: string) {
    return payload.concat(this.privateKey);
  }
}

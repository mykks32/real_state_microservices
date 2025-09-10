import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';

@Module({
  providers: [AuthService, JwtService],
  exports: [JwtService]
})
export class AuthModule { }

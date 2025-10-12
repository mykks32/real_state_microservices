import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { NestRefreshTokenService } from './refresh-token.service';
import { UserModule } from 'src/module/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'Shree Krishna Yadav',
      signOptions: { expiresIn: '60s' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, NestRefreshTokenService],
})
export class AuthModule {}

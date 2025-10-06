import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { nestRefreshTokenService } from './refresh-token.service';
import { userModule } from 'src/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'Shree Krishna Yadav',
      signOptions: { expiresIn: '60s' },
    }),
    userModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, nestRefreshTokenService],
})
export class AuthModule {}

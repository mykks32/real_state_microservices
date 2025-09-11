import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { nestJwtService } from './jwt.service';
import { nestRefreshTokenService } from './refresh-token.service';
import { UserService } from 'src/user/user.service';
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
  providers: [
    AuthService,
    nestRefreshTokenService,
    nestJwtService,
  ],
})
export class AuthModule {}

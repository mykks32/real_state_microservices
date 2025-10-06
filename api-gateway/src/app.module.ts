import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'Shree Krishna Yadav',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

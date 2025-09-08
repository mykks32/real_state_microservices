import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5462,
      username: 'postgres',
      password: 'postgres',
      database: 'real_state_pg',
      entities: [User],
      synchronize: true,
    }),
    UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

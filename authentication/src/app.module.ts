import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { userModule } from './user/user.module';
import { DBModule } from './database/database.module';

@Module({
  imports: [DBModule, AuthModule, userModule],
})
export class AppModule {}

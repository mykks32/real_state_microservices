import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { JwtService } from 'src/auth/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService, JwtService]
})
export class UserModule {}

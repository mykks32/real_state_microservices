import { Module } from '@nestjs/common';
import { userController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [userController],
  providers: [UserService],
  exports: [UserService],
})
export class userModule {}

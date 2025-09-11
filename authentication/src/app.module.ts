import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { userModule } from './user/user.module';
import { DBModule } from './database/database.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [DBModule, AuthModule, userModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

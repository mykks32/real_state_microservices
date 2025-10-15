import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { DBModule } from './database/database.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule,
    DBModule,
    AuthModule,
    UserModule,
    ConfigModule,
    TerminusModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

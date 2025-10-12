import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/common/middleware/logger.middleware';
import { RequestIdMiddleware } from './common/common/middleware/request-id.middleware';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

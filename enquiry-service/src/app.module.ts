import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBModule } from './database/database.module';
import { EnquiryModule } from './enquiry/enquiry.module';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [DBModule, EnquiryModule, TerminusModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

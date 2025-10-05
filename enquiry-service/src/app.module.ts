import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DBModule } from './database/database.module';
import { EnquiryModule } from './enquiry/enquiry.module';
import { RequestIdMiddleware } from './common/middlewares/request-id.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';

@Module({
  imports: [DBModule, EnquiryModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

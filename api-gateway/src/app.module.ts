import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { EnquiryModule } from './modules/enquiry/enquiry.module';
import { ConfigModule } from './config/config.module';
import { PropertyModule } from './modules/property/property.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    AuthModule,
    EnquiryModule,
    PropertyModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

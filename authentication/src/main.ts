import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // const loggerMiddleware = new LoggerMiddleware();
  // app.use(loggerMiddleware.use.bind(loggerMiddleware));

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

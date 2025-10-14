import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());

  console.log('port', process.env.PORT);
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');

  console.log(
    `API Gateway is running on: http://localhost:${process.env.PORT ?? 4000}/`,
  );
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});

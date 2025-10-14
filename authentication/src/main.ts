import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Authentication')
    .setDescription('The Authentication api')
    .setVersion('1.0')
    .addCookieAuth('realState_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'realState_token',
      description: 'Authentication cookie',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log(
    `Auth-Service is running on: http://localhost:${process.env.PORT ?? 3000}/`,
  );
  console.log(
    `Auth-Service Documentation: http://localhost:${process.env.PORT ?? 3000}/docs`,
  );
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Enquiry Service')
    .setDescription('The enquiry api')
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

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Register global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);

  console.log(`API Gateway is running on: http://localhost:${3001}/`);
  console.log(`API Documentation: http://localhost:${3001}/docs`);
}
bootstrap();

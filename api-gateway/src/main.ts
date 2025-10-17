import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway handling authentication and routing')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('admin-property', 'Admin property management endpoints')
    .addTag('seller-property', 'Seller property endpoints')
    .addTag('buyer-property', 'Buyer property endpoints')
    .addTag('enquiry', 'Enquiry endpoints')
    // Bearer token for accessToken (sent in Authorization header)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'bearer', // This name must match the one used in @ApiBearerAuth('bearer')
    )
    // Cookie authentication for refreshToken
    .addCookieAuth('realState_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'realState_token',
      description: 'Refresh token stored in HTTP-only cookie',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());

  console.log('port', process.env.PORT);
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');

  console.log(
    `API Gateway is running on: http://localhost:${process.env.PORT ?? 4000}/`,
  );

  console.log(
    `Swagger documentation is available on: http://localhost:${process.env.PORT ?? 4000}/docs`,
  );
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});

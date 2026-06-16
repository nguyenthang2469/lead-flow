import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AppLogger } from './common/logger/logger.service';
import { HelpService } from './modules/help/help.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AUTH_AT_COOKIE_NAME } from './common/constants/auth.constant';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const helpService = app.get(HelpService);

  app.useLogger(app.get(AppLogger));
  app.enableCors({
    origin: helpService.frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ field không khai báo trong DTO
      forbidNonWhitelisted: false, // Báo lỗi nếu có field lạ
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
      transformOptions: {
        enableImplicitConversion: true, // Cho phép chuyển đổi kiểu dữ liệu ngầm định
      },
    })
  );
  app.setGlobalPrefix('api');
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalInterceptors(app.get(TransformInterceptor));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Lead Management API')
    .setDescription('The core API for managing incoming leads and messages.')
    .setVersion('1.0')
    .addCookieAuth(AUTH_AT_COOKIE_NAME)
    .addSecurityRequirements('bearer')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
    useGlobalPrefix: true,
    customSiteTitle: 'Ecommerce API Documentation',
    raw: ['json'],
  });

  const port = helpService.appPort;
  const logger = app.get(AppLogger);
  await app.listen(port, () => {
    logger.log(`🚀 Application is running on port: ${port}`);
  });
}

void bootstrap();

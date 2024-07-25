import { GlobalExceptionFilter, ResponseInterceptor } from '@core/middlewares';
import { errorFormatter } from '@core/utils';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>(`port}`);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errorFormatter(errors);
        return new BadRequestException([message]);
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const documentSetup = new DocumentBuilder()
    .setTitle('API Document')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, documentSetup);
  SwaggerModule.setup(configService.get('rootApi'), app, document);

  await app.listen(port || 3000);
}
bootstrap();

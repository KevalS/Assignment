import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppConfigService } from './config/app-config.service';
import { unprocessableEntityHandler } from './common/interceptor/validation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
    logger: ['error', 'warn', 'log'],
  });
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  app.use(helmet());

  // add your IP to white list
  const whitelist = ['http://localhost:3000', 'https://web.postman.co'];
  const corsOptions = {
    origin: function (origin: string, callback: any) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: unprocessableEntityHandler,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle(appConfigService.appName)
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  await app.listen(appConfigService.port);

  Logger.log(`Magic happens at PORT : ${appConfigService.port}`);
}
bootstrap();

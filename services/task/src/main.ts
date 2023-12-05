import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { CustomExceptionFilter } from './common/interceptor/rpc-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptor/response.transform.interceptor';
import { DBExceptionFilter } from './common/interceptor/db.exception.filter';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { TaskServiceModule } from './service.task.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskServiceModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3002,
    },
  } as TcpOptions);

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // to remove excluded fields
  app.useGlobalFilters(new DBExceptionFilter()); // Handle Db Error
  await app.listen();
}
bootstrap();

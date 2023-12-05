import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controllers/user.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import configSchema from './config/config.schema';
import { TaskController } from './controllers/task.controller';

let envPath = 'env/.env';
if (process.env.NODE_ENV === 'test') envPath = 'env/test.env';

@Module({
  imports: [
    AppConfigModule,

    // validate and embed .env variables
    ConfigModule.forRoot({
      envFilePath: envPath,
      validationSchema: configSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      isGlobal: true,
    }),
  ],
  controllers: [UserController, TaskController],
  providers: [
    AppConfigService,
    {
      provide: 'USER_SERVICE',
      useFactory: (appConfigService: AppConfigService) => {
        const userService = appConfigService.userConfig;
        return ClientProxyFactory.create(userService);
      },
      inject: [AppConfigService],
    },
    {
      provide: 'TASK_SERVICE',
      useFactory: (appConfigService: AppConfigService) => {
        const userService = appConfigService.taskConfig;
        return ClientProxyFactory.create(userService);
      },
      inject: [AppConfigService],
    },
  ],
})
export class AppModule {}

import { Global, Module } from '@nestjs/common';
import { TaskConfigModule } from './config/task-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskServiceConfig } from './config/task-config.service';
import { resolve } from 'path';
import { ConfigModule } from '@nestjs/config';
import configSchema from './config/task-config.schema';
import { CustomExceptionFilter } from './common/interceptor/rpc-exception.filter';
import { TaskModule } from './entities/task/task.module';

const SEEDS_PATH = resolve(__dirname, 'database/seeds');
const MIGRATIONS_PATH = resolve(__dirname, 'database/migrations');
const ENTITIES_PATH = resolve(__dirname, 'entities');

let envPath = 'env/.env';
if (process.env.NODE_ENV === 'test') envPath = 'env/test.env';
@Global()
@Module({
  imports: [
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
    TaskConfigModule,

    // Enable DB
    TypeOrmModule.forRootAsync({
      imports: [TaskConfigModule],
      useFactory: (TaskServiceConfig: TaskServiceConfig) => {
        return {
          type: 'mysql',
          host: TaskServiceConfig.db.host,
          port: TaskServiceConfig.db.port,
          username: TaskServiceConfig.db.username,
          password: TaskServiceConfig.db.password,
          database: TaskServiceConfig.db.db,
          entities: [`${ENTITIES_PATH}/**/*.entity{.ts,.js}`],
          synchronize: true,
          logging: TaskServiceConfig.enableDBLogging,
          migrations: [
            `${MIGRATIONS_PATH}/*{.ts,.js}`,
            `${SEEDS_PATH}/*{.ts,.js}`,
          ],
          cli: {
            migrationsDir: MIGRATIONS_PATH,
          },
          migrationsRun: true,
          keepConnectionAlive: true,
          dropSchema: TaskServiceConfig.dropDBSchema,
        };
      },
      inject: [TaskServiceConfig],
    }),
    TaskModule,
  ],
  providers: [CustomExceptionFilter],
})
export class TaskServiceModule {}

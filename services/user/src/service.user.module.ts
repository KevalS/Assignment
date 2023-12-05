import { Global, Module } from '@nestjs/common';
import { UserConfigModule } from './config/user-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServiceConfig } from './config/user-config.service';
import { resolve } from 'path';
import { ConfigModule } from '@nestjs/config';
import configSchema from './config/user-config.schema';
import { UserModule } from './entities/user/user.module';
import { CustomExceptionFilter } from './common/interceptor/rpc-exception.filter';

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
    UserConfigModule,

    // Enable DB
    TypeOrmModule.forRootAsync({
      imports: [UserConfigModule],
      useFactory: (UserServiceConfig: UserServiceConfig) => {
        return {
          type: 'mysql',
          host: UserServiceConfig.db.host,
          port: UserServiceConfig.db.port,
          username: UserServiceConfig.db.username,
          password: UserServiceConfig.db.password,
          database: UserServiceConfig.db.db,
          entities: [`${ENTITIES_PATH}/**/*.entity{.ts,.js}`],
          synchronize: true,
          logging: UserServiceConfig.enableDBLogging,
          migrations: [
            `${MIGRATIONS_PATH}/*{.ts,.js}`,
            `${SEEDS_PATH}/*{.ts,.js}`,
          ],
          cli: {
            migrationsDir: MIGRATIONS_PATH,
          },
          migrationsRun: true,
          keepConnectionAlive: true,
          dropSchema: UserServiceConfig.dropDBSchema,
        };
      },
      inject: [UserServiceConfig],
    }),
    UserModule,
  ],
  providers: [CustomExceptionFilter],
})
export class UserServiceModule {}

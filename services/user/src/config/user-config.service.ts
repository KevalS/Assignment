import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as _ from 'lodash';

@Injectable()
export class UserServiceConfig {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return _.toInteger(this.configService.get('USER_SERVICE_PORT'));
  }

  get db(): any {
    return {
      host: this.configService.get('USER_SERVICE_DB_HOST'),
      port: _.toInteger(this.configService.get('USER_SERVICE_DB_PORT')),
      db: this.configService.get('USER_SERVICE_DB_NAME'),
      username: this.configService.get('USER_SERVICE_DB_USERNAME'),
      password: this.configService.get('USER_SERVICE_DB_PASSWORD'),
    };
  }

  get auth(): {
    bcryptRounds: number;
    jwtSecret: string;
    jwtExpTime: string;
    refreshTokenLifetime: number;
  } {
    return {
      bcryptRounds: 10,
      jwtSecret: this.configService.get('JWT_SECRET')!,
      jwtExpTime: this.configService.get('JWT_EXP_TIME')!,
      refreshTokenLifetime: this.configService.get('REFRESH_TOKEN_LIFE')!,
    };
  }

  get dropDBSchema(): boolean {
    return this.configService.get('NODE_ENV') == 'test' ? true : false;
  }

  get enableDBLogging(): boolean {
    return false;
  }

  get webLink(): string {
    return this.configService.get('WEB_LINK')!;
  }

  get taskServiceConfig(): any {
    return {
      options: {
        port: this.configService.get('TASK_SERVICE_PORT'),
        host: this.configService.get('TASK_SERVICE_HOST'),
      },
      transport: Transport.TCP,
    };
  }
}

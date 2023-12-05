import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as _ from 'lodash';

@Injectable()
export class TaskServiceConfig {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return _.toInteger(this.configService.get('TASK_SERVICE_PORT'));
  }

  get db(): any {
    return {
      host: this.configService.get('TASK_SERVICE_DB_HOST'),
      port: _.toInteger(this.configService.get('TASK_SERVICE_DB_PORT')),
      db: this.configService.get('TASK_SERVICE_DB_NAME'),
      username: this.configService.get('TASK_SERVICE_DB_TASKNAME'),
      password: this.configService.get('TASK_SERVICE_DB_PASSWORD'),
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

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as _ from 'lodash';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return _.toInteger(this.configService.get('API_GATEWAY_PORT'));
  }

  get appName(): string {
    return this.configService.get('APP_NAME')!;
  }

  get webLink(): string {
    return this.configService.get('WEB_LINK')!;
  }

  get userConfig(): any {
    return {
      options: {
        port: this.configService.get('USER_SERVICE_PORT'),
        host: this.configService.get('USER_SERVICE_HOST'),
      },
      transport: Transport.TCP,
    };
  }

  get taskConfig(): any {
    return {
      options: {
        port: this.configService.get('TASK_SERVICE_PORT'),
        host: this.configService.get('TASK_SERVICE_HOST'),
      },
      transport: Transport.TCP,
    };
  }
}

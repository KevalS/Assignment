import { Module } from '@nestjs/common';
import { UserServiceConfig } from './user-config.service';

@Module({
  providers: [UserServiceConfig],
  exports: [UserServiceConfig],
})
export class UserConfigModule {}

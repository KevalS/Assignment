import { Module } from '@nestjs/common';
import { TaskServiceConfig } from './task-config.service';

@Module({
  providers: [TaskServiceConfig],
  exports: [TaskServiceConfig],
})
export class TaskConfigModule {}

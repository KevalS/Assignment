import { Global, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskConfigModule } from '../../config/task-config.module';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Task]), TaskConfigModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

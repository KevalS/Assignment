import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TaskCreateDto } from './task.dto';
import { TaskService } from './task.service';
import { RequestData } from '../../common/validators/req.info';

@Controller('Task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('create_task')
  async create(options: RequestData) {
    const taskCreateDto: TaskCreateDto = options.body;
    return this.taskService.createTask(taskCreateDto);
  }

  @MessagePattern('update_task')
  async updateTask(options: RequestData) {
    return this.taskService.updateTask(options);
  }

  @MessagePattern('get_all_tasks')
  async getTasks(options: RequestData) {
    return this.taskService.getTasks(options);
  }

  @MessagePattern('get_task_by_id')
  async getTask(options: RequestData) {
    return this.taskService.getTask(options);
  }

  @MessagePattern('task_delete')
  async deleteTask(options: RequestData) {
    return this.taskService.deleteTask(options.params.taskId);
  }

  @MessagePattern('update_task_status')
  async updateTaskStatus(options: RequestData) {
    return this.taskService.updateTaskStatus(options);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskCreateDto } from './task.dto';
import { Task } from './task.entity';
import { RequestData } from '../../common/validators/req.info';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(taskCreateDto: TaskCreateDto): Promise<Task> {
    const task = new Task();
    Object.assign(task, taskCreateDto);
    return this.taskRepository.save(task);
  }

  async updateTask(options: RequestData): Promise<any> {
    const id = options.params.taskId;
    let where: any = { id };
    if (options.selfOnly) where = { id, userId: options.user.id };
    const task = await this.taskRepository.findOne(where);
    if (!task) return new NotFoundException('No Task Found');
    return this.taskRepository.update(id, options.body);
  }

  async updateTaskStatus(options: RequestData): Promise<any> {
    const id = options.params.taskId;
    let where: any = { id };
    if (options.selfOnly) where = { id, userId: options.user.id };
    const task = await this.taskRepository.findOne(where);
    if (!task) return new NotFoundException('No Task Found');
    return this.taskRepository.update(id, { status: options.body.status });
  }

  async getTasks(options: RequestData): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    if (options.query && options.query.searchString) {
      query.where('task.title like :title', {
        title: `%${options.query.searchString}%`, // Fix the parameter name to match the placeholder in the query
      });
    }
    if (options.selfOnly) {
      query.andWhere('task.userId = :userId', {
        userId: options.user.id,
      });
    }

    if (options.query && options.query.sortBy) {
      const sortOrder: 'ASC' | 'DESC' = 'ASC'; // You can set the desired sort order here

      query.orderBy(`task.${options.query.sortBy}`, sortOrder);
    }
    return query.getMany();
  }

  async getTask(options: RequestData): Promise<any> {
    const id = options.params.taskId;
    let where: any = { id };
    if (options.selfOnly) where = { id, userId: options.user.id };
    const task = await this.taskRepository.findOne(where);
    if (!task) throw new NotFoundException('No Task Found');
    return task;
  }

  async deleteTask(id: string): Promise<any> {
    return this.taskRepository.delete(id);
  }
}

import { Body, Delete, Get, Param, Put, Query, Req } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from '../dtos/task.dto';
import { Auth } from '../auth/role.decorator';
import { RequestData } from '../common/validators/enums';

@Controller('Task')
@ApiTags('Tasks')
export class TaskController {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskServiceClient: ClientProxy,
  ) {}

  @ApiBody({ type: CreateTaskDto })
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @Post('/')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' })
  public async create(@Body() createTaskDto: CreateTaskDto) {
    return firstValueFrom(
      this.taskServiceClient.send('create_task', { body: createTaskDto }),
    );
  }
  @ApiBody({ type: UpdateTaskDto })
  @ApiCreatedResponse({
    description: 'Task Updated successfully',
  })
  @Put('/:taskId')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' })
  public async update(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('taskId') taskId: number,
    @Req() req: RequestData,
  ) {
    return firstValueFrom(
      this.taskServiceClient.send('update_task', {
        body: updateTaskDto,
        params: { taskId },
        user: req.user,
        selfOnly: req.selfOnly,
      }),
    );
  }

  @Get('/')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' }, { type: 'default' })
  public async get(
    @Req() req: RequestData,
    @Query('searchString') searchString: string,
    @Query('sortBy') sortBy: string,
  ) {
    return firstValueFrom(
      this.taskServiceClient.send('get_all_tasks', {
        selfOnly: req.selfOnly,
        user: req.user,
        query: { searchString, sortBy },
      }),
    );
  }

  @Get('/:taskId')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' }, { type: 'default' })
  public async getById(
    @Param('taskId') taskId: number,
    @Req() req: RequestData,
  ) {
    return firstValueFrom(
      this.taskServiceClient.send('get_task_by_id', {
        params: { taskId },
        user: req.user,
      }),
    );
  }

  @Delete('/:taskId')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' }, { type: 'default' })
  async deleteTask(@Param('taskId') taskId: string) {
    return firstValueFrom(
      this.taskServiceClient.send('task_delete', { params: { taskId } }),
    );
  }

  @ApiBody({ type: UpdateTaskDto })
  @ApiCreatedResponse({
    description: 'Task Updated successfully',
  })
  @Put('/Status/:taskId')
  @ApiBearerAuth('Authorization')
  @Auth({ type: 'admin' }, { type: 'default' })
  public async updateStatus(
    @Body() updateTaskDto: UpdateTaskStatusDto,
    @Param('taskId') taskId: number,
    @Req() req: RequestData,
  ) {
    return firstValueFrom(
      this.taskServiceClient.send('update_task_status', {
        body: updateTaskDto,
        params: { taskId },
        user: req.user,
        selfOnly: req.selfOnly,
      }),
    );
  }
}

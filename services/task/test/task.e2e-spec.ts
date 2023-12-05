import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import TestUtils from './test.util';
import { firstValueFrom } from 'rxjs';
import { TaskServiceModule } from '../src/service.task.module';
import { Task } from '../src/entities/task/task.entity';
import { TaskCreateDto, TaskUpdateDto } from '../src/entities/task/task.dto';

// jest.setTimeout(30000);
const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(function () {
      resolve('finish');
    }, ms);
  });

let task: Task;
describe('TASK', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let testUtil: TestUtils;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TaskServiceModule,
        ClientsModule.register([
          { name: 'TASK_SERVICE', transport: Transport.TCP },
        ]),
      ],
    }).compile();
    app = moduleFixture.createNestApplication();

    await sleep(500);
    app.connectMicroservice({
      transport: Transport.TCP,
    });

    await app.startAllMicroservices();
    await app.init();

    client = app.get('TASK_SERVICE');
    await client.connect();
    testUtil = new TestUtils(app, client);
    await testUtil.clean();
  });

  it('Should be able to create task', async () => {
    const body: TaskCreateDto = {
      title: 'First Task',
      description: 'First Task Description',
      dueDate: '2023-12-02T10:41:37.365Z',
      userId: 'user.id',
      priority: 1,
      status: 'pending',
    };
    const response = await firstValueFrom(client.send('create_task', { body }));
    expect(response).toBeDefined();
    task = response;
  });

  it('Should be able to update task in db', async () => {
    const taskUpdateDto: TaskUpdateDto = {
      title: 'Task Updated',
    };
    const response: Task = await firstValueFrom(
      client.send('update_task', {
        body: taskUpdateDto,
        params: { taskId: task.id },
      }),
    );
    expect(response).toBeDefined();
  });

  it('Should be able to get task from db', async () => {
    const response: Task = await firstValueFrom(
      client.send('get_all_tasks', {}),
    );
    expect(response).toBeDefined();
    expect(response).toHaveLength(1);
  });

  it('Should be able to get task by id from db', async () => {
    const response: Task = await firstValueFrom(
      client.send('get_task_by_id', { params: { taskId: task.id } }),
    );
    expect(response).toBeDefined();
  });

  afterAll(async () => {
    await testUtil.down();
  });
});

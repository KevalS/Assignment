import { INestApplication } from '@nestjs/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { firstValueFrom } from 'rxjs';
import {
  AuthLoginDto,
  DeviceType,
  UserCreateDto,
  UserUpdateDto,
} from '../src/entities/user/user.dto';
import { User } from '../src/entities/user/user.entity';
import { UserServiceModule } from '../src/service.user.module';
import TestUtils from './test.util';
// jest.setTimeout(30000);
const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(function () {
      resolve('finish');
    }, ms);
  });

let user: User;
describe('USER', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let testUtil: TestUtils;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserServiceModule,
        ClientsModule.register([
          { name: 'USER_SERVICE', transport: Transport.TCP },
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

    client = app.get('USER_SERVICE');
    await client.connect();
    testUtil = new TestUtils(app, client);
    await testUtil.clean();
  });

  it('Member Should be able to login with valid credential', async () => {
    const body: AuthLoginDto = {
      email: 'keval688@gmail.com',
      deviceToken: '123414',
      password: 'qwertyuiop',
      deviceType: DeviceType.WEB,
    };
    const response = await firstValueFrom(client.send('Login', body));
    expect(response.status).toEqual(400);
    expect(response.response.message).toEqual('Invalid credentials');
  });

  it('Should be able to save user in db', async () => {
    const userCreateDto: UserCreateDto = {
      name: 'Jon',
      email: 'snow@dkod3.com',
      password: 'changeme',
      phone: '+918931097383',
      role: 'admin',
    };
    const response: User = await firstValueFrom(
      client.send('user_create', { body: userCreateDto }),
    );
    expect(response).toBeDefined();
    expect(response.email).not.toBeNull();
    expect(response.password).not.toBeNull();
    user = response;
  });

  it('Should be able to update user in db', async () => {
    const userUpdateDto: UserUpdateDto = {
      name: 'Jon Snow Updated',
    };
    const response: User = await firstValueFrom(
      client.send('user_update', {
        body: userUpdateDto,
        params: { userId: user.id },
      }),
    );
    expect(response).toBeDefined();
  });

  it('Should be able to get users from db', async () => {
    const response: User = await firstValueFrom(
      client.send('user_get_all', {}),
    );
    expect(response).toBeDefined();
    expect(response).toHaveLength(1);
  });

  afterAll(async () => {
    await testUtil.down();
  });
});

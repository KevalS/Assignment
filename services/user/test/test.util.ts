import { Connection, getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export default class TestUtils {
  private readonly connection: Connection;
  private readonly app: INestApplication;
  private readonly client: ClientProxy;

  constructor(app: INestApplication, client: ClientProxy) {
    this.connection = getConnection();
    this.app = app;
    this.client = client;
  }

  async clean() {
    jest.setTimeout(5000);
  }

  async down() {
    await this.connection.close();
    await this.client.close();
    await this.app.close();
  }
}

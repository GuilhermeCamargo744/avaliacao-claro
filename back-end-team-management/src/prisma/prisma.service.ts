import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnApplicationShutdown {
  readonly orm = db.orm;
  readonly sql = db.sql;

  async ping() {
    await db.transaction(async () => {});
  }

  async onModuleInit() {
    await db.connect();
    await this.ping();
  }

  async onApplicationShutdown() {
    await db.close();
  }
}

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

  async onModuleInit() {
    await db.connect();
    await db.transaction(async () => {});
  }

  async onApplicationShutdown() {
    await db.close();
  }
}

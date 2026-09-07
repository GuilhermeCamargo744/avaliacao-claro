import { Module } from '@nestjs/common';
import { TeamsModule } from '../teams/teams.module.js';
import { TasksService } from './application/tasks.service.js';
import { TASK_REPOSITORY } from './domain/task.repository.js';
import { PrismaTaskRepository } from './infrastructure/prisma-task.repository.js';
import { TasksController } from './infrastructure/tasks.controller.js';

@Module({
  imports: [TeamsModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    { provide: TASK_REPOSITORY, useClass: PrismaTaskRepository },
  ],
})
export class TasksModule {}

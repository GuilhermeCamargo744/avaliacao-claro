import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { TeamsModule } from './teams/teams.module.js';

@Module({
  imports: [PrismaModule, TeamsModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

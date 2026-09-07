import { Module } from '@nestjs/common';
import { TeamsService } from './application/teams.service.js';
import { TEAM_REPOSITORY } from './domain/team.repository.js';
import { PrismaTeamRepository } from './infrastructure/prisma-team.repository.js';
import { TeamsController } from './infrastructure/teams.controller.js';

@Module({
  controllers: [TeamsController],
  providers: [
    TeamsService,
    { provide: TEAM_REPOSITORY, useClass: PrismaTeamRepository },
  ],
  exports: [TEAM_REPOSITORY],
})
export class TeamsModule {}

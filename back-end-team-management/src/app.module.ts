import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { TeamsModule } from './teams/teams.module.js';

@Module({
  imports: [PrismaModule, TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

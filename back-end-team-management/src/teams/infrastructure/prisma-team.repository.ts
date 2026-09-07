import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Team } from '../domain/team.js';
import {
  NewTeam,
  TeamChanges,
  TeamRepository,
} from '../domain/team.repository.js';

@Injectable()
export class PrismaTeamRepository implements TeamRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(team: NewTeam): Promise<Team> {
    return this.prisma.orm.public.Team.create({
      name: team.name,
      colorHex: team.colorHex,
      description: team.description ?? null,
    });
  }

  async findAll(): Promise<Team[]> {
    return await this.prisma.orm.public.Team.all();
  }

  findById(id: string): Promise<Team | null> {
    return this.prisma.orm.public.Team.where({ id }).first();
  }

  update(id: string, changes: TeamChanges): Promise<Team | null> {
    return this.prisma.orm.public.Team.where({ id }).update(changes);
  }

  delete(id: string): Promise<Team | null> {
    return this.prisma.orm.public.Team.where({ id }).delete();
  }
}

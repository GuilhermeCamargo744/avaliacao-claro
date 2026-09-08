import { Injectable } from '@nestjs/common';
import { or } from '@prisma/orm-postgres/orm-client';
import { Page } from '../../common/page.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Team } from '../domain/team.js';
import {
  NewTeam,
  TeamChanges,
  TeamFilters,
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

  async findAll(filters: TeamFilters): Promise<Page<Team>> {
    const { total } = await this.filtered(filters).aggregate((a) => ({
      total: a.count(),
    }));

    const data = await this.filtered(filters)
      .orderBy((t) => t.name.asc())
      .limit(filters.limit)
      .offset(filters.offset)
      .all();

    return {
      data,
      meta: { total, limit: filters.limit, offset: filters.offset },
    };
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

  private filtered(filters: TeamFilters) {
    if (!filters.search) {
      return this.prisma.orm.public.Team;
    }

    const term = `%${filters.search}%`;

    return this.prisma.orm.public.Team.where((t) =>
      or(t.name.ilike(term), t.description.ilike(term)),
    );
  }
}

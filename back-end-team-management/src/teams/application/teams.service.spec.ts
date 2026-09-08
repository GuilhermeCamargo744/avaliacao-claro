import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Page } from '../../common/page.js';
import type { Team } from '../domain/team.js';
import { TEAM_REPOSITORY } from '../domain/team.repository.js';
import type {
  NewTeam,
  TeamChanges,
  TeamFilters,
  TeamRepository,
} from '../domain/team.repository.js';
import { TeamsService } from './teams.service.js';

class InMemoryTeamRepository implements TeamRepository {
  private readonly teams = new Map<string, Team>();
  private nextId = 1;

  async create(team: NewTeam) {
    const now = new Date().toISOString();
    const created: Team = {
      id: String(this.nextId++),
      name: team.name,
      colorHex: team.colorHex,
      description: team.description ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.teams.set(created.id, created);
    return created;
  }

  async findAll(filters: TeamFilters): Promise<Page<Team>> {
    const all = [...this.teams.values()].filter(
      (team) => !filters.search || team.name.includes(filters.search),
    );
    return {
      data: all.slice(filters.offset, filters.offset + filters.limit),
      meta: { total: all.length, limit: filters.limit, offset: filters.offset },
    };
  }

  async findById(id: string) {
    return this.teams.get(id) ?? null;
  }

  async update(id: string, changes: TeamChanges) {
    const team = this.teams.get(id);
    if (!team) {
      return null;
    }
    const updated = { ...team, ...changes };
    this.teams.set(id, updated);
    return updated;
  }

  async delete(id: string) {
    const team = this.teams.get(id);
    this.teams.delete(id);
    return team ?? null;
  }
}

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: TEAM_REPOSITORY, useClass: InMemoryTeamRepository },
      ],
    }).compile();

    service = module.get(TeamsService);
  });

  it('cria um time e devolve na listagem com o total', async () => {
    const team = await service.create({ name: 'Alpha', colorHex: '#2563EB' });
    const page = await service.findAll({ limit: 20, offset: 0 });

    expect(team.id).toBeDefined();
    expect(page.data).toEqual([team]);
    expect(page.meta.total).toBe(1);
  });

  it('filtra a listagem pela busca', async () => {
    await service.create({ name: 'Alpha', colorHex: '#2563EB' });
    await service.create({ name: 'Beta', colorHex: '#16A34A' });

    const page = await service.findAll({ search: 'Bet', limit: 20, offset: 0 });

    expect(page.meta.total).toBe(1);
    expect(page.data[0]?.name).toBe('Beta');
  });

  it('atualiza um time existente', async () => {
    const team = await service.create({ name: 'Alpha', colorHex: '#2563EB' });
    const updated = await service.update(team.id, { name: 'Beta' });

    expect(updated.name).toBe('Beta');
  });

  it('falha ao buscar um time que não existe', async () => {
    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
  });
});

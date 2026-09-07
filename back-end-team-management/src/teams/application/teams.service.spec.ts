import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Team } from '../domain/team.js';
import { TEAM_REPOSITORY } from '../domain/team.repository.js';
import type {
  NewTeam,
  TeamChanges,
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

  async findAll() {
    return [...this.teams.values()];
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

  it('cria um time e devolve na listagem', async () => {
    const team = await service.create({ name: 'Alpha', colorHex: '#2563EB' });

    expect(team.id).toBeDefined();
    expect(await service.findAll()).toEqual([team]);
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

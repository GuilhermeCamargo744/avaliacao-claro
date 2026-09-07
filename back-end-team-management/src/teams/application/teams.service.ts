import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TEAM_REPOSITORY } from '../domain/team.repository.js';
import type {
  NewTeam,
  TeamChanges,
  TeamRepository,
} from '../domain/team.repository.js';

@Injectable()
export class TeamsService {
  constructor(
    @Inject(TEAM_REPOSITORY) private readonly teams: TeamRepository,
  ) {}

  create(team: NewTeam) {
    return this.teams.create(team);
  }

  findAll() {
    return this.teams.findAll();
  }

  async findOne(id: string) {
    const team = await this.teams.findById(id);
    if (!team) {
      throw new NotFoundException(`Time ${id} não encontrado`);
    }
    return team;
  }

  async update(id: string, changes: TeamChanges) {
    const team = await this.teams.update(id, changes);
    if (!team) {
      throw new NotFoundException(`Time ${id} não encontrado`);
    }
    return team;
  }

  async remove(id: string) {
    const team = await this.teams.delete(id);
    if (!team) {
      throw new NotFoundException(`Time ${id} não encontrado`);
    }
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TEAM_REPOSITORY } from '../../teams/domain/team.repository.js';
import type { TeamRepository } from '../../teams/domain/team.repository.js';
import { TASK_REPOSITORY } from '../domain/task.repository.js';
import type {
  NewTask,
  TaskChanges,
  TaskFilters,
  TaskRepository,
} from '../domain/task.repository.js';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly tasks: TaskRepository,
    @Inject(TEAM_REPOSITORY) private readonly teams: TeamRepository,
  ) {}

  async create(task: NewTask) {
    await this.assertTeamsExist(task.teamIds);
    return this.tasks.create(task);
  }

  findAll(filters: TaskFilters) {
    return this.tasks.findAll(filters);
  }

  async findOne(id: string) {
    const task = await this.tasks.findById(id);
    if (!task) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`);
    }
    return task;
  }

  async update(id: string, changes: TaskChanges) {
    await this.assertTeamsExist(changes.teamIds);
    const task = await this.tasks.update(id, changes);
    if (!task) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`);
    }
    return task;
  }

  async remove(id: string) {
    const task = await this.tasks.delete(id);
    if (!task) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`);
    }
  }

  private async assertTeamsExist(teamIds?: string[]) {
    if (!teamIds?.length) {
      return;
    }

    const found = await Promise.all(teamIds.map((id) => this.teams.findById(id)));
    const missing = teamIds.filter((_, index) => !found[index]);

    if (missing.length) {
      throw new BadRequestException(
        `Time não encontrado: ${missing.join(', ')}`,
      );
    }
  }
}

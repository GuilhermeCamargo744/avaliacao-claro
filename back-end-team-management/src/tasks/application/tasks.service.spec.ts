import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Page } from '../../common/page.js';
import type { Team } from '../../teams/domain/team.js';
import { TEAM_REPOSITORY } from '../../teams/domain/team.repository.js';
import type { TeamRepository } from '../../teams/domain/team.repository.js';
import type { Task } from '../domain/task.js';
import { TASK_REPOSITORY } from '../domain/task.repository.js';
import type {
  NewTask,
  TaskChanges,
  TaskFilters,
  TaskRepository,
} from '../domain/task.repository.js';
import { TasksService } from './tasks.service.js';

const team: Team = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Alpha',
  colorHex: '#2563EB',
  description: null,
  createdAt: '2026-09-07',
  updatedAt: '2026-09-07',
};

class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks = new Map<string, Task>();
  private nextId = 1;

  async create(task: NewTask) {
    const created: Task = {
      id: String(this.nextId++),
      title: task.title,
      description: task.description ?? null,
      status: task.status ?? 'pending',
      dueDate: task.dueDate ?? null,
      teams: task.teamIds?.map(() => ({ id: team.id, name: team.name, colorHex: team.colorHex })) ?? [],
      createdAt: '2026-09-07',
      updatedAt: '2026-09-07',
    };
    this.tasks.set(created.id, created);
    return created;
  }

  async findAll(filters: TaskFilters): Promise<Page<Task>> {
    const all = [...this.tasks.values()].filter(
      (task) => !filters.status || task.status === filters.status,
    );
    return {
      data: all.slice(filters.offset, filters.offset + filters.limit),
      meta: { total: all.length, limit: filters.limit, offset: filters.offset },
    };
  }

  async findById(id: string) {
    return this.tasks.get(id) ?? null;
  }

  async update(id: string, changes: TaskChanges) {
    const task = this.tasks.get(id);
    if (!task) {
      return null;
    }
    const updated = { ...task, status: changes.status ?? task.status };
    this.tasks.set(id, updated);
    return updated;
  }

  async delete(id: string) {
    const task = this.tasks.get(id);
    this.tasks.delete(id);
    return task ?? null;
  }
}

class FakeTeamRepository implements Partial<TeamRepository> {
  async findById(id: string) {
    return id === team.id ? team : null;
  }
}

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TASK_REPOSITORY, useClass: InMemoryTaskRepository },
        { provide: TEAM_REPOSITORY, useClass: FakeTeamRepository },
      ],
    }).compile();

    service = module.get(TasksService);
  });

  it('cria uma tarefa com status pendente por padrão', async () => {
    const task = await service.create({ title: 'Primeira tarefa' });

    expect(task.status).toBe('pending');
    expect(task.teams).toEqual([]);
  });

  it('vincula a tarefa a um time existente', async () => {
    const task = await service.create({
      title: 'Com time',
      teamIds: [team.id],
    });

    expect(task.teams[0]?.colorHex).toBe('#2563EB');
  });

  it('recusa vínculo com time inexistente', async () => {
    await expect(
      service.create({
        title: 'Time errado',
        teamIds: ['22222222-2222-4222-8222-222222222222'],
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('lista com total e filtro de status', async () => {
    await service.create({ title: 'Pendente' });
    await service.create({ title: 'Concluída', status: 'done' });

    const page = await service.findAll({
      status: 'done',
      sort: 'createdAt',
      order: 'desc',
      limit: 20,
      offset: 0,
    });

    expect(page.meta.total).toBe(1);
    expect(page.data[0]?.title).toBe('Concluída');
  });

  it('falha ao buscar tarefa inexistente', async () => {
    await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
  });
});

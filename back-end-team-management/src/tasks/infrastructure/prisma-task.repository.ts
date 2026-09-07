import { Injectable } from '@nestjs/common';
import { or } from '@prisma/orm-postgres/orm-client';
import { Page } from '../../common/page.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Task } from '../domain/task.js';
import {
  NewTask,
  TaskChanges,
  TaskFilters,
  TaskRepository,
} from '../domain/task.repository.js';

type TaskRow = Awaited<
  ReturnType<PrismaTaskRepository['findRow']>
> extends infer Row
  ? Row
  : never;

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: NewTask): Promise<Task> {
    const created = await this.prisma.orm.public.Task.create({
      title: task.title,
      description: task.description ?? null,
      status: task.status ?? 'pending',
      dueDate: task.dueDate ?? null,
    });

    await this.linkTeams(created.id, task.teamIds ?? []);

    return (await this.findById(created.id))!;
  }

  async findAll(filters: TaskFilters): Promise<Page<Task>> {
    const taskIds = await this.taskIdsOfTeam(filters.teamId);

    if (taskIds?.length === 0) {
      return { data: [], meta: { total: 0, ...this.pageOf(filters) } };
    }

    const { total } = await this.filtered(filters, taskIds).aggregate((a) => ({
      total: a.count(),
    }));

    const rows = await this.filtered(filters, taskIds)
      .include('teams', (link) => link.include('team'))
      .orderBy((t) =>
        filters.order === 'asc' ? t[filters.sort].asc() : t[filters.sort].desc(),
      )
      .limit(filters.limit)
      .offset(filters.offset)
      .all();

    return {
      data: rows.map((row) => this.toTask(row)),
      meta: { total, ...this.pageOf(filters) },
    };
  }

  async findById(id: string): Promise<Task | null> {
    const row = await this.findRow(id);
    return row ? this.toTask(row) : null;
  }

  async update(id: string, changes: TaskChanges): Promise<Task | null> {
    const { teamIds, ...fields } = changes;
    const current = await this.prisma.orm.public.Task.where({ id }).first();

    if (!current) {
      return null;
    }

    if (Object.keys(fields).length) {
      await this.prisma.orm.public.Task.where({ id }).update(fields);
    }

    if (teamIds) {
      await this.unlinkTeams(id);
      await this.linkTeams(id, teamIds);
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<Task | null> {
    const task = await this.findById(id);
    if (!task) {
      return null;
    }

    await this.unlinkTeams(id);
    await this.prisma.orm.public.Task.where({ id }).delete();

    return task;
  }

  private findRow(id: string) {
    return this.prisma.orm.public.Task.where({ id })
      .include('teams', (link) => link.include('team'))
      .first();
  }

  private filtered(filters: TaskFilters, taskIds: string[] | undefined) {
    let tasks = this.prisma.orm.public.Task;

    if (taskIds) {
      tasks = tasks.where((t) => t.id.in(taskIds));
    }
    if (filters.status) {
      tasks = tasks.where({ status: filters.status });
    }
    if (filters.search) {
      const term = `%${filters.search}%`;
      tasks = tasks.where((t) =>
        or(t.title.ilike(term), t.description.ilike(term)),
      );
    }

    return tasks;
  }

  private async taskIdsOfTeam(teamId?: string) {
    if (!teamId) {
      return undefined;
    }

    const links = await this.prisma.orm.public.TaskTeam.where({ teamId })
      .select('taskId')
      .all();

    return links.map((link) => link.taskId);
  }

  private linkTeams(taskId: string, teamIds: string[]) {
    return Promise.all(
      teamIds.map((teamId) =>
        this.prisma.orm.public.TaskTeam.create({ taskId, teamId }),
      ),
    );
  }

  private async unlinkTeams(taskId: string) {
    const links = await this.prisma.orm.public.TaskTeam.where({ taskId })
      .select('teamId')
      .all();

    for (const { teamId } of links) {
      await this.prisma.orm.public.TaskTeam.where({ taskId, teamId }).delete();
    }
  }

  private pageOf(filters: TaskFilters) {
    return { limit: filters.limit, offset: filters.offset };
  }

  private toTask(row: NonNullable<TaskRow>): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      dueDate: row.dueDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      teams: row.teams.map((link) => ({
        id: link.team.id,
        name: link.team.name,
        colorHex: link.team.colorHex,
      })),
    };
  }
}

import { Page } from '../../common/page.js';
import { Task, TaskStatus } from './task.js';

export interface NewTask {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  dueDate?: string | null;
  teamIds?: string[];
}

export type TaskChanges = Partial<NewTask>;

export interface TaskFilters {
  teamId?: string;
  status?: TaskStatus;
  search?: string;
  sort: 'createdAt' | 'dueDate' | 'title';
  order: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface TaskRepository {
  create(task: NewTask): Promise<Task>;
  findAll(filters: TaskFilters): Promise<Page<Task>>;
  findById(id: string): Promise<Task | null>;
  update(id: string, changes: TaskChanges): Promise<Task | null>;
  delete(id: string): Promise<Task | null>;
}

export const TASK_REPOSITORY = 'TASK_REPOSITORY';

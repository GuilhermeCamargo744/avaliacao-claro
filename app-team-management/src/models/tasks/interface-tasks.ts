export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface TaskTeam {
  id: string;
  name: string;
  colorHex: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  teams: TaskTeam[];
  createdAt: string;
  updatedAt: string;
}

export interface TasksPageResponse {
  data: TaskResponse[];
  meta: { total: number; limit: number; offset: number };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  teams: TaskTeam[];
  createdAt: string;
  updatedAt: string;
}

export interface ListTasksFilters {
  teamId?: string;
  status?: TaskStatus;
  search?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  teamId: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  teamId?: string;
}

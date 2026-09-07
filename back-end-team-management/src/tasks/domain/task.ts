export const TASK_STATUSES = ['pending', 'in_progress', 'done'] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface TaskTeam {
  id: string;
  name: string;
  colorHex: string;
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

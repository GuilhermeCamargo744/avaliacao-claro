import { TASK_STATUSES, type TaskStatus } from '@/models/tasks/interface-tasks';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  pending: 'pendente',
  in_progress: 'em progresso',
  done: 'concluída',
};

export const TASK_STATUS_OPTIONS = TASK_STATUSES.map((status) => ({
  value: status,
  label: TASK_STATUS_LABEL[status],
}));

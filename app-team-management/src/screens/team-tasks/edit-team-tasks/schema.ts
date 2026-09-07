import { z } from 'zod';

import { TASK_STATUSES } from '@/models/tasks/interface-tasks';

export const editTaskSchema = z.object({
  title: z.string().trim().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().trim(),
  teamId: z.string().min(1, 'Selecione um time'),
  status: z.enum(TASK_STATUSES),
});

export type EditTaskForm = z.infer<typeof editTaskSchema>;

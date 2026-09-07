import { z } from 'zod';

import { TASK_STATUSES } from '@/models/tasks/interface-tasks';

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, 'O título deve ter no mínimo 3 caracteres'),
  description: z.string().trim().optional(),
  teamId: z.string().min(1, 'Selecione um time'),
  status: z.enum(TASK_STATUSES).optional(),
});

export type CreateTaskForm = z.infer<typeof createTaskSchema>;

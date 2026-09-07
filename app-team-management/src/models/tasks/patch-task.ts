import { api } from '../server-config';
import { mapTask } from './map-task';
import type { TaskResponse, UpdateTaskInput } from './interface-tasks';

export const patchTask = async (input: UpdateTaskInput) => {
  const { data } = await api.patch<TaskResponse>(`/tasks/${input.id}`, {
    title: input.title,
    description: input.description,
    status: input.status,
    teamIds: input.teamId ? [input.teamId] : undefined,
  });

  return mapTask(data);
};

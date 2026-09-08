import { api } from '../server-config';
import { mapTask } from './map-task';
import type { TaskResponse, UpdateTaskInput } from './interface-tasks';

export const patchTask = async ({ id, title, description, status, teamId }: UpdateTaskInput) => {
  const { data } = await api.patch<TaskResponse>(`/tasks/${id}`, {
    title,
    description,
    status,
    teamIds: teamId === undefined ? undefined : [teamId],
  });

  return mapTask(data);
};

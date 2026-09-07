import { api } from '../server-config';
import { mapTask } from './map-task';
import type { CreateTaskInput, TaskResponse } from './interface-tasks';

export const postTasks = async (input: CreateTaskInput) => {
  const { data } = await api.post<TaskResponse>('/tasks', {
    title: input.title,
    description: input.description || undefined,
    status: input.status,
    teamIds: [input.teamId],
  });

  return mapTask(data);
};

import { api } from '../server-config';
import { mapTask } from './map-task';
import type { TaskResponse } from './interface-tasks';

export const getTask = async (id: string) => {
  const { data } = await api.get<TaskResponse>(`/tasks/${id}`);

  return mapTask(data);
};

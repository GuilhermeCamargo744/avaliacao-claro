import { api } from '../server-config';
import { mapTask } from './map-task';
import type { ListTasksFilters, Task, TasksPageResponse } from './interface-tasks';

export type TasksPage = {
  tasks: Task[];
  meta: { total: number; limit: number; offset: number };
};

export const getTasks = async (filters: ListTasksFilters = {}): Promise<TasksPage> => {
  const { data } = await api.get<TasksPageResponse>('/tasks', { params: filters });

  return {
    tasks: data.data.map(mapTask),
    meta: data.meta,
  };
};

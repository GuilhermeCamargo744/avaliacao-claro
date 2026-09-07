import { api } from '../server-config';
import { mapTask } from './map-task';
import type { ListTasksFilters, TasksPageResponse } from './interface-tasks';

export const getTasks = async (filters: ListTasksFilters = {}) => {
  const { data } = await api.get<TasksPageResponse>('/tasks', { params: filters });

  return data.data.map(mapTask);
};

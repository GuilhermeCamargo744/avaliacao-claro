import { toIsoTimestamp } from '../normalize-timestamp';
import type { Task, TaskResponse } from './interface-tasks';

export const mapTask = (response: TaskResponse): Task => ({
  id: response.id,
  title: response.title,
  description: response.description,
  status: response.status,
  dueDate: response.dueDate ? toIsoTimestamp(response.dueDate) : null,
  teams: response.teams,
  createdAt: toIsoTimestamp(response.createdAt),
  updatedAt: toIsoTimestamp(response.updatedAt),
});

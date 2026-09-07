import { api } from '../server-config';

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`);
};

import { api } from '../server-config';

export const deleteTeam = async (id: string) => {
  await api.delete(`/teams/${id}`);
};

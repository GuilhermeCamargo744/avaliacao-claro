import { api } from '../server-config';
import { mapTeam } from './map-team';
import type { TeamResponse } from './interface-teams';

export const getTeam = async (id: string) => {
  const { data } = await api.get<TeamResponse>(`/teams/${id}`);

  return mapTeam(data);
};

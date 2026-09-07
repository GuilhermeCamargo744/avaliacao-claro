import { api } from '../server-config';
import { mapTeam } from './map-team';
import type { TeamResponse } from './interface-teams';

export const getTeams = async () => {
  const { data } = await api.get<TeamResponse[]>('/teams');

  return data.map(mapTeam);
};

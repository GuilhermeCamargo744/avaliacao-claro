import { api } from '../server-config';
import { mapTeam } from './map-team';
import type { ListTeamsFilters, TeamsPageResponse } from './interface-teams';

// O app não tem paginação; pede o teto do servidor e trata o resto como limite conhecido.
const MAX_TEAMS = 100;

export const getTeams = async (filters: ListTeamsFilters = {}) => {
  const { data } = await api.get<TeamsPageResponse>('/teams', {
    params: { ...filters, limit: MAX_TEAMS },
  });

  return data.data.map(mapTeam);
};

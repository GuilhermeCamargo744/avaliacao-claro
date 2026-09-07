import { api } from '../server-config';
import { mapTeam } from './map-team';
import type { CreateTeamInput, TeamResponse } from './interface-teams';

import { teamToneToHex } from '@/constants/team-colors';

export const postTeams = async (input: CreateTeamInput) => {
  const { data } = await api.post<TeamResponse>('/teams', {
    name: input.name.trim(),
    colorHex: teamToneToHex(input.tone),
  });

  return mapTeam(data);
};

import { api } from '../server-config';
import { mapTeam } from './map-team';
import type { TeamResponse, UpdateTeamInput } from './interface-teams';

import { teamToneToHex } from '@/constants/team-colors';

export const patchTeam = async (input: UpdateTeamInput) => {
  const { data } = await api.patch<TeamResponse>(`/teams/${input.id}`, {
    name: input.name.trim(),
    colorHex: teamToneToHex(input.tone),
  });

  return mapTeam(data);
};

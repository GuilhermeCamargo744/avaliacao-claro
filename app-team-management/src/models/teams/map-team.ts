import { toIsoTimestamp } from '../normalize-timestamp';
import type { Team, TeamResponse } from './interface-teams';

import { teamToneFromHex } from '@/constants/team-colors';

export const mapTeam = (response: TeamResponse): Team => ({
  id: response.id,
  name: response.name,
  tone: teamToneFromHex(response.colorHex),
  description: response.description,
  createdAt: toIsoTimestamp(response.createdAt),
  updatedAt: toIsoTimestamp(response.updatedAt),
});

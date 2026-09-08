import type { TeamTone } from '@/constants/team-colors';

export interface TeamResponse {
  id: string;
  name: string;
  colorHex: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeamsPageResponse {
  data: TeamResponse[];
  meta: { total: number; limit: number; offset: number };
}

export interface Team {
  id: string;
  name: string;
  tone: TeamTone;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListTeamsFilters {
  search?: string;
}

export interface CreateTeamInput {
  name: string;
  tone: TeamTone;
}

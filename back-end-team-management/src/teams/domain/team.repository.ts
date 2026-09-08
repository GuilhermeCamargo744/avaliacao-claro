import { Page } from '../../common/page.js';
import { Team } from './team.js';

export interface NewTeam {
  name: string;
  colorHex: string;
  description?: string | null;
}

export type TeamChanges = Partial<NewTeam>;

export interface TeamFilters {
  search?: string;
  limit: number;
  offset: number;
}

export interface TeamRepository {
  create(team: NewTeam): Promise<Team>;
  findAll(filters: TeamFilters): Promise<Page<Team>>;
  findById(id: string): Promise<Team | null>;
  update(id: string, changes: TeamChanges): Promise<Team | null>;
  delete(id: string): Promise<Team | null>;
}

export const TEAM_REPOSITORY = 'TEAM_REPOSITORY';

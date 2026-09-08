import { z } from 'zod';

import { TEAM_TONES } from '@/constants/team-colors';

export const createTeamSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tone: z.enum(TEAM_TONES),
});

export type CreateTeamForm = z.infer<typeof createTeamSchema>;

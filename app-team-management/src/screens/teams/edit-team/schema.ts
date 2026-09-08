import { z } from 'zod';

import { TEAM_TONES } from '@/constants/team-colors';

export const editTeamSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tone: z.enum(TEAM_TONES),
});

export type EditTeamForm = z.infer<typeof editTeamSchema>;

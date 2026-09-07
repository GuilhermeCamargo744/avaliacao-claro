import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTeam } from '@/models/teams/get-team';
import { getTeams } from '@/models/teams/get-teams';
import { postTeams } from '@/models/teams/post-teams';

const TEAMS_KEY = ['teams'];

export const useTeamsQuery = () => useQuery({ queryKey: TEAMS_KEY, queryFn: getTeams });

export const useTeamQuery = (id: string) =>
  useQuery({ queryKey: [...TEAMS_KEY, id], queryFn: () => getTeam(id) });

export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTeams,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEAMS_KEY }),
  });
};

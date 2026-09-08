import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showSuccessToast } from '@/components/toast/show-toast';
import { getTeam } from '@/models/teams/get-team';
import { getTeams } from '@/models/teams/get-teams';
import { postTeams } from '@/models/teams/post-teams';

const TEAMS_KEY = ['teams'];

export const useTeamsQuery = (search?: string) =>
  useQuery({
    queryKey: [...TEAMS_KEY, { search }],
    queryFn: () => getTeams({ search }),
    placeholderData: (previous) => previous,
  });

export const useTeamQuery = (id: string) =>
  useQuery({ queryKey: [...TEAMS_KEY, id], queryFn: () => getTeam(id) });

export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTeams,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_KEY });
      showSuccessToast('Time criado com sucesso');
    },
  });
};

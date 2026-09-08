import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showSuccessToast } from '@/components/toast/show-toast';
import { deleteTeam } from '@/models/teams/delete-team';
import { getTeam } from '@/models/teams/get-team';
import { getTeams } from '@/models/teams/get-teams';
import { patchTeam } from '@/models/teams/patch-team';
import { postTeams } from '@/models/teams/post-teams';

const TEAMS_KEY = ['teams'];
const TASKS_KEY = ['tasks'];

export const useTeamsQuery = (search?: string) =>
  useQuery({
    queryKey: [...TEAMS_KEY, { search }],
    queryFn: () => getTeams({ search }),
    placeholderData: (previous) => previous,
  });

export const useTeamQuery = (id: string) =>
  useQuery({
    queryKey: [...TEAMS_KEY, id],
    queryFn: () => getTeam(id),
    enabled: Boolean(id),
  });

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

export const useUpdateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_KEY });
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      showSuccessToast('Time atualizado com sucesso');
    },
  });
};

export const useDeleteTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAMS_KEY });
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      showSuccessToast('Time excluído com sucesso');
    },
  });
};

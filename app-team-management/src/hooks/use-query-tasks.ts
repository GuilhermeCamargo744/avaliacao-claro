import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTasks } from '@/models/tasks/get-tasks';
import { postTasks } from '@/models/tasks/post-tasks';

const TASKS_KEY = ['tasks'];

export const useTasksQuery = (teamId: string) =>
  useQuery({
    queryKey: [...TASKS_KEY, { teamId }],
    queryFn: () => getTasks({ teamId }),
    enabled: Boolean(teamId),
  });

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTasks,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });
};

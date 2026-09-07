import { useQuery } from '@tanstack/react-query';

import { getTasks } from '@/models/tasks/get-tasks';

const TASKS_KEY = ['tasks'];

export const useTasksQuery = (teamId: string) =>
  useQuery({
    queryKey: [...TASKS_KEY, { teamId }],
    queryFn: () => getTasks({ teamId }),
    enabled: Boolean(teamId),
  });

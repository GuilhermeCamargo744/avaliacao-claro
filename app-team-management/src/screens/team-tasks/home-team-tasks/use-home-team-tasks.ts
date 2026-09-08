import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTasksQuery } from '@/hooks/use-query-tasks';

export const useHomeTeamTasks = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const teamId = typeof id === 'string' ? id : undefined;
  const { data, isPending, error } = useTasksQuery(teamId);

  return {
    tasks: data ?? [],
    subtitle: teamId ? 'tarefas deste time' : 'todas as tarefas, com ou sem time',
    isLoading: isPending,
    errorMessage: error?.message ?? null,
    onBack: () => router.back(),
    onCreateTask: () => router.push('/create-task'),
    onOpenTask: (taskId: string) => router.push(`/view-task/${taskId}`),
  };
};

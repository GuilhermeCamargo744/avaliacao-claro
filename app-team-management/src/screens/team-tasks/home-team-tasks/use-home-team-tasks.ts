import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTasksQuery } from '@/hooks/use-query-tasks';

export const useHomeTeamTasks = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, error } = useTasksQuery(id);

  return {
    tasks: data ?? [],
    isLoading: isPending,
    errorMessage: error?.message ?? null,
    onBack: () => router.back(),
  };
};

import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { TASK_STATUS_OPTIONS } from '@/constants/task-status';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useTasksInfiniteQuery } from '@/hooks/use-query-tasks';
import { useTeamsQuery } from '@/hooks/use-query-teams';
import type { TaskStatus } from '@/models/tasks/interface-tasks';

const ALL_STATUSES = 'all';

export const useHomeTeamTasks = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const routeTeamId = typeof id === 'string' ? id : undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [teamFilter, setTeamFilter] = useState('');

  const search = useDebouncedValue(searchTerm.trim());
  const teamId = routeTeamId ?? (teamFilter || undefined);
  const { data: teams } = useTeamsQuery();
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useTasksInfiniteQuery({
      teamId,
      status,
      search: search || undefined,
    });

  const tasks = data?.pages.flatMap((page) => page.tasks) ?? [];

  return {
    tasks,
    subtitle: routeTeamId ? 'tarefas deste time' : 'todas as tarefas, com ou sem time',
    searchTerm,
    statusOptions: [{ value: ALL_STATUSES, label: 'todas' }, ...TASK_STATUS_OPTIONS],
    status: status ?? ALL_STATUSES,
    canFilterTeam: !routeTeamId,
    teamFilter,
    teamOptions: [
      { value: '', label: 'Todos os times' },
      ...(teams ?? []).map((team) => ({ value: team.id, label: team.name })),
    ],
    emptyMessage:
      search || status || teamFilter ? 'Nenhuma tarefa encontrada.' : 'Nenhuma tarefa ainda.',
    isLoadingMore: isFetchingNextPage,
    isLoading: isPending,
    errorMessage: error?.message ?? null,
    onSearchTermChange: setSearchTerm,
    onChangeStatus: (value: string) => {
      setStatus(value === ALL_STATUSES ? undefined : (value as TaskStatus));
    },
    onChangeTeamFilter: setTeamFilter,
    onLoadMore: () => {
      if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
    },
    onBack: () => router.back(),
    onCreateTask: () => router.push('/create-task'),
    onOpenTask: (taskId: string) => router.push(`/view-task/${taskId}`),
  };
};

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showSuccessToast } from '@/components/toast/show-toast';
import { deleteTask } from '@/models/tasks/delete-task';
import { getTask } from '@/models/tasks/get-task';
import { getTasks } from '@/models/tasks/get-tasks';
import type { ListTasksFilters } from '@/models/tasks/interface-tasks';
import { patchTask } from '@/models/tasks/patch-task';
import { postTasks } from '@/models/tasks/post-tasks';

const TASKS_KEY = ['tasks'];
const TASKS_PAGE_SIZE = 10;

export const useTasksInfiniteQuery = (filters: Omit<ListTasksFilters, 'limit' | 'offset'> = {}) =>
  useInfiniteQuery({
    queryKey: [
      ...TASKS_KEY,
      {
        teamId: filters.teamId ?? null,
        status: filters.status ?? null,
        search: filters.search ?? null,
      },
    ],
    queryFn: ({ pageParam }) =>
      getTasks({ ...filters, limit: TASKS_PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.tasks.length === 0) return undefined;

      const nextOffset = lastPage.meta.offset + lastPage.tasks.length;

      return nextOffset < lastPage.meta.total ? nextOffset : undefined;
    },
  });

export const useTaskQuery = (id: string) =>
  useQuery({
    queryKey: [...TASKS_KEY, id],
    queryFn: () => getTask(id),
    enabled: Boolean(id),
  });

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      showSuccessToast('Tarefa criada com sucesso');
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      showSuccessToast('Tarefa atualizada com sucesso');
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      showSuccessToast('Tarefa excluída com sucesso');
    },
  });
};

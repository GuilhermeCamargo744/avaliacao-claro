import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showSuccessToast } from '@/components/toast/show-toast';
import { deleteTask } from '@/models/tasks/delete-task';
import { getTask } from '@/models/tasks/get-task';
import { getTasks } from '@/models/tasks/get-tasks';
import { patchTask } from '@/models/tasks/patch-task';
import { postTasks } from '@/models/tasks/post-tasks';

const TASKS_KEY = ['tasks'];

export const useTasksQuery = (teamId: string) =>
  useQuery({
    queryKey: [...TASKS_KEY, { teamId }],
    queryFn: () => getTasks({ teamId }),
    enabled: Boolean(teamId),
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

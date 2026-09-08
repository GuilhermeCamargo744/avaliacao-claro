import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';

import { TASK_STATUS_OPTIONS } from '@/constants/task-status';
import {
  useDeleteTaskMutation,
  useTaskQuery,
  useUpdateTaskMutation,
} from '@/hooks/use-query-tasks';
import type { TaskStatus } from '@/models/tasks/interface-tasks';

export const useViewTeamTasks = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isPending, error } = useTaskQuery(id);
  const updateTask = useUpdateTaskMutation();
  const deleteTask = useDeleteTaskMutation();

  const removeTask = () => deleteTask.mutate(id, { onSuccess: () => router.back() });

  const onDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Excluir tarefa? Essa ação não pode ser desfeita.')) removeTask();
      return;
    }

    Alert.alert('Excluir tarefa', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: removeTask },
    ]);
  };

  return {
    title: task?.title ?? '',
    description: task?.description ?? null,
    teams: task?.teams ?? [],
    status: task?.status ?? 'pending',
    statusOptions: TASK_STATUS_OPTIONS,
    isLoading: isPending,
    isUpdatingStatus: updateTask.isPending,
    isDeleting: deleteTask.isPending,
    errorMessage: error?.message ?? null,
    onChangeStatus: (status: TaskStatus) => updateTask.mutate({ id, status }),
    onEdit: () => router.push(`/edit-task/${id}`),
    onDelete,
    onBack: () => router.back(),
  };
};

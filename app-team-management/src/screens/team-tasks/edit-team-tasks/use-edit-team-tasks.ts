import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert, Platform } from 'react-native';

import { editTaskSchema, type EditTaskForm } from './schema';

import { TASK_STATUS_OPTIONS } from '@/constants/task-status';
import { useDeleteTaskMutation, useTaskQuery, useUpdateTaskMutation } from '@/hooks/use-query-tasks';
import { useTeamsQuery } from '@/hooks/use-query-teams';

export const useEditTeamTasks = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: task, isPending, error } = useTaskQuery(id);
  const { data: teams } = useTeamsQuery();
  const updateTask = useUpdateTaskMutation();
  const deleteTask = useDeleteTaskMutation();

  const { control, handleSubmit, formState } = useForm<EditTaskForm>({
    resolver: zodResolver(editTaskSchema),
    mode: 'onTouched',
    defaultValues: { title: '', description: '', teamId: '', status: 'pending' },
    values: task && {
      title: task.title,
      description: task.description ?? '',
      teamId: task.teams[0]?.id ?? '',
      status: task.status,
    },
  });

  const onSubmit = handleSubmit((values) => {
    updateTask.mutate({ id, ...values }, { onSuccess: () => router.back() });
  });

  const removeTask = () => deleteTask.mutate(id, { onSuccess: () => router.back() });

  const onDelete = () => {
    // O Alert do react-native-web é um no-op, então a web precisa do confirm nativo.
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
    control,
    errors: formState.errors,
    teamOptions: (teams ?? []).map((team) => ({ value: team.id, label: team.name })),
    statusOptions: TASK_STATUS_OPTIONS,
    isLoading: isPending,
    isSubmitting: updateTask.isPending,
    isDeleting: deleteTask.isPending,
    errorMessage: error?.message ?? null,
    onSubmit,
    onDelete,
    onBack: () => router.back(),
  };
};

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { createTaskSchema, type CreateTaskForm } from './schema';

import { useTeamsQuery } from '@/hooks/use-query-teams';
import { useCreateTaskMutation } from '@/hooks/use-query-tasks';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'pendente' },
  { value: 'in_progress', label: 'em progresso' },
  { value: 'done', label: 'concluída' },
];

export const useCreateTeamTasks = () => {
  const router = useRouter();
  const createTask = useCreateTaskMutation();
  const { data: teams } = useTeamsQuery();

  const { control, handleSubmit, formState } = useForm<CreateTaskForm>({
    resolver: zodResolver(createTaskSchema),
    mode: 'onTouched',
    defaultValues: { title: '', description: '', teamId: '' },
  });

  const onSubmit = handleSubmit((values) => {
    createTask.mutate(values, { onSuccess: () => router.back() });
  });

  return {
    control,
    errors: formState.errors,
    teamOptions: (teams ?? []).map((team) => ({ value: team.id, label: team.name })),
    statusOptions: STATUS_OPTIONS,
    isSubmitting: createTask.isPending,
    errorMessage: createTask.error?.message ?? null,
    onSubmit,
    onBack: () => router.back(),
  };
};

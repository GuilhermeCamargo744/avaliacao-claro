import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { createTaskSchema, type CreateTaskForm } from './schema';

import { TASK_STATUS_OPTIONS } from '@/constants/task-status';
import { useCreateTaskMutation } from '@/hooks/use-query-tasks';
import { useTeamsQuery } from '@/hooks/use-query-teams';

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
    statusOptions: TASK_STATUS_OPTIONS,
    isSubmitting: createTask.isPending,
    onSubmit,
    onBack: () => router.back(),
  };
};

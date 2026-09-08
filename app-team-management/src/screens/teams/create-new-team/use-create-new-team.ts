import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createTeamSchema, type CreateTeamForm } from './schema';

import type { TeamTone } from '@/constants/team-colors';
import { useCreateTeamMutation } from '@/hooks/use-query-teams';

export const useCreateNewTeam = () => {
  const router = useRouter();
  const createTeam = useCreateTeamMutation();
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);

  const { control, handleSubmit, setValue, watch, formState } = useForm<CreateTeamForm>({
    resolver: zodResolver(createTeamSchema),
    mode: 'onTouched',
    defaultValues: { name: '', tone: 'yellow' },
  });

  const onSubmit = handleSubmit((values) => {
    createTeam.mutate({ name: values.name, tone: values.tone }, { onSuccess: () => router.back() });
  });

  return {
    control,
    errors: formState.errors,
    tone: watch('tone'),
    isColorPickerOpen,
    isSubmitting: createTeam.isPending,
    onSubmit,
    onOpenColorPicker: () => setColorPickerOpen(true),
    onCloseColorPicker: () => setColorPickerOpen(false),
    onSelectTone: (tone: TeamTone) => {
      setValue('tone', tone, { shouldDirty: true, shouldValidate: true });
      setColorPickerOpen(false);
    },
    onBack: () => router.back(),
  };
};

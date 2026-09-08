import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Platform } from 'react-native';

import { editTeamSchema, type EditTeamForm } from './schema';

import type { TeamTone } from '@/constants/team-colors';
import {
  useDeleteTeamMutation,
  useTeamQuery,
  useUpdateTeamMutation,
} from '@/hooks/use-query-teams';

export const useEditTeam = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: team, isPending, error } = useTeamQuery(id);
  const updateTeam = useUpdateTeamMutation();
  const deleteTeam = useDeleteTeamMutation();
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);

  const { control, handleSubmit, setValue, watch, formState } = useForm<EditTeamForm>({
    resolver: zodResolver(editTeamSchema),
    mode: 'onTouched',
    defaultValues: { name: '', tone: 'yellow' },
    values: team && { name: team.name, tone: team.tone },
  });

  const onSubmit = handleSubmit((values) => {
    updateTeam.mutate({ id, name: values.name, tone: values.tone }, { onSuccess: () => router.back() });
  });

  const removeTeam = () =>
    deleteTeam.mutate(id, {
      onSuccess: () => router.dismissTo('/'),
    });

  const onDelete = () => {
    const message =
      'As tarefas continuam existindo e só deixam de pertencer a este time. Essa ação não pode ser desfeita.';

    if (Platform.OS === 'web') {
      if (window.confirm(`Excluir time?\n\n${message}`)) removeTeam();
      return;
    }

    Alert.alert('Excluir time', message, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: removeTeam },
    ]);
  };

  return {
    control,
    errors: formState.errors,
    tone: watch('tone'),
    isColorPickerOpen,
    isLoading: isPending,
    isSubmitting: updateTeam.isPending,
    isDeleting: deleteTeam.isPending,
    errorMessage: error?.message ?? null,
    onSubmit,
    onDelete,
    onOpenColorPicker: () => setColorPickerOpen(true),
    onCloseColorPicker: () => setColorPickerOpen(false),
    onSelectTone: (tone: TeamTone) => {
      setValue('tone', tone, { shouldDirty: true, shouldValidate: true });
      setColorPickerOpen(false);
    },
    onBack: () => router.back(),
  };
};

import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useCreateTeamMutation } from '@/hooks/use-query-teams';
import type { TeamTone } from '@/constants/team-colors';

const MIN_NAME_LENGTH = 3;

export const useCreateNewTeam = () => {
  const router = useRouter();
  const createTeam = useCreateTeamMutation();

  const [name, setName] = useState('');
  const [tone, setTone] = useState<TeamTone>('yellow');
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length >= MIN_NAME_LENGTH && !createTeam.isPending;

  const onChangeName = (value: string) => {
    setName(value);
    if (createTeam.isError) createTeam.reset();
  };

  const onSubmit = () => {
    if (!canSubmit) return;

    createTeam.mutate({ name: trimmedName, tone }, { onSuccess: () => router.back() });
  };

  return {
    name,
    tone,
    isColorPickerOpen,
    isSubmitting: createTeam.isPending,
    canSubmit,
    errorMessage: createTeam.error?.message ?? null,
    onChangeName,
    onSubmit,
    onOpenColorPicker: () => setColorPickerOpen(true),
    onCloseColorPicker: () => setColorPickerOpen(false),
    onSelectTone: (next: TeamTone) => {
      setTone(next);
      setColorPickerOpen(false);
    },
    onBack: () => router.back(),
  };
};

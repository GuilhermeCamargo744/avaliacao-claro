import { useRouter } from 'expo-router';
import { useState } from 'react';

import type { TeamTone } from '@/constants/team-colors';

export const useCreateNewTeam = () => {
  const router = useRouter();

  const [tone, setTone] = useState<TeamTone>('yellow');
  const [isColorPickerOpen, setColorPickerOpen] = useState(false);

  const onSelectTone = (next: TeamTone) => {
    setTone(next);
    setColorPickerOpen(false);
  };

  return {
    tone,
    isColorPickerOpen,
    onOpenColorPicker: () => setColorPickerOpen(true),
    onCloseColorPicker: () => setColorPickerOpen(false),
    onSelectTone,
    onBack: () => router.back(),
  };
};

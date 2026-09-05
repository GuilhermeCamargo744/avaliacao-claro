import { useRouter } from 'expo-router';

export const useCreateNewTeam = () => {
  const router = useRouter();

  return {
    tone: 'yellow' as const,
    onBack: () => router.back(),
  };
};

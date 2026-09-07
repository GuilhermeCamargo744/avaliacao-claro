import { MutationCache, QueryClient } from '@tanstack/react-query';

import { showErrorToast } from '@/components/toast/show-toast';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => showErrorToast(error.message),
  }),
  defaultOptions: {
    queries: { networkMode: 'always', staleTime: 30000, refetchOnWindowFocus: false, retry: 1 },
    mutations: { networkMode: 'always', retry: 0 },
  },
});

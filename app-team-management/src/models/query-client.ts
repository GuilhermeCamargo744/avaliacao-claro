import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { networkMode: 'always', staleTime: 30000, refetchOnWindowFocus: false, retry: 1 },
    mutations: { networkMode: 'always', retry: 0 },
  },
});

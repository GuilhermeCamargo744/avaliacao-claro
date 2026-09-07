import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox, useColorScheme } from 'react-native';
import { Provider as StoreProvider } from 'react-redux';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { queryClient } from '@/models/query-client';
import { store } from '@/store/store';

LogBox.ignoreLogs([/Can't perform a React state update on a component that hasn't mounted yet/]);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}

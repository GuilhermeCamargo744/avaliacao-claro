import { configureStore } from '@reduxjs/toolkit';

import { teamsSlice } from './slices/teams-slice/teams-slice';

export const store = configureStore({
  reducer: {
    [teamsSlice.reducerPath]: teamsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TeamsState } from './interface-teams-slice';

const initialState: TeamsState = {
  searchTerm: '',
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    searchTermChanged: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  selectors: {
    selectSearchTerm: (state) => state.searchTerm,
  },
});

export const { searchTermChanged } = teamsSlice.actions;
export const { selectSearchTerm } = teamsSlice.selectors;

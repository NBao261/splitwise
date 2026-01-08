import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Group } from '@/types/group.types';

interface GroupsState {
  list: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  list: [],
  currentGroup: null,
  isLoading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.list = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.list.unshift(action.payload);
    },
    setCurrentGroup: (state, action: PayloadAction<Group>) => {
      state.currentGroup = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setGroups, addGroup, setCurrentGroup, setLoading, setError } =
  groupsSlice.actions;
export default groupsSlice.reducer;

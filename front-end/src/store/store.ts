import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import groupsReducer from './groups/groups.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

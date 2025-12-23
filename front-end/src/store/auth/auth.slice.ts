import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/auth.types';
import {
  getToken,
  getUser,
  setToken,
  setUser,
  clearAuth,
} from '@/utils/storage.util';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      setToken(token);
      setUser(user);
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      clearAuth();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setUser(state.user);
      }
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser } =
  authSlice.actions;
export default authSlice.reducer;

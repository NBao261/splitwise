import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/auth.service';
import { setCredentials, setLoading, logout } from './auth.slice';
import type {
  LoginInput,
  RegisterInput,
} from '@/features/auth/schemas/auth.schema';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(
        credentials.email,
        credentials.password
      );
      dispatch(setCredentials({ user: response.user, token: response.token }));
      return response;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Đăng nhập thất bại';
      return rejectWithValue(message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data: RegisterInput, { rejectWithValue }) => {
    try {
      await authService.register(data.email, data.password, data.username);
      return true;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Đăng ký thất bại';
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logout());
    }
  }
);

import { fetchApi } from './api.service';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { LoginResponse, RegisterResponse } from '@/types/auth.types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetchApi<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return response;
  },

  async register(
    email: string,
    password: string,
    username: string
  ): Promise<RegisterResponse> {
    return fetchApi<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },

  async logout(): Promise<void> {
    await fetchApi(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });
  },
};

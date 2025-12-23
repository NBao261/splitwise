import { API_BASE_URL } from '@/constants/api.constants';
import type { ApiResponse } from '@/types/api.types';
import { ApiError } from '@/types/api.types';
import { STORAGE_KEYS } from '@/constants/storage.constants';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || 'Đã xảy ra lỗi', response.status, data);
  }

  return data.data as T;
}

export { fetchApi, ApiError };

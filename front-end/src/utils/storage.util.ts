import { STORAGE_KEYS } from '@/constants/storage.constants';
import type { User } from '@/types/auth.types';

export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
}

export function setToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

export function setUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function removeToken(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function removeUser(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
}

export function clearAuth(): void {
  removeToken();
  removeUser();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

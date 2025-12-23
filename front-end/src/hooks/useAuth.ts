import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutThunk } from '@/store/auth/auth.thunks';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    state => state.auth
  );

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { User, LoginRequest, RegisterRequest, ApiError } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();
  const authCheckInterval = useRef<NodeJS.Timeout>();

  const checkAuth = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = await authService.validateToken();
      setUser(userData);
    } catch (err) {
      setUser(null);
      await authService.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Set up periodic token validation
    authCheckInterval.current = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      if (authCheckInterval.current) {
        clearInterval(authCheckInterval.current);
      }
    };
  }, [checkAuth]);

  const handleAuthError = useCallback((err: unknown) => {
    const apiError = err instanceof Error ? err as ApiError : new Error('An unexpected error occurred') as ApiError;
    setError(apiError);
    throw apiError;
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.login(credentials);
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setError(null);
      setLoading(true);
      const { user } = await authService.register(data);
      setUser(user);
      router.push('/dashboard');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.requestPasswordReset(email);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      router.push('/login');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      setLoading(true);
      await authService.changePassword(currentPassword, newPassword);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    changePassword,
    isAuthenticated: !!user,
  };
} 
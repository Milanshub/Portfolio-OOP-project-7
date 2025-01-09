import { useReducer, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './AuthReducer';
import { authService } from '@/services';
import { ApiError, LoginRequest, User } from '@/types';
import { logger } from '@/config/logger';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    status: 'idle'
  });

  useEffect(() => {
    validateToken();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);
      const user: User = {
        ...response.user,
        isAdmin: response.user.role === 'admin'
      };
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      logger.info('User logged in successfully');
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'AUTH_FAILURE', payload: apiError });
      logger.error('Login failed:', apiError);
      throw apiError;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      logger.info('User logged out successfully');
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      logger.error('Logout failed:', apiError);
      throw apiError;
    }
  };

  const validateToken = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      const userData = await authService.validateToken();
      const user: User = {
        ...userData,
        isAdmin: userData.role === 'admin'
      };
      dispatch({ type: 'VALIDATE_TOKEN_SUCCESS', payload: user });
      logger.debug('Token validated successfully');
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'AUTH_FAILURE', payload: apiError });
      logger.error('Token validation failed:', apiError);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.requestPasswordReset(email);
      dispatch({ type: 'SET_LOADING', payload: false });
      logger.info('Password reset requested successfully');
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      logger.error('Password reset request failed:', apiError);
      throw apiError;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.resetPassword(token, newPassword);
      dispatch({ type: 'SET_LOADING', payload: false });
      logger.info('Password reset successfully');
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      logger.error('Password reset failed:', apiError);
      throw apiError;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.changePassword(currentPassword, newPassword);
      dispatch({ type: 'SET_LOADING', payload: false });
      logger.info('Password changed successfully');
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ type: 'SET_ERROR', payload: apiError });
      logger.error('Password change failed:', apiError);
      throw apiError;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        validateToken,
        requestPasswordReset,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
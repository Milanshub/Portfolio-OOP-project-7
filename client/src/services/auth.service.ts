import { api } from '@/lib/api/client';
import { AuthResponse, LoginRequest, User } from '@/types';
import { endpoints } from '@/lib/api/endpoints';
import { logger } from '@/config/logger';

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(endpoints.AUTH.LOGIN, credentials);
      logger.info('User logged in successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to login:', error as Error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(endpoints.AUTH.LOGOUT);
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Failed to logout:', error as Error);
      throw error;
    }
  }

  async validateToken(): Promise<User> {
    try {
      const response = await api.get<User>(endpoints.AUTH.VALIDATE);
      logger.debug('Token validated successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to validate token:', error as Error);
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post(endpoints.AUTH.REQUEST_RESET, { email });
      logger.info('Password reset requested successfully');
    } catch (error) {
      logger.error('Failed to request password reset:', error as Error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post(endpoints.AUTH.RESET_PASSWORD, { token, newPassword });
      logger.info('Password reset successfully');
    } catch (error) {
      logger.error('Failed to reset password:', error as Error);
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post(endpoints.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
      logger.info('Password changed successfully');
    } catch (error) {
      logger.error('Failed to change password:', error as Error);
      throw error;
    }
  }
}

export const authService = AuthService.getInstance();
import { api } from '@/lib/api/client';
import { SecureStorage } from '@/lib/core/secureStorage';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

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
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    this.setTokens(response);
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    this.setTokens(response);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async validateToken(): Promise<User> {
    const response = await api.get<User>('/auth/validate');
    return response;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/reset-password/request', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  }

  isAuthenticated(): boolean {
    const token = SecureStorage.getItem<string>('token');
    return !!token;
  }

  private setTokens(response: AuthResponse): void {
    SecureStorage.setItem('token', response.token);
    SecureStorage.setItem('refreshToken', response.refreshToken);
    SecureStorage.setItem('expiresAt', response.expiresAt);
  }

  private clearTokens(): void {
    SecureStorage.removeItem('token');
    SecureStorage.removeItem('refreshToken');
    SecureStorage.removeItem('expiresAt');
  }
}

export const authService = AuthService.getInstance(); 
import { api, handleApiError } from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterRequest, User, TokenData, ApiError } from '@/types';
import { SecureStorage } from '@/lib/secureStorage';
import { RateLimiter } from '@/lib/rateLimiter';
import { SessionManager } from '@/lib/sessionManager';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

class AuthService {
  private tokenRefreshPromise: Promise<void> | null = null;
  private sessionManager: SessionManager;

  constructor() {
    this.sessionManager = SessionManager.getInstance();
    this.setupSessionListeners();
  }

  private setupSessionListeners(): void {
    this.sessionManager.addEventListener((event) => {
      switch (event.type) {
        case 'logout':
          this.clearTokens();
          break;
        case 'token_refresh':
          this.ensureValidToken();
          break;
        case 'session_expired':
          this.handleSessionExpired();
          break;
      }
    });
  }

  private handleSessionExpired(): void {
    this.clearTokens();
    window.location.href = '/login?session=expired';
  }

  setTokens(response: AuthResponse): void {
    try {
      SecureStorage.setItem(TOKEN_KEY, response.token);
      SecureStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      SecureStorage.setItem(TOKEN_EXPIRY_KEY, response.expiresAt);
      this.sessionManager.emit('token_refresh');
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Failed to securely store authentication data');
    }
  }

  clearTokens(): void {
    SecureStorage.removeItem(TOKEN_KEY);
    SecureStorage.removeItem(REFRESH_TOKEN_KEY);
    SecureStorage.removeItem(TOKEN_EXPIRY_KEY);
    this.sessionManager.emit('logout');
  }

  getTokenData(): TokenData | null {
    try {
      const token = SecureStorage.getItem<string>(TOKEN_KEY);
      const refreshToken = SecureStorage.getItem<string>(REFRESH_TOKEN_KEY);
      const expiresAt = SecureStorage.getItem<number>(TOKEN_EXPIRY_KEY);

      if (!token || !refreshToken || !expiresAt) {
        return null;
      }

      return { token, refreshToken, expiresAt };
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData) return true;
    return Date.now() + TOKEN_EXPIRY_BUFFER >= tokenData.expiresAt;
  }

  async ensureValidToken(): Promise<void> {
    if (!this.isTokenExpired()) return;

    if (this.tokenRefreshPromise) {
      await this.tokenRefreshPromise;
      return;
    }

    const tokenData = this.getTokenData();
    if (!tokenData?.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.tokenRefreshPromise = (async () => {
      try {
        const response = await this.refreshToken();
        this.setTokens(response);
      } finally {
        this.tokenRefreshPromise = null;
      }
    })();

    await this.tokenRefreshPromise;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const rateLimit = RateLimiter.checkRateLimit(`login_${credentials.email}`);
    if (!rateLimit.allowed) {
      throw new Error(`Too many login attempts. Please try again in ${Math.ceil(rateLimit.waitTime / 1000)} seconds.`);
    }

    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      this.setTokens(response);
      RateLimiter.resetRateLimit(`login_${credentials.email}`);
      this.sessionManager.emit('login');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const tokenData = this.getTokenData();
      if (tokenData) {
        await api.post('/auth/logout', { refreshToken: tokenData.refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  async validateToken(): Promise<User> {
    try {
      await this.ensureValidToken();
      const response = await api.get<User>('/auth/validate');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const tokenData = this.getTokenData();
      if (!tokenData?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken: tokenData.refreshToken,
      });
      return response;
    } catch (error) {
      this.clearTokens();
      throw this.handleError(error);
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const rateLimit = RateLimiter.checkRateLimit(`register_${data.email}`);
    if (!rateLimit.allowed) {
      throw new Error(`Too many registration attempts. Please try again in ${Math.ceil(rateLimit.waitTime / 1000)} seconds.`);
    }

    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      this.setTokens(response);
      RateLimiter.resetRateLimit(`register_${data.email}`);
      this.sessionManager.emit('login');
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const rateLimit = RateLimiter.checkRateLimit(`reset_${email}`);
    if (!rateLimit.allowed) {
      throw new Error(`Too many reset attempts. Please try again in ${Math.ceil(rateLimit.waitTime / 1000)} seconds.`);
    }

    try {
      await api.post('/auth/reset-password-request', { email });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const rateLimit = RateLimiter.checkRateLimit(`reset_confirm_${token}`);
    if (!rateLimit.allowed) {
      throw new Error(`Too many reset confirmation attempts. Please try again in ${Math.ceil(rateLimit.waitTime / 1000)} seconds.`);
    }

    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const rateLimit = RateLimiter.checkRateLimit(`change_password_${this.getTokenData()?.token}`);
    if (!rateLimit.allowed) {
      throw new Error(`Too many password change attempts. Please try again in ${Math.ceil(rateLimit.waitTime / 1000)} seconds.`);
    }

    try {
      await this.ensureValidToken();
      await api.post('/auth/change-password', { currentPassword, newPassword });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error: unknown): ApiError {
    if (error instanceof Error) {
      const apiError = new Error(error.message) as ApiError;
      if ('code' in error) apiError.code = (error as any).code;
      if ('statusCode' in error) apiError.statusCode = (error as any).statusCode;
      if ('validationErrors' in error) apiError.validationErrors = (error as any).validationErrors;
      return apiError;
    }
    return new Error('An unexpected error occurred') as ApiError;
  }

  isAuthenticated(): boolean {
    const tokenData = this.getTokenData();
    return !!tokenData && !this.isTokenExpired();
  }
}

export const authService = new AuthService(); 
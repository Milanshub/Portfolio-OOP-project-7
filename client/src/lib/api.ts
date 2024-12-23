import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RefreshTokenResponse {
  token: string;
}

// Extend InternalAxiosRequestConfig to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiClient {
  private static instance: ApiClient;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private api;

  private constructor() {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Required for cookies
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // Response interceptor
    this.api.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }

  private handleRequest = (config: ExtendedAxiosRequestConfig): ExtendedAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  private handleRequestError = (error: AxiosError): Promise<AxiosError> => {
    console.error('Request error:', error);
    return Promise.reject(error);
  };

  private handleResponse = (response: AxiosResponse): any => {
    return response.data;
  };

  private handleResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        try {
          const token = await new Promise<string>((resolve) => {
            this.refreshSubscribers.push((token: string) => {
              resolve(token);
            });
          });
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return this.api(originalRequest).then(res => res.data);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        const { data } = await this.api.post<RefreshTokenResponse>('/auth/refresh');
        const { token } = data;
        localStorage.setItem('token', token);
        
        this.refreshSubscribers.forEach((callback) => callback(token));
        this.refreshSubscribers = [];
        
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return this.api(originalRequest).then(res => res.data);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        this.handleAuthError();
        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    // Handle other errors
    this.handleError(error);
    return Promise.reject(error);
  };

  private async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const { data } = await this.api.post<RefreshTokenResponse>('/auth/refresh');
      return data;
    } catch (error) {
      throw error;
    }
  }

  private handleAuthError(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  private handleError(error: AxiosError): void {
    const message = this.extractErrorMessage(error);
    toast.error('Error', { description: message });
  }

  private extractErrorMessage(error: AxiosError): string {
    if (error.response?.data) {
      const data = error.response.data as any;
      return data.message || data.error || 'An unexpected error occurred';
    }
    return error.message || 'Network error occurred';
  }

  // Public methods
  public async get<T>(url: string, config = {}): Promise<T> {
    const { data } = await this.api.get<T>(url, config);
    return data;
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  public getAxiosInstance() {
    return this.api;
  }
}

export const api = ApiClient.getInstance();
export const handleApiError = (error: any): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }
  return error?.message || 'An unexpected error occurred';
}; 
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { AppError, AuthError, ValidationError, NetworkError } from '@/lib/utils/error';
import { apiConfig } from '@/config';

// ===== API TYPES =====  
// This file contains the types for the API
// It includes the ApiResponse, ApiError, and RefreshTokenResponse types
// These types are used to define the structure of the API responses and errors

// Define the structure of the API response
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Define the structure of the API error
interface ApiError {
  message: string;
  code?: string;
  validationErrors?: Record<string, string[]>;
  details?: unknown;
}

// Define the structure of the refresh token response
interface RefreshTokenResponse {
  token: string;
}

// Extend InternalAxiosRequestConfig to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Custom error class
class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// Define the API client class
class ApiClient {
  private static instance: ApiClient;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private api: AxiosInstance;

  private constructor() {
    // Create axios instance with merged config
    this.api = axios.create({
      baseURL: apiConfig.baseUrl,
      ...apiConfig.options, // Spread options first
      headers: {
        ...apiConfig.headers, // Spread headers from config
        'Content-Type': 'application/json', // Override if needed
      },
      withCredentials: true, // Override if needed
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
      (config) => {
        // Add auth header if needed
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.api(originalRequest));
              });
            });
          }

          this.isRefreshing = true;
          originalRequest._retry = true;

          try {
            const response = await this.api.post<RefreshTokenResponse>('/auth/refresh');
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
            
            this.refreshSubscribers.forEach((callback) => callback(token));
            this.refreshSubscribers = [];
            
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Handle refresh token failure
            localStorage.removeItem('token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleResponseError(error: AxiosError<ApiError>): never {
    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;

    // If no response, it's a network error
    if (!error.response) {
      throw new NetworkError('Network error: Unable to reach the server');
    }

    // Handle different status codes
    switch (status) {
      case 401:
        throw new AuthError(errorMessage);
      case 400:
        throw new ValidationError(errorMessage);
      case undefined:
        throw new NetworkError('Network error: No status code received');
      default:
        if (status >= 500) {
          throw new NetworkError('Server error');
        }
        throw new AppError(errorMessage);
    }
  }

  // Public methods with proper type handling
  public async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw this.handleResponseError(error as AxiosError<ApiError>);
    }
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleResponseError(error as AxiosError<ApiError>);
    }
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.api.put<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw this.handleResponseError(error as AxiosError<ApiError>);
    }
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.api.delete<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw this.handleResponseError(error as AxiosError<ApiError>);
    }
  }

  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Export singleton instance and types
export const api = ApiClient.getInstance();
export const axiosInstance = api.getAxiosInstance();
export { ApiRequestError };
export type { ApiResponse, ApiError, ExtendedAxiosRequestConfig };
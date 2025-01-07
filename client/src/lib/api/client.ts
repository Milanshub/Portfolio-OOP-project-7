import axios, { AxiosError, AxiosInstance } from 'axios';
import { config } from '@/config';
import { requestInterceptor, responseInterceptor } from './interceptors';
import { logger } from '@/config/logger';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
    baseURL: config.api.url,
    timeout: config.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Error handler type
export type ApiError = AxiosError<{
    message: string;
    errors?: Record<string, string[]>;
}>;

// Response wrapper type
export type ApiResponse<T> = {
    data: T;
    message?: string;
};

// Add interceptors
apiClient.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected
);

apiClient.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected
);

// API wrapper functions
export const api = {
    get: async <T>(url: string, config = {}) => {
        const response = await apiClient.get<ApiResponse<T>>(url, config);
        return response.data;
    },
    post: async <T>(url: string, data = {}, config = {}) => {
        const response = await apiClient.post<ApiResponse<T>>(url, data, config);
        return response.data;
    },
    put: async <T>(url: string, data = {}, config = {}) => {
        const response = await apiClient.put<ApiResponse<T>>(url, data, config);
        return response.data;
    },
    delete: async <T>(url: string, config = {}) => {
        const response = await apiClient.delete<ApiResponse<T>>(url, config);
        return response.data;
    }
};

export default api;
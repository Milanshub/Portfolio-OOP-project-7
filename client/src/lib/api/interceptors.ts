import { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { logger } from '@/config/logger';

// Request interceptor
export const requestInterceptor = {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (!(config.headers instanceof AxiosHeaders)) {
                config.headers = new AxiosHeaders(config.headers);
            }
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
    },
    onRejected: (error: AxiosError) => {
        logger.error('Request Error:', error);
        return Promise.reject(error);
    }
};

// Response interceptor
export const responseInterceptor = {
    onFulfilled: (response: AxiosResponse) => {
        logger.debug('API Response:', {
            status: response.status,
            data: response.data,
        });
        return response;
    },
    onRejected: async (error: AxiosError) => {
        logger.error('Response Error:', error, {
            status: error.response?.status,
            data: error.response?.data,
        });

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Clear tokens
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            
            // Redirect to login
            window.location.href = '/auth/login';
        }

        return Promise.reject(error);
    }
};
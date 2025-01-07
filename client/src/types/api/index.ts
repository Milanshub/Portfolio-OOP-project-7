export * from './requests';
export * from './responses';
export * from './errors';

// Common API types
export interface TokenData {
    token: string;
    refreshToken: string;
    expiresAt: number;
}

export interface RequestConfig {
    headers?: Record<string, string>;
    params?: Record<string, any>;
    signal?: AbortSignal;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiConfig {
    baseURL: string;
    timeout?: number;
    withCredentials?: boolean;
}
import { ApiError } from '../api/errors';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}

export interface Session {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: number;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: ApiError | null;
    status: AuthStatus;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
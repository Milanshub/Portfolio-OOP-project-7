// API Types
export * from './api/requests';
export * from './api/responses';
export * from './api/errors';

// Entity Types (matching server entities)
export * from './entities/project';
export * from './entities/profile';
export * from './entities/admin';
export * from './entities/technology';
export * from './entities/message';
export * from './entities/analytics';

// Feature Types
export * from './features/auth';
export * from './features/upload';
export * from './features/github';

// Common type utilities
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Utility types for API responses
export type AsyncData<T> = {
    data: Nullable<T>;
    error: Nullable<string>;
    isLoading: boolean;
};

// Import ApiError type before using it in the type guard
import { ApiError } from './api/errors';

// Type guards
export const isErrorResponse = (response: unknown): response is ApiError => {
    return response instanceof Error;
};
export interface ApiError extends Error {
    code?: string;
    statusCode?: number;
    validationErrors?: Record<string, string[]>;
}

export enum ErrorCode {
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ValidationError {
    field: string;
    message: string;
}

export type ApiErrorResponse = {
    error: string;
    message: string;
    statusCode: number;
    validationErrors?: ValidationError[];
};
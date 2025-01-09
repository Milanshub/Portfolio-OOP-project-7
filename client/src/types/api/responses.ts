// Generic API Response
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    validationErrors?: string[];
    message?: string;
    status?: number;
}

// Auth Responses
export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'user' | 'admin';
        createdAt: string;
        updatedAt: string;
    };
    token: string;
    refreshToken: string;
    expiresAt: number;
}

// Pagination Response Wrapper
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Upload Responses
export interface UploadResponse {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
}

export interface MultipleUploadResponse {
    urls: string[];
    files: Array<{
        filename: string;
        mimetype: string;
        size: number;
    }>;
}
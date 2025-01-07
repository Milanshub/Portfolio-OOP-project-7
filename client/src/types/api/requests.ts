// Auth Requests
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// Project Requests
export interface CreateProjectRequest {
    title: string;
    description: string;
    shortDescription: string;
    liveUrl: string;
    githubUrl?: string;
    featured: boolean;
    order: number;
    startDate: Date;
    endDate: Date;
    technologies: string[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

// Profile Requests
export interface UpdateProfileRequest {
    fullName?: string;
    title?: string;
    bio?: string;
    location?: string;
    email?: string;
}

// Message Requests
export interface SendMessageRequest {
    sender_name: string;
    sender_email: string;
    subject: string;
    message: string;
}

// Common Request Parameters
export interface PaginationParams {
    page: number;
    limit: number;
    offset?: number;
}

export interface SortParams {
    field: string;
    order: 'asc' | 'desc';
}

export interface FilterParams {
    [key: string]: string | number | boolean | string[];
}
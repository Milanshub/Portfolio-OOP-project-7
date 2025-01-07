export interface UploadFile {
    file: File;
    progress: number;
    error?: string;
    url?: string;
}

export interface UploadState {
    files: Record<string, UploadFile>;
    isUploading: boolean;
    error: string | null;
}

export interface UploadConfig {
    maxSize: number;
    allowedTypes: string[];
    maxFiles?: number;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}
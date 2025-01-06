// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  validationErrors?: string[];
}

export interface ApiError extends Error {
  code?: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
}

export interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
} 
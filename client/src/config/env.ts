import { z } from 'zod';

declare global {
  interface Window {
    env: {
      REACT_APP_API_URL: string;
      REACT_APP_API_TIMEOUT: string;
      REACT_APP_GITHUB_USERNAME: string;
      REACT_APP_GITHUB_CLIENT_ID?: string;
      REACT_APP_STORAGE_KEY: string;
      REACT_APP_LOG_LEVEL: string;
      REACT_APP_ADMIN_EMAIL: string;
      NODE_ENV: string;
    };
  }
}

const envSchema = z.object({
  // API Configuration
  REACT_APP_API_URL: z.string().url(),
  REACT_APP_API_TIMEOUT: z.number().default(10000),

  // GitHub Configuration
  REACT_APP_GITHUB_USERNAME: z.string(),
  REACT_APP_GITHUB_CLIENT_ID: z.string().optional(),

  // Storage Configuration
  REACT_APP_STORAGE_KEY: z.string().default('your-default-key'),

  // Logging Configuration
  REACT_APP_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Contact Information
  REACT_APP_ADMIN_EMAIL: z.string().email(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse({
  // API Configuration
  REACT_APP_API_URL: window.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  REACT_APP_API_TIMEOUT: Number(window.env.REACT_APP_API_TIMEOUT),

  // GitHub Configuration
  REACT_APP_GITHUB_USERNAME: window.env.REACT_APP_GITHUB_USERNAME,
  REACT_APP_GITHUB_CLIENT_ID: window.env.REACT_APP_GITHUB_CLIENT_ID,

  // Storage Configuration
  REACT_APP_STORAGE_KEY: window.env.REACT_APP_STORAGE_KEY,

  // Logging Configuration
  REACT_APP_LOG_LEVEL: window.env.REACT_APP_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error',

  // Contact Information
  REACT_APP_ADMIN_EMAIL: window.env.REACT_APP_ADMIN_EMAIL,

  // Environment
  NODE_ENV: window.env.NODE_ENV as 'development' | 'production' | 'test',
});

// Export type for usage in other files
export type Env = z.infer<typeof envSchema>;

// Utility function to check if we're in development mode
export const isDevelopment = env.NODE_ENV === 'development';

// Export validated environment variables
export const config = {
  api: {
    url: env.REACT_APP_API_URL,
    timeout: env.REACT_APP_API_TIMEOUT,
  },
  github: {
    username: env.REACT_APP_GITHUB_USERNAME,
    clientId: env.REACT_APP_GITHUB_CLIENT_ID,
  },
  storage: {
    key: env.REACT_APP_STORAGE_KEY,
  },
  logging: {
    level: env.REACT_APP_LOG_LEVEL,
  },
  contact: {
    adminEmail: env.REACT_APP_ADMIN_EMAIL,
  },
  environment: env.NODE_ENV,
} as const;
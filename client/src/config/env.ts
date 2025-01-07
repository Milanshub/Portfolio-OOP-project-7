import { z } from 'zod';

declare global {
  interface Window {
    env: {
      REACT_APP_API_URL: string;
      REACT_APP_API_TIMEOUT: string;
      REACT_APP_GITHUB_USERNAME: string;
      REACT_APP_GITHUB_CLIENT_ID?: string;
      REACT_APP_STORAGE_PREFIX: string;
      REACT_APP_LOG_LEVEL: string;
      REACT_APP_ADMIN_EMAIL: string;
      NODE_ENV: string;
    };
  }
}

const envSchema = z.object({
  // API Configuration
  API_URL: z.string().url(),
  API_TIMEOUT: z.number().default(10000),

  // GitHub Configuration
  GITHUB_USERNAME: z.string(),
  GITHUB_CLIENT_ID: z.string().optional(),

  // Storage Configuration
  STORAGE_PREFIX: z.string().default('portfolio_'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // Contact Information
  ADMIN_EMAIL: z.string().email(),
});

export const env = envSchema.parse({
  // API Configuration
  API_URL: window.env.REACT_APP_API_URL,
  API_TIMEOUT: Number(window.env.REACT_APP_API_TIMEOUT),

  // GitHub Configuration
  GITHUB_USERNAME: window.env.REACT_APP_GITHUB_USERNAME,
  GITHUB_CLIENT_ID: window.env.REACT_APP_GITHUB_CLIENT_ID,

  // Storage Configuration
  STORAGE_PREFIX: window.env.REACT_APP_STORAGE_PREFIX,

  // Logging Configuration
  LOG_LEVEL: window.env.REACT_APP_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error',

  // Contact Information
  ADMIN_EMAIL: window.env.REACT_APP_ADMIN_EMAIL,
});

// Export type for usage in other files
export type Env = z.infer<typeof envSchema>;

// Utility function to check if we're in development mode
export const isDevelopment = window.env.NODE_ENV === 'development';

// Export validated environment variables
export const config = {
  api: {
    url: env.API_URL,
    timeout: env.API_TIMEOUT,
  },
  github: {
    username: env.GITHUB_USERNAME,
    clientId: env.GITHUB_CLIENT_ID,
  },
  storage: {
    prefix: env.STORAGE_PREFIX,
  },
  logging: {
    level: env.LOG_LEVEL,
  },
  contact: {
    adminEmail: env.ADMIN_EMAIL,
  },
} as const;
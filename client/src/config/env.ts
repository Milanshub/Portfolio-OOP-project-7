import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_GITHUB_CLIENT_ID: z.string().optional(),
  VITE_STORAGE_PREFIX: z.string().default('portfolio_'),
  VITE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
  VITE_STORAGE_PREFIX: import.meta.env.VITE_STORAGE_PREFIX,
  VITE_LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL,
}); 
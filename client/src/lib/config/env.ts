import { z } from 'zod'

// ===== ENVIRONMENT VARIABLES =====
// This file defines the environment variables for our application
// It uses Zod to validate the environment variables against a schema
// This ensures that the environment variables are correctly set and prevents runtime errors

// Define the environment variables schema
const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // API
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000/api'),
  
  // Authentication
  NEXT_PUBLIC_GITHUB_AUTH_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_MFA_ENABLED: z.enum(['true', 'false']).default('false'),
  
  // Analytics
  NEXT_PUBLIC_ANALYTICS_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_ANALYTICS_PROVIDER: z.enum(['google', 'plausible', 'umami']).optional(),
  
  // Features
  NEXT_PUBLIC_GITHUB_SYNC_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_RECAPTCHA_ENABLED: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_NEW_PROJECT_UI: z.enum(['true', 'false']).default('false'),
  NEXT_PUBLIC_BETA_FEATURES: z.enum(['true', 'false']).default('false'),
  
  // Storage
  NEXT_PUBLIC_STORAGE_KEY: z.string().min(1),
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

// Parse the environment variables against the schema
export const env = envSchema.parse(process.env)

// Define the global process environment interface
// This allows us to access the environment variables in our code
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
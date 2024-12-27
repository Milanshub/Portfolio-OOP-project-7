import { env } from '@/lib/config/env'
import { APP_CONSTANTS } from '@/lib/config/constants'

// Types for feature flags
interface AuthFeatures {
  enabled: boolean
  providers: {
    github: boolean
    google: boolean
  }
  mfa: boolean
}

interface ProjectFeatures {
  githubSync: boolean
  imageOptimization: boolean
  maxImages: number
  allowedTypes: readonly string[]
  maxSize: number
}

interface SecurityFeatures {
  reCaptcha: boolean
  rateLimiting: boolean
  maxAttempts: number
  lockoutDuration: number
}

interface AnalyticsFeatures {
  enabled: boolean
  provider: 'custom' | 'google' | 'plausible'
}

interface PerformanceFeatures {
  imageOptimization: boolean
  lazyLoading: boolean
  prefetching: boolean
  monitoring: boolean
}

interface ExperimentalFeatures {
  newProjectUI: boolean
  betaFeatures: boolean
}

interface FeatureFlagsConfig {
  auth: AuthFeatures
  projects: ProjectFeatures
  security: SecurityFeatures
  analytics: AnalyticsFeatures
  performance: PerformanceFeatures
  experimental: ExperimentalFeatures
}

export const featureFlags: FeatureFlagsConfig = {
  auth: {
    enabled: true,
    providers: {
      github: env.NEXT_PUBLIC_GITHUB_AUTH_ENABLED === 'true',
      google: env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true',
    },
    mfa: env.NEXT_PUBLIC_MFA_ENABLED === 'true',
  },
  projects: {
    githubSync: env.NEXT_PUBLIC_GITHUB_SYNC_ENABLED === 'true',
    imageOptimization: true,
    maxImages: 10,
    allowedTypes: APP_CONSTANTS.IMAGE_FORMATS,
    maxSize: APP_CONSTANTS.MAX_FILE_SIZE,
  },
  security: {
    reCaptcha: env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true',
    rateLimiting: true,
    maxAttempts: APP_CONSTANTS.RATE_LIMIT.MAX_ATTEMPTS,
    lockoutDuration: APP_CONSTANTS.RATE_LIMIT.LOCKOUT_DURATION,
  },
  analytics: {
    enabled: env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    provider: (env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'custom') as 'custom' | 'google' | 'plausible',
  },
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    prefetching: true,
    monitoring: process.env.NODE_ENV === 'production',
  },
  experimental: {
    newProjectUI: env.NEXT_PUBLIC_NEW_PROJECT_UI === 'true',
    betaFeatures: env.NEXT_PUBLIC_BETA_FEATURES === 'true',
  },
} as const

// Helper functions to check features
export const isFeatureEnabled = (feature: keyof FeatureFlagsConfig) => {
  return featureFlags[feature]
}

export const isProviderEnabled = (provider: 'github' | 'google') => {
  return featureFlags.auth.providers[provider]
}

export type FeatureFlags = typeof featureFlags
export type { FeatureFlagsConfig }
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Core imports
import { SessionManager } from '@/lib/core/sessionManager'
import { SecureStorage } from '@/lib/core/secureStorage'
import { security } from '@/lib/core/security'

// Monitoring imports
import { performanceMonitor } from '@/lib/monitoring/performance'
import { analytics } from '@/lib/monitoring/analytics'

// Config imports
import { featureFlags, type FeatureFlagsConfig } from '@/config/features'
import { dashboardConfig } from '@/config/dashboard'
import type { NavItem } from '@/config/dashboard'

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get instances from core services
export const sessionManager = SessionManager.getInstance()
export const secureStorage = new SecureStorage()

// Export monitoring services
export { performanceMonitor }
export { analytics }

// Feature registry
export const features = {
  ...featureFlags,
  isEnabled: (feature: keyof FeatureFlagsConfig) => {
    const featureValue = featureFlags[feature]
    if ('enabled' in featureValue) {
      return (featureValue as { enabled: boolean }).enabled
    }
    // For features that don't have an enabled property, check if they have any truthy values
    return Object.values(featureValue).some(value => Boolean(value))
  },
  isExperimental: (feature: 'newProjectUI' | 'betaFeatures') => {
    return featureFlags.experimental[feature]
  },
  isAuthEnabled: (provider?: 'github' | 'google') => {
    if (provider) {
      return featureFlags.auth.enabled && featureFlags.auth.providers[provider]
    }
    return featureFlags.auth.enabled
  }
}

// Dashboard configuration registry
export const dashboardSettings = {
  ...dashboardConfig,
  getNavItems: (key: keyof typeof dashboardConfig): NavItem[] => {
    return dashboardConfig[key] || []
  }
}

// Type definitions for the registry
export type FeatureKey = keyof FeatureFlagsConfig
export type DashboardKey = keyof typeof dashboardConfig

// Export a default registry object that combines all registries
const registry = {
  session: sessionManager,
  storage: secureStorage,
  security,
  monitoring: {
    performance: performanceMonitor,
    analytics
  },
  features,
  dashboard: dashboardSettings,
  utils: {
    cn
  }
}

export type Registry = typeof registry
export default registry

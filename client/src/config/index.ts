// Import configurations
import { siteConfig } from './site'
import { dashboardConfig, DASHBOARD_ROUTES, SETTINGS_ROUTES } from './dashboard'
import { apiConfig, projectPaths } from './api'
import { featureFlags, isFeatureEnabled, isProviderEnabled } from './features'

// ===== CONFIG EXPORTS ===== 
// This file exports all the configuration objects for our application
// It includes the site configuration, dashboard configuration, API configuration, and feature flags
// Each configuration object is exported with its corresponding type
// The configuration objects are used to define the behavior and structure of the application

// Site configuration
export { siteConfig } from './site'
export type { SiteConfig } from './site'

// Dashboard configuration
export { 
  dashboardConfig, 
  DASHBOARD_ROUTES, 
  SETTINGS_ROUTES 
} from './dashboard'
export type { 
  DashboardConfig, 
  NavItem, 
  DashboardConfigType 
} from './dashboard'

// API configuration
export { 
  apiConfig,
  projectPaths 
} from './api'
export type { 
  ApiConfig, 
  ApiEndpoints, 
  ApiHeaders, 
  ApiOptions, 
  ApiFeatures 
} from './api'

// Feature flags
export { 
  featureFlags,
  isFeatureEnabled,
  isProviderEnabled 
} from './features'
export type { 
  FeatureFlags,
  FeatureFlagsConfig 
} from './features'

// Export unified config object
export const config = {
  site: siteConfig,
  dashboard: dashboardConfig,
  api: apiConfig,
  features: featureFlags,
} as const
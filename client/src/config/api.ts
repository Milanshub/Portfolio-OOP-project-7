import { env } from '@/lib/config/env'

// ===== API ENDPOINT TYPES =====
// These interfaces define the structure of our API routes
// They are used to ensure type safety when interacting with the API  


// Auth endpoints
interface AuthEndpoints {
  login: string
  register: string
  logout: string
  refresh: string
  resetPassword: string
  changePassword: string
}

// Profile endpoints
interface ProfileEndpoints {
  get: string
  update: string
  avatar: string
  resume: string
}

// Project endpoints
interface ProjectEndpoints {
  list: string
  featured: string
  detail: string
  create: string
  update: string
  delete: string
  thumbnail: string
  images: string
  github: string
}

// Message endpoints
interface MessageEndpoints {
  list: string
  unread: string
  send: string
  read: (id: string) => string
  delete: (id: string) => string
}

// Analytics endpoints
interface AnalyticsEndpoints {
  overview: string
  pageViews: string
  events: string
  report: string
}

// Main API endpoints interface that combines all endpoint types
interface ApiEndpoints {
  auth: AuthEndpoints
  profile: ProfileEndpoints
  projects: ProjectEndpoints
  messages: MessageEndpoints
  analytics: AnalyticsEndpoints
}

// Define HTTP headers for API requests
interface ApiHeaders {
  'Content-Type': string
  Accept: string
}

// API configuration options
interface ApiOptions {
  timeout: number
  retryAttempts: number
  retryDelay: number
  withCredentials: boolean
}

// Feature flags for API functionality
interface ApiFeatures {
  githubSync: boolean
  analytics: boolean
  recaptcha: boolean
}

// Helper function for dynamic routes
const createPath = (path: string, param: string) => `${path}/${param}`

// ===== MAIN API CONFIGURATION =====
// This object contains the main configuration for our API
// It includes the base URL, endpoints, headers, options, and feature flags
export const apiConfig = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      resetPassword: '/auth/reset-password',
      changePassword: '/auth/change-password',
    },
    profile: {
      get: '/profile',
      update: '/profile/update',
      avatar: '/profile/avatar',
      resume: '/profile/resume',
    },
    projects: {
      list: '/projects',
      featured: '/projects/featured',
      detail: '/projects',
      create: '/projects',
      update: '/projects',
      delete: '/projects',
      thumbnail: '/projects',
      images: '/projects',
      github: '/projects',
    },
    messages: {
      list: '/messages',
      unread: '/messages/unread',
      send: '/messages/send',
      read: (id: string) => `/messages/${id}/read`,
      delete: (id: string) => `/messages/${id}`,
    },
    analytics: {
      overview: '/analytics/overview',
      pageViews: '/analytics/page-views',
      events: '/analytics/events',
      report: '/analytics/report',
    },
  },
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  options: {
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
    withCredentials: true,
  },
  features: {
    githubSync: env.NEXT_PUBLIC_GITHUB_SYNC_ENABLED === 'true',
    analytics: env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
    recaptcha: env.NEXT_PUBLIC_RECAPTCHA_ENABLED === 'true',
  }
} as const

// ===== HELPER FUNCTIONS =====
// Functions to generate URLs for project-related operations
export const projectPaths = {
  detail: (id: string) => createPath(apiConfig.endpoints.projects.detail, id),
  update: (id: string) => createPath(apiConfig.endpoints.projects.update, id),
  delete: (id: string) => createPath(apiConfig.endpoints.projects.delete, id),
  thumbnail: (id: string) => createPath(apiConfig.endpoints.projects.thumbnail, `${id}/thumbnail`),
  images: (id: string) => createPath(apiConfig.endpoints.projects.images, `${id}/images`),
  github: (id: string) => createPath(apiConfig.endpoints.projects.github, `${id}/github`),
}

export type ApiConfig = typeof apiConfig
export type { 
  ApiEndpoints, 
  AuthEndpoints,
  ProfileEndpoints,
  ProjectEndpoints,
  MessageEndpoints,
  AnalyticsEndpoints,
  ApiHeaders, 
  ApiOptions, 
  ApiFeatures 
}
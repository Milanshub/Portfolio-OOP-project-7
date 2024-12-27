// ===== APP CONSTANTS =====
// This file contains constants used throughout the application
// These constants are used to define the behavior and structure of the application

export const APP_CONSTANTS = {
  APP_NAME: 'Your Portfolio',
  DEFAULT_LOCALE: 'en',
  DEFAULT_THEME: 'system',
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    TIME_WINDOW: 5 * 60 * 1000, // 5 minutes
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },
  CACHE: {
    DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
    STALE_TIME: 60 * 1000, // 1 minute
  },
  BREAKPOINTS: {
    mobile: 640,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
  },
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    ABOUT: '/about',
    CONTACT: '/contact',
  },
} as const

export type AppConstants = typeof APP_CONSTANTS 
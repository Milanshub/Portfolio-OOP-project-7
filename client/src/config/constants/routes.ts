// Public Routes
export const PUBLIC_ROUTES = {
    HOME: '/',
    PROJECTS: '/projects',
    PROJECT_DETAIL: '/projects/:id',
    TECHNOLOGIES: '/technologies',
    TECHNOLOGY_DETAIL: '/technologies/:id',
    TECHNOLOGY_CATEGORY: '/technologies/category/:category',
    PROFILE: '/profile',
    CONTACT: '/contact',
  } as const;
  
  // Auth Routes
  export const AUTH_ROUTES = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VALIDATE_TOKEN: '/auth/validate-token',
    CHANGE_PASSWORD: '/auth/change-password',
    REQUEST_RESET: '/auth/request-reset',
    RESET_PASSWORD: '/auth/reset-password',
  } as const;
  
  // Admin Routes
  export const ADMIN_ROUTES = {
    DASHBOARD: '/admin',
    PROFILE: '/admin/profile',
    PROJECTS: '/admin/projects',
    PROJECT_CREATE: '/admin/projects/create',
    PROJECT_EDIT: '/admin/projects/:id',
    TECHNOLOGIES: '/admin/technologies',
    MESSAGES: '/admin/messages',
    ANALYTICS: '/admin/analytics',
    STORAGE: '/admin/storage',
  } as const;
  
  // API Routes
  export const API_ROUTES = {
    // Projects
    PROJECTS: '/api/projects',
    FEATURED_PROJECTS: '/api/projects/featured',
    PROJECT_BY_ID: (id: string) => `/api/projects/${id}`,
    PROJECT_THUMBNAIL: (id: string) => `/api/projects/${id}/thumbnail`,
    PROJECT_IMAGES: (id: string) => `/api/projects/${id}/images`,
  
    // Technologies
    TECHNOLOGIES: '/api/technologies',
    TECHNOLOGY_BY_ID: (id: string) => `/api/technologies/${id}`,
    TECHNOLOGY_BY_CATEGORY: (category: string) => `/api/technologies/category/${category}`,
    TECHNOLOGY_PROFICIENCY: (id: string) => `/api/technologies/${id}/proficiency`,
  
    // Profile
    PROFILE: '/api/profile',
    PROFILE_AVATAR: '/api/profile/avatar',
    PROFILE_RESUME: '/api/profile/resume',
  
    // Messages
    MESSAGES: '/api/messages',
    UNREAD_MESSAGES: '/api/messages/unread',
    UNREAD_COUNT: '/api/messages/unread/count',
    MESSAGE_READ: (id: string) => `/api/messages/${id}/read`,
    MESSAGE_DELETE: (id: string) => `/api/messages/${id}`,
  
    // Analytics
    ANALYTICS: '/api/analytics',
    ANALYTICS_LATEST: '/api/analytics/latest',
    ANALYTICS_REPORT: '/api/analytics/report',
    ANALYTICS_PAGEVIEW: '/api/analytics/pageview',
    MOST_VIEWED_PROJECTS: '/api/analytics/most-viewed-projects',
  
    // Admin
    ADMIN: '/api/admin',
    ADMIN_LOGIN: '/api/admin/login',
    ADMIN_PROFILE: '/api/admin-profile',
    ADMIN_AVATAR: (id: string) => `/api/admin-profile/${id}/avatar`,
    ADMIN_RESUME: (id: string) => `/api/admin-profile/${id}/resume`,
  
    // Auth
    AUTH: '/api/auth',
    AUTH_LOGIN: '/api/auth/login',
    AUTH_LOGOUT: '/api/auth/logout',
    AUTH_VALIDATE: '/api/auth/validate-token',
    AUTH_CHANGE_PASSWORD: '/api/auth/change-password',
    AUTH_REQUEST_RESET: '/api/auth/request-reset',
    AUTH_RESET_PASSWORD: '/api/auth/reset-password',
  
    // GitHub
    GITHUB_REPOS: '/api/github/repositories',
    GITHUB_REPO: (name: string) => `/api/github/repository/${name}`,
    GITHUB_COMMITS: (name: string) => `/api/github/repository/${name}/commits`,
  
    // Storage
    STORAGE_UPLOAD: '/api/storage/upload',
    STORAGE_UPLOAD_MULTIPLE: '/api/storage/upload/multiple',
    STORAGE_DELETE: '/api/storage',
  
    // Health Check
    HEALTH: '/health',
  } as const;
  
  // Type exports
  export type PublicRoute = typeof PUBLIC_ROUTES[keyof typeof PUBLIC_ROUTES];
  export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];
  export type AdminRoute = typeof ADMIN_ROUTES[keyof typeof ADMIN_ROUTES];
  export type ApiRoute = typeof API_ROUTES;
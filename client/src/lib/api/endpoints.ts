import { API_ROUTES } from '@/config/constants/routes';
import { env } from '@/config/env';

// Projects
export const PROJECTS = {
    GET_ALL: `${env.REACT_APP_API_URL}${API_ROUTES.PROJECTS}`,
    GET_FEATURED: `${env.REACT_APP_API_URL}${API_ROUTES.FEATURED_PROJECTS}`,
    GET_BY_ID: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.PROJECT_BY_ID(id)}`,
    GET_THUMBNAIL: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.PROJECT_THUMBNAIL(id)}`,
    GET_IMAGES: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.PROJECT_IMAGES(id)}`,
    CREATE: `${env.REACT_APP_API_URL}${API_ROUTES.PROJECTS}`,
    UPDATE: (id: string) => `${env.REACT_APP_API_URL}/api/projects/${id}`,
    DELETE: (id: string) => `${env.REACT_APP_API_URL}/api/projects/${id}`,
} as const;

// Technologies
export const TECHNOLOGIES = {
    GET_ALL: `${env.REACT_APP_API_URL}${API_ROUTES.TECHNOLOGIES}`,
    GET_BY_ID: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.TECHNOLOGY_BY_ID(id)}`,
    GET_BY_CATEGORY: (category: string) => `${env.REACT_APP_API_URL}${API_ROUTES.TECHNOLOGY_BY_CATEGORY(category)}`,
    GET_PROFICIENCY: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.TECHNOLOGY_PROFICIENCY(id)}`,
    CREATE: `${env.REACT_APP_API_URL}${API_ROUTES.TECHNOLOGIES}`,
    UPDATE: (id: string) => `${env.REACT_APP_API_URL}/api/technologies/${id}`,
    DELETE: (id: string) => `${env.REACT_APP_API_URL}/api/technologies/${id}`,
} as const;

// Profile
export const PROFILE = {
    GET: `${env.REACT_APP_API_URL}${API_ROUTES.PROFILE}`,
    UPDATE: `${env.REACT_APP_API_URL}${API_ROUTES.PROFILE}`,
    AVATAR: `${env.REACT_APP_API_URL}${API_ROUTES.PROFILE_AVATAR}`,
    RESUME: `${env.REACT_APP_API_URL}${API_ROUTES.PROFILE_RESUME}`,
} as const;

// Messages
export const MESSAGES = {
    GET_ALL: `${env.REACT_APP_API_URL}${API_ROUTES.MESSAGES}`,
    GET_UNREAD: `${env.REACT_APP_API_URL}${API_ROUTES.UNREAD_MESSAGES}`,
    GET_UNREAD_COUNT: `${env.REACT_APP_API_URL}${API_ROUTES.UNREAD_COUNT}`,
    MARK_READ: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.MESSAGE_READ(id)}`,
    DELETE: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.MESSAGE_DELETE(id)}`,
    CREATE: `${env.REACT_APP_API_URL}${API_ROUTES.MESSAGES}`,
} as const;

// Analytics
export const ANALYTICS = {
    GET_ALL: `${env.REACT_APP_API_URL}${API_ROUTES.ANALYTICS}`,
    GET_LATEST: `${env.REACT_APP_API_URL}${API_ROUTES.ANALYTICS_LATEST}`,
    GET_REPORT: `${env.REACT_APP_API_URL}${API_ROUTES.ANALYTICS_REPORT}`,
    PAGE_VIEW: `${env.REACT_APP_API_URL}${API_ROUTES.ANALYTICS_PAGEVIEW}`,
    MOST_VIEWED_PROJECTS: `${env.REACT_APP_API_URL}${API_ROUTES.MOST_VIEWED_PROJECTS}`,
} as const;

// Admin
export const ADMIN = {
    GET: `${env.REACT_APP_API_URL}${API_ROUTES.ADMIN}`,
    LOGIN: `${env.REACT_APP_API_URL}${API_ROUTES.ADMIN_LOGIN}`,
    PROFILE: `${env.REACT_APP_API_URL}${API_ROUTES.ADMIN_PROFILE}`,
    AVATAR: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.ADMIN_AVATAR(id)}`,
    RESUME: (id: string) => `${env.REACT_APP_API_URL}${API_ROUTES.ADMIN_RESUME(id)}`,
} as const;

// Auth
export const AUTH = {
    LOGIN: `${env.REACT_APP_API_URL}${API_ROUTES.AUTH_LOGIN}`,
    LOGOUT: `${env.REACT_APP_API_URL}${API_ROUTES.AUTH_LOGOUT}`,
    VALIDATE: `${env.REACT_APP_API_URL}${API_ROUTES.AUTH_VALIDATE}`,
    CHANGE_PASSWORD: `${env.REACT_APP_API_URL}${API_ROUTES.AUTH_CHANGE_PASSWORD}`,
    REQUEST_RESET: `${env.REACT_APP_API_URL}${API_ROUTES.AUTH_REQUEST_RESET}`,
    RESET_PASSWORD: `${env.REACT_APP_API_URL}${API_ROUTES.AUTH_RESET_PASSWORD}`,
} as const;

// GitHub
export const GITHUB = {
    GET_REPOS: `${env.REACT_APP_API_URL}${API_ROUTES.GITHUB_REPOS}`,
    GET_REPO: (name: string) => `${env.REACT_APP_API_URL}${API_ROUTES.GITHUB_REPO(name)}`,
    GET_COMMITS: (name: string) => `${env.REACT_APP_API_URL}${API_ROUTES.GITHUB_COMMITS(name)}`,
} as const;

// Storage
export const STORAGE = {
    UPLOAD: `${env.REACT_APP_API_URL}${API_ROUTES.STORAGE_UPLOAD}`,
    UPLOAD_MULTIPLE: `${env.REACT_APP_API_URL}${API_ROUTES.STORAGE_UPLOAD_MULTIPLE}`,
    DELETE: `${env.REACT_APP_API_URL}${API_ROUTES.STORAGE_DELETE}`,
} as const;

// Health Check
export const HEALTH = {
    CHECK: `${env.REACT_APP_API_URL}${API_ROUTES.HEALTH}`,
} as const;

// Export all endpoints
export const endpoints = {
    PROJECTS,
    TECHNOLOGIES,
    PROFILE,
    MESSAGES,
    ANALYTICS,
    ADMIN,
    AUTH,
    GITHUB,
    STORAGE,
    HEALTH,
} as const;

// Export types for each endpoint group
export type ProjectEndpoints = typeof PROJECTS;
export type TechnologyEndpoints = typeof TECHNOLOGIES;
export type ProfileEndpoints = typeof PROFILE;
export type MessageEndpoints = typeof MESSAGES;
export type AnalyticsEndpoints = typeof ANALYTICS;
export type AdminEndpoints = typeof ADMIN;
export type AuthEndpoints = typeof AUTH;
export type GitHubEndpoints = typeof GITHUB;
export type StorageEndpoints = typeof STORAGE;
export type HealthEndpoints = typeof HEALTH;

export default endpoints;
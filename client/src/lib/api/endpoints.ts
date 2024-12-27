import { apiConfig, projectPaths } from '@/config'
import { axiosInstance } from './client'
import type { ApiResponse } from './client'

// ===== API ENDPOINTS =====
// This file contains the API endpoints for our application
// It includes the API endpoints for authentication, profile, projects, messages, and analytics
// Each endpoint is defined with its corresponding type
// The endpoints are used to interact with the API and perform CRUD operations

// Request/Response Types
// These types define the structure of the request and response data for each endpoint
// They are used to ensure type safety when interacting with the API
// They are defined in the AuthData, ProfileData, ProjectData, MessageData, and AnalyticsData interfaces
interface AuthData {
  email: string
  password: string
}

interface ProfileData {
  name?: string
  bio?: string
  location?: string
  website?: string
}

interface ProjectData {
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

interface MessageData {
  name: string
  email: string
  subject: string
  message: string
  attachments?: File[]
}

interface AnalyticsData {
  startDate: string
  endDate: string
  metrics?: string[]
}

// File upload helper
const createFormData = (key: string, file: File | File[]) => {
  const formData = new FormData()
  if (Array.isArray(file)) {
    file.forEach(f => formData.append(key, f))
  } else {
    formData.append(key, file)
  }
  return formData
}

// Auth endpoints
export const authApi = {
  login: (data: AuthData) => 
    axiosInstance.post<ApiResponse<{ token: string }>>(
      apiConfig.endpoints.auth.login, 
      data
    ),
  register: (data: AuthData) => 
    axiosInstance.post<ApiResponse<{ message: string }>>(
      apiConfig.endpoints.auth.register, 
      data
    ),
  logout: () => 
    axiosInstance.post<ApiResponse<void>>(
      apiConfig.endpoints.auth.logout
    ),
  refresh: () => 
    axiosInstance.post<ApiResponse<{ token: string }>>(
      apiConfig.endpoints.auth.refresh
    ),
  resetPassword: (email: string) => 
    axiosInstance.post<ApiResponse<{ message: string }>>(
      apiConfig.endpoints.auth.resetPassword, 
      { email }
    ),
  changePassword: (oldPassword: string, newPassword: string) => 
    axiosInstance.post<ApiResponse<{ message: string }>>(
      apiConfig.endpoints.auth.changePassword, 
      { oldPassword, newPassword }
    ),
}

// Profile endpoints
export const profileApi = {
  get: () => 
    axiosInstance.get<ApiResponse<ProfileData>>(
      apiConfig.endpoints.profile.get
    ),
  update: (data: Partial<ProfileData>) => 
    axiosInstance.put<ApiResponse<ProfileData>>(
      apiConfig.endpoints.profile.update, 
      data
    ),
  updateAvatar: (file: File) => 
    axiosInstance.put<ApiResponse<{ url: string }>>(
      apiConfig.endpoints.profile.avatar,
      createFormData('avatar', file),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
  updateResume: (file: File) => 
    axiosInstance.put<ApiResponse<{ url: string }>>(
      apiConfig.endpoints.profile.resume,
      createFormData('resume', file),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
}

// Projects endpoints
export const projectsApi = {
  getAll: () => 
    axiosInstance.get<ApiResponse<ProjectData[]>>(
      apiConfig.endpoints.projects.list
    ),
  getFeatured: () => 
    axiosInstance.get<ApiResponse<ProjectData[]>>(
      apiConfig.endpoints.projects.featured
    ),
  getById: (id: string) => 
    axiosInstance.get<ApiResponse<ProjectData>>(
      projectPaths.detail(id)  // Use helper function
    ),
  create: (data: ProjectData) => 
    axiosInstance.post<ApiResponse<ProjectData>>(
      apiConfig.endpoints.projects.create, 
      data
    ),
  update: (id: string, data: Partial<ProjectData>) => 
    axiosInstance.put<ApiResponse<ProjectData>>(
      projectPaths.update(id),  // Use helper function
      data
    ),
  delete: (id: string) => 
    axiosInstance.delete<ApiResponse<void>>(
      projectPaths.delete(id)  // Use helper function
    ),
  updateThumbnail: (id: string, file: File) => 
    axiosInstance.put<ApiResponse<{ url: string }>>(
      projectPaths.thumbnail(id),  // Use helper function
      createFormData('thumbnail', file),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
  updateImages: (id: string, files: File[]) => 
    axiosInstance.put<ApiResponse<{ urls: string[] }>>(
      projectPaths.images(id),  // Use helper function
      createFormData('images', files),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
  syncGitHub: (id: string, repoUrl: string) => 
    axiosInstance.post<ApiResponse<{ message: string }>>(
      projectPaths.github(id),  // Use helper function
      { repoUrl }
    ),
}

// ... rest of the code remains the same ...

// Messages endpoints
export const messagesApi = {
  getAll: () => 
    axiosInstance.get<ApiResponse<MessageData[]>>(
      apiConfig.endpoints.messages.list
    ),
  getUnread: () => 
    axiosInstance.get<ApiResponse<MessageData[]>>(
      apiConfig.endpoints.messages.unread
    ),
  send: (data: MessageData) => 
    axiosInstance.post<ApiResponse<{ message: string }>>(
      apiConfig.endpoints.messages.send, 
      data
    ),
  markAsRead: (id: string) => 
    axiosInstance.put<ApiResponse<void>>(
      apiConfig.endpoints.messages.read(id)
    ),
  delete: (id: string) => 
    axiosInstance.delete<ApiResponse<void>>(
      apiConfig.endpoints.messages.delete(id)
    ),
}

// Analytics endpoints
export const analyticsApi = {
  getOverview: (params?: Partial<AnalyticsData>) => 
    axiosInstance.get<ApiResponse<any>>(
      apiConfig.endpoints.analytics.overview, 
      { params }
    ),
  getPageViews: (params?: Partial<AnalyticsData>) => 
    axiosInstance.get<ApiResponse<any>>(
      apiConfig.endpoints.analytics.pageViews, 
      { params }
    ),
  getEvents: (params?: Partial<AnalyticsData>) => 
    axiosInstance.get<ApiResponse<any>>(
      apiConfig.endpoints.analytics.events, 
      { params }
    ),
  generateReport: (params: AnalyticsData) => 
    axiosInstance.get<ApiResponse<{ url: string }>>(
      apiConfig.endpoints.analytics.report, 
      { params }
    ),
}

// Export types
export type {
  AuthData,
  ProfileData,
  ProjectData,
  MessageData,
  AnalyticsData,
}
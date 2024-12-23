// Base API Response Type
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  validationErrors?: string[];
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  images: string[];
  liveUrl: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  startDate: Date;
  endDate: Date;
  technologies: string[];
  githubData?: {
    stars: number;
    forks: number;
    lastCommit: Date;
    languages: Record<string, number>;
  };
}

// Profile Types
export interface Profile {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  avatar: string;
  resume: string;
  location: string;
  email: string;
}

// Technology Types
export interface Technology {
  id: string;
  name: string;
  icon: string;
  category: TechnologyCategory;
  proficiencyLevel: number;
}

export enum TechnologyCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  OTHER = 'OTHER'
}

// Message Types
export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  created_at: Date;
  read: boolean;
}

export interface ContactForm {
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
}

// Analytics Types
export interface Analytics {
  id: string;
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: number;
  mostViewedProjects: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsEvent {
  id: string;
  event_name: string;
  event_data: any;
  timestamp: Date;
  created_at: Date;
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: number;
}

// File Upload Types
export interface UploadResponse {
  url: string;
}

export interface MultipleUploadResponse {
  urls: string[];
}

// GitHub Types
export interface GitHubRepository {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

// Error Types
export interface ApiError extends Error {
  code?: string;
  statusCode?: number;
  validationErrors?: Record<string, string[]>;
}

// Token Types
export interface TokenData {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

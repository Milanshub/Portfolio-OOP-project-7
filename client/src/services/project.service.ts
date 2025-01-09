import { api } from '@/lib/api/client';
import { Project } from '@/types';
import { endpoints } from '@/lib/api/endpoints';
import { logger } from '@/config/logger';

export class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(endpoints.PROJECTS.GET_ALL);
      logger.debug('Projects retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to get all projects:', error as Error);
      throw error;
    }
  }

  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>(endpoints.PROJECTS.GET_FEATURED);
      logger.debug('Featured projects retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to get featured projects:', error as Error);
      throw error;
    }
  }

  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await api.get<Project>(endpoints.PROJECTS.GET_BY_ID(id));
      logger.debug(`Project retrieved successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get project ${id}:`, error as Error);
      throw error;
    }
  }

  async createProject(data: FormData): Promise<Project> {
    try {
      const response = await api.post<Project>(endpoints.PROJECTS.CREATE, data);
      logger.info('Project created successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to create project:', error as Error);
      throw error;
    }
  }

  async updateProject(id: string, data: FormData): Promise<Project> {
    try {
      const response = await api.put<Project>(endpoints.PROJECTS.UPDATE(id), data);
      logger.info(`Project updated successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update project ${id}:`, error as Error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(endpoints.PROJECTS.DELETE(id));
      logger.info(`Project deleted successfully: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete project ${id}:`, error as Error);
      throw error;
    }
  }

  async updateThumbnail(id: string, file: File): Promise<Project> {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      const response = await api.put<Project>(
        endpoints.PROJECTS.GET_THUMBNAIL(id),
        formData
      );
      logger.info(`Project thumbnail updated successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update project thumbnail ${id}:`, error as Error);
      throw error;
    }
  }

  async updateImages(id: string, files: File[]): Promise<Project> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await api.put<Project>(
        endpoints.PROJECTS.GET_IMAGES(id),
        formData
      );
      logger.info(`Project images updated successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update project images ${id}:`, error as Error);
      throw error;
    }
  }
}

export const projectService = ProjectService.getInstance();
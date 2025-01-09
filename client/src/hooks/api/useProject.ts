import { useState } from 'react';
import { projectService } from '@/services';
import { Project, ApiError } from '@/types';
import { logger } from '@/config/logger';

export const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
      logger.debug('Projects fetched successfully');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to fetch projects:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (projectData: Omit<Project, 'id'>) => {
    try {
      setIsLoading(true);
      // Convert project data to FormData if needed
      const formData = new FormData();
      Object.entries(projectData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      });
      
      const newProject = await projectService.createProject(formData);
      setProjects(prev => [...prev, newProject]);
      logger.debug('Project created successfully');
      return newProject;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to create project:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      setIsLoading(true);
      // Convert project data to FormData if needed
      const formData = new FormData();
      Object.entries(projectData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      });

      const updatedProject = await projectService.updateProject(id, formData);
      setProjects(prev => 
        prev.map(project => project.id === id ? updatedProject : project)
      );
      logger.debug('Project updated successfully');
      return updatedProject;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to update project:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setIsLoading(true);
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      logger.debug('Project deleted successfully');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to delete project:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  };
};
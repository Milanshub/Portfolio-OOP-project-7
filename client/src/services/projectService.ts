import { api, handleApiError } from '@/lib/api';
import { Project } from '@/types';

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>('/projects');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getFeaturedProjects(): Promise<Project[]> {
    try {
      const response = await api.get<Project[]>('/projects/featured');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getProjectById(id: string): Promise<Project> {
    try {
      const response = await api.get<Project>(`/projects/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createProject(projectData: FormData): Promise<Project> {
    try {
      const response = await api.post<Project>('/projects', projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateProject(id: string, projectData: FormData): Promise<Project> {
    try {
      const response = await api.put<Project>(`/projects/${id}`, projectData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateThumbnail(id: string, file: File): Promise<Project> {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const response = await api.put<Project>(`/projects/${id}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateImages(id: string, files: File[]): Promise<Project> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.put<Project>(`/projects/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async syncWithGitHub(id: string, repoUrl: string): Promise<Project> {
    try {
      const response = await api.post<Project>(`/projects/${id}/sync-github`, { repoUrl });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 
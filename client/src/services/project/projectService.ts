import { api } from '@/lib/api';
import { Project } from '@/types';

class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response;
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects/featured');
    return response;
  }

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response;
  }

  async createProject(data: FormData): Promise<Project> {
    const response = await api.post<Project>('/projects', data);
    return response;
  }

  async updateProject(id: string, data: FormData): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response;
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  async updateThumbnail(id: string, file: File): Promise<Project> {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await api.put<Project>(`/projects/${id}/thumbnail`, formData);
    return response;
  }

  async updateImages(id: string, files: File[]): Promise<Project> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const response = await api.put<Project>(`/projects/${id}/images`, formData);
    return response;
  }

  async syncWithGitHub(id: string, repoUrl: string): Promise<Project> {
    const response = await api.post<Project>(`/projects/${id}/github`, { repoUrl });
    return response;
  }
}

export const projectService = ProjectService.getInstance(); 
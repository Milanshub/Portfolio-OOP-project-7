import { api, handleApiError } from '@/lib/api';
import { Technology, TechnologyCategory } from '@/types';

export const technologyService = {
  async getAllTechnologies(): Promise<Technology[]> {
    try {
      const response = await api.get<Technology[]>('/technologies');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getTechnologyById(id: string): Promise<Technology> {
    try {
      const response = await api.get<Technology>(`/technologies/${id}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getTechnologiesByCategory(category: TechnologyCategory): Promise<Technology[]> {
    try {
      const response = await api.get<Technology[]>(`/technologies/category/${category}`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createTechnology(technologyData: FormData): Promise<Technology> {
    try {
      const response = await api.post<Technology>('/technologies', technologyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateTechnology(id: string, technologyData: FormData): Promise<Technology> {
    try {
      const response = await api.put<Technology>(`/technologies/${id}`, technologyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteTechnology(id: string): Promise<void> {
    try {
      await api.delete(`/technologies/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateProficiencyLevel(id: string, level: number): Promise<Technology> {
    try {
      const response = await api.put<Technology>(`/technologies/${id}/proficiency`, { level });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 
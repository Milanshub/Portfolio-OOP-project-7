import { api } from '@/lib/api';
import { Technology, TechnologyCategory } from '@/types';

class TechnologyService {
  private static instance: TechnologyService;

  private constructor() {}

  public static getInstance(): TechnologyService {
    if (!TechnologyService.instance) {
      TechnologyService.instance = new TechnologyService();
    }
    return TechnologyService.instance;
  }

  async getAllTechnologies(): Promise<Technology[]> {
    const response = await api.get<Technology[]>('/technologies');
    return response;
  }

  async getTechnologyById(id: string): Promise<Technology> {
    const response = await api.get<Technology>(`/technologies/${id}`);
    return response;
  }

  async getTechnologiesByCategory(category: TechnologyCategory): Promise<Technology[]> {
    const response = await api.get<Technology[]>(`/technologies/category/${category}`);
    return response;
  }

  async createTechnology(data: FormData): Promise<Technology> {
    const response = await api.post<Technology>('/technologies', data);
    return response;
  }

  async updateTechnology(id: string, data: FormData): Promise<Technology> {
    const response = await api.put<Technology>(`/technologies/${id}`, data);
    return response;
  }

  async deleteTechnology(id: string): Promise<void> {
    await api.delete(`/technologies/${id}`);
  }

  async updateProficiencyLevel(id: string, level: number): Promise<Technology> {
    const response = await api.put<Technology>(`/technologies/${id}/proficiency`, { level });
    return response;
  }
}

export const technologyService = TechnologyService.getInstance(); 
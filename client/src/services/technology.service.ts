import { api } from '@/lib/api/client';
import { Technology, TechnologyCategory } from '@/types';
import { endpoints } from '@/lib/api/endpoints';
import { logger } from '@/config/logger';

export class TechnologyService {
  private static instance: TechnologyService;

  private constructor() {}

  public static getInstance(): TechnologyService {
    if (!TechnologyService.instance) {
      TechnologyService.instance = new TechnologyService();
    }
    return TechnologyService.instance;
  }

  async getAllTechnologies(): Promise<Technology[]> {
    try {
      const response = await api.get<Technology[]>(endpoints.TECHNOLOGIES.GET_ALL);
      logger.debug('Technologies retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to get all technologies:', error as Error);
      throw error;
    }
  }

  async getTechnologyById(id: string): Promise<Technology> {
    try {
      const response = await api.get<Technology>(endpoints.TECHNOLOGIES.GET_BY_ID(id));
      logger.debug(`Technology retrieved successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get technology ${id}:`, error as Error);
      throw error;
    }
  }

  async getTechnologiesByCategory(category: TechnologyCategory): Promise<Technology[]> {
    try {
      const response = await api.get<Technology[]>(
        endpoints.TECHNOLOGIES.GET_BY_CATEGORY(category)
      );
      logger.debug(`Technologies retrieved successfully for category: ${category}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get technologies for category ${category}:`, error as Error);
      throw error;
    }
  }

  async createTechnology(data: FormData): Promise<Technology> {
    try {
      const response = await api.post<Technology>(endpoints.TECHNOLOGIES.CREATE, data);
      logger.info('Technology created successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to create technology:', error as Error);
      throw error;
    }
  }

  async updateTechnology(id: string, data: FormData): Promise<Technology> {
    try {
      const response = await api.put<Technology>(endpoints.TECHNOLOGIES.UPDATE(id), data);
      logger.info(`Technology updated successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update technology ${id}:`, error as Error);
      throw error;
    }
  }

  async deleteTechnology(id: string): Promise<void> {
    try {
      await api.delete(endpoints.TECHNOLOGIES.DELETE(id));
      logger.info(`Technology deleted successfully: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete technology ${id}:`, error as Error);
      throw error;
    }
  }

  async updateProficiencyLevel(id: string, level: number): Promise<Technology> {
    try {
      const response = await api.put<Technology>(
        endpoints.TECHNOLOGIES.GET_PROFICIENCY(id),
        { level }
      );
      logger.info(`Technology proficiency updated successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update technology proficiency ${id}:`, error as Error);
      throw error;
    }
  }
}

export const technologyService = TechnologyService.getInstance();
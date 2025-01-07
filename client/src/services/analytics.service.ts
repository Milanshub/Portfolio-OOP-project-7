import { api } from '@/lib/api/client';
import { Analytics, AnalyticsEvent, CreateAnalytics, UpdateAnalytics } from '@/types/entities/analytics';
import { endpoints } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';
import { logger } from '@/config/logger';

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    try {
      const response = await api.get<Analytics[]>(endpoints.ANALYTICS.GET_ALL);
      return response.data;
    } catch (error) {
      logger.error('Failed to get all analytics:', error as Error);
      throw error;
    }
  }

  async getLatestAnalytics(): Promise<Analytics> {
    try {
      const response = await api.get<Analytics>(endpoints.ANALYTICS.GET_LATEST);
      return response.data;
    } catch (error) {
      logger.error('Failed to get latest analytics:', error as Error);
      throw error;
    }
  }

  async generateReport(): Promise<Analytics> {
    try {
      const response = await api.get<Analytics>(endpoints.ANALYTICS.GET_REPORT);
      return response.data;
    } catch (error) {
      logger.error('Failed to generate analytics report:', error as Error);
      throw error;
    }
  }

  async recordPageView(page: string): Promise<void> {
    try {
      await api.post(endpoints.ANALYTICS.PAGE_VIEW, { page });
      logger.info(`Page view recorded for: ${page}`);
    } catch (error) {
      logger.error('Failed to record page view:', error as Error);
      throw error;
    }
  }

  async getMostViewedProjects(): Promise<string[]> {
    try {
      const response = await api.get<string[]>(endpoints.ANALYTICS.MOST_VIEWED_PROJECTS);
      return response.data;
    } catch (error) {
      logger.error('Failed to get most viewed projects:', error as Error);
      throw error;
    }
  }

  async updateMostViewedProjects(projectIds: string[]): Promise<void> {
    try {
      await api.put(endpoints.ANALYTICS.MOST_VIEWED_PROJECTS, { projectIds });
      logger.info('Most viewed projects updated successfully');
    } catch (error) {
      logger.error('Failed to update most viewed projects:', error as Error);
      throw error;
    }
  }

  async createAnalytics(data: CreateAnalytics): Promise<Analytics> {
    try {
      const response = await api.post<Analytics>(endpoints.ANALYTICS.GET_ALL, data);
      logger.info('Analytics created successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to create analytics:', error as Error);
      throw error;
    }
  }

  async updateAnalytics(id: string, data: UpdateAnalytics): Promise<Analytics> {
    try {
      const response = await api.put<Analytics>(`${endpoints.ANALYTICS.GET_ALL}/${id}`, data);
      logger.info(`Analytics updated successfully: ${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to update analytics ${id}:`, error as Error);
      throw error;
    }
  }

  async deleteAnalytics(id: string): Promise<void> {
    try {
      await api.delete(`${endpoints.ANALYTICS.GET_ALL}/${id}`);
      logger.info(`Analytics deleted successfully: ${id}`);
    } catch (error) {
      logger.error(`Failed to delete analytics ${id}:`, error as Error);
      throw error;
    }
  }

  async trackEvent(eventName: string, eventData: Record<string, any> = {}): Promise<void> {
    try {
      await api.post(`${endpoints.ANALYTICS.GET_ALL}/event`, {
        event_name: eventName,
        event_data: eventData,
        timestamp: new Date(),
      });
      logger.info(`Event tracked: ${eventName}`, eventData);
    } catch (error) {
      logger.error(`Failed to track event ${eventName}:`, error as Error);
      throw error;
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
import { api, handleApiError } from '@/lib/api';
import { Analytics, AnalyticsEvent } from '@/types';

export const analyticsService = {
  async getAnalytics(): Promise<Analytics> {
    try {
      const response = await api.get<Analytics>('/analytics');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async trackPageView(page: string): Promise<void> {
    try {
      await api.post('/analytics/page-view', { page });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  },

  async trackEvent(eventName: string, eventData: any = {}): Promise<void> {
    try {
      await api.post<AnalyticsEvent>('/analytics/event', {
        event_name: eventName,
        event_data: eventData,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  },

  async generateReport(): Promise<any> {
    try {
      const response = await api.get('/analytics/report');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getMostViewedProjects(): Promise<string[]> {
    try {
      const response = await api.get<string[]>('/analytics/most-viewed-projects');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 
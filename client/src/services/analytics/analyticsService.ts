import { api } from '@/lib/api';
import { Analytics, AnalyticsEvent } from '@/types';

class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async getAnalytics(): Promise<Analytics> {
    const response = await api.get<Analytics>('/analytics');
    return response;
  }

  async trackPageView(page: string): Promise<void> {
    await api.post('/analytics/page-view', { page });
  }

  async trackEvent(eventName: string, eventData: any = {}): Promise<void> {
    await api.post('/analytics/event', { eventName, eventData });
  }

  async generateReport(): Promise<Analytics> {
    const response = await api.get<Analytics>('/analytics/report');
    return response;
  }

  async getMostViewedProjects(): Promise<string[]> {
    const response = await api.get<{ projectIds: string[] }>('/analytics/most-viewed-projects');
    return response.projectIds;
  }
}

export const analyticsService = AnalyticsService.getInstance(); 
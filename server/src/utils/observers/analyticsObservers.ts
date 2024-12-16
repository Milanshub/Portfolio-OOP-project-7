// src/utils/observers/analyticsObservers.ts
import { AnalyticsService } from '../../services/AnalyticsService';

export class AnalyticsObserver {
    private static instance: AnalyticsObserver;
    private analyticsService: AnalyticsService;

    private constructor() {
        this.analyticsService = AnalyticsService.getInstance();
    }

    static getInstance(): AnalyticsObserver {
        if (!AnalyticsObserver.instance) {
            AnalyticsObserver.instance = new AnalyticsObserver();
        }
        return AnalyticsObserver.instance;
    }

    async trackPageView(page: string): Promise<void> {
        try {
            await this.analyticsService.recordPageView();
        } catch (error) {
            console.error(`Failed to track page view for ${page}:`, error);
        }
    }

    async trackEvent(eventName: string, data: any): Promise<void> {
        try {
            await this.analyticsService.trackEvent(eventName, data);
        } catch (error) {
            console.error(`Failed to track event ${eventName}:`, error);
        }
    }

    async trackProjectView(projectId: string): Promise<void> {
        try {
            await this.analyticsService.recordPageView();
            // You might want to update most viewed projects here
            // await this.analyticsService.updateMostViewedProjects([projectId]);
        } catch (error) {
            console.error(`Failed to track project view for ${projectId}:`, error);
        }
    }
}
import { IAnalytics, ICreateAnalytics, IUpdateAnalytics } from '../types/entities';
import { Analytics } from '../models/Analytics';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class AnalyticsService {
    private static instance: AnalyticsService;
    private analyticsModel: Analytics;
    private logger = Logger.getInstance();

    private constructor() {
        this.analyticsModel = new Analytics();
    }

    public static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    async getAnalytics(): Promise<IAnalytics[]> {
        try {
            const analytics = await this.analyticsModel.findAll();
            this.logger.info('Analytics data retrieved successfully');
            return analytics;
        } catch (error: any) {
            this.logger.error('Failed to get analytics:', error);
            throw new AppError('Failed to get analytics', 500);
        }
    }

    async getLatestAnalytics(): Promise<IAnalytics | null> {
        try {
            const analytics = await this.analyticsModel.getLatestAnalytics();
            this.logger.info('Latest analytics retrieved successfully');
            return analytics;
        } catch (error: any) {
            this.logger.error('Failed to get latest analytics:', error);
            throw new AppError('Failed to get latest analytics', 500);
        }
    }

    async createAnalytics(analyticsData: ICreateAnalytics): Promise<IAnalytics> {
        try {
            const analytics = await this.analyticsModel.create(analyticsData);
            this.logger.info('Analytics created successfully');
            return analytics;
        } catch (error: any) {
            this.logger.error('Failed to create analytics:', error);
            throw new AppError('Failed to create analytics', 500);
        }
    }

    async updateAnalytics(id: string, analyticsData: IUpdateAnalytics): Promise<IAnalytics> {
        try {
            const updatedAnalytics = await this.analyticsModel.update(id, analyticsData);
            if (!updatedAnalytics) {
                throw new AppError('Analytics not found', 404);
            }
            this.logger.info(`Analytics updated successfully: ${id}`);
            return updatedAnalytics;
        } catch (error: any) {
            this.logger.error('Failed to update analytics:', error);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async deleteAnalytics(id: string): Promise<void> {
        try {
            const analytics = await this.analyticsModel.findById(id);
            if (!analytics) {
                throw new AppError('Analytics not found', 404);
            }

            await this.analyticsModel.delete(id);
            this.logger.info(`Analytics deleted successfully: ${id}`);
        } catch (error: any) {
            this.logger.error('Failed to delete analytics:', error);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async recordPageView(): Promise<void> {
        try {
            await this.analyticsModel.incrementPageViews();
            this.logger.info('Page view recorded successfully');
        } catch (error: any) {
            this.logger.error('Failed to record page view:', error);
            throw new AppError('Failed to record page view', 500);
        }
    }

    async updateMostViewedProjects(projectIds: string[]): Promise<void> {
        try {
            await this.analyticsModel.updateMostViewedProjects(projectIds);
            this.logger.info('Most viewed projects updated successfully');
        } catch (error: any) {
            this.logger.error('Failed to update most viewed projects:', error);
            throw new AppError('Failed to update most viewed projects', 500);
        }
    }

    async generateAnalyticsReport(): Promise<any> {
        try {
            const latest = await this.analyticsModel.getLatestAnalytics();
            if (!latest) {
                throw new AppError('No analytics data available', 404);
            }

            const report = {
                totalPageViews: latest.pageViews,
                uniqueVisitors: latest.uniqueVisitors,
                avgTimeOnSite: latest.avgTimeOnSite,
                topProjects: latest.mostViewedProjects,
                lastUpdated: latest.updatedAt
            };

            this.logger.info('Analytics report generated successfully');
            return report;
        } catch (error: any) {
            this.logger.error('Failed to generate analytics report:', error);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async trackEvent(eventName: string, data: any = {}): Promise<void> {
        try {
            await this.analyticsModel.createEvent({
                name: eventName,
                data,
                timestamp: new Date()
            });
            this.logger.info(`Event tracked: ${eventName}`, data);
        } catch (error: any) {
            this.logger.error(`Failed to track event ${eventName}:`, error);
            throw new AppError('Failed to track event', 500);
        }
    }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
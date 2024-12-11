import { IAnalytics, ICreateAnalytics, IUpdateAnalytics } from '../types/entities';
import { Analytics } from '../models/Analytics';
import { Logger } from '../utils/logger';

export class AnalyticsService {
    private analyticsModel: Analytics;
    private logger = Logger.getInstance();

    constructor() {
        this.analyticsModel = new Analytics();
    }

    async getAnalytics(): Promise<IAnalytics[]> {
        try {
            const analytics = await this.analyticsModel.findAll();
            this.logger.info('Analytics data retrieved successfully');
            return analytics;
        } catch (error: any) {
            this.logger.error('Failed to get analytics:', error);
            throw new Error(`Failed to get analytics: ${error.message}`);
        }
    }

    async getLatestAnalytics(): Promise<IAnalytics | null> {
        try {
            const analytics = await this.analyticsModel.getLatestAnalytics();
            this.logger.info('Latest analytics retrieved successfully');
            return analytics;
        } catch (error: any) {
            this.logger.error('Failed to get latest analytics:', error);
            throw new Error(`Failed to get latest analytics: ${error.message}`);
        }
    }

    async createAnalytics(analyticsData: ICreateAnalytics): Promise<IAnalytics> {
        try {
            const analytics = await this.analyticsModel.create(analyticsData);
            this.logger.info('Analytics created successfully');
            return analytics;
        } catch (error: any) {
            this.logger.error('Failed to create analytics:', error);
            throw new Error(`Failed to create analytics: ${error.message}`);
        }
    }

    async updateAnalytics(id: string, analyticsData: IUpdateAnalytics): Promise<IAnalytics> {
        try {
            const updatedAnalytics = await this.analyticsModel.update(id, analyticsData);
            if (!updatedAnalytics) {
                this.logger.warn(`Analytics not found with ID: ${id}`);
                throw new Error('Analytics not found');
            }
            this.logger.info(`Analytics updated successfully: ${id}`);
            return updatedAnalytics;
        } catch (error: any) {
            this.logger.error('Failed to update analytics:', error);
            throw new Error(`Failed to update analytics: ${error.message}`);
        }
    }

    async recordPageView(): Promise<void> {
        try {
            await this.analyticsModel.incrementPageViews();
            this.logger.info('Page view recorded successfully');
        } catch (error: any) {
            this.logger.error('Failed to record page view:', error);
            throw new Error(`Failed to record page view: ${error.message}`);
        }
    }

    async updateMostViewedProjects(projectIds: string[]): Promise<void> {
        try {
            await this.analyticsModel.updateMostViewedProjects(projectIds);
            this.logger.info('Most viewed projects updated successfully');
        } catch (error: any) {
            this.logger.error('Failed to update most viewed projects:', error);
            throw new Error(`Failed to update most viewed projects: ${error.message}`);
        }
    }

    async generateAnalyticsReport(): Promise<any> {
        try {
            const latest = await this.analyticsModel.getLatestAnalytics();
            if (!latest) {
                this.logger.warn('No analytics data available for report generation');
                throw new Error('No analytics data available');
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
            throw new Error(`Failed to generate analytics report: ${error.message}`);
        }
    }
}
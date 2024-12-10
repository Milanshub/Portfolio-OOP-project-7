import { IAnalytics, ICreateAnalytics, IUpdateAnalytics } from '../types/entities';
import { Analytics } from '../models/Analytics';

export class AnalyticsService {
    incrementPageViews() {
        throw new Error('Method not implemented.');
    }
    private analyticsModel: Analytics;

    constructor() {
        this.analyticsModel = new Analytics();
    }

    async getAnalytics(): Promise<IAnalytics[]> {
        try {
            return await this.analyticsModel.findAll();
        } catch (error: any) {
            throw new Error(`Failed to get analytics: ${error.message}`);
        }
    }

    async getLatestAnalytics(): Promise<IAnalytics | null> {
        try {
            return await this.analyticsModel.getLatestAnalytics();
        } catch (error: any) {
            throw new Error(`Failed to get latest analytics: ${error.message}`);
        }
    }

    async createAnalytics(analyticsData: ICreateAnalytics): Promise<IAnalytics> {
        try {
            return await this.analyticsModel.create(analyticsData);
        } catch (error: any) {
            throw new Error(`Failed to create analytics: ${error.message}`);
        }
    }

    async updateAnalytics(id: string, analyticsData: IUpdateAnalytics): Promise<IAnalytics> {
        try {
            const updatedAnalytics = await this.analyticsModel.update(id, analyticsData);
            if (!updatedAnalytics) {
                throw new Error('Analytics not found');
            }
            return updatedAnalytics;
        } catch (error: any) {
            throw new Error(`Failed to update analytics: ${error.message}`);
        }
    }

    async recordPageView(): Promise<void> {
        try {
            await this.analyticsModel.incrementPageViews();
        } catch (error: any) {
            throw new Error(`Failed to record page view: ${error.message}`);
        }
    }

    async updateMostViewedProjects(projectIds: string[]): Promise<void> {
        try {
            await this.analyticsModel.updateMostViewedProjects(projectIds);
        } catch (error: any) {
            throw new Error(`Failed to update most viewed projects: ${error.message}`);
        }
    }

    async generateAnalyticsReport(): Promise<any> {
        try {
            const latest = await this.analyticsModel.getLatestAnalytics();
            if (!latest) {
                throw new Error('No analytics data available');
            }

            return {
                totalPageViews: latest.pageViews,
                uniqueVisitors: latest.uniqueVisitors,
                avgTimeOnSite: latest.avgTimeOnSite,
                topProjects: latest.mostViewedProjects,
                lastUpdated: latest.updatedAt
            };
        } catch (error: any) {
            throw new Error(`Failed to generate analytics report: ${error.message}`);
        }
    }
}
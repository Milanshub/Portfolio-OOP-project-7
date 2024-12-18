import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { ICreateAnalytics, IUpdateAnalytics } from '../types/entities';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';
import { dateHelpers } from '../utils/helpers/dateHelpers';
import { AppError } from '../middleware/errorMiddleware';

export class AnalyticsController {
    private analyticsService: AnalyticsService;
    private logger = Logger.getInstance();
    private cache = new Cache<any>(1 * 60 * 1000); // 1 minute cache for analytics

    constructor() {
        this.analyticsService = AnalyticsService.getInstance();
    }

    async getAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'analytics-data';
            const cached = this.cache.get(cacheKey);
            
            if (cached) {
                this.logger.debug('Serving analytics from cache');
                res.status(200).json(cached);
                return;
            }

            const analytics = await this.analyticsService.getAnalytics();
            this.cache.set(cacheKey, analytics);
            this.logger.info('Analytics fetched successfully');
            res.status(200).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to get analytics:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getLatestAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'latest-analytics';
            const cached = this.cache.get(cacheKey);
            
            if (cached && dateHelpers.getDateDifference(new Date(), cached.timestamp) < 60000) {
                this.logger.debug('Serving latest analytics from cache');
                res.status(200).json(cached);
                return;
            }

            const analytics = await this.analyticsService.getLatestAnalytics();
            if (!analytics) {
                throw new AppError('No analytics data available', 404);
            }

            this.cache.set(cacheKey, { ...analytics, timestamp: new Date() });
            this.logger.info('Latest analytics fetched successfully');
            res.status(200).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to get latest analytics:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async generateAnalyticsReport(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'analytics-report';
            const cached = this.cache.get(cacheKey);

            if (cached) {
                this.logger.debug('Serving analytics report from cache');
                res.status(200).json(cached);
                return;
            }

            const report = await this.analyticsService.generateAnalyticsReport();
            this.cache.set(cacheKey, report);
            this.logger.info('Analytics report generated successfully');
            res.status(200).json(report);
        } catch (error: any) {
            this.logger.error('Failed to generate analytics report:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async createAnalytics(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body) {
                throw new AppError('Analytics data is required', 400);
            }

            const analyticsData: ICreateAnalytics = req.body;
            const analytics = await this.analyticsService.createAnalytics(analyticsData);
            this.cache.clear();
            await this.analyticsService.trackEvent('analytics_created');
            this.logger.info('Analytics created successfully');
            res.status(201).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to create analytics:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError('Analytics ID is required', 400);
            }

            const analyticsData: IUpdateAnalytics = req.body;
            const analytics = await this.analyticsService.updateAnalytics(id, analyticsData);
            this.cache.clear();
            await this.analyticsService.trackEvent('analytics_updated', { id });
            this.logger.info(`Analytics updated successfully: ${id}`);
            res.status(200).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to update analytics:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async deleteAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new AppError('Analytics ID is required', 400);
            }

            await this.analyticsService.deleteAnalytics(id);
            this.cache.clear();
            await this.analyticsService.trackEvent('analytics_deleted', { id });
            this.logger.info(`Analytics deleted successfully: ${id}`);
            res.status(200).json({ message: 'Analytics deleted successfully' });
        } catch (error: any) {
            this.logger.error('Failed to delete analytics:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async recordPageView(req: Request, res: Response): Promise<void> {
        try {
            await this.analyticsService.recordPageView();
            await this.analyticsService.trackEvent('page_view');
            this.logger.info('Page view recorded successfully');
            res.status(200).json({ message: 'Page view recorded successfully' });
        } catch (error: any) {
            this.logger.error('Failed to record page view:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateMostViewedProjects(req: Request, res: Response): Promise<void> {
        try {
            const { projectIds } = req.body;
            if (!projectIds || !Array.isArray(projectIds)) {
                throw new AppError('Valid project IDs array is required', 400);
            }

            await this.analyticsService.updateMostViewedProjects(projectIds);
            await this.analyticsService.trackEvent('most_viewed_projects_updated');
            this.logger.info('Most viewed projects updated successfully');
            res.status(200).json({ message: 'Most viewed projects updated successfully' });
        } catch (error: any) {
            this.logger.error('Failed to update most viewed projects:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
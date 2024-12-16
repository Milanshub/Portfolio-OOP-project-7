import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { ICreateAnalytics, IUpdateAnalytics } from '../types/entities';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';
import { dateHelpers } from '../utils/helpers/dateHelpers';

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
            res.status(500).json({ error: error.message });
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
            this.cache.set(cacheKey, { ...analytics, timestamp: new Date() });
            this.logger.info('Latest analytics fetched successfully');
            res.status(200).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to get latest analytics:', error);
            res.status(500).json({ error: error.message });
        }
    }


    async generateAnalyticsReport(req: Request, res: Response): Promise<void> {
        try {
            const report = await this.analyticsService.generateAnalyticsReport();
            res.status(200).json(report);
        } catch (error: any) {
            this.logger.error('Failed to generate analytics report:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async createAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analytics = await this.analyticsService.createAnalytics(req.body);
            this.cache.clear(); // Clear cache when data changes
            res.status(201).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to create analytics:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analytics = await this.analyticsService.updateAnalytics(req.params.id, req.body);
            this.cache.clear(); // Clear cache when data changes
            res.status(200).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to update analytics:', error);
            res.status(500).json({ error: error.message });
        }
    }

// ... existing code ...
    // ... similar updates for other methods
}
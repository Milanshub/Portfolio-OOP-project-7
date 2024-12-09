import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { ICreateAnalytics, IUpdateAnalytics } from '../types/entities';

export class AnalyticsController {
    private analyticsService: AnalyticsService;

    constructor() {
        this.analyticsService = new AnalyticsService();
    }

    async getAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analytics = await this.analyticsService.getAnalytics();
            res.status(200).json(analytics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getLatestAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analytics = await this.analyticsService.getLatestAnalytics();
            res.status(200).json(analytics);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analyticsData: ICreateAnalytics = req.body;
            const analytics = await this.analyticsService.createAnalytics(analyticsData);
            res.status(201).json(analytics);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const analyticsData: IUpdateAnalytics = req.body;
            const analytics = await this.analyticsService.updateAnalytics(id, analyticsData);
            res.status(200).json(analytics);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAnalyticsReport(req: Request, res: Response): Promise<void> {
        try {
            const report = await this.analyticsService.generateAnalyticsReport();
            res.status(200).json(report);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
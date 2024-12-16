// tests/controllers/AnalyticsController.test.ts
import { Request, Response } from 'express';
import { AnalyticsController } from '../../src/controllers/AnalyticsController';
import { AnalyticsService } from '../../src/services/AnalyticsService';
import { mockAnalytics, mockRequest, mockResponse } from '../utils/mockHelpers';

// Mock AnalyticsService
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            getAnalytics: jest.fn(),
            getLatestAnalytics: jest.fn(),
            createAnalytics: jest.fn(),
            updateAnalytics: jest.fn(),
            generateAnalyticsReport: jest.fn(),
            recordPageView: jest.fn(),
            trackEvent: jest.fn()
        })
    }
}));

// Mock Logger
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

describe('AnalyticsController', () => {
    let analyticsController: AnalyticsController;
    let mockAnalyticsService: jest.Mocked<AnalyticsService>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockAnalyticsService = AnalyticsService.getInstance() as jest.Mocked<AnalyticsService>;
        analyticsController = new AnalyticsController();
    });

    describe('getAnalytics', () => {
        it('should return analytics data successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            mockAnalyticsService.getAnalytics.mockResolvedValue([mockAnalytics]);

            await analyticsController.getAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockAnalytics]);
        });

        it('should return cached analytics if available', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const cachedData = [mockAnalytics];
            
            // First call to set cache
            mockAnalyticsService.getAnalytics.mockResolvedValue(cachedData);
            await analyticsController.getAnalytics(req as Request, res as Response);
            
            // Second call should use cache
            await analyticsController.getAnalytics(req as Request, res as Response);

            expect(mockAnalyticsService.getAnalytics).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(cachedData);
        });

        it('should handle errors appropriately', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');
            mockAnalyticsService.getAnalytics.mockRejectedValue(error);

            await analyticsController.getAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getLatestAnalytics', () => {
        it('should return latest analytics successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            mockAnalyticsService.getLatestAnalytics.mockResolvedValue(mockAnalytics);

            await analyticsController.getLatestAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnalytics);
        });

        it('should handle errors appropriately', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Database error');
            mockAnalyticsService.getLatestAnalytics.mockRejectedValue(error);

            await analyticsController.getLatestAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('generateAnalyticsReport', () => {
        it('should generate report successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockReport = {
                totalPageViews: mockAnalytics.pageViews,
                uniqueVisitors: mockAnalytics.uniqueVisitors,
                avgTimeOnSite: mockAnalytics.avgTimeOnSite,
                topProjects: mockAnalytics.mostViewedProjects,
                lastUpdated: mockAnalytics.updatedAt
            };
            mockAnalyticsService.generateAnalyticsReport.mockResolvedValue(mockReport);

            await analyticsController.generateAnalyticsReport(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReport);
        });

        it('should handle errors appropriately', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error('Report generation failed');
            mockAnalyticsService.generateAnalyticsReport.mockRejectedValue(error);

            await analyticsController.generateAnalyticsReport(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('createAnalytics', () => {
        it('should create analytics successfully', async () => {
            const req = mockRequest({
                body: {
                    pageViews: 100,
                    uniqueVisitors: 50,
                    avgTimeOnSite: '2m 30s',
                    mostViewedProjects: ['project1', 'project2']
                }
            });
            const res = mockResponse();
            mockAnalyticsService.createAnalytics.mockResolvedValue(mockAnalytics);

            await analyticsController.createAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockAnalytics);
        });

        it('should handle errors appropriately', async () => {
            const req = mockRequest({
                body: {}
            });
            const res = mockResponse();
            const error = new Error('Invalid data');
            mockAnalyticsService.createAnalytics.mockRejectedValue(error);

            await analyticsController.createAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('updateAnalytics', () => {
        it('should update analytics successfully', async () => {
            const req = mockRequest({
                params: { id: '123' },
                body: {
                    pageViews: 150,
                    uniqueVisitors: 75
                }
            });
            const res = mockResponse();
            mockAnalyticsService.updateAnalytics.mockResolvedValue(mockAnalytics);

            await analyticsController.updateAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnalytics);
        });

        it('should handle errors appropriately', async () => {
            const req = mockRequest({
                params: { id: '123' },
                body: {}
            });
            const res = mockResponse();
            const error = new Error('Analytics not found');
            mockAnalyticsService.updateAnalytics.mockRejectedValue(error);

            await analyticsController.updateAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: error.message });
        });
    });
});
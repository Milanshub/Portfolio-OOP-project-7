import { Request, Response } from 'express';
import { AnalyticsController } from '../../src/controllers/AnalyticsController';
import { mockAnalytics, mockRequest, mockResponse } from '../utils/mockHelpers';

// Mock the entire AnalyticsService class
let shouldMockError = false;

jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: jest.fn().mockImplementation(() => ({
        getAnalytics: jest.fn().mockImplementation(() => {
            if (shouldMockError) {
                return Promise.reject(new Error('Database error'));
            }
            return Promise.resolve(mockAnalytics);
        }),
        generateAnalyticsReport: jest.fn().mockResolvedValue({
            totalPageViews: mockAnalytics.pageViews,
            averageTimeSpent: '2m 30s',
            topProjects: mockAnalytics.mostViewedProjects,
            generatedAt: expect.any(Date)
        })
    }))
}));

describe('AnalyticsController', () => {
    let analyticsController: AnalyticsController;
    
    beforeEach(() => {
        analyticsController = new AnalyticsController();
        shouldMockError = false; // Reset the error flag before each test
    });

    describe('getAnalytics', () => {
        it('should return analytics data successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await analyticsController.getAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnalytics);
        });

        it('should handle errors appropriately', async () => {
            shouldMockError = true; // Enable error mocking for this test
            const req = mockRequest();
            const res = mockResponse();

            await analyticsController.getAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('generateAnalyticsReport', () => {
        it('should generate report successfully', async () => {
            const mockReport = {
                totalPageViews: mockAnalytics.pageViews,
                averageTimeSpent: '2m 30s',
                topProjects: mockAnalytics.mostViewedProjects,
                generatedAt: new Date()
            };
            const req = mockRequest();
            const res = mockResponse();

            await analyticsController.generateAnalyticsReport(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockReport);
        });
    });
});
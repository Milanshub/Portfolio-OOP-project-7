import { AnalyticsService } from '../../src/services/AnalyticsService';
import { Analytics } from '../../src/models/Analytics';
import { Logger } from '../../src/utils/logger';
import { mockAnalytics } from '../utils/mockHelpers';

// Mock Analytics model
jest.mock('../../src/models/Analytics');

// Mock Logger singleton
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => mockLogger
    }
}));

describe.skip('AnalyticsService', () => {
    let analyticsService: AnalyticsService;

    beforeEach(() => {
        jest.clearAllMocks();
        analyticsService = AnalyticsService.getInstance();
    });

    describe('getAnalytics', () => {
        it('should get all analytics successfully', async () => {
            (Analytics.prototype.findAll as jest.Mock).mockResolvedValue([mockAnalytics]);

            const result = await analyticsService.getAnalytics();

            expect(result).toEqual([mockAnalytics]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Analytics data retrieved successfully')
            );
        });

        it('should handle errors when getting analytics', async () => {
            (Analytics.prototype.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.getAnalytics())
                .rejects.toThrow('Failed to get analytics');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getLatestAnalytics', () => {
        it('should get latest analytics successfully', async () => {
            (Analytics.prototype.getLatestAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);

            const result = await analyticsService.getLatestAnalytics();

            expect(result).toEqual(mockAnalytics);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Latest analytics retrieved successfully')
            );
        });

        it('should handle errors when getting latest analytics', async () => {
            (Analytics.prototype.getLatestAnalytics as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.getLatestAnalytics())
                .rejects.toThrow('Failed to get latest analytics');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('createAnalytics', () => {
        const analyticsData = {
            pageViews: mockAnalytics.pageViews,
            uniqueVisitors: mockAnalytics.uniqueVisitors,
            avgTimeOnSite: mockAnalytics.avgTimeOnSite,
            mostViewedProjects: mockAnalytics.mostViewedProjects
        };

        it('should create analytics successfully', async () => {
            (Analytics.prototype.create as jest.Mock).mockResolvedValue(mockAnalytics);

            const result = await analyticsService.createAnalytics(analyticsData);

            expect(result).toEqual(mockAnalytics);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Analytics created successfully')
            );
        });

        it('should handle errors when creating analytics', async () => {
            (Analytics.prototype.create as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.createAnalytics(analyticsData))
                .rejects.toThrow('Failed to create analytics');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateAnalytics', () => {
        const updateData = {
            pageViews: 200,
            uniqueVisitors: 100
        };

        it('should update analytics successfully', async () => {
            (Analytics.prototype.update as jest.Mock).mockResolvedValue({ ...mockAnalytics, ...updateData });

            const result = await analyticsService.updateAnalytics(mockAnalytics.id, updateData);

            expect(result.pageViews).toBe(updateData.pageViews);
            expect(result.uniqueVisitors).toBe(updateData.uniqueVisitors);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Analytics updated successfully')
            );
        });

        it('should throw error for non-existent analytics', async () => {
            (Analytics.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(analyticsService.updateAnalytics('999', updateData))
                .rejects.toThrow('Analytics not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Analytics not found with ID')
            );
        });
    });

    describe('recordPageView', () => {
        it('should record page view successfully', async () => {
            (Analytics.prototype.incrementPageViews as jest.Mock).mockResolvedValue(undefined);

            await analyticsService.recordPageView();

            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Page view recorded successfully')
            );
        });

        it('should handle errors when recording page view', async () => {
            (Analytics.prototype.incrementPageViews as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.recordPageView())
                .rejects.toThrow('Failed to record page view');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateMostViewedProjects', () => {
        it('should update most viewed projects successfully', async () => {
            (Analytics.prototype.updateMostViewedProjects as jest.Mock).mockResolvedValue(undefined);

            await analyticsService.updateMostViewedProjects(mockAnalytics.mostViewedProjects);

            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Most viewed projects updated successfully')
            );
        });

        it('should handle errors when updating most viewed projects', async () => {
            (Analytics.prototype.updateMostViewedProjects as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.updateMostViewedProjects(mockAnalytics.mostViewedProjects))
                .rejects.toThrow('Failed to update most viewed projects');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('generateAnalyticsReport', () => {
        it('should generate analytics report successfully', async () => {
            (Analytics.prototype.getLatestAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);

            const result = await analyticsService.generateAnalyticsReport();

            expect(result).toEqual({
                totalPageViews: mockAnalytics.pageViews,
                uniqueVisitors: mockAnalytics.uniqueVisitors,
                avgTimeOnSite: mockAnalytics.avgTimeOnSite,
                topProjects: mockAnalytics.mostViewedProjects,
                lastUpdated: mockAnalytics.updatedAt
            });
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Analytics report generated successfully')
            );
        });

        it('should throw error when no analytics data available', async () => {
            (Analytics.prototype.getLatestAnalytics as jest.Mock).mockResolvedValue(null);

            await expect(analyticsService.generateAnalyticsReport())
                .rejects.toThrow('No analytics data available');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('No analytics data available for report generation')
            );
        });

        it('should handle errors when generating report', async () => {
            (Analytics.prototype.getLatestAnalytics as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.generateAnalyticsReport())
                .rejects.toThrow('Failed to generate analytics report');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
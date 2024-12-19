import { AnalyticsService } from '../../src/services/AnalyticsService';
import { AnalyticsRepository } from '../../src/respositories/AnalyticsRepository';
import { Logger } from '../../src/utils/logger';
import { mockAnalytics } from '../utils/mockHelpers';

// Mock AnalyticsRepository
jest.mock('../../src/respositories/AnalyticsRepository', () => {
    return {
        AnalyticsRepository: jest.fn().mockImplementation(() => ({
            findAll: jest.fn(),
            getLatestAnalytics: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            delete: jest.fn(),
            incrementPageViews: jest.fn(),
            updateMostViewedProjects: jest.fn(),
            createEvent: jest.fn()
        }))
    };
});

// Mock Logger
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));

describe.skip('AnalyticsService', () => {
    let analyticsService: AnalyticsService;
    let mockLogger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        // Reset singleton instance before each test
        (AnalyticsService as any).instance = null;
        analyticsService = AnalyticsService.getInstance();
    });

    describe('getAnalytics', () => {
        it('should get all analytics successfully', async () => {
            (AnalyticsRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockAnalytics]);

            const result = await analyticsService.getAnalytics();

            expect(result).toEqual([mockAnalytics]);
            expect(mockLogger.info).toHaveBeenCalledWith('Analytics data retrieved successfully');
        });

        it('should handle errors when getting analytics', async () => {
            (AnalyticsRepository.prototype.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.getAnalytics())
                .rejects.toThrow('Failed to get analytics');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getLatestAnalytics', () => {
        it('should get latest analytics successfully', async () => {
            (AnalyticsRepository.prototype.getLatestAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);

            const result = await analyticsService.getLatestAnalytics();

            expect(result).toEqual(mockAnalytics);
            expect(mockLogger.info).toHaveBeenCalledWith('Latest analytics retrieved successfully');
        });

        it('should handle errors when getting latest analytics', async () => {
            (AnalyticsRepository.prototype.getLatestAnalytics as jest.Mock).mockRejectedValue(new Error('Database error'));

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
            (AnalyticsRepository.prototype.create as jest.Mock).mockResolvedValue(mockAnalytics);

            const result = await analyticsService.createAnalytics(analyticsData);

            expect(result).toEqual(mockAnalytics);
            expect(mockLogger.info).toHaveBeenCalledWith('Analytics created successfully');
        });

        it('should handle errors when creating analytics', async () => {
            (AnalyticsRepository.prototype.create as jest.Mock).mockRejectedValue(new Error('Database error'));

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
            (AnalyticsRepository.prototype.update as jest.Mock)
                .mockResolvedValue({ ...mockAnalytics, ...updateData });

            const result = await analyticsService.updateAnalytics(mockAnalytics.id, updateData);

            expect(result.pageViews).toBe(updateData.pageViews);
            expect(result.uniqueVisitors).toBe(updateData.uniqueVisitors);
            expect(mockLogger.info).toHaveBeenCalledWith(`Analytics updated successfully: ${mockAnalytics.id}`);
        });

        it('should throw error for non-existent analytics', async () => {
            (AnalyticsRepository.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(analyticsService.updateAnalytics('999', updateData))
                .rejects.toThrow('Analytics not found');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('deleteAnalytics', () => {
        it('should delete analytics successfully', async () => {
            (AnalyticsRepository.prototype.findById as jest.Mock).mockResolvedValue(mockAnalytics);
            (AnalyticsRepository.prototype.delete as jest.Mock).mockResolvedValue(undefined);

            await analyticsService.deleteAnalytics(mockAnalytics.id);

            expect(mockLogger.info).toHaveBeenCalledWith(`Analytics deleted successfully: ${mockAnalytics.id}`);
        });

        it('should throw error for non-existent analytics', async () => {
            (AnalyticsRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(analyticsService.deleteAnalytics('999'))
                .rejects.toThrow('Analytics not found');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('recordPageView', () => {
        it('should record page view successfully', async () => {
            (AnalyticsRepository.prototype.incrementPageViews as jest.Mock).mockResolvedValue(undefined);

            await analyticsService.recordPageView();

            expect(mockLogger.info).toHaveBeenCalledWith('Page view recorded successfully');
        });

        it('should handle errors when recording page view', async () => {
            (AnalyticsRepository.prototype.incrementPageViews as jest.Mock)
                .mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.recordPageView())
                .rejects.toThrow('Failed to record page view');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateMostViewedProjects', () => {
        it('should update most viewed projects successfully', async () => {
            (AnalyticsRepository.prototype.updateMostViewedProjects as jest.Mock).mockResolvedValue(undefined);

            await analyticsService.updateMostViewedProjects(mockAnalytics.mostViewedProjects);

            expect(mockLogger.info).toHaveBeenCalledWith('Most viewed projects updated successfully');
        });

        it('should handle errors when updating most viewed projects', async () => {
            (AnalyticsRepository.prototype.updateMostViewedProjects as jest.Mock)
                .mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.updateMostViewedProjects(mockAnalytics.mostViewedProjects))
                .rejects.toThrow('Failed to update most viewed projects');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('generateAnalyticsReport', () => {
        it('should generate analytics report successfully', async () => {
            (AnalyticsRepository.prototype.getLatestAnalytics as jest.Mock).mockResolvedValue(mockAnalytics);

            const result = await analyticsService.generateAnalyticsReport();

            expect(result).toEqual({
                totalPageViews: mockAnalytics.pageViews,
                uniqueVisitors: mockAnalytics.uniqueVisitors,
                avgTimeOnSite: mockAnalytics.avgTimeOnSite,
                topProjects: mockAnalytics.mostViewedProjects,
                lastUpdated: mockAnalytics.updatedAt
            });
            expect(mockLogger.info).toHaveBeenCalledWith('Analytics report generated successfully');
        });

        it('should throw error when no analytics data available', async () => {
            (AnalyticsRepository.prototype.getLatestAnalytics as jest.Mock).mockResolvedValue(null);

            await expect(analyticsService.generateAnalyticsReport())
                .rejects.toThrow('No analytics data available');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('trackEvent', () => {
        it('should track event successfully', async () => {
            const eventName = 'test_event';
            const eventData = { test: 'data' };
            (AnalyticsRepository.prototype.createEvent as jest.Mock).mockResolvedValue(undefined);

            await analyticsService.trackEvent(eventName, eventData);

            expect(mockLogger.info).toHaveBeenCalledWith(`Event tracked: ${eventName}`, eventData);
        });

        it('should handle errors when tracking event', async () => {
            (AnalyticsRepository.prototype.createEvent as jest.Mock)
                .mockRejectedValue(new Error('Database error'));

            await expect(analyticsService.trackEvent('test_event'))
                .rejects.toThrow('Failed to track event');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
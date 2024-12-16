// tests/utils/observers/analyticsObservers.test.ts
import { AnalyticsObserver } from '../../../src/utils/observers/analyticsObservers';
import { AnalyticsService } from '../../../src/services/AnalyticsService';

// Mock AnalyticsService
jest.mock('../../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            recordPageView: jest.fn(),
            trackEvent: jest.fn(),
            getAnalytics: jest.fn(),
            getLatestAnalytics: jest.fn(),
            createAnalytics: jest.fn(),
            updateAnalytics: jest.fn(),
            generateAnalyticsReport: jest.fn()
        })
    }
}));

describe('AnalyticsObserver', () => {
    let analyticsObserver: AnalyticsObserver;
    let mockAnalyticsService: jest.Mocked<AnalyticsService>;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        // Clear all instances and mocks
        jest.clearAllMocks();
        
        // Reset singleton instance
        (AnalyticsObserver as any).instance = null;
        
        // Create new observer instance
        analyticsObserver = AnalyticsObserver.getInstance();
        
        // Get mock instance of AnalyticsService
        mockAnalyticsService = AnalyticsService.getInstance() as jest.Mocked<AnalyticsService>;
        
        // Spy on console.error
        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('getInstance', () => {
        it('should create singleton instance', () => {
            const instance1 = AnalyticsObserver.getInstance();
            const instance2 = AnalyticsObserver.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('trackPageView', () => {
        it('should track page view successfully', async () => {
            (mockAnalyticsService.recordPageView as jest.Mock).mockResolvedValue(undefined);

            await analyticsObserver.trackPageView('/home');

            expect(mockAnalyticsService.recordPageView).toHaveBeenCalled();
            expect(consoleSpy).not.toHaveBeenCalled();
        });

        it('should handle errors when tracking page view', async () => {
            const error = new Error('Failed to record page view');
            (mockAnalyticsService.recordPageView as jest.Mock).mockRejectedValue(error);

            await analyticsObserver.trackPageView('/home');

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to track page view for /home:',
                error
            );
        });
    });

    describe('trackEvent', () => {
        it('should track event successfully', async () => {
            const eventName = 'button_click';
            const eventData = { buttonId: 'submit' };
            (mockAnalyticsService.trackEvent as jest.Mock).mockResolvedValue(undefined);

            await analyticsObserver.trackEvent(eventName, eventData);

            expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith(eventName, eventData);
            expect(consoleSpy).not.toHaveBeenCalled();
        });

        it('should handle errors when tracking event', async () => {
            const error = new Error('Failed to track event');
            (mockAnalyticsService.trackEvent as jest.Mock).mockRejectedValue(error);

            await analyticsObserver.trackEvent('test_event', {});

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to track event test_event:',
                error
            );
        });
    });

    describe('trackProjectView', () => {
        it('should track project view successfully', async () => {
            const projectId = '123';
            (mockAnalyticsService.recordPageView as jest.Mock).mockResolvedValue(undefined);

            await analyticsObserver.trackProjectView(projectId);

            expect(mockAnalyticsService.recordPageView).toHaveBeenCalled();
            expect(consoleSpy).not.toHaveBeenCalled();
        });

        it('should handle errors when tracking project view', async () => {
            const projectId = '123';
            const error = new Error('Failed to track project view');
            (mockAnalyticsService.recordPageView as jest.Mock).mockRejectedValue(error);

            await analyticsObserver.trackProjectView(projectId);

            expect(consoleSpy).toHaveBeenCalledWith(
                `Failed to track project view for ${projectId}:`,
                error
            );
        });
    });

    describe('error handling', () => {
        it('should handle service initialization errors', () => {
            // Reset singleton to force new instance creation
            (AnalyticsObserver as any).instance = null;
            
            // Mock AnalyticsService getInstance to throw error
            (AnalyticsService.getInstance as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Service initialization failed');
            });

            // Expect getInstance to throw
            expect(() => AnalyticsObserver.getInstance()).toThrow('Service initialization failed');
        });
    });
});
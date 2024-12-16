// tests/app.test.ts
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import app from '../src/app';
import { Logger } from '../src/utils/logger';
import { AppError, errorHandler } from '../src/middleware/errorMiddleware';
import { AnalyticsObserver } from '../src/utils/observers/analyticsObservers';

// Mock all route imports
jest.mock('../src/routes/ProjectRoutes', () => ({
    router: express.Router()
}));
jest.mock('../src/routes/TechnologyRoutes', () => ({
    router: express.Router()
}));
jest.mock('../src/routes/ProfileRoutes', () => ({
    router: express.Router()
}));
jest.mock('../src/routes/MessageRoutes', () => ({
    router: express.Router()
}));
jest.mock('../src/routes/AnalyticsRoutes', () => ({
    router: express.Router()
}));

// Mock Logger
jest.mock('../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn()
        })
    }
}));

// Mock AnalyticsObserver
jest.mock('../src/utils/observers/analyticsObservers', () => ({
    AnalyticsObserver: {
        getInstance: jest.fn().mockReturnValue({
            trackPageView: jest.fn()
        })
    }
}));

describe('App', () => {
    const logger = Logger.getInstance();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Middleware Configuration', () => {
        it('should use CORS with correct configuration', async () => {
            const response = await request(app)
                .options('/health')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'GET');

            expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
            expect(response.statusCode).toBe(204);
        }, 10000);

        it('should log requests', async () => {
            await request(app).get('/health');
            expect(logger.info).toHaveBeenCalledWith('GET /health');
        });

        it('should parse JSON bodies', async () => {
            const response = await request(app)
                .post('/api/messages')
                .send({ test: 'data' })
                .set('Content-Type', 'application/json');

            expect(response.status).not.toBe(400);
        }, 10000);

        it('should handle URL-encoded bodies', async () => {
            const response = await request(app)
                .post('/api/messages')
                .send('test=data')
                .set('Content-Type', 'application/x-www-form-urlencoded');

            expect(response.status).not.toBe(400);
        }, 10000);
    });

    describe('Rate Limiting', () => {
        it('should apply rate limiting to API routes', async () => {
            const requests = [];
            for (let i = 0; i < 5; i++) {
                requests.push(
                    request(app)
                        .get('/api/projects')
                        .set('Origin', 'http://localhost:3000')
                );
            }

            const responses = await Promise.all(requests);
            expect(responses.every(res => res.status !== 429)).toBe(true);
        }, 15000);
    });

    describe('Health Check', () => {
        it('should return 200 OK with timestamp', async () => {
            const response = await request(app).get('/health');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('timestamp');
            expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for unknown routes', async () => {
            const testApp = express();
            testApp.use(express.json());
            
            // Mock AnalyticsObserver for this test
            const mockAnalytics = {
                trackPageView: jest.fn()
            };
            (AnalyticsObserver.getInstance as jest.Mock).mockReturnValue(mockAnalytics);
            
            // Add catch-all route
            testApp.use('*', (_req: Request, _res: Response, next: NextFunction) => {
                next(new AppError('Not Found', 404));
            });
            
            testApp.use(errorHandler);

            const response = await request(testApp)
                .get('/unknown-route')
                .set('Accept', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Not Found');
        });
    });

    describe('Error Handler', () => {
        let testApp: express.Application;

        beforeEach(() => {
            testApp = express();
            testApp.use(express.json());

            // Mock AnalyticsObserver for these tests
            const mockAnalytics = {
                trackPageView: jest.fn()
            };
            (AnalyticsObserver.getInstance as jest.Mock).mockReturnValue(mockAnalytics);

            // Test routes
            testApp.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
                next(new AppError('Test error', 400));
            });

            testApp.get('/test-generic-error', (_req: Request, _res: Response, next: NextFunction) => {
                next(new Error('Something went wrong'));
            });

            testApp.use(errorHandler);
        });

        it('should handle AppError instances', async () => {
            const response = await request(testApp)
                .get('/test-error')
                .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Test error');
        });

        it('should handle generic errors', async () => {
            const response = await request(testApp)
                .get('/test-generic-error')
                .set('Accept', 'application/json');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error', 'Something went wrong');
        });
    });

    describe('Security Headers', () => {
        it('should set security headers', async () => {
            const response = await request(app).get('/health');
            
            expect(response.headers).toHaveProperty('x-dns-prefetch-control');
            expect(response.headers).toHaveProperty('x-frame-options');
            expect(response.headers).toHaveProperty('x-download-options');
        });
    });

    describe('Compression', () => {
        it('should handle compression headers', async () => {
            const response = await request(app)
                .get('/health')
                .set('Accept-Encoding', 'gzip, deflate');
            
            expect(response.status).toBe(200);
        });
    });
});
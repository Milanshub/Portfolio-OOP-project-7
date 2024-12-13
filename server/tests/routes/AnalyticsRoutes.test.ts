import request from 'supertest';
import express from 'express';
import { router as analyticsRoutes } from '../../src/routes/AnalyticsRoutes';
import { AnalyticsController } from '../../src/controllers/AnalyticsController';
import { authenticate, requireAdmin } from '../../src/middleware/authMiddleware';

// Mock both middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: jest.fn((req, res, next) => next()),
    requireAdmin: jest.fn((req, res, next) => next())
}));

// Mock the controller methods
jest.mock('../../src/controllers/AnalyticsController', () => {
    return {
        AnalyticsController: jest.fn().mockImplementation(() => ({
            getAnalytics: jest.fn((req, res) => res.json([])),
            getLatestAnalytics: jest.fn((req, res) => res.json({})),
            generateAnalyticsReport: jest.fn((req, res) => res.json({})),
            createAnalytics: jest.fn((req, res) => res.status(201).json({})),
            updateAnalytics: jest.fn((req, res) => res.json({}))
        }))
    };
});

describe('Analytics Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/analytics', analyticsRoutes);
    });

    describe('Protected Routes', () => {
        it('GET / should get all analytics', async () => {
            const response = await request(app)
                .get('/analytics');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });

        it('GET /latest should get latest analytics', async () => {
            const response = await request(app)
                .get('/analytics/latest');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });

        it('GET /report should generate analytics report', async () => {
            const response = await request(app)
                .get('/analytics/report');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });

        it('POST / should create analytics', async () => {
            const response = await request(app)
                .post('/analytics')
                .send({ visits: 100, date: new Date().toISOString() });

            expect(response.status).toBe(201);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });

        it('PUT /:id should update analytics', async () => {
            const response = await request(app)
                .put('/analytics/1')
                .send({ visits: 150 });

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });
    });
});
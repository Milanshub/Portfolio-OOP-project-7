import request from 'supertest';
import express from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';
import { router as technologyRoutes } from '../../src/routes/TechnologyRoutes';
import { TechnologyController } from '../../src/controllers/TechnologyController';
import { authenticate } from '../../src/middleware/authMiddleware';

// Mock middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

// Mock the controller methods
jest.mock('../../src/controllers/TechnologyController', () => {
    return {
        TechnologyController: jest.fn().mockImplementation(() => ({
            getAllTechnologies: jest.fn((req, res) => res.json([])),
            getTechnologyById: jest.fn((req, res) => res.json({})),
            getTechnologiesByCategory: jest.fn((req, res) => res.json([])),
            createTechnology: jest.fn((req, res) => res.status(201).json({})),
            updateTechnology: jest.fn((req, res) => res.json({})),
            deleteTechnology: jest.fn((req, res) => res.status(204).send()),
            updateProficiencyLevel: jest.fn((req, res) => res.json({}))
        }))
    };
});

describe('Technology Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/technologies', technologyRoutes);
    });

    describe('Public Routes', () => {
        it('GET / should get all technologies', async () => {
            const response = await request(app)
                .get('/technologies');

            expect(response.status).toBe(200);
        });

        it('GET /:id should get technology by id', async () => {
            const response = await request(app)
                .get('/technologies/1');

            expect(response.status).toBe(200);
        });

        it('GET /category/:category should get technologies by category', async () => {
            const response = await request(app)
                .get('/technologies/category/FRONTEND');

            expect(response.status).toBe(200);
        });
    });

    describe('Protected Routes', () => {
        it('POST / should create technology', async () => {
            const response = await request(app)
                .post('/technologies')
                .send({ 
                    name: 'React',
                    category: 'FRONTEND',
                    proficiencyLevel: 90 
                });

            expect(response.status).toBe(201);
            expect(authenticate).toHaveBeenCalled();
        });

        it('PUT /:id should update technology', async () => {
            const response = await request(app)
                .put('/technologies/1')
                .send({ 
                    name: 'Updated React',
                    proficiencyLevel: 95 
                });

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
        });

        it('DELETE /:id should delete technology', async () => {
            const response = await request(app)
                .delete('/technologies/1');

            expect(response.status).toBe(204);
            expect(authenticate).toHaveBeenCalled();
        });

        it('PUT /:id/proficiency should update proficiency level', async () => {
            const response = await request(app)
                .put('/technologies/1/proficiency')
                .send({ level: 95 });

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
        });
    });
});
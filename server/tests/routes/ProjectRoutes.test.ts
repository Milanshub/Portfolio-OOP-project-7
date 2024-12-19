import request from 'supertest';
import express from 'express';
import { router as projectRoutes } from '../../src/routes/ProjectRoutes';
import { ProjectController } from '../../src/controllers/ProjectController';
import { authenticate, requireAdmin } from '../../src/middleware/authMiddleware';
import { validateProject } from '../../src/middleware/validationMiddleware';
import { handleUpload } from '../../src/middleware/uploadMiddleware';
import { Request, Response, NextFunction } from 'express-serve-static-core';

// Mock middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => next()),
    requireAdmin: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

jest.mock('../../src/middleware/validationMiddleware', () => ({
    validateProject: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

jest.mock('../../src/middleware/uploadMiddleware', () => ({
    handleUpload: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));

// Mock multer
jest.mock('multer', () => {
    const multer = () => ({
        single: () => (req: Request, res: Response, next: NextFunction) => next(),
        array: () => (req: Request, res: Response, next: NextFunction) => next()
    });
    multer.memoryStorage = () => ({});
    return multer;
});

// Mock the controller methods
jest.mock('../../src/controllers/ProjectController', () => {
    return {
        ProjectController: jest.fn().mockImplementation(() => ({
            getAllProjects: jest.fn((req, res) => res.json([])),
            getFeaturedProjects: jest.fn((req, res) => res.json([])),
            getProjectById: jest.fn((req, res) => res.json({})),
            createProject: jest.fn((req, res) => res.status(201).json({})),
            updateProject: jest.fn((req, res) => res.json({})),
            deleteProject: jest.fn((req, res) => res.status(200).json({ message: 'Project deleted successfully' })),
            updateThumbnail: jest.fn((req, res) => res.json({ thumbnailUrl: 'test-url' })),
            updateImages: jest.fn((req, res) => res.json({ imageUrls: ['test-url'] }))
        }))
    };
});

describe('Project Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/projects', projectRoutes);
    });

    describe('Public Routes', () => {
        it('GET / should get all projects', async () => {
            const response = await request(app)
                .get('/projects');
            expect(response.status).toBe(200);
        });

        it('GET /featured should get featured projects', async () => {
            const response = await request(app)
                .get('/projects/featured');
            expect(response.status).toBe(200);
        });

        it('GET /:id should get project by id', async () => {
            const response = await request(app)
                .get('/projects/1');
            expect(response.status).toBe(200);
        });
    });

    describe('Protected Routes', () => {
        it('POST / should create project', async () => {
            const response = await request(app)
                .post('/projects')
                .send({ title: 'Test Project', description: 'Test Description' });

            expect(response.status).toBe(201);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(validateProject).toHaveBeenCalled();
        });

        it('PUT /:id should update project', async () => {
            const response = await request(app)
                .put('/projects/1')
                .send({ title: 'Updated Project' });

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(validateProject).toHaveBeenCalled();
        });

        it('DELETE /:id should delete project', async () => {
            const response = await request(app)
                .delete('/projects/1');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(response.body).toEqual({ message: 'Project deleted successfully' });
        });
    });

    describe('File Upload Routes', () => {
        it('POST /:id/thumbnail should update thumbnail', async () => {
            const response = await request(app)
                .post('/projects/1/thumbnail')
                .attach('thumbnail', Buffer.from('test'), 'test.jpg');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(response.body).toHaveProperty('thumbnailUrl');
        });

        it('POST /:id/images should update multiple images', async () => {
            const response = await request(app)
                .post('/projects/1/images')
                .attach('images', Buffer.from('test'), 'test1.jpg')
                .attach('images', Buffer.from('test'), 'test2.jpg');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(response.body).toHaveProperty('imageUrls');
        });
    });
});
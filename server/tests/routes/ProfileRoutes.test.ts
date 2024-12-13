import request from 'supertest';
import express from 'express';
import { router as profileRoutes } from '../../src/routes/ProfileRoutes';
import { ProfileController } from '../../src/controllers/ProfileController';
import { authenticate, requireAdmin } from '../../src/middleware/authMiddleware';
import { validateProfile } from '../../src/middleware/validationMiddleware';
import { handleUpload } from '../../src/middleware/uploadMiddleware';
import { Request, Response, NextFunction } from 'express-serve-static-core';

// Mock all middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: jest.fn((req: Request, res: Response, next: NextFunction) => next()),
    requireAdmin: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

jest.mock('../../src/middleware/validationMiddleware', () => ({
    validateProfile: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

jest.mock('../../src/middleware/uploadMiddleware', () => ({
    handleUpload: jest.fn(() => (req: Request, res: Response, next: NextFunction) => next())
}));

// Mock multer
// Update multer mock
jest.mock('multer', () => {
    const multer = () => ({
        single: () => (req: Request, res: Response, next: NextFunction) => next()
    });
    multer.memoryStorage = () => ({});
    return multer;
});

// Mock the controller methods
jest.mock('../../src/controllers/ProfileController', () => {
    return {
        ProfileController: jest.fn().mockImplementation(() => ({
            getProfile: jest.fn((req, res) => res.json({})),
            updateProfile: jest.fn((req, res) => res.json({})),
            uploadAvatar: jest.fn((req, res) => res.json({ avatarUrl: 'test-url' })),
            uploadResume: jest.fn((req, res) => res.json({ resumeUrl: 'test-url' }))
        }))
    };
});

describe('Profile Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/profile', profileRoutes);
    });

    describe('Public Routes', () => {
        it('GET / should get profile', async () => {
            const response = await request(app)
                .get('/profile');

            expect(response.status).toBe(200);
        });
    });

    describe('Protected Routes', () => {
        it('PUT / should update profile', async () => {
            const response = await request(app)
                .put('/profile')
                .send({ name: 'Test', email: 'test@example.com' });

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(validateProfile).toHaveBeenCalled();
        });

        it('POST /avatar should upload avatar', async () => {
            const response = await request(app)
                .post('/profile/avatar')
                .attach('avatar', Buffer.from('test'), 'test.jpg');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(response.body).toHaveProperty('avatarUrl');
        });

        it('POST /resume should upload resume', async () => {
            const response = await request(app)
                .post('/profile/resume')
                .attach('resume', Buffer.from('test'), 'test.pdf');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
            expect(response.body).toHaveProperty('resumeUrl');
        });
    });
});
import request from 'supertest';
import express from 'express';
import { adminRoutes } from '../../src/routes/AdminRoutes';
import { AdminController } from '../../src/controllers/AdminController';
import { authenticate, requireAdmin } from '../../src/middleware/authMiddleware';

// Mock both middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: jest.fn((req, res, next) => next()),
    requireAdmin: jest.fn((req, res, next) => next())
}));

// Mock the controller methods
jest.mock('../../src/controllers/AdminController', () => {
    return {
        AdminController: jest.fn().mockImplementation(() => ({
            login: jest.fn((req, res) => res.json({ token: 'test-token' })),
            createAdmin: jest.fn((req, res) => res.status(201).json({})),
            updateAdmin: jest.fn((req, res) => res.json({})),
            deleteAdmin: jest.fn((req, res) => res.status(204).send())
        }))
    };
});

describe('Admin Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/admin', adminRoutes);
    });

    describe('Public Routes', () => {
        it('POST /login should authenticate admin', async () => {
            const response = await request(app)
                .post('/admin/login')
                .send({ email: 'admin@example.com', password: 'password' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        
    });

    describe('Protected Routes', () => {
        it('POST / should create admin', async () => {
            const response = await request(app)
                .post('/admin')
                .send({ email: 'new@example.com', password: 'password' });

            expect(response.status).toBe(201);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });

        it('PUT /:id should update admin', async () => {
            const response = await request(app)
                .put('/admin/1')
                .send({ email: 'updated@example.com' });

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });

        it('DELETE /:id should delete admin', async () => {
            const response = await request(app)
                .delete('/admin/1');

            expect(response.status).toBe(204);
            expect(authenticate).toHaveBeenCalled();
            expect(requireAdmin).toHaveBeenCalled();
        });
    });
});
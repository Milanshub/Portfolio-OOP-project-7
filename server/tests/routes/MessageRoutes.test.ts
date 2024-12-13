import request from 'supertest';
import express from 'express';
import { router as messageRoutes } from '../../src/routes/MessageRoutes';
import { MessageController } from '../../src/controllers/MessageController';
import { authenticate } from '../../src/middleware/authMiddleware';

// Mock the auth middleware
jest.mock('../../src/middleware/authMiddleware', () => ({
    authenticate: jest.fn((req, res, next) => next())
}));

// Mock the controller methods
jest.mock('../../src/controllers/MessageController', () => {
    return {
        MessageController: jest.fn().mockImplementation(() => ({
            getAllMessages: jest.fn((req, res) => res.json([])),
            getUnreadMessages: jest.fn((req, res) => res.json([])),
            getUnreadCount: jest.fn((req, res) => res.json({ count: 0 })),
            createMessage: jest.fn((req, res) => res.status(201).json({})),
            markAsRead: jest.fn((req, res) => res.json({})),
            deleteMessage: jest.fn((req, res) => res.status(204).send())
        }))
    };
});

describe('Message Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/messages', messageRoutes);
    });

    describe('Public Routes', () => {
        it('POST / should create a message', async () => {
            const response = await request(app)
                .post('/messages')
                .send({ name: 'Test', email: 'test@example.com', message: 'Hello' });

            expect(response.status).toBe(201);
        });
    });

    describe('Protected Routes', () => {
        it('GET / should get all messages', async () => {
            const response = await request(app)
                .get('/messages');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
        });

        it('GET /unread should get unread messages', async () => {
            const response = await request(app)
                .get('/messages/unread');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
        });

        it('GET /unread/count should get unread count', async () => {
            const response = await request(app)
                .get('/messages/unread/count');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
        });

        it('PUT /:id/read should mark message as read', async () => {
            const response = await request(app)
                .put('/messages/1/read');

            expect(response.status).toBe(200);
            expect(authenticate).toHaveBeenCalled();
        });

        it('DELETE /:id should delete message', async () => {
            const response = await request(app)
                .delete('/messages/1');

            expect(response.status).toBe(204);
            expect(authenticate).toHaveBeenCalled();
        });
    });
});
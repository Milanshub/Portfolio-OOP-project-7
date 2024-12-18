import { Request, Response } from 'express';
import { MessageController } from '../../src/controllers/MessageController';
import { MessageService } from '../../src/services/MessageService';
import { mockRequest, mockResponse, mockMessage } from '../utils/mockHelpers';
import { messageValidator } from '../../src/utils/validators/messageValidator';

// Mock dependencies
jest.mock('../../src/services/MessageService');
jest.mock('../../src/utils/validators/messageValidator', () => ({
    messageValidator: {
        validateCreate: jest.fn((data) => {
            const errors = [];
            if (!data.senderName) errors.push('Sender name is required');
            if (!data.senderEmail || !data.senderEmail.includes('@')) errors.push('Invalid email format');
            if (!data.message) errors.push('Message content is required');
            return errors;
        })
    }
}));

// Mock Cache
const mockCacheData: { [key: string]: any } = {};
jest.mock('../../src/utils/cache', () => ({
    Cache: jest.fn().mockImplementation(() => ({
        get: jest.fn((key: string) => mockCacheData[key]),
        set: jest.fn((key: string, value: any) => {
            mockCacheData[key] = value;
            return true;
        }),
        clear: jest.fn(() => {
            Object.keys(mockCacheData).forEach(key => delete mockCacheData[key]);
        })
    }))
}));

// Mock Logger
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

// Mock Resend
jest.mock('resend', () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ id: 'mock-email-id' })
        }
    }))
}));

describe('MessageController', () => {
    let messageController: MessageController;

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(mockCacheData).forEach(key => delete mockCacheData[key]);
        messageController = new MessageController();
    });

    describe('getAllMessages', () => {
        it('should return all messages successfully', async () => {
            const mockMessages = [mockMessage];
            jest.spyOn(MessageService.prototype, 'getAllMessages')
                .mockResolvedValue(mockMessages);

            const req = mockRequest();
            const res = mockResponse();

            await messageController.getAllMessages(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMessages);
        });

        it('should serve from cache if available', async () => {
            const mockMessages = [mockMessage];
            const req = mockRequest();
            const res = mockResponse();

            // First call to populate cache
            jest.spyOn(MessageService.prototype, 'getAllMessages')
                .mockResolvedValue(mockMessages);
            await messageController.getAllMessages(req as Request, res as Response);

            // Reset response mock
            (res.json as jest.Mock).mockClear();
            (res.status as jest.Mock).mockClear();

            // Second call should use cache
            await messageController.getAllMessages(req as Request, res as Response);

            expect(MessageService.prototype.getAllMessages).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockMessages);
        });

        it('should handle errors appropriately', async () => {
            jest.spyOn(MessageService.prototype, 'getAllMessages')
                .mockRejectedValue(new Error('Database error'));

            const req = mockRequest();
            const res = mockResponse();

            await messageController.getAllMessages(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('createMessage', () => {
        it('should create message successfully', async () => {
            const req = mockRequest({
                body: {
                    senderName: 'John Doe',
                    senderEmail: 'john@example.com',
                    message: 'Test Message'
                }
            });
            const res = mockResponse();

            jest.spyOn(MessageService.prototype, 'createMessage')
                .mockResolvedValue(mockMessage);

            await messageController.createMessage(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockMessage);
        });

        it('should validate message data', async () => {
            const req = mockRequest({
                body: {
                    senderName: '',
                    senderEmail: 'invalid-email',
                    message: ''
                }
            });
            const res = mockResponse();

            await messageController.createMessage(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    'Sender name is required',
                    'Invalid email format',
                    'Message content is required'
                ])
            });
        });
    });

    describe('markAsRead', () => {
        it('should mark message as read successfully', async () => {
            const updatedMessage = { ...mockMessage, read: true };
            jest.spyOn(MessageService.prototype, 'markAsRead')
                .mockResolvedValue(updatedMessage);

            const req = mockRequest({
                params: { id: '1' }
            });
            const res = mockResponse();

            await messageController.markAsRead(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedMessage);
        });

        it('should handle not found error', async () => {
            jest.spyOn(MessageService.prototype, 'markAsRead')
                .mockRejectedValue(new Error('Message not found'));

            const req = mockRequest({
                params: { id: 'non-existent' }
            });
            const res = mockResponse();

            await messageController.markAsRead(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Message not found' });
        });
    });

    describe('getUnreadMessages', () => {
        it('should return unread messages successfully', async () => {
            const unreadMessages = [mockMessage];
            jest.spyOn(MessageService.prototype, 'getUnreadMessages')
                .mockResolvedValue(unreadMessages);

            const req = mockRequest();
            const res = mockResponse();

            await messageController.getUnreadMessages(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(unreadMessages);
        });

        it('should serve from cache if available', async () => {
            const unreadMessages = [mockMessage];
            const req = mockRequest();
            const res = mockResponse();

            jest.spyOn(MessageService.prototype, 'getUnreadMessages')
                .mockResolvedValue(unreadMessages);

            // First call to populate cache
            await messageController.getUnreadMessages(req as Request, res as Response);

            // Reset response mock
            (res.json as jest.Mock).mockClear();
            (res.status as jest.Mock).mockClear();

            // Second call should use cache
            await messageController.getUnreadMessages(req as Request, res as Response);

            expect(MessageService.prototype.getUnreadMessages).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(unreadMessages);
        });
    });

    describe('getUnreadCount', () => {
        it('should return unread count successfully', async () => {
            jest.spyOn(MessageService.prototype, 'getUnreadCount')
                .mockResolvedValue(5);

            const req = mockRequest();
            const res = mockResponse();

            await messageController.getUnreadCount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ count: 5 });
        });

        it('should serve from cache if available', async () => {
            const req = mockRequest();
            const res = mockResponse();

            jest.spyOn(MessageService.prototype, 'getUnreadCount')
                .mockResolvedValue(5);

            // First call to populate cache
            await messageController.getUnreadCount(req as Request, res as Response);

            // Reset response mock
            (res.json as jest.Mock).mockClear();
            (res.status as jest.Mock).mockClear();

            // Second call should use cache
            await messageController.getUnreadCount(req as Request, res as Response);

            expect(MessageService.prototype.getUnreadCount).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ count: 5 });
        });
    });

    describe('deleteMessage', () => {
        it('should delete message successfully', async () => {
            jest.spyOn(MessageService.prototype, 'deleteMessage')
                .mockResolvedValue(true);

            const req = mockRequest({
                params: { id: '1' }
            });
            const res = mockResponse();

            await messageController.deleteMessage(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted successfully' });
        });

        it('should handle not found error', async () => {
            jest.spyOn(MessageService.prototype, 'deleteMessage')
                .mockRejectedValue(new Error('Message not found'));

            const req = mockRequest({
                params: { id: 'non-existent' }
            });
            const res = mockResponse();

            await messageController.deleteMessage(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Message not found' });
        });
    });
});
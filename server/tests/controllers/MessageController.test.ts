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

describe('MessageController', () => {
    let messageController: MessageController;


    beforeEach(() => {
        jest.clearAllMocks();
        messageController = new MessageController();
    });

    describe('getAllMessages', () => {
        it('should return all messages successfully', async () => {
            const mockMessages = [mockMessage];
            jest.spyOn(MessageService.prototype, 'getAllMessages')
                .mockResolvedValue([mockMessage]);

            const req = mockRequest();
            const res = mockResponse();

            await messageController.getAllMessages(req as Request, res as Response);

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
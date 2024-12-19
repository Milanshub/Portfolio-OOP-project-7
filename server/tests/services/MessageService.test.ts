import { MessageService } from '../../src/services/MessageService';
import { MessageRepository } from '../../src/respositories/MessageRepository';
import { Logger } from '../../src/utils/logger';
import { emailValidator } from '../../src/utils/validators/emailValidator';
import { mockMessage } from '../utils/mockHelpers';

// Mock all dependencies
jest.mock('../../src/respositories/MessageRepository');
jest.mock('../../src/utils/validators/emailValidator');
jest.mock('resend', () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ id: 'mock-email-id' })
        }
    }))
}));
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));

// Mock environment variables
process.env.RESEND_API_KEY = 'mock-resend-key';

describe('MessageService', () => {
    let messageService: MessageService;
    let mockLogger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.ADMIN_EMAIL = 'admin@test.com';
        mockLogger = Logger.getInstance();
        messageService = new MessageService();
        
        // Setup email validator mock
        (emailValidator.isValidEmail as jest.Mock).mockReturnValue(true);
    });

    afterEach(() => {
        delete process.env.ADMIN_EMAIL;
    });

    describe('getAllMessages', () => {
        it('should get all messages successfully', async () => {
            (MessageRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockMessage]);

            const result = await messageService.getAllMessages();

            expect(result).toEqual([mockMessage]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('All messages retrieved successfully')
            );
        });

        it('should handle errors when getting messages', async () => {
            (MessageRepository.prototype.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(messageService.getAllMessages())
                .rejects.toThrow('Failed to get messages');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getUnreadMessages', () => {
        it('should get unread messages successfully', async () => {
            (MessageRepository.prototype.findAllUnread as jest.Mock).mockResolvedValue([mockMessage]);

            const result = await messageService.getUnreadMessages();

            expect(result).toEqual([mockMessage]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Unread messages retrieved successfully')
            );
        });

        it('should handle errors when getting unread messages', async () => {
            (MessageRepository.prototype.findAllUnread as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(messageService.getUnreadMessages())
                .rejects.toThrow('Failed to get unread messages');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getUnreadCount', () => {
        it('should get unread count successfully', async () => {
            (MessageRepository.prototype.getUnreadCount as jest.Mock).mockResolvedValue(5);

            const result = await messageService.getUnreadCount();

            expect(result).toBe(5);
            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.stringContaining('Current unread message count: 5')
            );
        });

        it('should handle errors when getting unread count', async () => {
            (MessageRepository.prototype.getUnreadCount as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(messageService.getUnreadCount())
                .rejects.toThrow('Failed to get unread count');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('createMessage', () => {
        const validMessageData = {
            senderName: mockMessage.senderName,
            senderEmail: mockMessage.senderEmail,
            subject: mockMessage.subject,
            message: mockMessage.message
        };

        it('should create message successfully', async () => {
            (MessageRepository.prototype.create as jest.Mock).mockResolvedValue(mockMessage);

            const result = await messageService.createMessage(validMessageData);

            expect(result).toEqual(mockMessage);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('New message created from')
            );
        });

        it('should throw error for invalid email format', async () => {
            (emailValidator.isValidEmail as jest.Mock).mockReturnValue(false);

            await expect(messageService.createMessage({
                ...validMessageData,
                senderEmail: 'invalid-email'
            })).rejects.toThrow('Invalid email format');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Invalid email format attempted')
            );
        });

        it('should throw error for empty name', async () => {
            await expect(messageService.createMessage({
                ...validMessageData,
                senderName: ''
            })).rejects.toThrow('Name and message are required');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('missing required fields')
            );
        });

        it('should throw error for empty message', async () => {
            await expect(messageService.createMessage({
                ...validMessageData,
                message: ''
            })).rejects.toThrow('Name and message are required');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('missing required fields')
            );
        });

        it.skip('should handle email notification failure', async () => {
            const { Resend } = require('resend');
            const mockResendInstance = new Resend();
            mockResendInstance.emails.send.mockRejectedValueOnce(new Error('Email sending failed'));
            
            (MessageRepository.prototype.create as jest.Mock).mockResolvedValue(mockMessage);

            await expect(messageService.createMessage(validMessageData))
                .rejects.toThrow('Failed to create message: Email sending failed');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('markAsRead', () => {
        it('should mark message as read successfully', async () => {
            (MessageRepository.prototype.markAsRead as jest.Mock).mockResolvedValue(mockMessage);

            const result = await messageService.markAsRead(mockMessage.id);

            expect(result).toEqual(mockMessage);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Message marked as read')
            );
        });

        it('should throw error for non-existent message', async () => {
            (MessageRepository.prototype.markAsRead as jest.Mock).mockResolvedValue(null);

            await expect(messageService.markAsRead('999'))
                .rejects.toThrow('Message not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Attempted to mark non-existent message as read')
            );
        });
    });

    describe('deleteMessage', () => {
        it('should delete message successfully', async () => {
            (MessageRepository.prototype.findById as jest.Mock).mockResolvedValue(mockMessage);
            (MessageRepository.prototype.delete as jest.Mock).mockResolvedValue(true);

            const result = await messageService.deleteMessage(mockMessage.id);

            expect(result).toBe(true);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Message deleted successfully')
            );
        });

        it('should throw error for non-existent message', async () => {
            (MessageRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(messageService.deleteMessage('999'))
                .rejects.toThrow('Message not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Attempted to delete non-existent message')
            );
        });
    });
});
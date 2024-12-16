import { MessageService } from '../../src/services/MessageService';
import { Message } from '../../src/models/Message';
import { Logger } from '../../src/utils/logger';
import { emailValidator } from '../../src/utils/validators/emailValidator';
import { mockMessage } from '../utils/mockHelpers';

// Mock all dependencies
jest.mock('../../src/models/Message');
jest.mock('../../src/utils/validators/emailValidator');

// Mock Logger singleton
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => mockLogger
    }
}));

describe('MessageService', () => {
    let messageService: MessageService;

    beforeEach(() => {
        jest.clearAllMocks();
        messageService = new MessageService();
        
        // Setup email validator mock
        (emailValidator.isValidEmail as jest.Mock).mockReturnValue(true);
    });

    describe('getAllMessages', () => {
        it('should get all messages successfully', async () => {
            (Message.prototype.findAll as jest.Mock).mockResolvedValue([mockMessage]);

            const result = await messageService.getAllMessages();

            expect(result).toEqual([mockMessage]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('All messages retrieved successfully')
            );
        });

        it('should handle errors when getting messages', async () => {
            (Message.prototype.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(messageService.getAllMessages())
                .rejects.toThrow('Failed to get messages');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getUnreadMessages', () => {
        it('should get unread messages successfully', async () => {
            (Message.prototype.findAllUnread as jest.Mock).mockResolvedValue([mockMessage]);

            const result = await messageService.getUnreadMessages();

            expect(result).toEqual([mockMessage]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Unread messages retrieved successfully')
            );
        });

        it('should handle errors when getting unread messages', async () => {
            (Message.prototype.findAllUnread as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(messageService.getUnreadMessages())
                .rejects.toThrow('Failed to get unread messages');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getUnreadCount', () => {
        it('should get unread count successfully', async () => {
            (Message.prototype.getUnreadCount as jest.Mock).mockResolvedValue(5);

            const result = await messageService.getUnreadCount();

            expect(result).toBe(5);
            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.stringContaining('Current unread message count: 5')
            );
        });

        it('should handle errors when getting unread count', async () => {
            (Message.prototype.getUnreadCount as jest.Mock).mockRejectedValue(new Error('Database error'));

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
            (Message.prototype.create as jest.Mock).mockResolvedValue(mockMessage);

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
    });

    describe('markAsRead', () => {
        it('should mark message as read successfully', async () => {
            (Message.prototype.markAsRead as jest.Mock).mockResolvedValue(mockMessage);

            const result = await messageService.markAsRead(mockMessage.id);

            expect(result).toEqual(mockMessage);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Message marked as read')
            );
        });

        it('should throw error for non-existent message', async () => {
            (Message.prototype.markAsRead as jest.Mock).mockResolvedValue(null);

            await expect(messageService.markAsRead('999'))
                .rejects.toThrow('Message not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Attempted to mark non-existent message as read')
            );
        });
    });

    describe('deleteMessage', () => {
        it('should delete message successfully', async () => {
            (Message.prototype.findById as jest.Mock).mockResolvedValue(mockMessage);
            (Message.prototype.delete as jest.Mock).mockResolvedValue(true);

            const result = await messageService.deleteMessage(mockMessage.id);

            expect(result).toBe(true);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Message deleted successfully')
            );
        });

        it('should throw error for non-existent message', async () => {
            (Message.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(messageService.deleteMessage('999'))
                .rejects.toThrow('Message not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Attempted to delete non-existent message')
            );
        });
    });
});
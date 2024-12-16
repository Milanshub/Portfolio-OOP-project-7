// tests/utils/validators/messageValidator.test.ts
import { messageValidator } from '../../../src/utils/validators/messageValidator';
import { ICreateMessage } from '../../../src/types/entities';
import { stringHelpers } from '../../../src/utils/helpers/stringHelpers';
import { mockMessage } from '../mockHelpers';

// Mock stringHelpers
jest.mock('../../../src/utils/helpers/stringHelpers', () => ({
    stringHelpers: {
        isValidEmail: jest.fn()
    }
}));

describe('messageValidator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (stringHelpers.isValidEmail as jest.Mock).mockReturnValue(true);
    });

    describe('validateCreate', () => {
        // Use mockMessage to create valid message data
        const validMessage: ICreateMessage = {
            senderName: mockMessage.senderName,
            senderEmail: mockMessage.senderEmail,
            subject: mockMessage.subject,
            message: mockMessage.message
        };

        it('should return empty array for valid message', () => {
            const errors = messageValidator.validateCreate(validMessage);
            expect(errors).toEqual([]);
        });

        it('should validate required sender name', () => {
            const invalidMessage = { ...validMessage, senderName: '' };
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Sender name is required');
        });

        it('should validate required sender email', () => {
            const invalidMessage = { ...validMessage, senderEmail: '' };
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Sender email is required');
        });

        it('should validate required subject', () => {
            const invalidMessage = { ...validMessage, subject: '' };
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Subject is required');
        });

        it('should validate email format', () => {
            (stringHelpers.isValidEmail as jest.Mock).mockReturnValue(false);
            const invalidMessage = { ...validMessage, senderEmail: 'invalid-email' };
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Invalid email format');
        });

        it('should validate required message content', () => {
            const invalidMessage = { ...validMessage, message: '' };
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Message content is required');
        });

        it('should handle whitespace-only values', () => {
            const invalidMessage: ICreateMessage = {
                senderName: '   ',
                senderEmail: '   ',
                subject: '   ',
                message: '   '
            };
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Sender name is required');
            expect(errors).toContain('Sender email is required');
            expect(errors).toContain('Subject is required');
            expect(errors).toContain('Message content is required');
        });

        it('should handle undefined values', () => {
            const invalidMessage = {} as ICreateMessage;
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Sender name is required');
            expect(errors).toContain('Sender email is required');
            expect(errors).toContain('Subject is required');
            expect(errors).toContain('Message content is required');
        });

        it('should handle null values', () => {
            const invalidMessage = {
                senderName: null,
                senderEmail: null,
                subject: null,
                message: null
            } as unknown as ICreateMessage;
            
            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toContain('Sender name is required');
            expect(errors).toContain('Sender email is required');
            expect(errors).toContain('Subject is required');
            expect(errors).toContain('Message content is required');
        });

        it('should validate multiple errors simultaneously', () => {
            const invalidMessage: ICreateMessage = {
                senderName: '',
                senderEmail: 'invalid-email',
                subject: '',
                message: ''
            };
            (stringHelpers.isValidEmail as jest.Mock).mockReturnValue(false);

            const errors = messageValidator.validateCreate(invalidMessage);
            expect(errors).toHaveLength(4);
            expect(errors).toContain('Sender name is required');
            expect(errors).toContain('Invalid email format');
            expect(errors).toContain('Subject is required');
            expect(errors).toContain('Message content is required');
        });
    });
});
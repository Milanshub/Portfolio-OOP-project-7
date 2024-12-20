import { MessageRepository } from '../../src/respositories/MessageRepository';
import { supabase } from '../../src/config/supabase';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockMessage } from '../utils/mockHelpers';

// Mock dependencies
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(),
                    order: jest.fn()
                })),
                single: jest.fn(),
                order: jest.fn(() => ({
                    limit: jest.fn(() => ({
                        single: jest.fn()
                    }))
                })),
                count: jest.fn()
            })),
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn()
                }))
            })),
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn()
                    }))
                }))
            })),
            delete: jest.fn(() => ({
                eq: jest.fn()
            }))
        }))
    }
}));

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            error: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

describe('Message Model', () => {
    let messageModel: MessageRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        messageModel = new MessageRepository();
    });

    describe('CRUD Operations', () => {
        it('should find all messages', async () => {
            const mockData = [mockMessage];
            const orderMock = jest.fn().mockReturnValue({
                data: mockData,
                error: null
            });
            
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    order: orderMock
                })
            });

            const result = await messageModel.findAll();

            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('messages');
        });

        it('should find message by id', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: mockMessage, 
                error: null 
            });
            const eqMock = jest.fn().mockReturnValue({ single: singleMock });
            const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await messageModel.findById('1');

            expect(result).toEqual(mockMessage);
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should create new message', async () => {
            const newMessage = {
                senderName: 'Test Sender',
                sender_email: 'test@example.com',
                subject: 'Test Subject',
                message: 'Test Message'
            };

            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...newMessage, id: '2' }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const insertMock = jest.fn().mockReturnValue({ select: selectMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: insertMock
            });

            const result = await messageModel.create(newMessage);

            expect(result).toHaveProperty('id', '2');
            expect(insertMock).toHaveBeenCalledWith({
                ...newMessage,
                created_at: expect.any(Date),
                read: false
            });
        });

        it('should update message', async () => {
            const updateData = { read: true };

            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...mockMessage, ...updateData }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const eqMock = jest.fn().mockReturnValue({ select: selectMock });
            const updateMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: updateMock
            });

            const result = await messageModel.update('1', updateData);

            expect(result).toEqual({ ...mockMessage, ...updateData });
            expect(updateMock).toHaveBeenCalledWith(updateData);
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should delete message', async () => {
            const eqMock = jest.fn().mockResolvedValueOnce({ error: null });
            const deleteMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                delete: deleteMock
            });

            const result = await messageModel.delete('1');

            expect(result).toBe(true);
            expect(deleteMock).toHaveBeenCalled();
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });
    });

    describe('Message-specific methods', () => {
        it('should mark message as read', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...mockMessage, read: true }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const eqMock = jest.fn().mockReturnValue({ select: selectMock });
            const updateMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: updateMock
            });

            const result = await messageModel.markAsRead('1');

            expect(result).toEqual({ ...mockMessage, read: true });
            expect(updateMock).toHaveBeenCalledWith({ read: true });
        });

        it('should get unread count', async () => {
            // Setup the complete mock chain
            const mockResponse = {
                data: [],
                count: 5,
                error: null
            };
        
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue(mockResponse)
                })
            });
        
            const result = await messageModel.getUnreadCount();
        
            expect(result).toBe(5);
            expect(supabase.from).toHaveBeenCalledWith('messages');
        });

        it('should find all unread messages', async () => {
            const mockUnreadMessages = [mockMessage];
            const orderMock = jest.fn().mockReturnValue({
                data: mockUnreadMessages,
                error: null
            });
            const eqMock = jest.fn().mockReturnValue({ order: orderMock });
            const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await messageModel.findAllUnread();

            expect(result).toEqual(mockUnreadMessages);
            expect(eqMock).toHaveBeenCalledWith('read', false);
            expect(orderMock).toHaveBeenCalledWith('created_at', { ascending: false });
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors', async () => {
            const selectMock = jest.fn().mockResolvedValueOnce({ 
                data: null, 
                error: new Error('Database error') 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            await expect(messageModel.findAll())
                .rejects
                .toThrow(AppError);
        });
    });
});
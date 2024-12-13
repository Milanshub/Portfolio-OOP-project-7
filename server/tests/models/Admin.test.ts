import { Admin } from '../../src/models/Admin';
import { supabase } from '../../src/config/supabase';
import { AppError } from '../../src/middleware/errorMiddleware';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn()
                })),
                single: jest.fn(),
                order: jest.fn()
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

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true)
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

describe('Admin Model', () => {
    let adminModel: Admin;
    const mockAdmin = {
        id: '1',
        email: 'admin@test.com',
        password: 'password123',
        lastLogin: new Date()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        adminModel = new Admin();
    });

    describe('CRUD Operations', () => {
        it('should find all admins', async () => {
            const mockData = [mockAdmin];
            const selectMock = jest.fn().mockResolvedValueOnce({ 
                data: mockData, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await adminModel.findAll();

            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('admins');
            expect(selectMock).toHaveBeenCalledWith('*');
        });

        it('should find admin by id', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: mockAdmin, 
                error: null 
            });
            const eqMock = jest.fn().mockReturnValue({ single: singleMock });
            const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await adminModel.findById('1');

            expect(result).toEqual(mockAdmin);
            expect(supabase.from).toHaveBeenCalledWith('admins');
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should create new admin', async () => {
            const newAdmin = {
                email: 'new@test.com',
                password: 'newpass123'
            };

            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...newAdmin, id: '2' }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const insertMock = jest.fn().mockReturnValue({ select: selectMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: insertMock
            });

            const result = await adminModel.create(newAdmin);

            expect(result).toHaveProperty('id', '2');
            expect(bcrypt.hash).toHaveBeenCalledWith(newAdmin.password, 10);
            expect(insertMock).toHaveBeenCalledWith({
                ...newAdmin,
                password: 'hashedPassword'
            });
        });

        it('should update admin', async () => {
            const updateData = { email: 'updated@test.com' };

            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...mockAdmin, ...updateData }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const eqMock = jest.fn().mockReturnValue({ select: selectMock });
            const updateMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: updateMock
            });

            const result = await adminModel.update('1', updateData);

            expect(result).toEqual({ ...mockAdmin, ...updateData });
            expect(updateMock).toHaveBeenCalledWith(updateData);
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should delete admin', async () => {
            const eqMock = jest.fn().mockResolvedValueOnce({ error: null });
            const deleteMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                delete: deleteMock
            });

            const result = await adminModel.delete('1');

            expect(result).toBe(true);
            expect(deleteMock).toHaveBeenCalled();
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });
    });

    describe('Admin-specific methods', () => {
        it('should find admin by email', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: mockAdmin, 
                error: null 
            });
            const eqMock = jest.fn().mockReturnValue({ single: singleMock });
            const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await adminModel.findByEmail('admin@test.com');

            expect(result).toEqual(mockAdmin);
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(eqMock).toHaveBeenCalledWith('email', 'admin@test.com');
        });

        it('should update last login', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: mockAdmin, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const eqMock = jest.fn().mockReturnValue({ select: selectMock });
            const updateMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: updateMock
            });

            const result = await adminModel.updateLastLogin('1');

            expect(result).toEqual(mockAdmin);
            expect(updateMock).toHaveBeenCalledWith({ lastLogin: expect.any(Date) });
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should validate password', async () => {
            const result = await adminModel.validatePassword(
                'password123', 
                'hashedPassword'
            );

            expect(result).toBe(true);
            expect(bcrypt.compare)
                .toHaveBeenCalledWith('password123', 'hashedPassword');
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

            await expect(adminModel.findAll())
                .rejects
                .toThrow(AppError);
        });

        it('should handle password validation errors', async () => {
            const validationError = new Error('Validation failed');
            (bcrypt.compare as jest.Mock).mockRejectedValueOnce(validationError);
    
            const result = adminModel.validatePassword('pass', 'hash');
    
            await expect(result).rejects.toThrow(AppError);
            await expect(result).rejects.toThrow('Password validation error: Validation failed');
        });
    });
});
import { AdminService } from '../../src/services/AdminService';
import { Admin } from '../../src/models/Admin';
import { Logger } from '../../src/utils/logger';
import { emailValidator } from '../../src/utils/validators/emailValidator';
import jwt from 'jsonwebtoken';
import { mockAdmin } from '../utils/mockHelpers';

// Mock all dependencies
jest.mock('../../src/models/Admin');
jest.mock('jsonwebtoken');
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

describe('AdminService', () => {
    let adminService: AdminService;

    beforeEach(() => {
        jest.clearAllMocks();
        adminService = new AdminService();
        
        // Setup email validator mock
        (emailValidator.isValidEmail as jest.Mock).mockReturnValue(true);
    });

    describe('login', () => {
        it('should successfully login admin', async () => {
            (Admin.prototype.findByEmail as jest.Mock).mockResolvedValue(mockAdmin);
            (Admin.prototype.validatePassword as jest.Mock).mockResolvedValue(true);
            (Admin.prototype.updateLastLogin as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mock-token');

            const result = await adminService.login('test@example.com', 'password');

            expect(result).toHaveProperty('admin');
            expect(result).toHaveProperty('token', 'mock-token');
            expect(Admin.prototype.updateLastLogin).toHaveBeenCalledWith(mockAdmin.id);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Admin logged in successfully')
            );
        });

        it('should throw error for non-existent admin', async () => {
            (Admin.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(adminService.login('nonexistent@example.com', 'password'))
                .rejects.toThrow('Invalid credentials');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Failed login attempt')
            );
        });

        it('should throw error for invalid password', async () => {
            (Admin.prototype.findByEmail as jest.Mock).mockResolvedValue(mockAdmin);
            (Admin.prototype.validatePassword as jest.Mock).mockResolvedValue(false);

            await expect(adminService.login('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid credentials');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Invalid password attempt')
            );
        });
    });

    describe('createAdmin', () => {
        it('should create new admin successfully', async () => {
            const adminData = {
                email: 'new@example.com',
                password: 'password'
            };

            (Admin.prototype.findByEmail as jest.Mock).mockResolvedValue(null);
            (Admin.prototype.create as jest.Mock).mockResolvedValue({ ...mockAdmin, ...adminData });

            const result = await adminService.createAdmin(adminData);

            expect(result).toHaveProperty('id');
            expect(result.email).toBe(adminData.email);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('New admin created')
            );
        });

        it('should throw error for invalid email format', async () => {
            (emailValidator.isValidEmail as jest.Mock).mockReturnValue(false);

            await expect(adminService.createAdmin({
                email: 'invalid-email',
                password: 'password'
            })).rejects.toThrow('Invalid email format');
        });

        it('should throw error for existing email', async () => {
            (Admin.prototype.findByEmail as jest.Mock).mockResolvedValue(mockAdmin);

            await expect(adminService.createAdmin({
                email: 'test@example.com',
                password: 'password'
            })).rejects.toThrow('Email already registered');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Attempt to create admin with existing email')
            );
        });
    });

    describe('getAdminById', () => {
        it('should get admin by id successfully', async () => {
            (Admin.prototype.findById as jest.Mock).mockResolvedValue(mockAdmin);

            const result = await adminService.getAdminById('1');

            expect(result).toEqual(mockAdmin);
        });

        it('should throw error for non-existent admin', async () => {
            (Admin.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(adminService.getAdminById('999'))
                .rejects.toThrow('Admin not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Admin not found with ID')
            );
        });
    });

    describe('updateAdmin', () => {
        it('should update admin successfully', async () => {
            const updateData = { email: 'updated@example.com' };
            (Admin.prototype.update as jest.Mock).mockResolvedValue({ ...mockAdmin, ...updateData });

            const result = await adminService.updateAdmin('1', updateData);

            expect(result.email).toBe(updateData.email);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Admin updated successfully')
            );
        });

        it('should throw error for invalid email format', async () => {
            (emailValidator.isValidEmail as jest.Mock).mockReturnValue(false);

            await expect(adminService.updateAdmin('1', { email: 'invalid-email' }))
                .rejects.toThrow('Invalid email format');
        });

        it('should throw error for non-existent admin', async () => {
            (Admin.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(adminService.updateAdmin('999', { email: 'test@example.com' }))
                .rejects.toThrow('Admin not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Admin not found for update')
            );
        });
    });

    describe('deleteAdmin', () => {
        it('should delete admin successfully', async () => {
            (Admin.prototype.findById as jest.Mock).mockResolvedValue(mockAdmin);
            (Admin.prototype.delete as jest.Mock).mockResolvedValue(true);

            const result = await adminService.deleteAdmin('1');

            expect(result).toBe(true);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Admin deleted successfully')
            );
        });

        it('should throw error for non-existent admin', async () => {
            (Admin.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(adminService.deleteAdmin('999'))
                .rejects.toThrow('Admin not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Admin not found for deletion')
            );
        });
    });
});
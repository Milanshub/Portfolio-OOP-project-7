import { AdminService } from '../../src/services/AdminService';
import { AdminRepository } from '../../src/respositories/AdminRepository';
import { Logger } from '../../src/utils/logger';
import { emailValidator } from '../../src/utils/validators/emailValidator';
import { mockAdmin } from '../utils/mockHelpers';
import { AnalyticsService } from '../../src/services/AnalyticsService';

// Mock all dependencies
jest.mock('../../src/respositories/AdminRepository');
jest.mock('../../src/utils/validators/emailValidator');
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn(),
            generateAnalyticsReport: jest.fn()
        })
    }
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

describe('AdminService', () => {
    let adminService: AdminService;
    let mockAnalytics: any; // Changed from jest.Mocked<AnalyticsService>
    let mockLogger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        mockAnalytics = AnalyticsService.getInstance();
        adminService = new AdminService();
        
        // Setup email validator mock
        (emailValidator.isValidEmail as jest.Mock).mockReturnValue(true);
    });

    describe('validateCredentials', () => {
        it('should validate credentials successfully', async () => {
            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(mockAdmin);
            (AdminRepository.prototype.validatePassword as jest.Mock).mockResolvedValue(true);
            (AdminRepository.prototype.updateLastLogin as jest.Mock).mockResolvedValue(true);

            const result = await adminService.validateCredentials('test@example.com', 'password');

            expect(result).toEqual(mockAdmin);
            expect(AdminRepository.prototype.updateLastLogin).toHaveBeenCalledWith(mockAdmin.id);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Admin credentials validated')
            );
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('successful_login', { adminId: mockAdmin.id });
        });

        it('should throw error for non-existent admin', async () => {
            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(adminService.validateCredentials('nonexistent@example.com', 'password'))
                .rejects.toThrow('Invalid credentials');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Failed login attempt')
            );
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('failed_login_attempt', 
                expect.any(Object)
            );
        });

        it('should throw error for invalid password', async () => {
            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(mockAdmin);
            (AdminRepository.prototype.validatePassword as jest.Mock).mockResolvedValue(false);

            await expect(adminService.validateCredentials('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid credentials');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Invalid password attempt')
            );
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('invalid_password_attempt', 
                expect.any(Object)
            );
        });
    });

    describe('createAdmin', () => {
        it('should create new admin successfully', async () => {
            const adminData = {
                email: 'new@example.com',
                password: 'password',
                name: 'Test Admin'
            };

            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(null);
            (AdminRepository.prototype.create as jest.Mock).mockResolvedValue({ ...mockAdmin, ...adminData });

            const result = await adminService.createAdmin(adminData);

            expect(result).toHaveProperty('id');
            expect(result.email).toBe(adminData.email);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('New admin created')
            );
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('admin_created', 
                expect.any(Object)
            );
        });

        it('should throw error for invalid email format', async () => {
            (emailValidator.isValidEmail as jest.Mock).mockReturnValue(false);

            await expect(adminService.createAdmin({
                email: 'invalid-email',
                password: 'password',
                name: 'Test Admin'
            })).rejects.toThrow('Invalid email format');
        });

        it('should throw error for existing email', async () => {
            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(mockAdmin);

            await expect(adminService.createAdmin({
                email: 'test@example.com',
                password: 'password',
                name: 'Test Admin'
            })).rejects.toThrow('Email already registered');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Attempt to create admin with existing email')
            );
        });
    });

    describe('updateAdmin', () => {
        it('should update admin successfully', async () => {
            const updateData = { email: 'updated@example.com' };
            (AdminRepository.prototype.update as jest.Mock).mockResolvedValue({ ...mockAdmin, ...updateData });
            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

            const result = await adminService.updateAdmin('1', updateData);

            expect(result.email).toBe(updateData.email);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Admin updated successfully')
            );
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('admin_updated', 
                expect.any(Object)
            );
        });

        it('should throw error for invalid email format', async () => {
            (emailValidator.isValidEmail as jest.Mock).mockReturnValue(false);

            await expect(adminService.updateAdmin('1', { email: 'invalid-email' }))
                .rejects.toThrow('Invalid email format');
        });

        it('should throw error for existing email', async () => {
            const existingAdmin = { ...mockAdmin, id: '2', email: 'existing@example.com' };
            (AdminRepository.prototype.findByEmail as jest.Mock).mockResolvedValue(existingAdmin);

            await expect(adminService.updateAdmin('1', { email: 'existing@example.com' }))
                .rejects.toThrow('Email already in use');
        });
    });

    describe('deleteAdmin', () => {
        it('should delete admin successfully', async () => {
            (AdminRepository.prototype.findById as jest.Mock).mockResolvedValue(mockAdmin);
            (AdminRepository.prototype.delete as jest.Mock).mockResolvedValue(true);

            const result = await adminService.deleteAdmin('1');

            expect(result).toBe(true);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Admin deleted successfully')
            );
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('admin_deleted', 
                expect.any(Object)
            );
        });

        it('should throw error for non-existent admin', async () => {
            (AdminRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(adminService.deleteAdmin('999'))
                .rejects.toThrow('Admin not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Admin not found for deletion')
            );
        });
    });

    describe('getAllAdmins', () => {
        it('should get all admins successfully', async () => {
            const mockAdmins = [mockAdmin, { ...mockAdmin, id: '2' }];
            (AdminRepository.prototype.findAll as jest.Mock).mockResolvedValue(mockAdmins);

            const result = await adminService.getAllAdmins();

            expect(result).toEqual(mockAdmins);
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('admins_list_viewed');
        });
    });

    describe('viewAnalytics', () => {
        it('should view analytics successfully', async () => {
            const mockReport = { visits: 100, actions: 50 };
            mockAnalytics.generateAnalyticsReport.mockResolvedValue(mockReport);

            const result = await adminService.viewAnalytics();

            expect(result).toEqual(mockReport);
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('analytics_viewed', 
                expect.any(Object)
            );
        });
    });
});
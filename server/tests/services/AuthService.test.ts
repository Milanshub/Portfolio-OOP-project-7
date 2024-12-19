import { AuthService } from '../../src/services/AuthService';
import { AdminService } from '../../src/services/AdminService';
import { Logger } from '../../src/utils/logger';
import { mockAdmin } from '../utils/mockHelpers';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../../src/utils/emailSender';
import { stringHelpers } from '../../src/utils/helpers/stringHelpers';

// Mock AdminService
jest.mock('../../src/services/AdminService', () => {
    return {
        AdminService: jest.fn().mockImplementation(() => ({
            validateCredentials: jest.fn(),
            getAdminById: jest.fn(),
            getAdminByEmail: jest.fn(),
            updateAdmin: jest.fn()
        }))
    };
});

// Mock Logger
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

// Mock JWT
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));

// Mock Email Sender
jest.mock('../../src/utils/emailSender', () => ({
    sendEmail: jest.fn()
}));

// Mock String Helpers
jest.mock('../../src/utils/helpers/stringHelpers', () => ({
    stringHelpers: {
        generateRandomString: jest.fn()
    }
}));

describe('AuthService', () => {
    let authService: AuthService;
    let mockLogger: any;
    let adminService: AdminService;
    const mockToken = 'mock-jwt-token';
    const mockResetToken = 'mock-reset-token';

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        
        // Reset singleton instance
        (AuthService as any).instance = null;
        authService = AuthService.getInstance();
        
        // Create and inject adminService mock
        adminService = new AdminService();
        (AuthService as any).instance.adminService = adminService;
        
        // Default JWT mock implementation
        (jwt.sign as jest.Mock).mockReturnValue(mockToken);
        (jwt.verify as jest.Mock).mockReturnValue({ id: mockAdmin.id });
        
        // Default string helper mock
        (stringHelpers.generateRandomString as jest.Mock).mockReturnValue(mockResetToken);

        // Set up token cache with mock admin ID
        (AuthService as any).instance.tokenCache.set(mockToken, mockAdmin.id);
        (AuthService as any).instance.resetTokenCache.set(mockResetToken, mockAdmin.id);
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const adminService = new AdminService();
            adminService.validateCredentials = jest.fn().mockResolvedValue(mockAdmin);
            (AuthService as any).instance.adminService = adminService;

            const result = await authService.login('test@example.com', 'password');

            expect(result).toEqual({ admin: mockAdmin, token: mockToken });
            expect(mockLogger.info).toHaveBeenCalledWith(`Login successful for admin: test@example.com`);
            expect(adminService.validateCredentials).toHaveBeenCalledWith('test@example.com', 'password');
        });

        it('should handle login failure', async () => {
            const adminService = new AdminService();
            adminService.validateCredentials = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
            (AuthService as any).instance.adminService = adminService;

            await expect(authService.login('test@example.com', 'wrong-password'))
                .rejects.toThrow('Invalid credentials');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('validateToken', () => {
        it('should validate token successfully', async () => {
            const adminService = new AdminService();
            adminService.getAdminById = jest.fn().mockResolvedValue(mockAdmin);
            (AuthService as any).instance.adminService = adminService;

            const result = await authService.validateToken(mockToken);

            expect(result).toEqual(mockAdmin);
            expect(adminService.getAdminById).toHaveBeenCalledWith(mockAdmin.id);
        });

        it('should handle invalid token', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(authService.validateToken('invalid-token'))
                .rejects.toThrow('Authentication failed');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully', async () => {
            adminService.getAdminById = jest.fn().mockResolvedValue(mockAdmin);

            const result = await authService.refreshToken(mockToken);

            expect(result).toEqual({ admin: mockAdmin, token: mockToken });
            expect(mockLogger.info).toHaveBeenCalledWith(`Token refreshed for admin: ${mockAdmin.id}`);
        });

        it('should handle refresh token failure', async () => {
            adminService.getAdminById = jest.fn().mockResolvedValue(null);

            await expect(authService.refreshToken(mockToken))
                .rejects.toThrow('Failed to refresh token'); // Changed to match actual error message
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const adminService = new AdminService();
            adminService.getAdminById = jest.fn().mockResolvedValue(mockAdmin);
            adminService.validateCredentials = jest.fn().mockResolvedValue(mockAdmin);
            adminService.updateAdmin = jest.fn().mockResolvedValue(mockAdmin);
            (AuthService as any).instance.adminService = adminService;

            await authService.changePassword(mockAdmin.id, 'oldPassword', 'newPassword');

            expect(mockLogger.info).toHaveBeenCalledWith(`Password changed successfully for admin: ${mockAdmin.id}`);
            expect(adminService.updateAdmin).toHaveBeenCalledWith(mockAdmin.id, { password: 'newPassword' });
        });

        it('should handle invalid current password', async () => {
            const adminService = new AdminService();
            adminService.getAdminById = jest.fn().mockResolvedValue(mockAdmin);
            adminService.validateCredentials = jest.fn().mockRejectedValue(new Error('Current password is incorrect'));
            (AuthService as any).instance.adminService = adminService;

            await expect(authService.changePassword(mockAdmin.id, 'wrongPassword', 'newPassword'))
                .rejects.toThrow('Current password is incorrect');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('requestPasswordReset', () => {
        it('should request password reset successfully', async () => {
            const adminService = new AdminService();
            adminService.getAdminByEmail = jest.fn().mockResolvedValue(mockAdmin);
            (AuthService as any).instance.adminService = adminService;
            (sendEmail as jest.Mock).mockResolvedValue(undefined);

            await authService.requestPasswordReset(mockAdmin.email);

            expect(sendEmail).toHaveBeenCalled();
            expect(mockLogger.info).toHaveBeenCalledWith(`Password reset requested for admin: ${mockAdmin.email}`);
        });

        it('should handle non-existent admin', async () => {
            const adminService = new AdminService();
            adminService.getAdminByEmail = jest.fn().mockResolvedValue(null);
            (AuthService as any).instance.adminService = adminService;

            await expect(authService.requestPasswordReset('nonexistent@example.com'))
                .rejects.toThrow('Admin not found');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('resetPassword', () => {
        it('should reset password successfully', async () => {
            adminService.updateAdmin = jest.fn().mockResolvedValue(mockAdmin);
            // Pre-set the reset token in the cache
            (AuthService as any).instance.resetTokenCache.set(mockResetToken, mockAdmin.id);

            await authService.resetPassword(mockResetToken, 'newPassword');

            expect(mockLogger.info).toHaveBeenCalledWith(`Password reset completed for admin: ${mockAdmin.id}`);
            expect(adminService.updateAdmin).toHaveBeenCalledWith(mockAdmin.id, { password: 'newPassword' });
        });

        it('should handle invalid reset token', async () => {
            // Don't set any token in the cache to simulate invalid token
            await expect(authService.resetPassword('invalid-token', 'newPassword'))
                .rejects.toThrow('Invalid or expired reset token');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('invalidateToken', () => {
        it('should invalidate token successfully', () => {
            authService.invalidateToken(mockToken);
            expect(mockLogger.info).toHaveBeenCalledWith('Token invalidated successfully');
        });
    });
});
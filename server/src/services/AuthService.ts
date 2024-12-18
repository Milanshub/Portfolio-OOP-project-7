import jwt from 'jsonwebtoken';
import { AdminService } from './AdminService';
import { Logger } from '../utils/logger';
import { IAdmin } from '../types/entities';
import { Cache } from '../utils/cache';
import { AppError } from '../middleware/errorMiddleware';
import { sendEmail } from '../utils/emailSender';
import { stringHelpers } from '../utils/helpers/stringHelpers';

export class AuthService {
    private static instance: AuthService;
    private adminService: AdminService;
    private logger = Logger.getInstance();
    private tokenCache = new Cache<string>(15 * 60 * 1000); // 15 minute cache
    private resetTokenCache = new Cache<string>(30 * 60 * 1000); // 30 minute cache for reset tokens

    private constructor() {
        this.adminService = new AdminService();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(email: string, password: string): Promise<{ admin: IAdmin; token: string }> {
        try {
            const admin = await this.adminService.validateCredentials(email, password);
            const token = this.generateToken(admin);
            
            // Cache the token
            this.tokenCache.set(token, admin.id);
            
            this.logger.info(`Login successful for admin: ${email}`);
            return { admin, token };
        } catch (error: any) {
            this.logger.error(`Login failed: ${error.message}`);
            throw new AppError('Invalid credentials', 401);
        }
    }

    async validateToken(token: string): Promise<IAdmin> {
        try {
            // Check cache first
            const cachedAdminId = this.tokenCache.get(token);
            if (cachedAdminId) {
                const admin = await this.adminService.getAdminById(cachedAdminId);
                if (admin) return admin;
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const admin = await this.adminService.getAdminById(decoded.id);
            
            if (!admin) {
                throw new AppError('Invalid token', 401);
            }

            // Update cache
            this.tokenCache.set(token, admin.id);
            return admin;
        } catch (error: any) {
            this.logger.error(`Token validation failed: ${error.message}`);
            throw new AppError('Authentication failed', 401);
        }
    }

    async refreshToken(oldToken: string): Promise<{ token: string; admin: IAdmin }> {
        try {
            const admin = await this.validateToken(oldToken);
            
            // Invalidate old token
            this.invalidateToken(oldToken);
            
            // Generate new token
            const newToken = this.generateToken(admin);
            
            // Cache new token
            this.tokenCache.set(newToken, admin.id);
            
            this.logger.info(`Token refreshed for admin: ${admin.id}`);
            return { token: newToken, admin };
        } catch (error: any) {
            this.logger.error(`Token refresh failed: ${error.message}`);
            throw new AppError('Failed to refresh token', 401);
        }
    }

    async changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const admin = await this.adminService.getAdminById(adminId);
            if (!admin) {
                throw new AppError('Admin not found', 404);
            }

            // Validate current password
            const isValid = await this.adminService.validateCredentials(admin.email, currentPassword);
            if (!isValid) {
                throw new AppError('Current password is incorrect', 401);
            }

            // Update password
            await this.adminService.updateAdmin(adminId, { password: newPassword });
            
            // Invalidate all existing tokens for this admin
            this.invalidateAdminTokens(adminId);
            
            this.logger.info(`Password changed successfully for admin: ${adminId}`);
        } catch (error: any) {
            this.logger.error(`Password change failed: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async requestPasswordReset(email: string): Promise<void> {
        try {
            const admin = await this.adminService.getAdminByEmail(email);
            if (!admin) {
                throw new AppError('Admin not found', 404);
            }

            // Generate reset token
            const resetToken = stringHelpers.generateRandomString(32);
            this.resetTokenCache.set(resetToken, admin.id);

            // Send reset email
            const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
            await sendEmail({
                to: email,
                subject: 'Password Reset Request',
                text: `Click the following link to reset your password: ${resetLink}\n\nThis link will expire in 30 minutes.`
            });

            this.logger.info(`Password reset requested for admin: ${email}`);
        } catch (error: any) {
            this.logger.error(`Password reset request failed: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            const adminId = this.resetTokenCache.get(token);
            if (!adminId) {
                throw new AppError('Invalid or expired reset token', 401);
            }

            // Update password
            await this.adminService.updateAdmin(adminId, { password: newPassword });
            
            // Clear reset token
            this.resetTokenCache.delete(token);
            
            // Invalidate all existing session tokens for this admin
            this.invalidateAdminTokens(adminId);

            this.logger.info(`Password reset completed for admin: ${adminId}`);
        } catch (error: any) {
            this.logger.error(`Password reset failed: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    generateToken(admin: IAdmin): string {
        return jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
    }

    invalidateToken(token: string): void {
        this.tokenCache.delete(token);
        this.logger.info('Token invalidated successfully');
    }

    private invalidateAdminTokens(adminId: string): void {
        const entries = this.tokenCache.getEntries();
        for (const [token, cachedAdminId] of entries) {
            if (cachedAdminId === adminId) {
                this.tokenCache.delete(token);
            }
        }
        this.logger.info(`All tokens invalidated for admin: ${adminId}`);
    }
}

// Export singleton instance
export const authService = AuthService.getInstance();
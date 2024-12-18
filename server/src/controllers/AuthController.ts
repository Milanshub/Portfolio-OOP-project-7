import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { Logger } from '../utils/logger';
import { stringHelpers } from '../utils/helpers/stringHelpers';
import { AnalyticsService } from '../services/AnalyticsService';
import { AppError } from '../middleware/errorMiddleware';

export class AuthController {
    private authService: AuthService;
    private logger = Logger.getInstance();
    private analytics: AnalyticsService;

    constructor() {
        this.authService = AuthService.getInstance();
        this.analytics = AnalyticsService.getInstance();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!stringHelpers.isValidEmail(email)) {
                throw new AppError('Invalid email format', 400);
            }

            if (!password || !stringHelpers.isStrongPassword(password)) {
                throw new AppError('Invalid password format', 400);
            }

            const result = await this.authService.login(email, password);
            await this.analytics.trackEvent('user_login', { email: stringHelpers.maskEmail(email) });
            this.logger.info(`Login successful: ${stringHelpers.maskEmail(email)}`);
            res.status(200).json(result);
        } catch (error: any) {
            this.logger.error('Login failed:', error);
            await this.analytics.trackEvent('failed_login_attempt', { error: error.message });
            res.status(error.statusCode || 401).json({ error: error.message });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new AppError('No token provided', 401);
            }

            this.authService.invalidateToken(token);
            await this.analytics.trackEvent('user_logout');
            this.logger.info('Logout successful');
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error: any) {
            this.logger.error('Logout failed:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async validateToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new AppError('No token provided', 401);
            }

            const admin = await this.authService.validateToken(token);
            this.logger.debug('Token validated successfully');
            res.status(200).json({ valid: true, admin });
        } catch (error: any) {
            this.logger.error('Token validation failed:', error);
            res.status(error.statusCode || 401).json({ valid: false, error: error.message });
        }
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                throw new AppError('No token provided', 401);
            }

            const result = await this.authService.refreshToken(token);
            this.logger.info('Token refreshed successfully');
            res.status(200).json(result);
        } catch (error: any) {
            this.logger.error('Token refresh failed:', error);
            res.status(error.statusCode || 401).json({ error: error.message });
        }
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { currentPassword, newPassword } = req.body;
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new AppError('No token provided', 401);
            }

            if (!currentPassword || !newPassword) {
                throw new AppError('Current password and new password are required', 400);
            }

            if (!stringHelpers.isStrongPassword(newPassword)) {
                throw new AppError('New password does not meet security requirements', 400);
            }

            const admin = await this.authService.validateToken(token);
            await this.authService.changePassword(admin.id, currentPassword, newPassword);
            await this.analytics.trackEvent('password_changed', { userId: admin.id });
            this.logger.info(`Password changed successfully for user: ${admin.id}`);
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error: any) {
            this.logger.error('Password change failed:', error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }

    async requestPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;

            if (!stringHelpers.isValidEmail(email)) {
                throw new AppError('Invalid email format', 400);
            }

            await this.authService.requestPasswordReset(email);
            await this.analytics.trackEvent('password_reset_requested', { email: stringHelpers.maskEmail(email) });
            this.logger.info(`Password reset requested for: ${stringHelpers.maskEmail(email)}`);
            res.status(200).json({ message: 'Password reset email sent' });
        } catch (error: any) {
            this.logger.error('Password reset request failed:', error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                throw new AppError('Token and new password are required', 400);
            }

            if (!stringHelpers.isStrongPassword(newPassword)) {
                throw new AppError('New password does not meet security requirements', 400);
            }

            await this.authService.resetPassword(token, newPassword);
            await this.analytics.trackEvent('password_reset_completed');
            this.logger.info('Password reset completed successfully');
            res.status(200).json({ message: 'Password reset successful' });
        } catch (error: any) {
            this.logger.error('Password reset failed:', error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }
}
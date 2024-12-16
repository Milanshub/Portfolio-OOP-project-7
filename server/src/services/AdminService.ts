// server/src/services/AdminService.ts

import { IAdmin, ICreateAdmin, IUpdateAdmin } from '../types/entities';
import { Admin } from '../models/Admin';
import { Logger } from '../utils/logger';
import { emailValidator } from '../utils/validators/emailValidator';
import { AppError } from '../middleware/errorMiddleware';
import { AnalyticsService } from './AnalyticsService';

export class AdminService {
    private adminModel: Admin;
    private logger = Logger.getInstance();
    private analytics: AnalyticsService;

    constructor() {
        this.adminModel = new Admin();
        this.analytics = AnalyticsService.getInstance();
    }

    async validateCredentials(email: string, password: string): Promise<IAdmin> {
        try {
            const admin = await this.adminModel.findByEmail(email);
            if (!admin) {
                await this.analytics.trackEvent('failed_login_attempt', { email });
                this.logger.warn(`Failed login attempt for email: ${email}`);
                throw new AppError('Invalid credentials', 401);
            }

            const isValidPassword = await this.adminModel.validatePassword(
                password,
                admin.password
            );

            if (!isValidPassword) {
                await this.analytics.trackEvent('invalid_password_attempt', { email });
                this.logger.warn(`Invalid password attempt for admin: ${email}`);
                throw new AppError('Invalid credentials', 401);
            }

            await this.adminModel.updateLastLogin(admin.id);
            await this.analytics.trackEvent('successful_login', { adminId: admin.id });
            this.logger.info(`Admin credentials validated: ${email}`);
            return admin;
        } catch (error: any) {
            this.logger.error(`Credential validation failed: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async createAdmin(adminData: ICreateAdmin): Promise<IAdmin> {
        try {
            if (!emailValidator.isValidEmail(adminData.email)) {
                throw new AppError('Invalid email format', 400);
            }

            const existingAdmin = await this.adminModel.findByEmail(adminData.email);
            if (existingAdmin) {
                this.logger.warn(`Attempt to create admin with existing email: ${adminData.email}`);
                throw new AppError('Email already registered', 409);
            }

            const admin = await this.adminModel.create(adminData);
            await this.analytics.trackEvent('admin_created', { adminId: admin.id });
            this.logger.info(`New admin created: ${admin.email}`);
            return admin;
        } catch (error: any) {
            this.logger.error(`Failed to create admin: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async getAdminById(id: string): Promise<IAdmin> {
        try {
            const admin = await this.adminModel.findById(id);
            if (!admin) {
                this.logger.warn(`Admin not found with ID: ${id}`);
                throw new AppError('Admin not found', 404);
            }
            await this.analytics.trackEvent('admin_viewed', { adminId: id });
            return admin;
        } catch (error: any) {
            this.logger.error(`Failed to get admin: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async getAdminByEmail(email: string): Promise<IAdmin> {
        try {
            const admin = await this.adminModel.findByEmail(email);
            if (!admin) {
                this.logger.warn(`Admin not found with email: ${email}`);
                throw new AppError('Admin not found', 404);
            }
            return admin;
        } catch (error: any) {
            this.logger.error(`Failed to get admin by email: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async updateAdmin(id: string, adminData: IUpdateAdmin): Promise<IAdmin> {
        try {
            if (adminData.email && !emailValidator.isValidEmail(adminData.email)) {
                throw new AppError('Invalid email format', 400);
            }

            if (adminData.email) {
                const existingAdmin = await this.adminModel.findByEmail(adminData.email);
                if (existingAdmin && existingAdmin.id !== id) {
                    throw new AppError('Email already in use', 409);
                }
            }

            const updatedAdmin = await this.adminModel.update(id, adminData);
            if (!updatedAdmin) {
                this.logger.warn(`Admin not found for update with ID: ${id}`);
                throw new AppError('Admin not found', 404);
            }

            await this.analytics.trackEvent('admin_updated', { adminId: id });
            this.logger.info(`Admin updated successfully: ${id}`);
            return updatedAdmin;
        } catch (error: any) {
            this.logger.error(`Failed to update admin: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async deleteAdmin(id: string): Promise<boolean> {
        try {
            const admin = await this.adminModel.findById(id);
            if (!admin) {
                this.logger.warn(`Admin not found for deletion with ID: ${id}`);
                throw new AppError('Admin not found', 404);
            }

            const result = await this.adminModel.delete(id);
            if (result) {
                await this.analytics.trackEvent('admin_deleted', { adminId: id });
                this.logger.info(`Admin deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete admin: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            const admin = await this.getAdminById(id);
            
            const isValidPassword = await this.adminModel.validatePassword(
                currentPassword,
                admin.password
            );

            if (!isValidPassword) {
                await this.analytics.trackEvent('password_change_failed', { adminId: id });
                throw new AppError('Current password is incorrect', 401);
            }

            await this.adminModel.updatePassword(id, newPassword);
            await this.analytics.trackEvent('password_changed', { adminId: id });
            this.logger.info(`Password changed successfully for admin: ${id}`);
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to change password: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async viewAnalytics(): Promise<any> {
        try {
            const report = await this.analytics.generateAnalyticsReport();
            await this.analytics.trackEvent('analytics_viewed', { timestamp: new Date() });
            return report;
        } catch (error: any) {
            this.logger.error('Failed to view analytics:', error);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async getAllAdmins(): Promise<IAdmin[]> {
        try {
            const admins = await this.adminModel.findAll();
            await this.analytics.trackEvent('admins_list_viewed');
            return admins;
        } catch (error: any) {
            this.logger.error('Failed to get all admins:', error);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }
}

// Export singleton instance
export const adminService = new AdminService();
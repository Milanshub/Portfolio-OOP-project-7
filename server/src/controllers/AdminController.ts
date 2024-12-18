import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { AuthService } from '../services/AuthService';
import { ICreateAdmin, IUpdateAdmin } from '../types/entities';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';
import { stringHelpers } from '../utils/helpers/stringHelpers';
import { AnalyticsObserver } from '../utils/observers/analyticsObservers';
import { AppError } from '../middleware/errorMiddleware';

export class AdminController {
    private adminService: AdminService;
    private authService: AuthService;
    private logger = Logger.getInstance();
    private analytics = AnalyticsObserver.getInstance();
    private cache = new Cache<any>(30 * 60 * 1000); // 30 minute cache

    constructor() {
        this.adminService = new AdminService();
        this.authService = AuthService.getInstance();
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
            await this.analytics.trackEvent('admin_login', { email: stringHelpers.maskEmail(email) });
            this.logger.info(`Admin logged in successfully: ${stringHelpers.maskEmail(email)}`);
            res.status(200).json(result);
        } catch (error: any) {
            this.logger.error('Login failed:', error);
            res.status(error.statusCode || 401).json({ error: error.message });
        }
    }

    async createAdmin(req: Request, res: Response): Promise<void> {
        try {
            const adminData: ICreateAdmin = req.body;
            const errors: string[] = [];
            
            if (!stringHelpers.isValidEmail(adminData.email)) {
                errors.push('Invalid email format');
            }

            if (!stringHelpers.isStrongPassword(adminData.password)) {
                errors.push('Password does not meet security requirements');
            }

            if (!adminData.name?.trim()) {
                errors.push('Name is required');
            }

            if (errors.length > 0) {
                throw new AppError(errors.join(', '), 400);
            }

            const admin = await this.adminService.createAdmin(adminData);
            this.cache.clear();
            await this.analytics.trackEvent('admin_created', { email: stringHelpers.maskEmail(admin.email) });
            this.logger.info(`New admin created: ${stringHelpers.maskEmail(admin.email)}`);
            res.status(201).json(admin);
        } catch (error: any) {
            this.logger.error('Failed to create admin:', error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }

    async updateAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const adminData: IUpdateAdmin = req.body;
            const errors: string[] = [];

            if (adminData.email && !stringHelpers.isValidEmail(adminData.email)) {
                errors.push('Invalid email format');
            }

            if (adminData.password && !stringHelpers.isStrongPassword(adminData.password)) {
                errors.push('Password does not meet security requirements');
            }

            if (adminData.name && !adminData.name.trim()) {
                errors.push('Name cannot be empty');
            }

            if (errors.length > 0) {
                throw new AppError(errors.join(', '), 400);
            }

            const admin = await this.adminService.updateAdmin(id, adminData);
            this.cache.clear();
            await this.analytics.trackEvent('admin_updated', { id });
            this.logger.info(`Admin updated successfully: ${id}`);
            res.status(200).json(admin);
        } catch (error: any) {
            this.logger.error(`Failed to update admin ${req.params.id}:`, error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }

    async deleteAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.adminService.deleteAdmin(id);
            this.cache.clear();
            await this.analytics.trackEvent('admin_deleted', { id });
            this.logger.info(`Admin deleted successfully: ${id}`);
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error: any) {
            this.logger.error(`Failed to delete admin ${req.params.id}:`, error);
            res.status(error.statusCode || 400).json({ error: error.message });
        }
    }

    async getAdminProfile(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const cacheKey = `admin-profile-${id}`;
            const cached = this.cache.get(cacheKey);

            if (cached) {
                this.logger.debug(`Serving admin profile from cache: ${id}`);
                res.status(200).json(cached);
                return;
            }

            const admin = await this.adminService.getAdminById(id);
            if (!admin) {
                throw new AppError('Admin not found', 404);
            }

            this.cache.set(cacheKey, admin);
            this.logger.info(`Admin profile fetched: ${id}`);
            res.status(200).json(admin);
        } catch (error: any) {
            this.logger.error(`Failed to get admin profile ${req.params.id}:`, error);
            res.status(error.statusCode || 404).json({ error: error.message });
        }
    }

    async getAllAdmins(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'all-admins';
            const cached = this.cache.get(cacheKey);

            if (cached) {
                this.logger.debug('Serving all admins from cache');
                res.status(200).json(cached);
                return;
            }

            const admins = await this.adminService.getAllAdmins();
            this.cache.set(cacheKey, admins);
            this.logger.info('All admins fetched successfully');
            res.status(200).json(admins);
        } catch (error: any) {
            this.logger.error('Failed to get all admins:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async viewAnalytics(req: Request, res: Response): Promise<void> {
        try {
            const analytics = await this.adminService.viewAnalytics();
            this.logger.info('Analytics viewed successfully');
            res.status(200).json(analytics);
        } catch (error: any) {
            this.logger.error('Failed to view analytics:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
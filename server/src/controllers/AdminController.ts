import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';
import { ICreateAdmin, IUpdateAdmin } from '../types/entities';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';
import { stringHelpers } from '../utils/helpers/stringHelpers';
import { AnalyticsObserver } from '../utils/observers/analyticsObservers';

export class AdminController {
    private adminService: AdminService;
    private logger = Logger.getInstance();
    private analytics = AnalyticsObserver.getInstance();
    private cache = new Cache<any>(30 * 60 * 1000); // 30 minute cache

    constructor() {
        this.adminService = new AdminService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            // Validate email format
            if (!stringHelpers.isValidEmail(email)) {
                this.logger.warn('Invalid email format attempted login:', email);
                res.status(400).json({ error: 'Invalid email format' });
                return;
            }

            const result = await this.adminService.login(email, password);
            this.logger.info(`Admin logged in successfully: ${email}`);
            await this.analytics.trackEvent('admin_login', { email });
            res.status(200).json(result);
        } catch (error: any) {
            this.logger.error('Login failed:', error);
            res.status(401).json({ error: error.message });
        }
    }

    async createAdmin(req: Request, res: Response): Promise<void> {
        try {
            const adminData: ICreateAdmin = req.body;

            // Validate admin data
            const errors: string[] = [];
            
            if (!stringHelpers.isValidEmail(adminData.email)) {
                errors.push('Invalid email format');
            }

            if (!adminData.password || adminData.password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }

            if (!adminData.name?.trim()) {
                errors.push('Name is required');
            }

            if (errors.length > 0) {
                this.logger.warn('Admin creation validation failed:', errors);
                res.status(400).json({ errors });
                return;
            }

            const admin = await this.adminService.createAdmin(adminData);
            this.logger.info(`New admin created: ${admin.email}`);
            this.cache.clear(); // Clear cache when admin data changes
            await this.analytics.trackEvent('admin_created', { email: admin.email });
            res.status(201).json(admin);
        } catch (error: any) {
            this.logger.error('Failed to create admin:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async updateAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const adminData: IUpdateAdmin = req.body;

            // Validate update data
            const errors: string[] = [];

            if (adminData.email && !stringHelpers.isValidEmail(adminData.email)) {
                errors.push('Invalid email format');
            }

            if (adminData.password && adminData.password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }

            if (adminData.name && !adminData.name.trim()) {
                errors.push('Name cannot be empty');
            }

            if (errors.length > 0) {
                this.logger.warn(`Admin update validation failed for ID ${id}:`, errors);
                res.status(400).json({ errors });
                return;
            }

            const admin = await this.adminService.updateAdmin(id, adminData);
            this.logger.info(`Admin updated successfully: ${id}`);
            this.cache.clear(); // Clear cache when admin data changes
            await this.analytics.trackEvent('admin_updated', { id });
            res.status(200).json(admin);
        } catch (error: any) {
            this.logger.error(`Failed to update admin ${req.params.id}:`, error);
            res.status(400).json({ error: error.message });
        }
    }

    async deleteAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.adminService.deleteAdmin(id);
            this.logger.info(`Admin deleted successfully: ${id}`);
            this.cache.clear(); // Clear cache when admin data changes
            await this.analytics.trackEvent('admin_deleted', { id });
            res.status(200).json({ message: 'Admin deleted successfully' });
        } catch (error: any) {
            this.logger.error(`Failed to delete admin ${req.params.id}:`, error);
            res.status(400).json({ error: error.message });
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
            if (admin) {
                this.cache.set(cacheKey, admin);
                this.logger.info(`Admin profile fetched: ${id}`);
                res.status(200).json(admin);
            } else {
                throw new Error('Admin not found');
            }
        } catch (error: any) {
            this.logger.error(`Failed to get admin profile ${req.params.id}:`, error);
            res.status(404).json({ error: error.message });
        }
    }
}
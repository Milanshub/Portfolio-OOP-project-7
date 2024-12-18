import { Request, Response } from 'express';
import { AdminProfileService } from '../services/AdminProfileService';
import { IUpdateProfile } from '../types/entities';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';
import { AppError } from '../middleware/errorMiddleware';

export class AdminProfileController {
    private adminProfileService: AdminProfileService;
    private logger = Logger.getInstance();
    private cache = new Cache<any>(5 * 60 * 1000); // 5 minute cache

    constructor() {
        this.adminProfileService = new AdminProfileService();
    }

    async manageProfile(req: Request, res: Response): Promise<void> {
        try {
            const adminId = req.params.adminId;
            if (!adminId) {
                throw new AppError('Admin ID is required', 400);
            }

            const profileData: IUpdateProfile = req.body;
            if (!profileData) {
                throw new AppError('Profile data is required', 400);
            }

            const updatedProfile = await this.adminProfileService.manageProfile(adminId, profileData);
            this.cache.clear(); // Clear cache when profile is updated
            this.logger.info(`Profile managed successfully for admin: ${adminId}`);
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            this.logger.error('Failed to manage profile:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateAvatar(req: Request, res: Response): Promise<void> {
        try {
            const adminId = req.params.adminId;
            if (!adminId) {
                throw new AppError('Admin ID is required', 400);
            }

            if (!req.file) {
                throw new AppError('Avatar file is required', 400);
            }

            const updatedProfile = await this.adminProfileService.updateAvatar(adminId, req.file);
            this.cache.clear();
            this.logger.info(`Avatar updated successfully for admin: ${adminId}`);
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            this.logger.error('Failed to update avatar:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateResume(req: Request, res: Response): Promise<void> {
        try {
            const adminId = req.params.adminId;
            if (!adminId) {
                throw new AppError('Admin ID is required', 400);
            }

            if (!req.file) {
                throw new AppError('Resume file is required', 400);
            }

            const updatedProfile = await this.adminProfileService.updateResume(adminId, req.file);
            this.cache.clear();
            this.logger.info(`Resume updated successfully for admin: ${adminId}`);
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            this.logger.error('Failed to update resume:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { ICreateProfile, IUpdateProfile } from '../types/entities';
import { Logger } from '../utils/logger';
import { profileValidator } from '../utils/validators/profileValidator';
import { fileHelpers } from '../utils/helpers/fileHelpers';
import { Cache } from '../utils/cache';

export class ProfileController {
    private profileService: ProfileService;
    private logger = Logger.getInstance();
    private cache = new Cache<any>(10 * 60 * 1000); // 10 minute cache

    constructor() {
        this.profileService = new ProfileService();
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'profile-data';
            const cached = this.cache.get(cacheKey);
            
            if (cached) {
                this.logger.debug('Serving profile from cache');
                res.status(200).json(cached);
                return;
            }

            const profile = await this.profileService.getProfile();
            this.cache.set(cacheKey, profile);
            this.logger.info('Profile fetched successfully');
            res.status(200).json(profile);
        } catch (error: any) {
            this.logger.error('Failed to get profile:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const profileData: IUpdateProfile = req.body;
            const errors = profileValidator.validateUpdate(profileData);
            
            if (errors.length > 0) {
                this.logger.warn('Profile update validation failed:', errors);
                res.status(400).json({ errors });
                return;
            }

            const updatedProfile = await this.profileService.updateProfile(profileData);
            this.logger.info('Profile updated successfully');
            this.cache.clear(); // Clear cache when data changes
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            this.logger.error('Failed to update profile:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async uploadAvatar(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }

            if (!fileHelpers.isValidImageType(req.file.mimetype)) {
                this.logger.warn('Invalid avatar file type');
                res.status(400).json({ error: 'Invalid file type' });
                return;
            }

            const maxSize = 5; // 5MB
            if (fileHelpers.getFileSizeInMB(req.file.size) > maxSize) {
                this.logger.warn('Avatar file too large');
                res.status(400).json({ error: `File size must be less than ${maxSize}MB` });
                return;
            }

            const updatedProfile = await this.profileService.updateAvatar(req.file);
            this.logger.info('Avatar updated successfully');
            this.cache.clear();
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            this.logger.error('Failed to upload avatar:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async uploadResume(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }

            const validTypes = ['.pdf', '.doc', '.docx'];
            const fileExt = fileHelpers.getFileExtension(req.file.originalname);
            if (!validTypes.includes(fileExt)) {
                this.logger.warn('Invalid resume file type');
                res.status(400).json({ error: 'Invalid file type' });
                return;
            }

            const updatedProfile = await this.profileService.updateResume(req.file);
            this.logger.info('Resume updated successfully');
            this.cache.clear();
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            this.logger.error('Failed to upload resume:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
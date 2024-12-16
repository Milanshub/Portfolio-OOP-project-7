import { IProfile, IUpdateProfile } from '../types/entities';
import { Profile } from '../models/Profile';
import { StorageService } from './StorageService';
import { Logger } from '../utils/logger';
import { AppError } from '@/middleware/errorMiddleware';

export class ProfileService {
    private profileModel: Profile;
    private storageService: StorageService;
    private logger = Logger.getInstance();
    
    constructor() {
        this.profileModel = new Profile();
        this.storageService = new StorageService();
    }

    async getProfile(): Promise<IProfile> {
        try {
            const profiles = await this.profileModel.findAll();
            if (!profiles.length) {
                throw new AppError('No profile found', 404); // AppError with status code
            }
            return profiles[0];
        } catch (error: any) {
            this.logger.error('Failed to get profile:', error);
            throw new AppError(`Failed to get profile: ${error.message}`, error.statusCode || 500);
        }
    }

    async updateProfile(profileData: IUpdateProfile): Promise<IProfile> {
        try {
            const currentProfile = await this.getProfile();
            const updatedProfile = await this.profileModel.update(currentProfile.id, profileData);
            if (!updatedProfile) {
                throw new Error('Failed to update profile');
            }
            return updatedProfile;
        } catch (error: any) {
            this.logger.error('Failed to update profile:', error);
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    async updateAvatar(file: Express.Multer.File): Promise<IProfile> {
        try {
            const currentProfile = await this.getProfile();
            const avatarUrl = await this.storageService.uploadFile(
                file,
                'avatars',
                ['image/jpeg', 'image/png']
            );

            const updatedProfile = await this.profileModel.updateAvatar(currentProfile.id, avatarUrl);
            if (!updatedProfile) {
                throw new Error('Failed to update avatar');
            }

            if (currentProfile.avatar) {
                await this.storageService.deleteFile(currentProfile.avatar);
            }

            return updatedProfile;
        } catch (error: any) {
            this.logger.error('Failed to update avatar:', error);
            throw new Error(`Failed to update avatar: ${error.message}`);
        }
    }

    async updateResume(file: Express.Multer.File): Promise<IProfile> {
        try {
            const currentProfile = await this.getProfile();
            const resumeUrl = await this.storageService.uploadFile(
                file,
                'resumes',
                ['application/pdf']
            );

            const updatedProfile = await this.profileModel.updateResume(currentProfile.id, resumeUrl);
            if (!updatedProfile) {
                throw new Error('Failed to update resume');
            }

            if (currentProfile.resume) {
                await this.storageService.deleteFile(currentProfile.resume);
            }

            return updatedProfile;
        } catch (error: any) {
            this.logger.error('Failed to update resume:', error);
            throw new Error(`Failed to update resume: ${error.message}`);
        }
    }

}
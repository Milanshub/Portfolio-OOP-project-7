import { Express } from 'express';
import { supabase } from '../config/supabase';
import { IProfile, ICreateProfile, IUpdateProfile } from '../types/entities';
import { Profile } from '../models/Profile';
import { StorageService } from './StorageService';

export class ProfileService {
    private profileModel: Profile;
    private storageService: StorageService;

    constructor() {
        this.profileModel = new Profile();
        this.storageService = new StorageService();
    }

    async getProfile(): Promise<IProfile> {
        try {
            const profiles = await this.profileModel.findAll();
            if (!profiles.length) {
                throw new Error('No profile found');
            }
            return profiles[0]; // Assuming we only have one profile
        } catch (error: any) {
            throw new Error(`Failed to get profile: ${error.message}`);
        }
    }

    async createProfile(profileData: ICreateProfile): Promise<IProfile> {
        try {
            // Validate profile data
            this.validateProfileData(profileData);

            // Create profile
            const profile = await this.profileModel.create(profileData);
            return profile;
        } catch (error: any) {
            throw new Error(`Failed to create profile: ${error.message}`);
        }
    }

    async updateProfile(profileData: IUpdateProfile): Promise<IProfile> {
        try {
            const currentProfile = await this.getProfile();
            
            // Validate update data
            this.validateProfileData(profileData);

            // Update profile
            const updatedProfile = await this.profileModel.update(
                currentProfile.id,
                profileData
            );

            if (!updatedProfile) {
                throw new Error('Failed to update profile');
            }

            return updatedProfile;
        } catch (error: any) {
            throw new Error(`Failed to update profile: ${error.message}`);
        }
    }

    async updateAvatar(file: Express.Multer.File): Promise<IProfile> {
        try {
            // Upload avatar to storage
            const avatarUrl = await this.storageService.uploadFile(
                file,
                'avatars',
                ['image/jpeg', 'image/png']
            );

            // Update profile with new avatar URL
            const currentProfile = await this.getProfile();
            const updatedProfile = await this.profileModel.updateAvatar(
                currentProfile.id,
                avatarUrl
            );

            if (!updatedProfile) {
                throw new Error('Failed to update avatar');
            }

            // Delete old avatar if exists
            if (currentProfile.avatar) {
                await this.storageService.deleteFile(currentProfile.avatar);
            }

            return updatedProfile;
        } catch (error: any) {
            throw new Error(`Failed to update avatar: ${error.message}`);
        }
    }

    async updateResume(file: Express.Multer.File): Promise<IProfile> {
        try {
            // Upload resume to storage
            const resumeUrl = await this.storageService.uploadFile(
                file,
                'resumes',
                ['application/pdf']
            );

            // Update profile with new resume URL
            const currentProfile = await this.getProfile();
            const updatedProfile = await this.profileModel.updateResume(
                currentProfile.id,
                resumeUrl
            );

            if (!updatedProfile) {
                throw new Error('Failed to update resume');
            }

            // Delete old resume if exists
            if (currentProfile.resume) {
                await this.storageService.deleteFile(currentProfile.resume);
            }

            return updatedProfile;
        } catch (error: any) {
            throw new Error(`Failed to update resume: ${error.message}`);
        }
    }

    private validateProfileData(profileData: Partial<IProfile>): void {
        if (profileData.email && !this.isValidEmail(profileData.email)) {
            throw new Error('Invalid email format');
        }

        if (profileData.fullName && profileData.fullName.length < 2) {
            throw new Error('Full name must be at least 2 characters long');
        }

        if (profileData.bio && profileData.bio.length > 500) {
            throw new Error('Bio must not exceed 500 characters');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
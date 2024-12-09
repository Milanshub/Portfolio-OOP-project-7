import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { ICreateProfile, IUpdateProfile } from '../types/entities';

export class ProfileController {
    private profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const profile = await this.profileService.getProfile();
            res.status(200).json(profile);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const profileData: IUpdateProfile = req.body;
            const updatedProfile = await this.profileService.updateProfile(profileData);
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async uploadAvatar(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            const updatedProfile = await this.profileService.updateAvatar(req.file);
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async uploadResume(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            const updatedProfile = await this.profileService.updateResume(req.file);
            res.status(200).json(updatedProfile);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
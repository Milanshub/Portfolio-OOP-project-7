import { IProfile, IUpdateProfile } from '../types/entities';
import { ProfileService } from './ProfileService';
import { AdminService } from './AdminService';
import { Logger } from '../utils/logger';

export class AdminProfileService {
    private profileService: ProfileService;
    private adminService: AdminService;
    private logger = Logger.getInstance();

    constructor() {
        this.profileService = new ProfileService();
        this.adminService = new AdminService();
    }

    async manageProfile(adminId: string, profileData: IUpdateProfile): Promise<IProfile> {
        try {
            const admin = await this.adminService.getAdminById(adminId);
            if (!admin) {
                throw new Error('Admin not found');
            }

            const updatedProfile = await this.profileService.updateProfile(profileData);
            this.logger.info(`Profile managed successfully by admin: ${adminId}`);
            return updatedProfile;
        } catch (error: any) {
            this.logger.error(`Profile management failed: ${error.message}`);
            throw new Error(`Failed to manage profile: ${error.message}`);
        }
    }

    async updateAvatar(adminId: string, file: Express.Multer.File): Promise<IProfile> {
        try {
            await this.validateAdmin(adminId);
            return await this.profileService.updateAvatar(file);
        } catch (error: any) {
            this.logger.error(`Avatar update failed: ${error.message}`);
            throw new Error(`Failed to update avatar: ${error.message}`);
        }
    }

    async updateResume(adminId: string, file: Express.Multer.File): Promise<IProfile> {
        try {
            await this.validateAdmin(adminId);
            return await this.profileService.updateResume(file);
        } catch (error: any) {
            this.logger.error(`Resume update failed: ${error.message}`);
            throw new Error(`Failed to update resume: ${error.message}`);
        }
    }

    private async validateAdmin(adminId: string): Promise<void> {
        const admin = await this.adminService.getAdminById(adminId);
        if (!admin) {
            throw new Error('Unauthorized admin access');
        }
    }
}
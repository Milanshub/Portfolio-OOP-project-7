import { AdminProfileService } from '../../src/services/AdminProfileService';
import { AdminService } from '../../src/services/AdminService';
import { ProfileService } from '../../src/services/ProfileService';
import { Logger } from '../../src/utils/logger';
import { mockAdmin } from '../utils/mockHelpers';

// Mock all dependencies
jest.mock('../../src/services/AdminService');
jest.mock('../../src/services/ProfileService');

// Mock AnalyticsService (needed by AdminService)
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn(),
            generateAnalyticsReport: jest.fn()
        })
    }
}));

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));

describe('AdminProfileService', () => {
    let adminProfileService: AdminProfileService;
    let mockLogger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        adminProfileService = new AdminProfileService();
    });

    describe('manageProfile', () => {
        it('should manage profile successfully', async () => {
            const mockProfileData = {
                bio: 'Updated bio',
                skills: ['TypeScript', 'Node.js']
            };
            const mockUpdatedProfile = { 
                id: '1', 
                ...mockProfileData 
            };

            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
            (ProfileService.prototype.updateProfile as jest.Mock).mockResolvedValue(mockUpdatedProfile);

            const result = await adminProfileService.manageProfile('1', mockProfileData);

            expect(result).toEqual(mockUpdatedProfile);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('Profile managed successfully')
            );
        });

        it('should throw error for non-existent admin', async () => {
            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(null);

            await expect(adminProfileService.manageProfile('999', {}))
                .rejects.toThrow('Admin not found');
            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Profile management failed')
            );
        });

        it('should handle profile update errors', async () => {
            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
            (ProfileService.prototype.updateProfile as jest.Mock)
                .mockRejectedValue(new Error('Update failed'));

            await expect(adminProfileService.manageProfile('1', {}))
                .rejects.toThrow('Failed to manage profile');
            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Profile management failed')
            );
        });
    });

    describe('updateAvatar', () => {
        const mockFile = {
            filename: 'avatar.jpg'
        } as Express.Multer.File;

        it('should update avatar successfully', async () => {
            const mockUpdatedProfile = { 
                id: '1', 
                avatarUrl: 'path/to/avatar.jpg' 
            };

            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
            (ProfileService.prototype.updateAvatar as jest.Mock).mockResolvedValue(mockUpdatedProfile);

            const result = await adminProfileService.updateAvatar('1', mockFile);

            expect(result).toEqual(mockUpdatedProfile);
        });

        it('should throw error for unauthorized admin', async () => {
            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(null);

            await expect(adminProfileService.updateAvatar('999', mockFile))
                .rejects.toThrow('Unauthorized admin access');
            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Avatar update failed')
            );
        });
    });

    describe('updateResume', () => {
        const mockFile = {
            filename: 'resume.pdf'
        } as Express.Multer.File;

        it('should update resume successfully', async () => {
            const mockUpdatedProfile = { 
                id: '1', 
                resumeUrl: 'path/to/resume.pdf' 
            };

            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
            (ProfileService.prototype.updateResume as jest.Mock).mockResolvedValue(mockUpdatedProfile);

            const result = await adminProfileService.updateResume('1', mockFile);

            expect(result).toEqual(mockUpdatedProfile);
        });

        it('should throw error for unauthorized admin', async () => {
            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(null);

            await expect(adminProfileService.updateResume('999', mockFile))
                .rejects.toThrow('Unauthorized admin access');
            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Resume update failed')
            );
        });

        it('should handle resume update errors', async () => {
            (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
            (ProfileService.prototype.updateResume as jest.Mock)
                .mockRejectedValue(new Error('Update failed'));

            await expect(adminProfileService.updateResume('1', mockFile))
                .rejects.toThrow('Failed to update resume');
            expect(mockLogger.error).toHaveBeenCalledWith(
                expect.stringContaining('Resume update failed')
            );
        });
    });
});

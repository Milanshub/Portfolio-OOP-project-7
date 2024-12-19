import { ProfileService } from '../../src/services/ProfileService';
import { ProfileRepository } from '../../src/respositories/ProfileRepository';
import { StorageService } from '../../src/services/StorageService';
import { Logger } from '../../src/utils/logger';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockProfile, createMockFile } from '../utils/mockHelpers';

// Mock all dependencies
jest.mock('../../src/respositories/ProfileRepository');
jest.mock('../../src/services/StorageService');
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

describe('ProfileService', () => {
    let profileService: ProfileService;
    let mockStorageService: jest.Mocked<StorageService>;
    let mockLogger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        mockStorageService = new StorageService() as jest.Mocked<StorageService>;
        profileService = new ProfileService();
    });

    describe('getProfile', () => {
        it('should get profile successfully', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);

            const result = await profileService.getProfile();

            expect(result).toEqual(mockProfile);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it.skip('should throw AppError when no profile exists', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([]);

            await expect(profileService.getProfile())
                .rejects.toThrow(new AppError('No profile found', 404));
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            const dbError = new Error('Database error');
            (ProfileRepository.prototype.findAll as jest.Mock).mockRejectedValue(dbError);

            await expect(profileService.getProfile())
                .rejects.toThrow(new AppError('Failed to get profile: Database error', 500));
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get profile:',
                expect.any(Error)
            );
        });
    });

    describe('updateProfile', () => {
        const updateData = {
            fullName: 'Updated Name',
            title: 'Updated Title'
        };

        it('should update profile successfully', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (ProfileRepository.prototype.update as jest.Mock).mockResolvedValue({ ...mockProfile, ...updateData });

            const result = await profileService.updateProfile(updateData);

            expect(result.fullName).toBe(updateData.fullName);
            expect(result.title).toBe(updateData.title);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should throw error when update fails', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (ProfileRepository.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateProfile(updateData))
                .rejects.toThrow('Failed to update profile: Failed to update profile');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle database errors during update', async () => {
            const dbError = new Error('Database error');
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (ProfileRepository.prototype.update as jest.Mock).mockRejectedValue(dbError);

            await expect(profileService.updateProfile(updateData))
                .rejects.toThrow('Failed to update profile: Database error');
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to update profile:',
                expect.any(Error)
            );
        });
    });

    describe('updateAvatar', () => {
        const mockFile = createMockFile();
        const newAvatarUrl = 'new-avatar.jpg';

        it('should update avatar successfully', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newAvatarUrl);
            (ProfileRepository.prototype.updateAvatar as jest.Mock).mockResolvedValue({ ...mockProfile, avatar: newAvatarUrl });
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);

            const result = await profileService.updateAvatar(mockFile);

            expect(result.avatar).toBe(newAvatarUrl);
            expect(StorageService.prototype.uploadFile).toHaveBeenCalledWith(
                mockFile,
                'avatars',
                ['image/jpeg', 'image/png']
            );
            expect(StorageService.prototype.deleteFile).toHaveBeenCalledWith(mockProfile.avatar);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should throw error when avatar update fails', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newAvatarUrl);
            (ProfileRepository.prototype.updateAvatar as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateAvatar(mockFile))
                .rejects.toThrow('Failed to update avatar: Failed to update avatar');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle file upload errors', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockRejectedValue(new Error('Upload failed'));

            await expect(profileService.updateAvatar(mockFile))
                .rejects.toThrow('Failed to update avatar: Upload failed');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateResume', () => {
        const mockFile = createMockFile({ mimetype: 'application/pdf' });
        const newResumeUrl = 'new-resume.pdf';

        it('should update resume successfully', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newResumeUrl);
            (ProfileRepository.prototype.updateResume as jest.Mock).mockResolvedValue({ ...mockProfile, resume: newResumeUrl });
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);

            const result = await profileService.updateResume(mockFile);

            expect(result.resume).toBe(newResumeUrl);
            expect(StorageService.prototype.uploadFile).toHaveBeenCalledWith(
                mockFile,
                'resumes',
                ['application/pdf']
            );
            expect(StorageService.prototype.deleteFile).toHaveBeenCalledWith(mockProfile.resume);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should throw error when resume update fails', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newResumeUrl);
            (ProfileRepository.prototype.updateResume as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateResume(mockFile))
                .rejects.toThrow('Failed to update resume: Failed to update resume');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle file upload errors', async () => {
            (ProfileRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockRejectedValue(new Error('Upload failed'));

            await expect(profileService.updateResume(mockFile))
                .rejects.toThrow('Failed to update resume: Upload failed');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
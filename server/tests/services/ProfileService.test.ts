import { ProfileService } from '../../src/services/ProfileService';
import { Profile } from '../../src/models/Profile';
import { StorageService } from '../../src/services/StorageService';
import { Logger } from '../../src/utils/logger';
import { mockProfile, createMockFile } from '../utils/mockHelpers';

// Mock all dependencies
jest.mock('../../src/models/Profile');
jest.mock('../../src/services/StorageService');

// Mock Logger singleton
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => mockLogger
    }
}));

describe('ProfileService', () => {
    let profileService: ProfileService;
    let mockStorageService: jest.Mocked<StorageService>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockStorageService = new StorageService() as jest.Mocked<StorageService>;
        profileService = new ProfileService();
    });

    describe('getProfile', () => {
        it('should get profile successfully', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);

            const result = await profileService.getProfile();

            expect(result).toEqual(mockProfile);
        });

        it('should throw error when no profile exists', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([]);

            await expect(profileService.getProfile())
                .rejects.toThrow('No profile found');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle database errors', async () => {
            (Profile.prototype.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

            await expect(profileService.getProfile())
                .rejects.toThrow('Failed to get profile');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateProfile', () => {
        const updateData = {
            fullName: 'Updated Name',
            title: 'Updated Title'
        };

        it('should update profile successfully', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (Profile.prototype.update as jest.Mock).mockResolvedValue({ ...mockProfile, ...updateData });

            const result = await profileService.updateProfile(updateData);

            expect(result.fullName).toBe(updateData.fullName);
            expect(result.title).toBe(updateData.title);
        });

        it('should throw error when update fails', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (Profile.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateProfile(updateData))
                .rejects.toThrow('Failed to update profile');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateAvatar', () => {
        const mockFile = createMockFile();
        const newAvatarUrl = 'new-avatar.jpg';

        it('should update avatar successfully', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newAvatarUrl);
            (Profile.prototype.updateAvatar as jest.Mock).mockResolvedValue({ ...mockProfile, avatar: newAvatarUrl });
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);

            const result = await profileService.updateAvatar(mockFile);

            expect(result.avatar).toBe(newAvatarUrl);
            expect(StorageService.prototype.uploadFile).toHaveBeenCalledWith(
                mockFile,
                'avatars',
                ['image/jpeg', 'image/png']
            );
            expect(StorageService.prototype.deleteFile).toHaveBeenCalledWith(mockProfile.avatar);
        });

        it('should throw error when avatar update fails', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newAvatarUrl);
            (Profile.prototype.updateAvatar as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateAvatar(mockFile))
                .rejects.toThrow('Failed to update avatar');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateResume', () => {
        const mockFile = createMockFile({ mimetype: 'application/pdf' });
        const newResumeUrl = 'new-resume.pdf';

        it('should update resume successfully', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newResumeUrl);
            (Profile.prototype.updateResume as jest.Mock).mockResolvedValue({ ...mockProfile, resume: newResumeUrl });
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);

            const result = await profileService.updateResume(mockFile);

            expect(result.resume).toBe(newResumeUrl);
            expect(StorageService.prototype.uploadFile).toHaveBeenCalledWith(
                mockFile,
                'resumes',
                ['application/pdf']
            );
            expect(StorageService.prototype.deleteFile).toHaveBeenCalledWith(mockProfile.resume);
        });

        it('should throw error when resume update fails', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue(newResumeUrl);
            (Profile.prototype.updateResume as jest.Mock).mockResolvedValue(null);

            await expect(profileService.updateResume(mockFile))
                .rejects.toThrow('Failed to update resume');
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('should handle file upload errors', async () => {
            (Profile.prototype.findAll as jest.Mock).mockResolvedValue([mockProfile]);
            (StorageService.prototype.uploadFile as jest.Mock).mockRejectedValue(new Error('Upload failed'));

            await expect(profileService.updateResume(mockFile))
                .rejects.toThrow('Failed to update resume');
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
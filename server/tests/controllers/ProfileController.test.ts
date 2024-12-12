import { Request, Response } from 'express';
import { ProfileController } from '../../src/controllers/ProfileController';
import { ProfileService } from '../../src/services/ProfileService';
import { mockProfile, mockRequest, mockResponse, createMockFile } from '../utils/mockHelpers';
import { fileHelpers } from '../../src/utils/helpers/fileHelpers';
import { profileValidator } from '../../src/utils/validators/profileValidator';


jest.mock('../../src/services/ProfileService');
jest.mock('../../src/utils/validators/profileValidator');
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            error: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));
jest.mock('../../src/utils/helpers/fileHelpers');
jest.mock('../../src/utils/validators/profileValidator', () => ({
    profileValidator: {
        validateUpdate: jest.fn((data) => {
            if (!data.fullName || data.fullName.trim() === '') {
                return ['Full name cannot be empty'];
            }
            return [];
        })
    }
}));

describe('ProfileController', () => {
    let profileController: ProfileController;

    beforeEach(() => {
        jest.clearAllMocks();
        profileController = new ProfileController();
    });

    describe('getProfile', () => {
        it('should return profile successfully', async () => {
            jest.spyOn(ProfileService.prototype, 'getProfile')
                .mockResolvedValue(mockProfile);

            const req = mockRequest();
            const res = mockResponse();

            await profileController.getProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfile);
        });

        it('should handle errors appropriately', async () => {
            jest.spyOn(ProfileService.prototype, 'getProfile')
                .mockRejectedValue(new Error('Database error'));

            const req = mockRequest();
            const res = mockResponse();

            await profileController.getProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    
describe('updateProfile', () => {
    it('should update profile successfully', async () => {
        const updatedProfile = { ...mockProfile, fullName: 'Updated Name' };
        
        // Mock validator to return no errors
        (profileValidator.validateUpdate as jest.Mock).mockReturnValue([]);
        
        jest.spyOn(ProfileService.prototype, 'updateProfile')
            .mockResolvedValue(updatedProfile);

        const req = mockRequest({
            body: { fullName: 'Updated Name' }
        });
        const res = mockResponse();

        await profileController.updateProfile(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedProfile);
    });

    it('should handle validation errors', async () => {
        // Mock validator to return errors
        (profileValidator.validateUpdate as jest.Mock).mockReturnValue(['Full name cannot be empty']);

        const req = mockRequest({
            body: { fullName: '' }
        });
        const res = mockResponse();

        await profileController.updateProfile(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: ['Full name cannot be empty']
        });
    });
});

    describe('uploadAvatar', () => {
        it('should upload avatar successfully', async () => {
            const mockFile = createMockFile({
                mimetype: 'image/jpeg',
                filename: 'avatar.jpg'
            });

            jest.spyOn(fileHelpers, 'isValidImageType').mockReturnValue(true);
            jest.spyOn(fileHelpers, 'getFileSizeInMB').mockReturnValue(1);
            jest.spyOn(ProfileService.prototype, 'updateAvatar')
                .mockResolvedValue(mockProfile);

            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await profileController.uploadAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfile);
        });

        it('should reject invalid file types', async () => {
            const mockFile = createMockFile({
                mimetype: 'text/plain',
                filename: 'not-an-image.txt'
            });

            jest.spyOn(fileHelpers, 'isValidImageType').mockReturnValue(false);

            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await profileController.uploadAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid file type' });
        });

        it('should reject large files', async () => {
            const mockFile = createMockFile({
                size: 6 * 1024 * 1024 // 6MB
            });

            jest.spyOn(fileHelpers, 'isValidImageType').mockReturnValue(true);
            jest.spyOn(fileHelpers, 'getFileSizeInMB').mockReturnValue(6);

            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await profileController.uploadAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'File size must be less than 5MB' });
        });

        it('should handle missing file', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await profileController.uploadAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
        });
    });

    describe('uploadResume', () => {
        it('should upload resume successfully', async () => {
            const mockFile = createMockFile({
                originalname: 'resume.pdf',
                mimetype: 'application/pdf'
            });

            jest.spyOn(fileHelpers, 'getFileExtension').mockReturnValue('.pdf');
            jest.spyOn(ProfileService.prototype, 'updateResume')
                .mockResolvedValue(mockProfile);

            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await profileController.uploadResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfile);
        });

        it('should reject invalid file types', async () => {
            const mockFile = createMockFile({
                originalname: 'invalid.txt',
                mimetype: 'text/plain'
            });

            jest.spyOn(fileHelpers, 'getFileExtension').mockReturnValue('.txt');

            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await profileController.uploadResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid file type' });
        });

        it('should handle missing file', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await profileController.uploadResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
        });
    });
});
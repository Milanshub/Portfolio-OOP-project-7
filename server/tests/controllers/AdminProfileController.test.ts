import { Request, Response } from 'express';
import { AdminProfileController } from '../../src/controllers/AdminProfileController';
import { AdminProfileService } from '../../src/services/AdminProfileService';
import { mockRequest, mockResponse, mockProfile, createMockFile } from '../utils/mockHelpers';

// Mock all required dependencies
jest.mock('../../src/services/AdminProfileService');
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn(),
            logPageView: jest.fn(),
            logError: jest.fn()
        })
    }
}));
jest.mock('../../src/services/AdminService', () => ({
    AdminService: jest.fn().mockImplementation(() => ({
        getAdminById: jest.fn(),
        validateAdmin: jest.fn()
    }))
}));
jest.mock('../../src/utils/cache', () => ({
    Cache: jest.fn().mockImplementation(() => ({
        get: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
        clear: jest.fn()
    }))
}));
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

describe('AdminProfileController', () => {
    let adminProfileController: AdminProfileController;

    beforeEach(() => {
        jest.clearAllMocks();
        adminProfileController = new AdminProfileController();
    });

    describe('manageProfile', () => {
        it('should update admin profile successfully', async () => {
            const req = mockRequest({
                params: { adminId: '1' },
                body: {
                    fullName: 'John Doe',
                    email: 'john@example.com'
                }
            });
            const res = mockResponse();

            jest.spyOn(AdminProfileService.prototype, 'manageProfile')
                .mockResolvedValue(mockProfile);

            await adminProfileController.manageProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfile);
        });

        it('should handle missing admin ID', async () => {
            const req = mockRequest({
                body: { fullName: 'John Doe' }
            });
            const res = mockResponse();

            await adminProfileController.manageProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Admin ID is required' });
        });

        it('should handle service errors', async () => {
            const req = mockRequest({
                params: { adminId: '1' },
                body: { fullName: 'John Doe' }
            });
            const res = mockResponse();

            jest.spyOn(AdminProfileService.prototype, 'manageProfile')
                .mockRejectedValue(new Error('Service error'));

            await adminProfileController.manageProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateAvatar', () => {
        it('should update avatar successfully', async () => {
            const mockFile = createMockFile({
                originalname: 'avatar.jpg',
                mimetype: 'image/jpeg'
            });

            const req = mockRequest({
                params: { adminId: '1' },
                file: mockFile
            });
            const res = mockResponse();

            jest.spyOn(AdminProfileService.prototype, 'updateAvatar')
                .mockResolvedValue(mockProfile);

            await adminProfileController.updateAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfile);
        });

        it('should handle missing file', async () => {
            const req = mockRequest({
                params: { adminId: '1' }
            });
            const res = mockResponse();

            await adminProfileController.updateAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Avatar file is required' });
        });

        it('should handle missing admin ID', async () => {
            const mockFile = createMockFile();
            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await adminProfileController.updateAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Admin ID is required' });
        });

        it('should handle service errors', async () => {
            const mockFile = createMockFile();
            const req = mockRequest({
                params: { adminId: '1' },
                file: mockFile
            });
            const res = mockResponse();

            jest.spyOn(AdminProfileService.prototype, 'updateAvatar')
                .mockRejectedValue(new Error('Service error'));

            await adminProfileController.updateAvatar(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });

    describe('updateResume', () => {
        it('should update resume successfully', async () => {
            const mockFile = createMockFile({
                originalname: 'resume.pdf',
                mimetype: 'application/pdf'
            });

            const req = mockRequest({
                params: { adminId: '1' },
                file: mockFile
            });
            const res = mockResponse();

            jest.spyOn(AdminProfileService.prototype, 'updateResume')
                .mockResolvedValue(mockProfile);

            await adminProfileController.updateResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProfile);
        });

        it('should handle missing file', async () => {
            const req = mockRequest({
                params: { adminId: '1' }
            });
            const res = mockResponse();

            await adminProfileController.updateResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Resume file is required' });
        });

        it('should handle missing admin ID', async () => {
            const mockFile = createMockFile({
                originalname: 'resume.pdf',
                mimetype: 'application/pdf'
            });
            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await adminProfileController.updateResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Admin ID is required' });
        });

        it('should handle service errors', async () => {
            const mockFile = createMockFile({
                originalname: 'resume.pdf',
                mimetype: 'application/pdf'
            });
            const req = mockRequest({
                params: { adminId: '1' },
                file: mockFile
            });
            const res = mockResponse();

            jest.spyOn(AdminProfileService.prototype, 'updateResume')
                .mockRejectedValue(new Error('Service error'));

            await adminProfileController.updateResume(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Service error' });
        });
    });
});
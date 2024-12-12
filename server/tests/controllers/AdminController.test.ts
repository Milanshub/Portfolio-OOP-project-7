import { Request, Response } from 'express';
import { AdminController } from '../../src/controllers/AdminController';
import { mockRequest, mockResponse, mockAdmin } from '../utils/mockHelpers';
import { AdminService } from '../../src/services/AdminService';

// Mock the dependencies
jest.mock('../../src/services/AdminService');
jest.mock('../../src/utils/cache');

// Mock the Logger
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

// Mock AnalyticsObserver singleton
jest.mock('../../src/utils/observers/analyticsObservers', () => ({
    AnalyticsObserver: {
        getInstance: () => ({
            trackEvent: jest.fn()
        })
    }
}));

describe('AdminController', () => {
    let adminController: AdminController;

    beforeEach(() => {
        adminController = new AdminController();
        jest.clearAllMocks();
        
        // Mock successful service responses
        (AdminService.prototype.login as jest.Mock).mockResolvedValue({ token: 'mock-token' });
        (AdminService.prototype.createAdmin as jest.Mock).mockResolvedValue(mockAdmin);
        (AdminService.prototype.updateAdmin as jest.Mock).mockResolvedValue(mockAdmin);
        (AdminService.prototype.deleteAdmin as jest.Mock).mockResolvedValue(true);
        (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
    });

    describe('login', () => {
        it('should login admin successfully', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            });
            const res = mockResponse();

            await adminController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'mock-token' });
        });

        it('should reject invalid email format', async () => {
            const req = mockRequest({
                body: {
                    email: 'invalid-email',
                    password: 'password123'
                }
            });
            const res = mockResponse();

            await adminController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
        });
    });

    describe('createAdmin', () => {
        it('should create admin successfully', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test Admin'
                }
            });
            const res = mockResponse();

            await adminController.createAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockAdmin);
        });

        it('should validate admin data', async () => {
            const req = mockRequest({
                body: {
                    email: 'invalid-email',
                    password: '123', // too short
                    name: ''
                }
            });
            const res = mockResponse();

            await adminController.createAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    'Invalid email format',
                    'Password must be at least 8 characters long',
                    'Name is required'
                ])
            });
        });
    });

    describe('updateAdmin', () => {
        it('should update admin successfully', async () => {
            const req = mockRequest({
                params: { id: '1' },
                body: {
                    name: 'Updated Name',
                    email: 'updated@example.com'
                }
            });
            const res = mockResponse();

            await adminController.updateAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAdmin);
        });

        it('should validate update data', async () => {
            const req = mockRequest({
                params: { id: '1' },
                body: {
                    email: 'invalid-email',
                    password: '123'
                }
            });
            const res = mockResponse();

            await adminController.updateAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                errors: expect.arrayContaining([
                    'Invalid email format',
                    'Password must be at least 8 characters long'
                ])
            });
        });
    });

    describe('deleteAdmin', () => {
        it('should delete admin successfully', async () => {
            const req = mockRequest({
                params: { id: '1' }
            });
            const res = mockResponse();

            await adminController.deleteAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Admin deleted successfully' });
        });

        it('should handle not found error', async () => {
            const req = mockRequest({
                params: { id: 'non-existent' }
            });
            const res = mockResponse();

            (AdminService.prototype.deleteAdmin as jest.Mock)
                .mockRejectedValueOnce(new Error('Admin not found'));

            await adminController.deleteAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Admin not found' });
        });
    });

    describe('getAdminProfile', () => {
        it('should get admin profile successfully', async () => {
            const req = mockRequest({
                params: { id: '1' }
            });
            const res = mockResponse();

            await adminController.getAdminProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAdmin);
        });

        it('should return 404 for non-existent admin', async () => {
            const req = mockRequest({
                params: { id: 'non-existent' }
            });
            const res = mockResponse();

            (AdminService.prototype.getAdminById as jest.Mock)
                .mockRejectedValueOnce(new Error('Admin not found'));

            await adminController.getAdminProfile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Admin not found' });
        });
    });
});
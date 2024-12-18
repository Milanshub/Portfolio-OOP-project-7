import { Request, Response } from 'express';
import { AdminController } from '../../src/controllers/AdminController';
import { AdminService } from '../../src/services/AdminService';
import { AuthService } from '../../src/services/AuthService';
import { mockRequest, mockResponse, mockAdmin } from '../utils/mockHelpers';

// Mock dependencies
jest.mock('../../src/services/AdminService');
jest.mock('../../src/services/AuthService');
jest.mock('../../src/utils/cache');
jest.mock('resend', () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ id: 'mock-email-id' })
        }
    }))
}));

jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn(),
            logPageView: jest.fn(),
            logError: jest.fn()
        })
    }
}));

jest.mock('../../src/utils/observers/analyticsObservers', () => ({
    AnalyticsObserver: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn()
        })
    }
}));

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
        })
    }
}));

describe('AdminController', () => {
    let adminController: AdminController;
    let mockAuthService: jest.Mocked<AuthService>;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockAuthService = {
            login: jest.fn().mockResolvedValue({ token: 'mock-token', admin: mockAdmin }),
            getInstance: jest.fn()
        } as any;

        (AuthService.getInstance as jest.Mock).mockReturnValue(mockAuthService);
        
        (AdminService.prototype.createAdmin as jest.Mock).mockResolvedValue(mockAdmin);
        (AdminService.prototype.updateAdmin as jest.Mock).mockResolvedValue(mockAdmin);
        (AdminService.prototype.deleteAdmin as jest.Mock).mockResolvedValue(true);
        (AdminService.prototype.getAdminById as jest.Mock).mockResolvedValue(mockAdmin);
        (AdminService.prototype.getAllAdmins as jest.Mock).mockResolvedValue([mockAdmin]);
        (AdminService.prototype.validateCredentials as jest.Mock).mockResolvedValue(mockAdmin);
        (AdminService.prototype.viewAnalytics as jest.Mock).mockResolvedValue({ visits: 100, actions: 50 });
        
        adminController = new AdminController();
    });

    describe('login', () => {
        it('should login admin successfully', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'StrongPassword123!'
                }
            });
            const res = mockResponse();

            await adminController.login(req as Request, res as Response);

            expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'StrongPassword123!');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'mock-token', admin: mockAdmin });
        });

        it('should reject invalid email format', async () => {
            const req = mockRequest({
                body: {
                    email: 'invalid-email',
                    password: 'StrongPassword123!'
                }
            });
            const res = mockResponse();

            await adminController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
        });

        it('should reject weak password', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'weak'
                }
            });
            const res = mockResponse();

            await adminController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password format' });
        });
    });

    describe('createAdmin', () => {
        it('should create admin successfully', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'StrongPassword123!',
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
                    password: 'weak',
                    name: ''
                }
            });
            const res = mockResponse();

            await adminController.createAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.stringContaining('Invalid email format')
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
                    email: 'invalid-email'
                }
            });
            const res = mockResponse();

            await adminController.updateAdmin(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: expect.stringContaining('Invalid email format')
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
    });

    describe('getAllAdmins', () => {
        it('should fetch all admins successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockAdmins = [mockAdmin, { ...mockAdmin, id: '2' }];

            (AdminService.prototype.getAllAdmins as jest.Mock).mockResolvedValue(mockAdmins);

            await adminController.getAllAdmins(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAdmins);
        });
    });

    describe('viewAnalytics', () => {
        it('should fetch analytics successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const mockAnalytics = { visits: 100, actions: 50 };

            await adminController.viewAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAnalytics);
        });

        it('should handle errors', async () => {
            const req = mockRequest();
            const res = mockResponse();

            (AdminService.prototype.viewAnalytics as jest.Mock)
                .mockRejectedValue(new Error('Analytics service error'));

            await adminController.viewAnalytics(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Analytics service error' 
            });
        });
    });
});
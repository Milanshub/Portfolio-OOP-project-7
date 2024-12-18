import { Request, Response } from 'express';
import { AuthController } from '../../src/controllers/AuthController';
import { AuthService } from '../../src/services/AuthService';
import { 
    mockRequest, 
    mockResponse, 
    mockAdmin, 
    mockAuthResponse,
    AuthRequest 
} from '../utils/mockHelpers';

// Define MockAuthService type
interface MockAuthService {
    login: jest.Mock;
    logout: jest.Mock;
    validateToken: jest.Mock;
    refreshToken: jest.Mock;
    generateToken: jest.Mock;
    invalidateToken: jest.Mock;
}

// Mock dependencies
jest.mock('../../src/services/AuthService');
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn()
        })
    }
}));
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn()
        })
    }
}));

// Mock email service
jest.mock('../../src/utils/emailSender', () => ({
    sendEmail: jest.fn()
}));

describe('AuthController', () => {
    let authController: AuthController;
    let mockAuthService: MockAuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockAuthService = {
            login: jest.fn().mockResolvedValue(mockAuthResponse),
            logout: jest.fn().mockResolvedValue(true),
            validateToken: jest.fn().mockResolvedValue(mockAuthResponse.admin),
            refreshToken: jest.fn().mockResolvedValue(mockAuthResponse),
            generateToken: jest.fn().mockReturnValue(mockAuthResponse.token),
            invalidateToken: jest.fn()
        };

        (AuthService as any).getInstance = jest.fn().mockReturnValue(mockAuthService);
        authController = new AuthController();
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'Password123!'
                }
            });
            const res = mockResponse();

            await authController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAuthResponse);
        });

        it('should handle missing credentials', async () => {
            const req = mockRequest({
                body: {}
            });
            const res = mockResponse();

            await authController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Invalid email format' 
            });
        });

        it.skip('should handle invalid credentials', async () => {
            const req = mockRequest({
                body: {
                    email: 'test@example.com',
                    password: 'wrongpassword'
                }
            });
            const res = mockResponse();

            mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

            await authController.login(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Invalid credentials' 
            });
        });
    });

    describe('logout', () => {
        it('should logout successfully', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer valid-token' }
            });
            const res = mockResponse();

            await authController.logout(req as Request, res as Response);

            expect(mockAuthService.invalidateToken).toHaveBeenCalledWith('valid-token');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'Logged out successfully' 
            });
        });

        it('should handle missing token', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await authController.logout(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'No token provided' 
            });
        });
    });

    describe('validateToken', () => {
        it.skip('should validate token successfully', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer valid-token' }
            });
            const res = mockResponse();

            await authController.validateToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ 
                valid: true, 
                admin: mockAuthResponse.admin 
            });
        });

        it('should handle missing token', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await authController.validateToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ 
                valid: false, 
                error: 'No token provided' 
            });
        });

        it('should handle invalid token', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer invalid-token' }
            });
            const res = mockResponse();

            mockAuthService.validateToken.mockRejectedValue(new Error('Invalid token'));

            await authController.validateToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ 
                valid: false, 
                error: 'Invalid token' 
            });
        });
    });

    describe('refreshToken', () => {
        it('should refresh token successfully', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer valid-token' }
            });
            const res = mockResponse();

            await authController.refreshToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAuthResponse);
        });

        it('should handle missing token', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await authController.refreshToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'No token provided' 
            });
        });

        it('should handle invalid token', async () => {
            const req = mockRequest({
                headers: { authorization: 'Bearer invalid-token' }
            });
            const res = mockResponse();

            mockAuthService.refreshToken.mockRejectedValue(new Error('Invalid token'));

            await authController.refreshToken(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Invalid token' 
            });
        });
    });
});
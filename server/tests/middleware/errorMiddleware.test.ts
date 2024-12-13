import { Request, Response, NextFunction } from 'express';
import { ValidationMiddleware } from '../../src/middleware/validationMiddleware';
import { mockRequest, mockResponse } from '../utils/mockHelpers';
import { AppError } from '../../src/middleware/errorMiddleware';

// Mock Logger
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            error: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

// Mock AnalyticsObserver
jest.mock('../../src/utils/observers/analyticsObservers', () => ({
    AnalyticsObserver: {
        getInstance: () => ({
            trackPageView: jest.fn(),
            trackEvent: jest.fn()
        })
    }
}));

describe('ValidationMiddleware', () => {
    let validationMiddleware: ValidationMiddleware;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        validationMiddleware = ValidationMiddleware.getInstance();
        mockNext = jest.fn();
    });

    describe('validateProject', () => {
        it('should pass validation with valid project data', () => {
            const req = mockRequest({
                body: {
                    title: 'Test Project',
                    description: 'Test Description'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProject(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });

        it('should fail validation with missing title', () => {
            const req = mockRequest({
                body: {
                    description: 'Test Description'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProject(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Title is required',
                    statusCode: 400
                })
            );
        });

        it('should fail validation with missing description', () => {
            const req = mockRequest({
                body: {
                    title: 'Test Project'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProject(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Description is required',
                    statusCode: 400
                })
            );
        });
    });

    describe('validateProfile', () => {
        it('should pass validation with valid profile data', () => {
            const req = mockRequest({
                body: {
                    fullName: 'John Doe',
                    email: 'john@example.com'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProfile(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith();
        });

        it('should fail validation with missing fullName', () => {
            const req = mockRequest({
                body: {
                    email: 'john@example.com'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProfile(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Full name is required',
                    statusCode: 400
                })
            );
        });

        it('should fail validation with missing email', () => {
            const req = mockRequest({
                body: {
                    fullName: 'John Doe'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProfile(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Email is required',
                    statusCode: 400
                })
            );
        });

        it('should fail validation with invalid email format', () => {
            const req = mockRequest({
                body: {
                    fullName: 'John Doe',
                    email: 'invalid-email'
                }
            });
            const res = mockResponse();

            validationMiddleware.validateProfile(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid email format',
                    statusCode: 400
                })
            );
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct email formats', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.com',
                'user+label@domain.co.uk'
            ];

            validEmails.forEach(email => {
                expect((validationMiddleware as any).isValidEmail(email)).toBe(true);
            });
        });

        it('should invalidate incorrect email formats', () => {
            const invalidEmails = [
                'invalid-email',
                'user@',
                '@domain.com',
                'user@domain',
                'user space@domain.com'
            ];

            invalidEmails.forEach(email => {
                expect((validationMiddleware as any).isValidEmail(email)).toBe(false);
            });
        });
    });
});
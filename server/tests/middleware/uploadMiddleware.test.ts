import { Request, Response, NextFunction } from 'express';
import { UploadMiddleware } from '../../src/middleware/uploadMiddleware';
import { mockRequest, mockResponse, createMockFile } from '../utils/mockHelpers';
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

// Mock Supabase
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        storage: {
            from: jest.fn().mockReturnValue({
                upload: jest.fn().mockResolvedValue({ error: null }),
                getPublicUrl: jest.fn().mockReturnValue({ 
                    data: { publicUrl: 'https://example.com/test.jpg' }
                })
            })
        }
    }
}));

describe('UploadMiddleware', () => {
    let uploadMiddleware: UploadMiddleware;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        uploadMiddleware = UploadMiddleware.getInstance();
        mockNext = jest.fn();
    });

    describe('uploadFile', () => {
        const testBucket = 'test-bucket';

        it('should handle single file upload successfully', async () => {
            const mockFile = createMockFile();
            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await uploadMiddleware.uploadFile(testBucket)(req as Request, res as Response, mockNext);

            expect(req.uploadedFile).toEqual({
                url: 'https://example.com/test.jpg'
            });
            expect(mockNext).toHaveBeenCalled();
        });

        it('should handle multiple files upload successfully', async () => {
            const mockFiles = [
                createMockFile({ originalname: 'test1.jpg' }),
                createMockFile({ originalname: 'test2.jpg' })
            ];
            const req = mockRequest({
                files: mockFiles
            });
            const res = mockResponse();

            await uploadMiddleware.uploadFile(testBucket)(req as Request, res as Response, mockNext);

            expect(req.uploadedFiles).toHaveLength(2);
            expect(req.uploadedFiles).toEqual([
                { url: 'https://example.com/test.jpg' },
                { url: 'https://example.com/test.jpg' }
            ]);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should throw error when no file is provided', async () => {
            const req = mockRequest();
            const res = mockResponse();

            await uploadMiddleware.uploadFile(testBucket)(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'No file uploaded',
                    statusCode: 400
                })
            );
        });

        it('should handle storage upload error', async () => {
            // Mock storage upload error
            const mockError = new Error('Storage error');
            jest.spyOn(require('../../src/config/supabase').supabase.storage, 'from')
                .mockReturnValue({
                    upload: jest.fn().mockResolvedValue({ error: mockError }),
                    getPublicUrl: jest.fn()
                });

            const mockFile = createMockFile();
            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await uploadMiddleware.uploadFile(testBucket)(req as Request, res as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: mockError.message,
                    statusCode: 500
                })
            );
        });
    });

    describe('Singleton Instance', () => {
        it('should return the same instance', () => {
            const instance1 = UploadMiddleware.getInstance();
            const instance2 = UploadMiddleware.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('File Naming', () => {
        it('should generate unique file names', async () => {
            // Mock Date.now and Math.random for predictable file names
            const mockDate = 1234567890;
            const mockRandom = 0.123456789;
            jest.spyOn(Date, 'now').mockReturnValue(mockDate);
            jest.spyOn(Math, 'random').mockReturnValue(mockRandom);

            const mockFile = createMockFile({
                originalname: 'test.jpg'
            });
            const req = mockRequest({
                file: mockFile
            });
            const res = mockResponse();

            await uploadMiddleware.uploadFile('test-bucket')(req as Request, res as Response, mockNext);

            expect(require('../../src/config/supabase').supabase.storage.from().upload)
                .toHaveBeenCalledWith(
                    expect.stringContaining(`${mockDate}`),
                    expect.any(Buffer),
                    expect.any(Object)
                );
        });
    });
});
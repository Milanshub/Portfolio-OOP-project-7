import { Request, Response } from 'express';
import { StorageController } from '../../src/controllers/StorageController';
import { StorageService } from '../../src/services/StorageService';
import { mockRequest, mockResponse } from '../utils/mockHelpers';

// Mock dependencies
jest.mock('../../src/services/StorageService');
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn()
        })
    }
}));

describe('StorageController', () => {
    let storageController: StorageController;
    let mockStorageService: jest.Mocked<StorageService>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockStorageService = {
            uploadFile: jest.fn().mockResolvedValue('https://storage.com/test-file.jpg'),
            deleteFile: jest.fn().mockResolvedValue(undefined)
        } as any;

        (StorageService as jest.Mock).mockImplementation(() => mockStorageService);
        storageController = new StorageController();
    });

    describe('uploadFile', () => {
        it('should upload file successfully', async () => {
            const mockFile = {
                originalname: 'test.jpg',
                mimetype: 'image/jpeg',
                buffer: Buffer.from('test'),
                size: 1024
            } as Express.Multer.File;

            const req = mockRequest({
                file: mockFile,
                body: {
                    bucket: 'test-bucket',
                    allowedTypes: JSON.stringify(['image/jpeg', 'image/png'])
                }
            });
            const res = mockResponse();

            await storageController.uploadFile(req as Request, res as Response);

            expect(mockStorageService.uploadFile).toHaveBeenCalledWith(
                mockFile,
                'test-bucket',
                ['image/jpeg', 'image/png']
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                url: 'https://storage.com/test-file.jpg'
            });
        });

        it('should handle missing file', async () => {
            const req = mockRequest({
                body: {
                    bucket: 'test-bucket',
                    allowedTypes: JSON.stringify(['image/jpeg'])
                }
            });
            const res = mockResponse();

            await storageController.uploadFile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'No file uploaded'
            });
        });

        it('should handle invalid file type', async () => {
            const mockFile = {
                originalname: 'test.txt',
                mimetype: 'text/plain',
                buffer: Buffer.from('test'),
                size: 1024
            } as Express.Multer.File;

            const req = mockRequest({
                file: mockFile,
                body: {
                    bucket: 'test-bucket',
                    allowedTypes: JSON.stringify(['image/jpeg', 'image/png'])
                }
            });
            const res = mockResponse();

            await storageController.uploadFile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid file type. Allowed types: image/jpeg, image/png'
            });
        });
    });

    describe('deleteFile', () => {
        it('should delete file successfully', async () => {
            const req = mockRequest({
                body: {
                    fileUrl: 'https://storage.com/test-file.jpg'
                }
            });
            const res = mockResponse();

            await storageController.deleteFile(req as Request, res as Response);

            expect(mockStorageService.deleteFile).toHaveBeenCalledWith(
                'https://storage.com/test-file.jpg'
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File deleted successfully'
            });
        });

        it('should handle missing file URL', async () => {
            const req = mockRequest({
                body: {}
            });
            const res = mockResponse();

            await storageController.deleteFile(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'File URL is required'
            });
        });
    });

    describe('uploadMultipleFiles', () => {
        it('should upload multiple files successfully', async () => {
            const mockFiles = [
                {
                    originalname: 'test1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('test1'),
                    size: 1024
                },
                {
                    originalname: 'test2.png',
                    mimetype: 'image/png',
                    buffer: Buffer.from('test2'),
                    size: 1024
                }
            ] as Express.Multer.File[];

            const req = mockRequest({
                files: mockFiles,
                body: {
                    bucket: 'test-bucket',
                    allowedTypes: JSON.stringify(['image/jpeg', 'image/png'])
                }
            });
            const res = mockResponse();

            mockStorageService.uploadFile
                .mockResolvedValueOnce('https://storage.com/test1.jpg')
                .mockResolvedValueOnce('https://storage.com/test2.png');

            await storageController.uploadMultipleFiles(req as Request, res as Response);

            expect(mockStorageService.uploadFile).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                urls: [
                    'https://storage.com/test1.jpg',
                    'https://storage.com/test2.png'
                ]
            });
        });

        it('should handle missing files', async () => {
            const req = mockRequest({
                body: {
                    bucket: 'test-bucket',
                    allowedTypes: JSON.stringify(['image/jpeg', 'image/png'])
                }
            });
            const res = mockResponse();

            await storageController.uploadMultipleFiles(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'No files uploaded'
            });
        });

        it('should handle invalid file type in multiple upload', async () => {
            const mockFiles = [
                {
                    originalname: 'test1.jpg',
                    mimetype: 'image/jpeg',
                    buffer: Buffer.from('test1'),
                    size: 1024
                },
                {
                    originalname: 'test2.txt',
                    mimetype: 'text/plain',
                    buffer: Buffer.from('test2'),
                    size: 1024
                }
            ] as Express.Multer.File[];

            const req = mockRequest({
                files: mockFiles,
                body: {
                    bucket: 'test-bucket',
                    allowedTypes: JSON.stringify(['image/jpeg', 'image/png'])
                }
            });
            const res = mockResponse();

            await storageController.uploadMultipleFiles(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid file type for test2.txt'
            });
        });
    });
});
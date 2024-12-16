import { StorageService } from '../../src/services/StorageService';
import { supabase } from '../../src/config/supabase';
import { Logger } from '../../src/utils/logger';
import { createMockFile } from '../utils/mockHelpers';

// Mock Supabase storage
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        storage: {
            from: jest.fn().mockReturnThis(),
            upload: jest.fn(),
            remove: jest.fn(),
            getPublicUrl: jest.fn()
        }
    }
}));

// Mock Logger
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

describe('StorageService', () => {
    let storageService: StorageService;
    const mockBucket = 'test-bucket';

    beforeEach(() => {
        jest.clearAllMocks();
        storageService = new StorageService();
    });

    describe('uploadFile', () => {
        const mockFile = createMockFile();
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        const mockPath = 'test-file.jpg';
        const mockPublicUrl = 'https://example.com/test-bucket/test-file.jpg';

        it('should upload file successfully', async () => {
            const mockUploadResponse = {
                data: { path: mockPath },
                error: null
            };

            const mockPublicUrlResponse = {
                data: { publicUrl: mockPublicUrl }
            };

            (supabase.storage.from as jest.Mock).mockImplementation(() => ({
                upload: jest.fn().mockResolvedValue(mockUploadResponse),
                getPublicUrl: jest.fn().mockReturnValue(mockPublicUrlResponse)
            }));

            const result = await storageService.uploadFile(mockFile, mockBucket, allowedMimeTypes);

            expect(result).toBe(mockPublicUrl);
            expect(supabase.storage.from).toHaveBeenCalledWith(mockBucket);
            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.stringContaining('Uploading file:')
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('File uploaded successfully')
            );
        });

        it('should throw error for invalid mime type', async () => {
            const invalidFile = createMockFile({ mimetype: 'invalid/type' });

            await expect(storageService.uploadFile(invalidFile, mockBucket, allowedMimeTypes))
                .rejects
                .toThrow('Invalid file type');

            expect(mockLogger.warn).toHaveBeenCalledWith(
                expect.stringContaining('Invalid file type attempted')
            );
        });

        it('should handle upload errors', async () => {
            const mockError = new Error('Upload failed');
            (supabase.storage.from as jest.Mock).mockImplementation(() => ({
                upload: jest.fn().mockResolvedValue({
                    data: null,
                    error: mockError
                })
            }));

            await expect(storageService.uploadFile(mockFile, mockBucket, allowedMimeTypes))
                .rejects
                .toThrow('Failed to upload file');

            expect(mockLogger.error).toHaveBeenCalledWith(
                'Storage upload error:',
                mockError
            );
        });

        it('should handle missing file buffer', async () => {
            const invalidFile = createMockFile({ buffer: undefined });

            await expect(storageService.uploadFile(invalidFile, mockBucket, allowedMimeTypes))
                .rejects
                .toThrow('Failed to upload file');
        });
    });

    describe('deleteFile', () => {
        const mockFileUrl = 'https://example.com/test-bucket/test-file.jpg';

        it('should delete file successfully', async () => {
            const mockDeleteResponse = {
                data: {},
                error: null
            };

            (supabase.storage.from as jest.Mock).mockImplementation(() => ({
                remove: jest.fn().mockResolvedValue(mockDeleteResponse)
            }));

            await storageService.deleteFile(mockFileUrl);

            expect(supabase.storage.from).toHaveBeenCalledWith('test-bucket');
            expect(mockLogger.debug).toHaveBeenCalledWith(
                expect.stringContaining('Deleting file:')
            );
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('File deleted successfully')
            );
        });

        it('should throw error for invalid file URL', async () => {
            const invalidUrls = ['invalid-url', '', 'http://test.com'];

            for (const invalidUrl of invalidUrls) {
                await expect(storageService.deleteFile(invalidUrl))
                    .rejects
                    .toThrow('Invalid file URL');

                expect(mockLogger.warn).toHaveBeenCalledWith(
                    expect.stringContaining('Invalid file URL provided')
                );
            }
        });

        it('should handle deletion errors', async () => {
            const mockError = new Error('Deletion failed');
            (supabase.storage.from as jest.Mock).mockImplementation(() => ({
                remove: jest.fn().mockResolvedValue({
                    data: null,
                    error: mockError
                })
            }));

            await expect(storageService.deleteFile(mockFileUrl))
                .rejects
                .toThrow('Failed to delete file');

            expect(mockLogger.error).toHaveBeenCalledWith(
                'Storage deletion error:',
                mockError
            );
        });

        it('should handle empty path or bucket', async () => {
            const invalidUrls = [
                'https://example.com/',
                'https://example.com/bucket/',
                'https://example.com//file.jpg'
            ];

            for (const invalidUrl of invalidUrls) {
                await expect(storageService.deleteFile(invalidUrl))
                    .rejects
                    .toThrow('Invalid file URL');

                expect(mockLogger.warn).toHaveBeenCalledWith(
                    expect.stringContaining('Invalid file URL provided')
                );
            }
        });
    });
});
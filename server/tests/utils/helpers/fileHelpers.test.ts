// tests/utils/helpers/fileHelpers.test.ts
import { fileHelpers } from '../../../src/utils/helpers/fileHelpers';

describe('fileHelpers', () => {
    describe('getFileExtension', () => {
        it('should return correct file extension', () => {
            expect(fileHelpers.getFileExtension('test.jpg')).toBe('.jpg');
            expect(fileHelpers.getFileExtension('test.PDF')).toBe('.PDF');
            expect(fileHelpers.getFileExtension('path/to/test.png')).toBe('.png');
        });

        it('should handle files without extension', () => {
            expect(fileHelpers.getFileExtension('testfile')).toBe('');
        });

        it('should handle files with multiple dots', () => {
            expect(fileHelpers.getFileExtension('test.min.js')).toBe('.js');
        });

        it('should handle hidden files', () => {
            expect(fileHelpers.getFileExtension('.gitignore')).toBe('');
        });
    });

    describe('isValidImageType', () => {
        it('should validate correct image types', () => {
            expect(fileHelpers.isValidImageType('image/jpeg')).toBe(true);
            expect(fileHelpers.isValidImageType('image/png')).toBe(true);
            expect(fileHelpers.isValidImageType('image/gif')).toBe(true);
            expect(fileHelpers.isValidImageType('image/webp')).toBe(true);
        });

        it('should reject invalid image types', () => {
            expect(fileHelpers.isValidImageType('application/pdf')).toBe(false);
            expect(fileHelpers.isValidImageType('text/plain')).toBe(false);
            expect(fileHelpers.isValidImageType('image/svg+xml')).toBe(false);
        });

        it('should handle empty or invalid mimetypes', () => {
            expect(fileHelpers.isValidImageType('')).toBe(false);
            expect(fileHelpers.isValidImageType('invalid-type')).toBe(false);
        });
    });

    describe('isValidResumeType', () => {
        it('should validate PDF files', () => {
            expect(fileHelpers.isValidResumeType('application/pdf')).toBe(true);
        });

        it('should reject non-PDF files', () => {
            expect(fileHelpers.isValidResumeType('application/msword')).toBe(false);
            expect(fileHelpers.isValidResumeType('application/vnd.openxmlformats-officedocument.wordprocessingml.document')).toBe(false);
        });

        it('should handle empty or invalid mimetypes', () => {
            expect(fileHelpers.isValidResumeType('')).toBe(false);
            expect(fileHelpers.isValidResumeType('invalid-type')).toBe(false);
        });
    });

    describe('generateFileName', () => {
        beforeEach(() => {
            jest.spyOn(Date, 'now').mockImplementation(() => 1234567890);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should generate filename with timestamp and extension', () => {
            expect(fileHelpers.generateFileName('test.jpg')).toBe('1234567890.jpg');
        });

        it('should handle files without extension', () => {
            expect(fileHelpers.generateFileName('testfile')).toBe('1234567890');
        });

        it('should preserve extension case', () => {
            expect(fileHelpers.generateFileName('test.JPG')).toBe('1234567890.JPG');
        });

        it('should handle multiple extensions', () => {
            expect(fileHelpers.generateFileName('test.min.js')).toBe('1234567890.js');
        });
    });

    describe('getFileSizeInMB', () => {
        it('should convert bytes to megabytes correctly', () => {
            // 1 MB = 1,048,576 bytes
            expect(fileHelpers.getFileSizeInMB(1048576)).toBe(1);
            expect(fileHelpers.getFileSizeInMB(2097152)).toBe(2);
            expect(fileHelpers.getFileSizeInMB(524288)).toBe(0.5);
        });

        it('should handle zero bytes', () => {
            expect(fileHelpers.getFileSizeInMB(0)).toBe(0);
        });

        it('should handle small files', () => {
            expect(fileHelpers.getFileSizeInMB(1024)).toBe(0.0009765625); // 1KB
        });

        it('should handle large files', () => {
            expect(fileHelpers.getFileSizeInMB(1073741824)).toBe(1024); // 1GB
        });
    });
});
import { extname } from 'path';

export const fileHelpers = {
    getFileExtension: (filename: string): string => {
        return extname(filename);
    },

    isValidImageType: (mimetype: string): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        return validTypes.includes(mimetype);
    },

    generateFileName: (originalName: string): string => {
        const timestamp = Date.now();
        const extension = extname(originalName);
        return `${timestamp}${extension}`;
    },

    getFileSizeInMB: (sizeInBytes: number): number => {
        return sizeInBytes / (1024 * 1024);
    }
};
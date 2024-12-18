import { Request, Response } from 'express';
import { StorageService } from '../services/StorageService';
import { Logger } from '../utils/logger';
import { fileHelpers } from '../utils/helpers/fileHelpers';
import { AppError } from '../middleware/errorMiddleware';

export class StorageController {
    private storageService: StorageService;
    private logger = Logger.getInstance();

    constructor() {
        this.storageService = new StorageService();
    }

    async uploadFile(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            const { bucket, allowedTypes } = req.body;
            if (!bucket || !allowedTypes) {
                throw new AppError('Bucket and allowed types are required', 400);
            }

            // Parse allowed types from string to array
            const allowedMimeTypes = JSON.parse(allowedTypes);
            
            if (!Array.isArray(allowedMimeTypes)) {
                throw new AppError('Allowed types must be an array', 400);
            }

            // Validate file type
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new AppError(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`, 400);
            }

            const fileUrl = await this.storageService.uploadFile(
                req.file,
                bucket,
                allowedMimeTypes
            );

            this.logger.info(`File uploaded successfully to ${bucket}`);
            res.status(200).json({ url: fileUrl });
        } catch (error: any) {
            this.logger.error('Failed to upload file:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async deleteFile(req: Request, res: Response): Promise<void> {
        try {
            const { fileUrl } = req.body;
            if (!fileUrl) {
                throw new AppError('File URL is required', 400);
            }

            await this.storageService.deleteFile(fileUrl);
            this.logger.info('File deleted successfully');
            res.status(200).json({ message: 'File deleted successfully' });
        } catch (error: any) {
            this.logger.error('Failed to delete file:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async uploadMultipleFiles(req: Request, res: Response): Promise<void> {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                throw new AppError('No files uploaded', 400);
            }

            const { bucket, allowedTypes } = req.body;
            if (!bucket || !allowedTypes) {
                throw new AppError('Bucket and allowed types are required', 400);
            }

            const allowedMimeTypes = JSON.parse(allowedTypes);
            if (!Array.isArray(allowedMimeTypes)) {
                throw new AppError('Allowed types must be an array', 400);
            }

            const uploadPromises = (req.files as Express.Multer.File[]).map(file => {
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    throw new AppError(`Invalid file type for ${file.originalname}`, 400);
                }
                return this.storageService.uploadFile(file, bucket, allowedMimeTypes);
            });

            const fileUrls = await Promise.all(uploadPromises);
            this.logger.info(`${fileUrls.length} files uploaded successfully to ${bucket}`);
            res.status(200).json({ urls: fileUrls });
        } catch (error: any) {
            this.logger.error('Failed to upload multiple files:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
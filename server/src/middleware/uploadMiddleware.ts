import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';
import { AppError } from './errorMiddleware';

export class UploadMiddleware {
    private static instance: UploadMiddleware;
    private logger = Logger.getInstance();
    
    private constructor() {}

    static getInstance(): UploadMiddleware {
        if (!UploadMiddleware.instance) {
            UploadMiddleware.instance = new UploadMiddleware();
        }
        return UploadMiddleware.instance;
    }

    uploadFile = (bucket: string) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (req.file) {
                    // Handle single file
                    const url = await this.handleSingleFile(req.file, bucket);
                    req.uploadedFile = { url };
                } else if (req.files && Array.isArray(req.files)) {
                    // Handle multiple files
                    const urls = await Promise.all(
                        req.files.map(file => this.handleSingleFile(file, bucket))
                    );
                    req.uploadedFiles = urls.map(url => ({ url }));
                } else {
                    throw new AppError('No file uploaded', 400);
                }
                next();
            } catch (error) {
                next(error);
            }
        };
    };

    private async handleSingleFile(file: Express.Multer.File, bucket: string): Promise<string> {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600'
            });

        if (error) {
            this.logger.error('Storage upload error:', error);
            throw new AppError(error.message, 500);
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        this.logger.info(`File uploaded successfully to ${bucket}: ${fileName}`);
        return publicUrl;
    }
}

const uploadMiddleware = UploadMiddleware.getInstance();
export const handleUpload = uploadMiddleware.uploadFile;
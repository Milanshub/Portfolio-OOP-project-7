import { Express } from 'express';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';

export class StorageService {
    private logger = Logger.getInstance();

    async uploadFile(
        file: Express.Multer.File,
        bucket: string,
        allowedMimeTypes: string[]
    ): Promise<string> {
        try {
            // Validate file type
            if (!allowedMimeTypes.includes(file.mimetype)) {
                this.logger.warn(`Invalid file type attempted: ${file.mimetype}`);
                throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
            }

            // Create unique filename
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            
            this.logger.debug(`Uploading file: ${fileName} to bucket: ${bucket}`);

            // Upload file
            const { data, error } = await supabase
                .storage
                .from(bucket)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                this.logger.error(`Storage upload error:`, error);
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(data.path);

            this.logger.info(`File uploaded successfully: ${fileName}`);
            return publicUrl;
        } catch (error: any) {
            this.logger.error('Failed to upload file:', error);
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    // server/src/services/StorageService.ts
async deleteFile(fileUrl: string): Promise<void> {
    try {
        // Extract path from URL
        const urlParts = fileUrl.split('/');
        const path = urlParts.pop();
        const bucket = urlParts.pop(); // Get bucket name from URL

        // Validate URL format
        if (!path || !bucket || urlParts.length < 2) {
            this.logger.warn(`Invalid file URL provided: ${fileUrl}`);
            throw new Error('Invalid file URL');
        }

        this.logger.debug(`Deleting file: ${path} from bucket: ${bucket}`);

        const { error } = await supabase
            .storage
            .from(bucket)
            .remove([path]);

        if (error) {
            this.logger.error(`Storage deletion error:`, error);
            throw error;
        }

        this.logger.info(`File deleted successfully: ${path}`);
    } catch (error: any) {
        this.logger.error('Failed to delete file:', error);
        throw new Error(`Failed to delete file: ${error.message}`);
    }
}
}
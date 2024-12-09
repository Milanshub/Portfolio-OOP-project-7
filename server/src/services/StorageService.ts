import { Express } from 'express';
import { supabase } from '../config/supabase';
import * as multer from 'multer';


export class StorageService {
    async uploadFile(
        file: Express.Multer.File,
        bucket: string,
        allowedMimeTypes: string[]
    ): Promise<string> {
        try {
            // Validate file type
            if (!allowedMimeTypes.includes(file.mimetype)) {
                throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
            }

            // Create unique filename
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            // Upload file
            const { data, error } = await supabase
                .storage
                .from(bucket)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(data.path);

            return publicUrl;
        } catch (error: any) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Extract path from URL
            const path = fileUrl.split('/').pop();
            if (!path) throw new Error('Invalid file URL');

            // Get bucket name from URL
            const bucket = fileUrl.split('/').slice(-2)[0];

            const { error } = await supabase
                .storage
                .from(bucket)
                .remove([path]);

            if (error) throw error;
        } catch (error: any) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }
}
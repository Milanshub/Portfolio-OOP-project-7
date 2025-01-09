import { api } from '@/lib/api/client';
import { UploadResponse, MultipleUploadResponse } from '@/types';
import { endpoints } from '@/lib/api/endpoints';
import { logger } from '@/config/logger';

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<UploadResponse>(endpoints.STORAGE.UPLOAD, formData);
      logger.info('File uploaded successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to upload file:', error as Error);
      throw error;
    }
  }

  async uploadMultipleFiles(files: File[]): Promise<MultipleUploadResponse> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      const response = await api.post<MultipleUploadResponse>(
        endpoints.STORAGE.UPLOAD_MULTIPLE, 
        formData
      );
      logger.info(`${files.length} files uploaded successfully`);
      return response.data;
    } catch (error) {
      logger.error('Failed to upload multiple files:', error as Error);
      throw error;
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      await api.delete(endpoints.STORAGE.DELETE, { data: { url } });
      logger.info('File deleted successfully');
    } catch (error) {
      logger.error('Failed to delete file:', error as Error);
      throw error;
    }
  }
}

export const storageService = StorageService.getInstance();
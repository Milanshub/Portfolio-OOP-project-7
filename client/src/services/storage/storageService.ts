import { api } from '@/lib/api';
import { UploadResponse, MultipleUploadResponse } from '@/types';

class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UploadResponse>('/storage/upload', formData);
    return response;
  }

  async uploadMultipleFiles(files: File[]): Promise<MultipleUploadResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    const response = await api.post<MultipleUploadResponse>('/storage/upload/multiple', formData);
    return response;
  }

  async deleteFile(url: string): Promise<void> {
    await api.delete('/storage', { data: { url } });
  }
}

export const storageService = StorageService.getInstance(); 
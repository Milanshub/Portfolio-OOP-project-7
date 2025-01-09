import { api } from '@/lib/api/client';
import { Profile } from '@/types';
import { endpoints } from '@/lib/api/endpoints';
import { logger } from '@/config/logger';

export class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(): Promise<Profile> {
    try {
      const response = await api.get<Profile>(endpoints.PROFILE.GET);
      logger.debug('Profile retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to get profile:', error as Error);
      throw error;
    }
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    try {
      const response = await api.put<Profile>(endpoints.PROFILE.UPDATE, data);
      logger.info('Profile updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to update profile:', error as Error);
      throw error;
    }
  }

  async updateAvatar(file: File): Promise<Profile> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.put<Profile>(endpoints.PROFILE.UPDATE_AVATAR, formData);
      logger.info('Avatar updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to update avatar:', error as Error);
      throw error;
    }
  }

  async updateResume(file: File): Promise<Profile> {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await api.put<Profile>(endpoints.PROFILE.UPDATE_RESUME, formData);
      logger.info('Resume updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to update resume:', error as Error);
      throw error;
    }
  }
}

export const profileService = ProfileService.getInstance();
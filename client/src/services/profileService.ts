import { api, handleApiError } from '@/lib/api';
import { Profile } from '@/types';

export const profileService = {
  async getProfile(): Promise<Profile> {
    try {
      const response = await api.get<Profile>('/profile');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    try {
      const response = await api.put<Profile>('/admin-profile', profileData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateAvatar(file: File): Promise<Profile> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.put<Profile>('/admin-profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateResume(file: File): Promise<Profile> {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.put<Profile>('/admin-profile/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 
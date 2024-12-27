import { api } from '@/lib/api';
import { Profile } from '@/types';

class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(): Promise<Profile> {
    const response = await api.get<Profile>('/profile');
    return response;
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const response = await api.put<Profile>('/profile', data);
    return response;
  }

  async updateAvatar(file: File): Promise<Profile> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.put<Profile>('/profile/avatar', formData);
    return response;
  }

  async updateResume(file: File): Promise<Profile> {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.put<Profile>('/profile/resume', formData);
    return response;
  }
}

export const profileService = ProfileService.getInstance(); 
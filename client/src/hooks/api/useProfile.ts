import { useState } from 'react';
import { profileService } from '@/services';
import { Profile, ApiError } from '@/types';
import { logger } from '@/config/logger';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      logger.debug('Profile fetched successfully');
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to fetch profile:', apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    try {
      setIsLoading(true);
      const updatedProfile = await profileService.updateProfile(profileData);
      setProfile(updatedProfile);
      logger.debug('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to update profile:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      setIsLoading(true);
      const updatedProfile = await profileService.updateAvatar(file);
      setProfile(updatedProfile);
      logger.debug('Avatar updated successfully');
      return updatedProfile;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to update avatar:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const updateResume = async (file: File) => {
    try {
      setIsLoading(true);
      const updatedProfile = await profileService.updateResume(file);
      setProfile(updatedProfile);
      logger.debug('Resume updated successfully');
      return updatedProfile;
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError);
      logger.error('Failed to update resume:', apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
    updateResume
  };
};
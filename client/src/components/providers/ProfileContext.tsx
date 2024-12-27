import { createContext, useContext, ReactNode } from 'react';
import { useProfile } from '@/hooks/profile/useProfile';
import { Profile } from '@/types';

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (profileData: Partial<Profile>) => Promise<Profile>;
  updateAvatar: (file: File) => Promise<Profile>;
  updateResume: (file: File) => Promise<Profile>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profileData = useProfile();

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
} 
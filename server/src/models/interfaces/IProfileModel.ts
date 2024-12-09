import { IProfile } from '../../types/entities';
import { IRepository } from './IRepository';

// Define the IProfileModel interface       
export interface IProfileModel extends IRepository<IProfile, Omit<IProfile, 'id'>, Partial<IProfile>> {
    // Profile-specific methods
    findByEmail(email: string): Promise<IProfile | null>;
    updateAvatar(id: string, avatarUrl: string): Promise<IProfile | null>;
    updateResume(id: string, resumeUrl: string): Promise<IProfile | null>;
}


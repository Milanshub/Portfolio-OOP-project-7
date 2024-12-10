import { IProfile } from '../types/entities';
import { IProfileModel } from './interfaces/IProfileModel';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class Profile implements IProfileModel {
    private logger = Logger.getInstance();
    private tableName = 'profiles';

    async findAll(): Promise<IProfile[]> {
        try {
            this.logger.debug('Fetching all profiles');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*');
            
            if (error) throw error;
            return data as IProfile[];
        } catch (error: any) {
            this.logger.error('Failed to fetch profiles:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findById(id: string): Promise<IProfile | null> {
        try {
            this.logger.debug(`Fetching profile with id: ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data as IProfile;
        } catch (error: any) {
            this.logger.error(`Failed to fetch profile ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async create(profile: Omit<IProfile, 'id'>): Promise<IProfile> {
        try {
            this.logger.debug('Creating new profile:', profile);
            const { data, error } = await supabase
                .from(this.tableName)
                .insert(profile)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProfile;
        } catch (error: any) {
            this.logger.error('Failed to create profile:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async update(id: string, profile: Partial<IProfile>): Promise<IProfile | null> {
        try {
            this.logger.debug(`Updating profile ${id}:`, profile);
            const { data, error } = await supabase
                .from(this.tableName)
                .update(profile)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProfile;
        } catch (error: any) {
            this.logger.error(`Failed to update profile ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            this.logger.debug(`Deleting profile ${id}`);
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete profile ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    // Profile-specific methods
    async findByEmail(email: string): Promise<IProfile | null> {
        try {
            this.logger.debug(`Finding profile by email: ${email}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) throw error;
            return data as IProfile;
        } catch (error: any) {
            this.logger.error(`Failed to find profile by email ${email}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateAvatar(id: string, avatarUrl: string): Promise<IProfile | null> {
        try {
            this.logger.debug(`Updating avatar for profile ${id} to ${avatarUrl}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ avatar: avatarUrl })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProfile;
        } catch (error: any) {
            this.logger.error(`Failed to update avatar for profile ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateResume(id: string, resumeUrl: string): Promise<IProfile | null> {
        try {
            this.logger.debug(`Updating resume for profile ${id} to ${resumeUrl}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ resume: resumeUrl })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProfile;
        } catch (error: any) {
            this.logger.error(`Failed to update resume for profile ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    // Helper method to validate profile data
    private validateProfile(profile: Partial<IProfile>): void {
        try {
            if (profile.email && !this.isValidEmail(profile.email)) {
                this.logger.error(`Invalid email format: ${profile.email}`);
                throw new Error('Invalid email format');
            }
        } catch (error: any) {
            throw new AppError(`Validation error: ${error.message}`, 400);
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
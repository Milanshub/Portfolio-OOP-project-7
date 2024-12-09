import { IProfile } from '../types/entities';
import { IProfileModel } from './interfaces/IProfileModel';
import { supabase } from '../config/supabase';

export class Profile implements IProfileModel {
    // Implement IRepository methods
    async findAll(): Promise<IProfile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        
        if (error) throw error;
        return data as IProfile[];
    }

    async findById(id: string): Promise<IProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as IProfile;
    }

    async create(profile: Omit<IProfile, 'id'>): Promise<IProfile> {
        const { data, error } = await supabase
            .from('profiles')
            .insert(profile)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProfile;
    }

    async update(id: string, profile: Partial<IProfile>): Promise<IProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update(profile)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProfile;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Implement Profile-specific methods
    async findByEmail(email: string): Promise<IProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) throw error;
        return data as IProfile;
    }

    async updateAvatar(id: string, avatarUrl: string): Promise<IProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update({ avatar: avatarUrl })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProfile;
    }

    async updateResume(id: string, resumeUrl: string): Promise<IProfile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update({ resume: resumeUrl })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProfile;
    }

    // Helper method to validate profile data
    private validateProfile(profile: Partial<IProfile>): void {
        if (profile.email && !this.isValidEmail(profile.email)) {
            throw new Error('Invalid email format');
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
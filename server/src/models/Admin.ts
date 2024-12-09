import { IAdmin } from '../types/entities';
import { IAdminModel } from './interfaces/IAdminModel';
import { supabase } from '../config/supabase';
import bcrypt from 'bcrypt';

export class Admin implements IAdminModel {
    async findAll(): Promise<IAdmin[]> {
        const { data, error } = await supabase
            .from('admins')
            .select('*');
        
        if (error) throw error;
        return data as IAdmin[];
    }

    async findById(id: string): Promise<IAdmin | null> {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as IAdmin;
    }

    async create(admin: Omit<IAdmin, 'id' | 'lastLogin'>): Promise<IAdmin> {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        
        const { data, error } = await supabase
            .from('admins')
            .insert({ ...admin, password: hashedPassword })
            .select()
            .single();
        
        if (error) throw error;
        return data as IAdmin;
    }

    async update(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null> {
        if (admin.password) {
            admin.password = await bcrypt.hash(admin.password, 10);
        }

        const { data, error } = await supabase
            .from('admins')
            .update(admin)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IAdmin;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('admins')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Admin-specific methods
    async findByEmail(email: string): Promise<IAdmin | null> {
        const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) throw error;
        return data as IAdmin;
    }

    async updateLastLogin(id: string): Promise<IAdmin | null> {
        const { data, error } = await supabase
            .from('admins')
            .update({ lastLogin: new Date() })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IAdmin;
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}
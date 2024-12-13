import { IAdmin } from '../types/entities';
import { IAdminModel } from './interfaces/IAdminModel';
import { supabase } from '../config/supabase';
import bcrypt from 'bcrypt';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class Admin implements IAdminModel {
    private logger = Logger.getInstance();
    private tableName = 'admins';

    async findAll(): Promise<IAdmin[]> {
        try {
            this.logger.debug('Fetching all admins');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*');
            
            if (error) throw error;
            return data as IAdmin[];
        } catch (error: any) {
            this.logger.error('Failed to fetch admins:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findById(id: string): Promise<IAdmin | null> {
        try {
            this.logger.debug(`Fetching admin with id: ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data as IAdmin;
        } catch (error: any) {
            this.logger.error(`Failed to fetch admin ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async create(admin: Omit<IAdmin, 'id' | 'lastLogin'>): Promise<IAdmin> {
        try {
            this.logger.debug('Creating new admin:', { ...admin, password: '[REDACTED]' });
            const hashedPassword = await bcrypt.hash(admin.password, 10);
            
            const { data, error } = await supabase
                .from(this.tableName)
                .insert({ ...admin, password: hashedPassword })
                .select()
                .single();
            
            if (error) throw error;
            return data as IAdmin;
        } catch (error: any) {
            this.logger.error('Failed to create admin:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async update(id: string, admin: Partial<IAdmin>): Promise<IAdmin | null> {
        try {
            this.logger.debug(`Updating admin ${id}:`, { ...admin, password: admin.password ? '[REDACTED]' : undefined });
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }

            const { data, error } = await supabase
                .from(this.tableName)
                .update(admin)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IAdmin;
        } catch (error: any) {
            this.logger.error(`Failed to update admin ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            this.logger.debug(`Deleting admin ${id}`);
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete admin ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        try {
            this.logger.debug(`Finding admin by email: ${email}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) throw error;
            return data as IAdmin;
        } catch (error: any) {
            this.logger.error(`Failed to find admin by email ${email}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateLastLogin(id: string): Promise<IAdmin | null> {
        try {
            this.logger.debug(`Updating last login for admin ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ lastLogin: new Date() })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IAdmin;
        } catch (error: any) {
            this.logger.error(`Failed to update last login for admin ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            this.logger.debug('Validating password');
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error: any) {
            this.logger.error('Failed to validate password:', error);
            throw new AppError(`Password validation error: ${error.message}`, 500);
        }
    }
}
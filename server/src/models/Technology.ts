import { ITechnology } from '../types/entities';
import { ITechnologyModel } from './interfaces/ITechnologyModel';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class Technology implements ITechnologyModel {
    private logger = Logger.getInstance();
    private tableName = 'technologies';

    async findAll(): Promise<ITechnology[]> {
        try {
            this.logger.debug('Fetching all technologies');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('category', { ascending: true });
            
            if (error) throw error;
            return data as ITechnology[];
        } catch (error: any) {
            this.logger.error('Failed to fetch technologies:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findById(id: string): Promise<ITechnology | null> {
        try {
            this.logger.debug(`Fetching technology with id: ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data as ITechnology;
        } catch (error: any) {
            this.logger.error(`Failed to fetch technology ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async create(technology: Omit<ITechnology, 'id'>): Promise<ITechnology> {
        try {
            this.logger.debug('Creating new technology:', technology);
            const { data, error } = await supabase
                .from(this.tableName)
                .insert(technology)
                .select()
                .single();
            
            if (error) throw error;
            return data as ITechnology;
        } catch (error: any) {
            this.logger.error('Failed to create technology:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async update(id: string, technology: Partial<ITechnology>): Promise<ITechnology | null> {
        try {
            this.logger.debug(`Updating technology ${id}:`, technology);
            const { data, error } = await supabase
                .from(this.tableName)
                .update(technology)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as ITechnology;
        } catch (error: any) {
            this.logger.error(`Failed to update technology ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            this.logger.debug(`Deleting technology ${id}`);
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete technology ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    // Technology-specific methods
    async findByCategory(category: string): Promise<ITechnology[]> {
        try {
            this.logger.debug(`Fetching technologies by category: ${category}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('category', category)
                .order('proficiencyLevel', { ascending: false });
            
            if (error) throw error;
            return data as ITechnology[];
        } catch (error: any) {
            this.logger.error(`Failed to fetch technologies by category ${category}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateProficiencyLevel(id: string, level: number): Promise<ITechnology | null> {
        try {
            this.logger.debug(`Updating proficiency level for technology ${id} to ${level}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ proficiencyLevel: level })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as ITechnology;
        } catch (error: any) {
            this.logger.error(`Failed to update proficiency level for technology ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }
}
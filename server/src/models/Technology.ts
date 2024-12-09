import { ITechnology } from '../types/entities';
import { ITechnologyModel } from './interfaces/ITechnologyModel';
import { supabase } from '../config/supabase';

export class Technology implements ITechnologyModel {
    async findAll(): Promise<ITechnology[]> {
        const { data, error } = await supabase
            .from('technologies')
            .select('*')
            .order('category', { ascending: true });
        
        if (error) throw error;
        return data as ITechnology[];
    }

    async findById(id: string): Promise<ITechnology | null> {
        const { data, error } = await supabase
            .from('technologies')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as ITechnology;
    }

    async create(technology: Omit<ITechnology, 'id'>): Promise<ITechnology> {
        const { data, error } = await supabase
            .from('technologies')
            .insert(technology)
            .select()
            .single();
        
        if (error) throw error;
        return data as ITechnology;
    }

    async update(id: string, technology: Partial<ITechnology>): Promise<ITechnology | null> {
        const { data, error } = await supabase
            .from('technologies')
            .update(technology)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as ITechnology;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('technologies')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Technology-specific methods
    async findByCategory(category: string): Promise<ITechnology[]> {
        const { data, error } = await supabase
            .from('technologies')
            .select('*')
            .eq('category', category)
            .order('proficiencyLevel', { ascending: false });
        
        if (error) throw error;
        return data as ITechnology[];
    }

    async updateProficiencyLevel(id: string, level: number): Promise<ITechnology | null> {
        const { data, error } = await supabase
            .from('technologies')
            .update({ proficiencyLevel: level })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as ITechnology;
    }
}
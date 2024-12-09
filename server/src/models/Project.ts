import { IProject } from '../types/entities';
import { IProjectModel } from './interfaces/IProjectModel';
import { supabase } from '../config/supabase';

export class Project implements IProjectModel {
    // Implement IRepository methods
    async findAll(): Promise<IProject[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('order', { ascending: true });
        
        if (error) throw error;
        return data as IProject[];
    }

    async findById(id: string): Promise<IProject | null> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as IProject;
    }

    async create(project: Omit<IProject, 'id'>): Promise<IProject> {
        const { data, error } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProject;
    }

    async update(id: string, project: Partial<IProject>): Promise<IProject | null> {
        const { data, error } = await supabase
            .from('projects')
            .update(project)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProject;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Implement Project-specific methods
    async findFeatured(): Promise<IProject[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('featured', true)
            .order('order', { ascending: true });
        
        if (error) throw error;
        return data as IProject[];
    }

    async updateThumbnail(id: string, thumbnailUrl: string): Promise<IProject | null> {
        const { data, error } = await supabase
            .from('projects')
            .update({ thumbnail: thumbnailUrl })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProject;
    }

    async updateImages(id: string, imageUrls: string[]): Promise<IProject | null> {
        const { data, error } = await supabase
            .from('projects')
            .update({ images: imageUrls })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProject;
    }

    async updateOrder(id: string, order: number): Promise<IProject | null> {
        const { data, error } = await supabase
            .from('projects')
            .update({ order })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IProject;
    }
}
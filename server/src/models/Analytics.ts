import { IAnalytics } from '../types/entities';
import { IAnalyticsModel } from './interfaces/IAnalyticsModel';
import { supabase } from '../config/supabase';

export class Analytics implements IAnalyticsModel {
    async findAll(): Promise<IAnalytics[]> {
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .order('createdAt', { ascending: false });
        
        if (error) throw error;
        return data as IAnalytics[];
    }

    async findById(id: string): Promise<IAnalytics | null> {
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as IAnalytics;
    }

    async create(analytics: Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAnalytics> {
        const { data, error } = await supabase
            .from('analytics')
            .insert({
                ...analytics,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            .select()
            .single();
        
        if (error) throw error;
        return data as IAnalytics;
    }

    async update(id: string, analytics: Partial<IAnalytics>): Promise<IAnalytics | null> {
        const { data, error } = await supabase
            .from('analytics')
            .update({
                ...analytics,
                updatedAt: new Date()
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as IAnalytics;
    }

    async delete(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('analytics')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }

    // Analytics-specific methods
    async getLatestAnalytics(): Promise<IAnalytics | null> {
        const { data, error } = await supabase
            .from('analytics')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(1)
            .single();
        
        if (error) throw error;
        return data as IAnalytics;
    }

    async incrementPageViews(): Promise<void> {
        const latest = await this.getLatestAnalytics();
        if (latest) {
            await this.update(latest.id, {
                pageViews: latest.pageViews + 1
            });
        }
    }

    async updateMostViewedProjects(projectIds: string[]): Promise<void> {
        const latest = await this.getLatestAnalytics();
        if (latest) {
            await this.update(latest.id, {
                mostViewedProjects: projectIds
            });
        }
    }
}
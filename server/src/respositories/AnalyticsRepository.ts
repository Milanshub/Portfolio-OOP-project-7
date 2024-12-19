import { IAnalytics } from '../types/entities';
import { IAnalyticsModel } from '../models/interfaces/IAnalyticsModel';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class AnalyticsRepository implements IAnalyticsModel {
    private logger = Logger.getInstance();
    private tableName = 'analytics';
    private eventsTableName = 'analytics_events'; // Add this property


    async findAll(): Promise<IAnalytics[]> {
        try {
            this.logger.debug('Fetching all analytics records');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('createdAt', { ascending: false });
            
            if (error) throw error;
            return data as IAnalytics[];
        } catch (error: any) {
            this.logger.error('Failed to fetch analytics:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findById(id: string): Promise<IAnalytics | null> {
        try {
            this.logger.debug(`Fetching analytics record with id: ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data as IAnalytics;
        } catch (error: any) {
            this.logger.error(`Failed to fetch analytics ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async create(analytics: Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAnalytics> {
        try {
            this.logger.debug('Creating new analytics record:', analytics);
            const { data, error } = await supabase
                .from(this.tableName)
                .insert({
                    ...analytics,
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
                .select()
                .single();
            
            if (error) throw error;
            return data as IAnalytics;
        } catch (error: any) {
            this.logger.error('Failed to create analytics record:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async update(id: string, analytics: Partial<IAnalytics>): Promise<IAnalytics | null> {
        try {
            this.logger.debug(`Updating analytics record ${id}:`, analytics);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({
                    ...analytics,
                    updatedAt: new Date()
                })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IAnalytics;
        } catch (error: any) {
            this.logger.error(`Failed to update analytics ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            this.logger.debug(`Deleting analytics record ${id}`);
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete analytics ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    // Analytics-specific methods
    async getLatestAnalytics(): Promise<IAnalytics | null> {
        try {
            this.logger.debug('Fetching latest analytics record');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('createdAt', { ascending: false })
                .limit(1)
                .single();
            
            if (error) throw error;
            return data as IAnalytics;
        } catch (error: any) {
            this.logger.error('Failed to fetch latest analytics:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async incrementPageViews(): Promise<void> {
        try {
            this.logger.debug('Incrementing page views');
            const latest = await this.getLatestAnalytics();
            if (latest) {
                await this.update(latest.id, {
                    pageViews: latest.pageViews + 1
                });
            }
        } catch (error: any) {
            this.logger.error('Failed to increment page views:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateMostViewedProjects(projectIds: string[]): Promise<void> {
        try {
            this.logger.debug('Updating most viewed projects:', projectIds);
            const latest = await this.getLatestAnalytics();
            if (latest) {
                await this.update(latest.id, {
                    mostViewedProjects: projectIds
                });
            }
        } catch (error: any) {
            this.logger.error('Failed to update most viewed projects:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async createEvent(event: { name: string; data: any; timestamp: Date }): Promise<void> {
        try {
            const { error } = await supabase
                .from(this.eventsTableName)
                .insert({
                    event_name: event.name,
                    event_data: event.data,
                    timestamp: event.timestamp
                });

            if (error) throw error;
            
            this.logger.info(`Analytics event created: ${event.name}`);
        } catch (error: any) {
            this.logger.error('Failed to create analytics event:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }
}
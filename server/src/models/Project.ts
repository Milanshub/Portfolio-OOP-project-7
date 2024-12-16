import { IProject } from '../types/entities';
import { IProjectModel } from './interfaces/IProjectModel';
import { supabase } from '../config/supabase';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';
import { IGitHubRepoMetadata } from './interfaces/IGitHubModel';

export class Project implements IProjectModel {
    private logger = Logger.getInstance();
    private tableName = 'projects';

    async findAll(): Promise<IProject[]> {
        try {
            this.logger.debug('Fetching all projects');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .order('order', { ascending: true });
            
            if (error) throw error;
            return data as IProject[];
        } catch (error: any) {
            this.logger.error('Failed to fetch projects:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async findById(id: string): Promise<IProject | null> {
        try {
            this.logger.debug(`Fetching project with id: ${id}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data as IProject;
        } catch (error: any) {
            this.logger.error(`Failed to fetch project ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async create(project: Omit<IProject, 'id'>): Promise<IProject> {
        try {
            this.logger.debug('Creating new project:', project);
            const { data, error } = await supabase
                .from(this.tableName)
                .insert(project)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProject;
        } catch (error: any) {
            this.logger.error('Failed to create project:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async update(id: string, project: Partial<IProject>): Promise<IProject | null> {
        try {
            this.logger.debug(`Updating project ${id}:`, project);
            const { data, error } = await supabase
                .from(this.tableName)
                .update(project)
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProject;
        } catch (error: any) {
            this.logger.error(`Failed to update project ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            this.logger.debug(`Deleting project ${id}`);
            const { error } = await supabase
                .from(this.tableName)
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete project ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    // Project-specific methods
    async findFeatured(): Promise<IProject[]> {
        try {
            this.logger.debug('Fetching featured projects');
            const { data, error } = await supabase
                .from(this.tableName)
                .select('*')
                .eq('featured', true)
                .order('order', { ascending: true });
            
            if (error) throw error;
            return data as IProject[];
        } catch (error: any) {
            this.logger.error('Failed to fetch featured projects:', error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateThumbnail(id: string, thumbnailUrl: string): Promise<IProject | null> {
        try {
            this.logger.debug(`Updating thumbnail for project ${id} to ${thumbnailUrl}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ thumbnail: thumbnailUrl })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProject;
        } catch (error: any) {
            this.logger.error(`Failed to update thumbnail for project ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateImages(id: string, imageUrls: string[]): Promise<IProject | null> {
        try {
            this.logger.debug(`Updating images for project ${id}:`, imageUrls);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ images: imageUrls })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProject;
        } catch (error: any) {
            this.logger.error(`Failed to update images for project ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateOrder(id: string, order: number): Promise<IProject | null> {
        try {
            this.logger.debug(`Updating order for project ${id} to ${order}`);
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ order })
                .eq('id', id)
                .select()
                .single();
            
            if (error) throw error;
            return data as IProject;
        } catch (error: any) {
            this.logger.error(`Failed to update order for project ${id}:`, error);
            throw new AppError(`Database error: ${error.message}`, 500);
        }
    }

    async updateTechnologies(id: string, technologyIds: string[]): Promise<IProject | null> {
        try {
            const { data, error } = await supabase
                .from(this.tableName)
                .update({ technologies: technologyIds })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            this.logger.error(`Failed to update technologies for project ${id}:`, error);
            throw new Error(`Failed to update technologies: ${error.message}`);
        }
    }

    async updateGitHubData(id: string, data: IGitHubRepoMetadata): Promise<IProject | null> {
        try {
            const { data: updatedProject, error } = await supabase
                .from(this.tableName)
                .update({ githubData: data })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update GitHub data for project ${id}:`, error);
            throw new Error(`Failed to update GitHub data: ${error.message}`);
        }
    }
}
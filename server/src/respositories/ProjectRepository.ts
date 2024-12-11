import { supabase } from '../config/supabase';
import { IProject, ICreateProject, IUpdateProject } from '../types/entities';
import { IRepository } from '../models/interfaces/IRepository';
import { Logger } from '../utils/logger';
import { AppError } from '../middleware/errorMiddleware';

export class ProjectRepository implements IRepository<IProject, ICreateProject, IUpdateProject> {
  private static instance: ProjectRepository;
  private readonly TABLE_NAME = 'projects';
  private logger = Logger.getInstance();

  private constructor() {}

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  async findAll(): Promise<IProject[]> {
    try {
      this.logger.debug('Fetching all projects');
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('order', { ascending: true });

      if (error) throw new AppError(error.message, 500);
      return data || [];
    } catch (error: any) {
      this.logger.error('Failed to fetch projects:', error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }

  async findById(id: string): Promise<IProject | null> {
    try {
      this.logger.debug(`Fetching project with id: ${id}`);
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new AppError(error.message, 500);
      return data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch project ${id}:`, error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }

  async create(project: ICreateProject): Promise<IProject> {
    try {
      this.logger.debug('Creating new project:', project);
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(project)
        .select()
        .single();

      if (error) throw new AppError(error.message, 500);
      return data;
    } catch (error: any) {
      this.logger.error('Failed to create project:', error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }

  async update(id: string, project: IUpdateProject): Promise<IProject | null> {
    try {
      this.logger.debug(`Updating project ${id}:`, project);
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new AppError(error.message, 500);
      return data;
    } catch (error: any) {
      this.logger.error(`Failed to update project ${id}:`, error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      this.logger.debug(`Deleting project ${id}`);
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) throw new AppError(error.message, 500);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to delete project ${id}:`, error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }

  async getFeaturedProjects(): Promise<IProject[]> {
    try {
      this.logger.debug('Fetching featured projects');
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('featured', true)
        .order('order', { ascending: true });

      if (error) throw new AppError(error.message, 500);
      return data || [];
    } catch (error: any) {
      this.logger.error('Failed to fetch featured projects:', error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }

  async updateOrder(id: string, newOrder: number): Promise<IProject | null> {
    try {
      this.logger.debug(`Updating order for project ${id} to ${newOrder}`);
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update({ order: newOrder })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new AppError(error.message, 500);
      return data;
    } catch (error: any) {
      this.logger.error(`Failed to update order for project ${id}:`, error);
      throw new AppError(`Database error: ${error.message}`, 500);
    }
  }
}
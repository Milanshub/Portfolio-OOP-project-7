import { supabase } from '../config/supabase';
import { IProject, ICreateProject, IUpdateProject } from '../types/entities';
import { IRepository } from '../models/interfaces/IRepository';

// Define a class for the ProjectRepository
export class ProjectRepository implements IRepository<IProject, ICreateProject, IUpdateProject> {
  // Define a private static instance of the class
  private static instance: ProjectRepository;
  // Define a private readonly table name for the projects
  private readonly TABLE_NAME = 'projects';

  // Define a private constructor to prevent direct instantiation
  private constructor() {}

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  // Define a method to find all projects
  async findAll(): Promise<IProject[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .order('order', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Define a method to find a project by its ID
  async findById(id: string): Promise<IProject | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Define a method to create a new project
  async create(project: ICreateProject): Promise<IProject> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(project)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Define a method to update an existing project
  async update(id: string, project: IUpdateProject): Promise<IProject | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Define a method to delete a project
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  // Define a method to get featured projects
  async getFeaturedProjects(): Promise<IProject[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('featured', true)
      .order('order', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  // Define a method to update the order of a project
    async updateOrder(id: string, newOrder: number): Promise<IProject | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update({ order: newOrder })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}; 
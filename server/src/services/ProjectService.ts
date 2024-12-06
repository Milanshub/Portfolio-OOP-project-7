// Import the ProjectRepository class from the repositories directory
// Import the IProject, ICreateProject, and IUpdateProject interfaces from the types directory
import { ProjectRepository } from '../respositories/ProjectRepository';
import { IProject, ICreateProject, IUpdateProject } from '../types/entities';

// Define a class for the ProjectService
export class ProjectService {
  // Define a private instance of the ProjectRepository
  private repository: ProjectRepository;

  // Define a constructor to initialize the repository
  constructor() {
    this.repository = ProjectRepository.getInstance();
  }

  // Define a method to get all projects
  async getAllProjects(): Promise<IProject[]> {
    try {
      return await this.repository.findAll();
    } catch (error: any) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }
  }

  // Define a method to get a project by id
  async getProjectById(id: string): Promise<IProject | null> {
    try {
      const project = await this.repository.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    } catch (error: any) {
      throw new Error(`Error fetching project: ${error.message}`);
    }
  }

  // Define a method to create a project
  async createProject(projectData: ICreateProject): Promise<IProject> {
    try {
      // Business logic validation
      this.validateProject(projectData);
      return await this.repository.create(projectData);
    } catch (error: any) {
      throw new Error(`Error creating project: ${error.message}`);
    }
  }

  // Define a method to update a project
  async updateProject(id: string, projectData: IUpdateProject): Promise<IProject | null> {
    try {
      const existingProject = await this.repository.findById(id);
      if (!existingProject) {
        throw new Error('Project not found');
      }
      return await this.repository.update(id, projectData);
    } catch (error: any) {
      throw new Error(`Error updating project: ${error.message}`);
    }
  }

  // Define a method to delete a project
  async deleteProject(id: string): Promise<boolean> {
    try {
      const existingProject = await this.repository.findById(id);
      if (!existingProject) {
        throw new Error('Project not found');
      }
      return await this.repository.delete(id);
    } catch (error: any) {
      throw new Error(`Error deleting project: ${error.message}`);
    }
  }

  // Define a method to get featured projects
  async getFeaturedProjects(): Promise<IProject[]> {
    try {
      return await this.repository.getFeaturedProjects();
    } catch (error: any) {
      throw new Error(`Error fetching featured projects: ${error.message}`);
    }
  }

  // Define a private method to validate a project
  private validateProject(project: ICreateProject): void {
    if (!project.title) {
      throw new Error('Project title is required');
    }
    if (!project.description) {
      throw new Error('Project description is required');
    }
    if (!project.shortDescription) {
      throw new Error('Project short description is required');
    }
  }
}
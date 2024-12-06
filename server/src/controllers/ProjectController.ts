import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ICreateProject, IUpdateProject } from '../types/entities';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  // Get all projects
  async getAllProjects (req: Request, res: Response): Promise<void> {
    try {
      const projects = await this.projectService.getAllProjects();
      res.status(200).json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get project by ID
  async getProjectById  (req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await this.projectService.getProjectById(id);
      res.status(200).json(project);
    } catch (error: any) {
      if (error.message === 'Project not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Create new project
  async createProject (req: Request, res: Response): Promise<void> {
    try {
      const projectData: ICreateProject = req.body;
      const newProject = await this.projectService.createProject(projectData);
      res.status(201).json(newProject);
    } catch (error: any) {
      if (error.message.includes('required')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Update project
  async updateProject (req: Request, res: Response): Promise<void>  {
    try {
      const { id } = req.params;
      const projectData: IUpdateProject = req.body;
      const updatedProject = await this.projectService.updateProject(id, projectData);
      res.status(200).json(updatedProject);
    } catch (error: any) {
      if (error.message === 'Project not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Delete project
  async deleteProject (req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.projectService.deleteProject(id);
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error: any) {
      if (error.message === 'Project not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get featured projects
  async getFeaturedProjects (req: Request, res: Response): Promise<void> {
    try {
      const featuredProjects = await this.projectService.getFeaturedProjects();
      res.status(200).json(featuredProjects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
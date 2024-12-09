import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ICreateProject, IUpdateProject } from '../types/entities';

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await this.projectService.getAllProjects();
            res.status(200).json(projects);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProjectById(req: Request, res: Response): Promise<void> {
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
    }

    async getFeaturedProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await this.projectService.getFeaturedProjects();
            res.status(200).json(projects);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData: ICreateProject = req.body;
            const project = await this.projectService.createProject(projectData);
            res.status(201).json(project);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const projectData: IUpdateProject = req.body;
            const project = await this.projectService.updateProject(id, projectData);
            res.status(200).json(project);
        } catch (error: any) {
            if (error.message === 'Project not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async deleteProject(req: Request, res: Response): Promise<void> {
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
    }

    async uploadThumbnail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!req.file) {
                throw new Error('No file uploaded');
            }
            const project = await this.projectService.updateThumbnail(id, req.file);
            res.status(200).json(project);
        } catch (error: any) {
            if (error.message === 'Project not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async uploadImages(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!req.files || !Array.isArray(req.files)) {
                throw new Error('No files uploaded');
            }
            const project = await this.projectService.updateImages(id, req.files);
            res.status(200).json(project);
        } catch (error: any) {
            if (error.message === 'Project not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
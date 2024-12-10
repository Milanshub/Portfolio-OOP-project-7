import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ICreateProject, IUpdateProject } from '../types/entities';
import { Logger } from '../utils/logger';
import { projectValidator } from '../utils/validators/projectValidator';
import { AnalyticsObserver } from '../utils/observers/analyticsObservers'
import { fileHelpers } from '../utils/helpers/fileHelpers';
import { Cache } from '../utils/cache';

export class ProjectController {
    private projectService: ProjectService;
    private logger = Logger.getInstance();
    private analytics = AnalyticsObserver.getInstance();
    private cache = new Cache<any>(5 * 60 * 1000); // 5 minute cache

    constructor() {
        this.projectService = new ProjectService();
    }

    async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'all-projects';
            const cached = this.cache.get(cacheKey);
            
            if (cached) {
                this.logger.debug('Serving projects from cache');
                res.status(200).json(cached);
                return;
            }

            const projects = await this.projectService.getAllProjects();
            this.cache.set(cacheKey, projects);
            this.logger.info('Projects fetched successfully');
            res.status(200).json(projects);
        } catch (error: any) {
            this.logger.error('Failed to get projects:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const cacheKey = `project-${id}`;
            const cached = this.cache.get(cacheKey);

            if (cached) {
                this.logger.debug(`Serving project ${id} from cache`);
                res.status(200).json(cached);
                return;
            }

            const project = await this.projectService.getProjectById(id);
            if (project) {
                this.cache.set(cacheKey, project);
                await this.analytics.trackProjectView(id);
            }
            
            this.logger.info(`Project ${id} fetched successfully`);
            res.status(200).json(project);
        } catch (error: any) {
            this.logger.error(`Failed to get project ${req.params.id}:`, error);
            if (error.message === 'Project not found') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData: ICreateProject = req.body;
            const errors = projectValidator.validateCreate(projectData);
            
            if (errors.length > 0) {
                this.logger.warn('Project validation failed:', errors);
                res.status(400).json({ errors });
                return;
            }

            const project = await this.projectService.createProject(projectData);
            this.logger.info('Project created successfully:', project.id);
            this.cache.clear(); // Clear cache when data changes
            res.status(201).json(project);
        } catch (error: any) {
            this.logger.error('Failed to create project:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const projectData: IUpdateProject = req.body;
            const errors = projectValidator.validateUpdate(projectData);
            
            if (errors.length > 0) {
                this.logger.warn(`Project ${id} update validation failed:`, errors);
                res.status(400).json({ errors });
                return;
            }

            const project = await this.projectService.updateProject(id, projectData);
            this.logger.info(`Project ${id} updated successfully`);
            this.cache.clear(); // Clear cache when data changes
            res.status(200).json(project);
        } catch (error: any) {
            this.logger.error(`Failed to update project ${req.params.id}:`, error);
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

            if (!fileHelpers.isValidImageType(req.file.mimetype)) {
                this.logger.warn(`Invalid file type for project ${id} thumbnail`);
                res.status(400).json({ error: 'Invalid file type' });
                return;
            }

            const project = await this.projectService.updateThumbnail(id, req.file);
            this.logger.info(`Thumbnail updated for project ${id}`);
            this.cache.clear(); // Clear cache when data changes
            res.status(200).json(project);
        } catch (error: any) {
            this.logger.error(`Failed to upload thumbnail for project ${req.params.id}:`, error);
            res.status(500).json({ error: error.message });
        }
    }

    // ... similar updates for other methods
}
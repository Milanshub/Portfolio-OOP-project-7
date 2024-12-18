import { Request, Response } from 'express';
import { ProjectService } from '../services/ProjectService';
import { ICreateProject, IUpdateProject } from '../types/entities';
import { Logger } from '../utils/logger';
import { projectValidator } from '../utils/validators/projectValidator';
import { AnalyticsObserver } from '../utils/observers/analyticsObservers';
import { fileHelpers } from '../utils/helpers/fileHelpers';
import { Cache } from '../utils/cache';
import { AppError } from '../middleware/errorMiddleware';

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
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async getFeaturedProjects(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'featured-projects';
            const cached = this.cache.get(cacheKey);
            
            if (cached) {
                this.logger.debug('Serving featured projects from cache');
                res.status(200).json(cached);
                return;
            }

            const projects = await this.projectService.getFeaturedProjects();
            this.cache.set(cacheKey, projects);
            this.logger.info('Featured projects fetched successfully');
            res.status(200).json(projects);
        } catch (error: any) {
            this.logger.error('Failed to get featured projects:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
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
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData: ICreateProject = req.body;
            const errors = projectValidator.validateCreate(projectData);
            
            if (errors.length > 0) {
                // Fix: Combine errors into the error message
                throw new AppError('Project validation failed: ' + errors.join(', '), 400);
            }

            const project = await this.projectService.createProject(projectData);
            this.logger.info('Project created successfully:', project.id);
            this.cache.clear();
            res.status(201).json(project);
        } catch (error: any) {
            this.logger.error('Failed to create project:', error);
            res.status(error.statusCode || 500).json({ 
                error: error.message,
                validationErrors: error.errors // Include validation errors separately in response
            });
        }
    }

    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const projectData: IUpdateProject = req.body;
            const errors = projectValidator.validateUpdate(projectData);
            
            if (errors.length > 0) {
                // Fix: Combine errors into the error message
                throw new AppError('Project validation failed: ' + errors.join(', '), 400);
            }

            const project = await this.projectService.updateProject(id, projectData);
            this.logger.info(`Project ${id} updated successfully`);
            this.cache.clear();
            res.status(200).json(project);
        } catch (error: any) {
            this.logger.error(`Failed to update project ${req.params.id}:`, error);
            res.status(error.statusCode || 500).json({ 
                error: error.message,
                validationErrors: error.errors // Include validation errors separately in response
            });
        }
    }

    async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.projectService.deleteProject(id);
            this.logger.info(`Project ${id} deleted successfully`);
            this.cache.clear();
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error: any) {
            this.logger.error(`Failed to delete project ${req.params.id}:`, error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateThumbnail(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!req.file) {
                throw new AppError('No file uploaded', 400);
            }

            if (!fileHelpers.isValidImageType(req.file.mimetype)) {
                throw new AppError('Invalid file type. Only JPEG and PNG are allowed', 400);
            }

            const project = await this.projectService.updateThumbnail(id, req.file);
            this.logger.info(`Thumbnail updated for project ${id}`);
            this.cache.clear();
            res.status(200).json(project);
        } catch (error: any) {
            this.logger.error(`Failed to update thumbnail for project ${req.params.id}:`, error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async updateImages(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!req.files || !Array.isArray(req.files)) {
                throw new AppError('No files uploaded', 400);
            }

            for (const file of req.files) {
                if (!fileHelpers.isValidImageType(file.mimetype)) {
                    throw new AppError('Invalid file type. Only JPEG and PNG are allowed', 400);
                }
            }

            if (req.files.length > 5) {
                throw new AppError('Maximum 5 images allowed', 400);
            }

            const project = await this.projectService.updateImages(id, req.files);
            this.logger.info(`Images updated for project ${id}`);
            this.cache.clear();
            res.status(200).json(project);
        } catch (error: any) {
            this.logger.error(`Failed to update images for project ${req.params.id}:`, error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
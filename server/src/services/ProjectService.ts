import { IProject, ICreateProject, IUpdateProject } from '../types/entities';
import { Project } from '../models/Project';
import { StorageService } from './StorageService';
import { Logger } from '../utils/logger';

export class ProjectService {
    private projectModel: Project;
    private storageService: StorageService;
    private logger = Logger.getInstance();

    constructor() {
        this.projectModel = new Project();
        this.storageService = new StorageService();
    }

    async getAllProjects(): Promise<IProject[]> {
        try {
            const projects = await this.projectModel.findAll();
            this.logger.info('All projects retrieved successfully');
            return projects;
        } catch (error: any) {
            this.logger.error('Failed to get projects:', error);
            throw new Error(`Failed to get projects: ${error.message}`);
        }
    }

    async getFeaturedProjects(): Promise<IProject[]> {
        try {
            const projects = await this.projectModel.findFeatured();
            this.logger.info('Featured projects retrieved successfully');
            return projects;
        } catch (error: any) {
            this.logger.error('Failed to get featured projects:', error);
            throw new Error(`Failed to get featured projects: ${error.message}`);
        }
    }

    async getProjectById(id: string): Promise<IProject> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                this.logger.warn(`Project not found with ID: ${id}`);
                throw new Error('Project not found');
            }
            this.logger.debug(`Project retrieved: ${id}`);
            return project;
        } catch (error: any) {
            this.logger.error(`Failed to get project: ${id}`, error);
            throw new Error(`Failed to get project: ${error.message}`);
        }
    }

    async createProject(projectData: ICreateProject): Promise<IProject> {
        try {
            const project = await this.projectModel.create(projectData);
            this.logger.info(`New project created: ${project.id}`);
            return project;
        } catch (error: any) {
            this.logger.error('Failed to create project:', error);
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }

    async updateProject(id: string, projectData: IUpdateProject): Promise<IProject> {
        try {
            const updatedProject = await this.projectModel.update(id, projectData);
            if (!updatedProject) {
                this.logger.warn(`Project not found for update: ${id}`);
                throw new Error('Project not found');
            }
            this.logger.info(`Project updated successfully: ${id}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update project: ${id}`, error);
            throw new Error(`Failed to update project: ${error.message}`);
        }
    }

    async deleteProject(id: string): Promise<boolean> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                this.logger.warn(`Project not found for deletion: ${id}`);
                throw new Error('Project not found');
            }

            // Delete associated files
            if (project.thumbnail) {
                await this.storageService.deleteFile(project.thumbnail);
                this.logger.debug(`Deleted thumbnail for project: ${id}`);
            }
            
            for (const image of project.images) {
                await this.storageService.deleteFile(image);
                this.logger.debug(`Deleted image for project: ${id}`);
            }

            const result = await this.projectModel.delete(id);
            if (result) {
                this.logger.info(`Project deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete project: ${id}`, error);
            throw new Error(`Failed to delete project: ${error.message}`);
        }
    }

    async updateThumbnail(id: string, file: Express.Multer.File): Promise<IProject> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                this.logger.warn(`Project not found for thumbnail update: ${id}`);
                throw new Error('Project not found');
            }

            const thumbnailUrl = await this.storageService.uploadFile(
                file,
                'projects',
                ['image/jpeg', 'image/png']
            );

            const updatedProject = await this.projectModel.updateThumbnail(id, thumbnailUrl);
            if (!updatedProject) {
                this.logger.error(`Failed to update thumbnail in database: ${id}`);
                throw new Error('Failed to update thumbnail');
            }

            // Delete old thumbnail if exists
            if (project.thumbnail) {
                await this.storageService.deleteFile(project.thumbnail);
                this.logger.debug(`Deleted old thumbnail for project: ${id}`);
            }

            this.logger.info(`Project thumbnail updated successfully: ${id}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update thumbnail: ${id}`, error);
            throw new Error(`Failed to update thumbnail: ${error.message}`);
        }
    }

    async updateImages(id: string, files: Express.Multer.File[]): Promise<IProject> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                this.logger.warn(`Project not found for images update: ${id}`);
                throw new Error('Project not found');
            }

            const imageUrls = await Promise.all(
                files.map(file => 
                    this.storageService.uploadFile(
                        file,
                        'projects',
                        ['image/jpeg', 'image/png']
                    )
                )
            );

            const updatedProject = await this.projectModel.updateImages(id, imageUrls);
            if (!updatedProject) {
                this.logger.error(`Failed to update images in database: ${id}`);
                throw new Error('Failed to update images');
            }

            // Delete old images if they exist
            for (const image of project.images) {
                await this.storageService.deleteFile(image);
                this.logger.debug(`Deleted old image for project: ${id}`);
            }

            this.logger.info(`Project images updated successfully: ${id}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update images: ${id}`, error);
            throw new Error(`Failed to update images: ${error.message}`);
        }
    }
}
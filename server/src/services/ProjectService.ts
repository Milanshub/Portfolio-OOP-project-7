import { IProject, ICreateProject, IUpdateProject } from '../types/entities';
import { ProjectRepository } from '../respositories/ProjectRepository';
import { Logger } from '../utils/logger';
import { GitHubService } from './GitHubService';
import { StorageService } from './StorageService';
import { TechnologyService } from './TechnologyService';
import { AnalyticsService } from './AnalyticsService';
import { AppError } from '../middleware/errorMiddleware';

export class ProjectService {
    private projectRepository: ProjectRepository;
    private githubService: GitHubService;
    private storageService: StorageService;
    private technologyService: TechnologyService;
    private analytics: AnalyticsService;
    private logger = Logger.getInstance();

    constructor() {
        this.projectRepository = new ProjectRepository();
        this.githubService = new GitHubService();
        this.storageService = new StorageService();
        this.technologyService = new TechnologyService();
        this.analytics = AnalyticsService.getInstance();
    }

    async getAllProjects(): Promise<IProject[]> {
        try {
            const projects = await this.projectRepository.findAll();
            this.logger.info('All projects retrieved successfully');
            return projects;
        } catch (error: any) {
            this.logger.error('Failed to get projects:', error);
            throw new AppError(`Failed to get projects: ${error.message}`, 500);
        }
    }

    async getFeaturedProjects(): Promise<IProject[]> {
        try {
            const projects = await this.projectRepository.findFeatured();
            this.logger.info('Featured projects retrieved successfully');
            return projects;
        } catch (error: any) {
            this.logger.error('Failed to get featured projects:', error);
            throw new AppError(`Failed to get featured projects: ${error.message}`, 500);
        }
    }

    async getProjectById(id: string): Promise<IProject> {
        try {
            const project = await this.projectRepository.findById(id);
            if (!project) {
                this.logger.warn(`Project not found: ${id}`);
                throw new AppError('Project not found', 404);
            }
            await this.trackProjectView(id);
            return project;
        } catch (error: any) {
            this.logger.error(`Failed to get project: ${id}`, error);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async createProject(projectData: ICreateProject): Promise<IProject> {
        try {
            const project = await this.projectRepository.create(projectData);

            if (projectData.technologies) {
                await this.associateTechnologies(project.id, projectData.technologies);
            }

            if (projectData.githubUrl) {
                await this.syncWithGitHub(project.id, projectData.githubUrl);
            }

            await this.analytics.trackEvent('project_created', {
                projectId: project.id,
                title: project.title
            });

            this.logger.info(`Project created successfully: ${project.id}`);
            return project;
        } catch (error: any) {
            this.logger.error('Failed to create project:', error);
            throw new AppError(`Failed to create project: ${error.message}`, error.statusCode || 500);
        }
    }

    async updateProject(id: string, projectData: IUpdateProject): Promise<IProject> {
        try {
            const updatedProject = await this.projectRepository.update(id, projectData);
            if (!updatedProject) {
                this.logger.warn(`Project not found for update: ${id}`);
                throw new AppError('Project not found', 404);
            }

            if (projectData.technologies) {
                await this.associateTechnologies(id, projectData.technologies);
            }

            if (projectData.githubUrl) {
                await this.syncWithGitHub(id, projectData.githubUrl);
            }

            await this.analytics.trackEvent('project_updated', {
                projectId: id,
                updates: Object.keys(projectData)
            });

            this.logger.info(`Project updated successfully: ${id}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update project: ${id}`, error);
            throw new AppError(`Failed to update project: ${error.message}`, error.statusCode || 500);
        }
    }

    async deleteProject(id: string): Promise<boolean> {
        try {
            const project = await this.projectRepository.findById(id);
            if (!project) {
                this.logger.warn(`Project not found for deletion: ${id}`);
                throw new AppError('Project not found', 404);
            }

            if (project.thumbnail) {
                await this.storageService.deleteFile(project.thumbnail);
            }
            
            for (const image of project.images || []) {
                await this.storageService.deleteFile(image);
            }

            const result = await this.projectRepository.delete(id);
            if (result) {
                await this.analytics.trackEvent('project_deleted', { projectId: id });
                this.logger.info(`Project deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete project: ${id}`, error);
            throw new AppError(`Failed to delete project: ${error.message}`, error.statusCode || 500);
        }
    }

    async associateTechnologies(projectId: string, technologyIds: string[]): Promise<IProject> {
        try {
            await Promise.all(
                technologyIds.map(techId => this.technologyService.getTechnologyById(techId))
            );

            const updatedProject = await this.projectRepository.updateTechnologies(projectId, technologyIds);
            if (!updatedProject) {
                throw new AppError('Failed to associate technologies', 500);
            }

            await this.analytics.trackEvent('project_technologies_updated', {
                projectId,
                technologies: technologyIds
            });

            this.logger.info(`Technologies associated with project: ${projectId}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to associate technologies: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async syncWithGitHub(projectId: string, repoUrl: string): Promise<IProject> {
        try {
            const repoMetadata = await this.githubService.getRepositoryMetadata(repoUrl);
            const updatedProject = await this.projectRepository.updateGitHubData(projectId, repoMetadata);

            if (!updatedProject) {
                throw new AppError('Failed to sync with GitHub', 500);
            }

            await this.analytics.trackEvent('project_github_synced', {
                projectId,
                repoUrl
            });

            this.logger.info(`Project synced with GitHub: ${projectId}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to sync with GitHub: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async updateThumbnail(id: string, file: Express.Multer.File): Promise<IProject> {
        try {
            const project = await this.getProjectById(id);
            
            const thumbnailUrl = await this.storageService.uploadFile(
                file,
                'projects',
                ['image/jpeg', 'image/png']
            );

            if (project.thumbnail) {
                await this.storageService.deleteFile(project.thumbnail);
            }

            const updatedProject = await this.projectRepository.updateThumbnail(id, thumbnailUrl);
            if (!updatedProject) {
                throw new AppError('Failed to update thumbnail', 500);
            }

            this.logger.info(`Project thumbnail updated: ${id}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update thumbnail: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    async updateImages(id: string, files: Express.Multer.File[]): Promise<IProject> {
        try {
            const project = await this.getProjectById(id);

            const imageUrls = await Promise.all(
                files.map(file => 
                    this.storageService.uploadFile(
                        file,
                        'projects',
                        ['image/jpeg', 'image/png']
                    )
                )
            );

            for (const image of project.images || []) {
                await this.storageService.deleteFile(image);
            }

            const updatedProject = await this.projectRepository.updateImages(id, imageUrls);
            if (!updatedProject) {
                throw new AppError('Failed to update images', 500);
            }

            this.logger.info(`Project images updated: ${id}`);
            return updatedProject;
        } catch (error: any) {
            this.logger.error(`Failed to update images: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }

    private async trackProjectView(id: string): Promise<void> {
        try {
            await this.analytics.recordPageView();
            await this.analytics.updateMostViewedProjects([id]);
            this.logger.info(`Project view tracked: ${id}`);
        } catch (error: any) {
            this.logger.error(`Failed to track project view: ${error.message}`);
            throw new AppError(error.message, error.statusCode || 500);
        }
    }
}
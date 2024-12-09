import { Express } from 'express';
import { IProject, ICreateProject, IUpdateProject } from '../types/entities';
import { Project } from '../models/Project';
import { StorageService } from './StorageService';

export class ProjectService {
    private projectModel: Project;
    private storageService: StorageService;

    constructor() {
        this.projectModel = new Project();
        this.storageService = new StorageService();
    }

    async getAllProjects(): Promise<IProject[]> {
        try {
            return await this.projectModel.findAll();
        } catch (error: any) {
            throw new Error(`Failed to get projects: ${error.message}`);
        }
    }

    async getFeaturedProjects(): Promise<IProject[]> {
        try {
            return await this.projectModel.findFeatured();
        } catch (error: any) {
            throw new Error(`Failed to get featured projects: ${error.message}`);
        }
    }

    async getProjectById(id: string): Promise<IProject> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                throw new Error('Project not found');
            }
            return project;
        } catch (error: any) {
            throw new Error(`Failed to get project: ${error.message}`);
        }
    }

    async createProject(projectData: ICreateProject): Promise<IProject> {
        try {
            return await this.projectModel.create(projectData);
        } catch (error: any) {
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }

    async updateProject(id: string, projectData: IUpdateProject): Promise<IProject> {
        try {
            const updatedProject = await this.projectModel.update(id, projectData);
            if (!updatedProject) {
                throw new Error('Project not found');
            }
            return updatedProject;
        } catch (error: any) {
            throw new Error(`Failed to update project: ${error.message}`);
        }
    }

    async deleteProject(id: string): Promise<boolean> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                throw new Error('Project not found');
            }

            // Delete associated files
            if (project.thumbnail) {
                await this.storageService.deleteFile(project.thumbnail);
            }
            for (const image of project.images) {
                await this.storageService.deleteFile(image);
            }

            return await this.projectModel.delete(id);
        } catch (error: any) {
            throw new Error(`Failed to delete project: ${error.message}`);
        }
    }

    async updateThumbnail(id: string, file: Express.Multer.File): Promise<IProject> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
                throw new Error('Project not found');
            }

            const thumbnailUrl = await this.storageService.uploadFile(
                file,
                'projects',
                ['image/jpeg', 'image/png']
            );

            const updatedProject = await this.projectModel.updateThumbnail(id, thumbnailUrl);
            if (!updatedProject) {
                throw new Error('Failed to update thumbnail');
            }

            // Delete old thumbnail if exists
            if (project.thumbnail) {
                await this.storageService.deleteFile(project.thumbnail);
            }

            return updatedProject;
        } catch (error: any) {
            throw new Error(`Failed to update thumbnail: ${error.message}`);
        }
    }

    async updateImages(id: string, files: Express.Multer.File[]): Promise<IProject> {
        try {
            const project = await this.projectModel.findById(id);
            if (!project) {
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
                throw new Error('Failed to update images');
            }

            // Delete old images if they exist
            for (const image of project.images) {
                await this.storageService.deleteFile(image);
            }

            return updatedProject;
        } catch (error: any) {
            throw new Error(`Failed to update images: ${error.message}`);
        }
    }
}
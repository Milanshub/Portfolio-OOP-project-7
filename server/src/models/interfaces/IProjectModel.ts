import { IProject } from '../../types/entities';
import { IRepository } from './IRepository';
import { IGitHubRepoMetadata } from './IGitHubModel';

export interface IProjectModel extends IRepository<IProject, Omit<IProject, 'id'>, Partial<IProject>> {
    findFeatured(): Promise<IProject[]>;
    updateThumbnail(id: string, thumbnailUrl: string): Promise<IProject | null>;
    updateImages(id: string, imageUrls: string[]): Promise<IProject | null>;
    updateTechnologies(id: string, technologyIds: string[]): Promise<IProject | null>;
    updateGitHubData(id: string, data: IGitHubRepoMetadata): Promise<IProject | null>;
}
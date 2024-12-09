import { IProject } from '../../types/entities';
import { IRepository } from './IRepository';

export interface IProjectModel extends IRepository<IProject, Omit<IProject, 'id'>, Partial<IProject>> {
    // Project-specific methods
    findFeatured(): Promise<IProject[]>;
    updateThumbnail(id: string, thumbnailUrl: string): Promise<IProject | null>;
    updateImages(id: string, imageUrls: string[]): Promise<IProject | null>;
    updateOrder(id: string, order: number): Promise<IProject | null>;
}
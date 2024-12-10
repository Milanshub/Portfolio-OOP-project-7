import { IProject } from '../../types/entities';

export class ProjectFactory {
    static create(data: Partial<IProject>): IProject {
        return {
            id: data.id || '',
            title: data.title || '',
            description: data.description || '',
            shortDescription: data.shortDescription || '',
            thumbnail: data.thumbnail || '',
            images: data.images || [],
            liveUrl: data.liveUrl || '',
            githubUrl: data.githubUrl || '',
            featured: data.featured || false,
            order: data.order || 0,
            startDate: data.startDate || new Date(),
            endDate: data.endDate || new Date(),
        };
    }
}
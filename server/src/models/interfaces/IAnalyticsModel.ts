import { IAnalytics } from '../../types/entities';
import { IRepository } from './IRepository';

export interface IAnalyticsModel extends IRepository<
    IAnalytics,
    Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'>,
    Partial<IAnalytics>
> {
    getLatestAnalytics(): Promise<IAnalytics | null>;
    incrementPageViews(): Promise<void>;
    updateMostViewedProjects(projectIds: string[]): Promise<void>;
    createEvent(event: {
        name: string;
        data: any;
        timestamp: Date;
    }): Promise<void>;
}
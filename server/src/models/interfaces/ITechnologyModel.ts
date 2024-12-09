import { ITechnology } from '../../types/entities';
import { IRepository } from './IRepository';

export interface ITechnologyModel extends IRepository<ITechnology, Omit<ITechnology, 'id'>, Partial<ITechnology>> {
    findByCategory(category: string): Promise<ITechnology[]>;
    updateProficiencyLevel(id: string, level: number): Promise<ITechnology | null>;
}
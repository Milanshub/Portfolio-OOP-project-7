import { IAdmin } from '../../types/entities';
import { IRepository } from './IRepository';

export interface IAdminModel extends IRepository<IAdmin, Omit<IAdmin, 'id' | 'lastLogin'>, Partial<IAdmin>> {
    findByEmail(email: string): Promise<IAdmin | null>;
    updateLastLogin(id: string): Promise<IAdmin | null>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
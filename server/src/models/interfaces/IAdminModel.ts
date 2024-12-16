import { IAdmin } from '../../types/entities';
import { IRepository } from './IRepository';

export interface IAdminModel extends IRepository<IAdmin, Omit<IAdmin, 'id'>, Partial<IAdmin>> {
    findByEmail(email: string): Promise<IAdmin | null>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
    updateLastLogin(id: string): Promise<void>;
    updatePassword(id: string, newPassword: string): Promise<void>; // Add this method
}
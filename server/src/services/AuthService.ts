import jwt from 'jsonwebtoken';
import { AdminService } from './AdminService';
import { Logger } from '../utils/logger';
import { IAdmin } from '../types/entities';
import { Cache } from '../utils/cache';
import { AppError } from '../middleware/errorMiddleware';

export class AuthService {
    private static instance: AuthService;
    private adminService: AdminService;
    private logger = Logger.getInstance();
    private tokenCache = new Cache<string>(15 * 60 * 1000); // 15 minute cache

    private constructor() {
        this.adminService = new AdminService();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(email: string, password: string): Promise<{ admin: IAdmin; token: string }> {
        try {
            const admin = await this.adminService.validateCredentials(email, password);
            const token = this.generateToken(admin);
            
            // Cache the token
            this.tokenCache.set(token, admin.id);
            
            this.logger.info(`Login successful for admin: ${email}`);
            return { admin, token };
        } catch (error: any) {
            this.logger.error(`Login failed: ${error.message}`);
            throw new AppError('Invalid credentials', 401);
        }
    }

    async validateToken(token: string): Promise<IAdmin> {
        try {
            // Check cache first
            const cachedAdminId = this.tokenCache.get(token);
            if (cachedAdminId) {
                const admin = await this.adminService.getAdminById(cachedAdminId);
                if (admin) return admin;
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
            const admin = await this.adminService.getAdminById(decoded.id);
            
            if (!admin) {
                throw new AppError('Invalid token', 401);
            }

            // Update cache
            this.tokenCache.set(token, admin.id);
            return admin;
        } catch (error: any) {
            this.logger.error(`Token validation failed: ${error.message}`);
            throw new AppError('Authentication failed', 401);
        }
    }

    generateToken(admin: IAdmin): string {
        return jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
    }

    invalidateToken(token: string): void {
        this.tokenCache.delete(token);
        this.logger.info('Token invalidated successfully');
    }
}

// Export singleton instance
export const authService = AuthService.getInstance();
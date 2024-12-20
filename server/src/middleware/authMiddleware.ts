import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';
import { AppError } from './errorMiddleware';
import { supabase } from '../config/supabase';

interface JwtPayload {
    id: string;
    email: string;
}

export class AuthMiddleware {
    private static instance: AuthMiddleware;
    private logger = Logger.getInstance();
    private cache = new Cache<JwtPayload>(15 * 60 * 1000); // 15 minute cache

    private constructor() {}

    static getInstance(): AuthMiddleware {
        if (!AuthMiddleware.instance) {
            AuthMiddleware.instance = new AuthMiddleware();
        }
        return AuthMiddleware.instance;
    }

    authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                this.logger.warn('Authentication failed: No token provided');
                throw new AppError('Authentication required', 401);
            }

            // Check token in cache
            const cachedPayload = this.cache.get(token);
            if (cachedPayload) {
                req.user = cachedPayload;
                return next();
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            
            // Cache the decoded token
            this.cache.set(token, decoded);
            
            // Attach user to request
            req.user = decoded;
            
            this.logger.debug('Authentication successful', { userId: decoded.id });
            next();
        } catch (error: any) {
            if (error.name === 'JsonWebTokenError') {
                this.logger.warn('Invalid token provided');
                throw new AppError('Invalid token', 401);
            }
            if (error.name === 'TokenExpiredError') {
                this.logger.warn('Token expired');
                throw new AppError('Token expired', 401);
            }
            next(error);
        }
    };

    requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                this.logger.warn('Admin check failed: No user in request');
                throw new AppError('Authentication required', 401);
            }
    
            const { data: admin, error } = await supabase
                .from('admins')
                .select('*')
                .eq('id', req.user.id)
                .single();
    
            if (error || !admin) {
                this.logger.warn(`Admin check failed: User ${req.user.id} is not an admin`);
                throw new AppError('Admin access required', 403);
            }
            
            this.logger.debug('Admin check successful', { userId: req.user.id });
            next();
        } catch (error) {
            next(error);
        }
    };
}

// Export singleton instance methods
const authMiddleware = AuthMiddleware.getInstance();
export const authenticate = authMiddleware.authenticate;
export const requireAdmin = authMiddleware.requireAdmin;
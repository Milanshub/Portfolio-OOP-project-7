import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { AppError } from './errorMiddleware';

export class ValidationMiddleware {
    private static instance: ValidationMiddleware;
    private logger = Logger.getInstance();

    private constructor() {}

    static getInstance(): ValidationMiddleware {
        if (!ValidationMiddleware.instance) {
            ValidationMiddleware.instance = new ValidationMiddleware();
        }
        return ValidationMiddleware.instance;
    }

    validateProject = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, description } = req.body;
            
            if (!title) throw new AppError('Title is required', 400);
            if (!description) throw new AppError('Description is required', 400);
            
            next();
        } catch (error) {
            next(error);
        }
    };

    validateProfile = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fullName, email } = req.body;
            
            if (!fullName) throw new AppError('Full name is required', 400);
            if (!email) throw new AppError('Email is required', 400);
            if (!this.isValidEmail(email)) throw new AppError('Invalid email format', 400);
            
            next();
        } catch (error) {
            next(error);
        }
    };

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

const validationMiddleware = ValidationMiddleware.getInstance();
export const { validateProject, validateProfile } = validationMiddleware;
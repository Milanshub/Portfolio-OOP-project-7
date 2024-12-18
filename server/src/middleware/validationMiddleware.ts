import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { AppError } from './errorMiddleware';
import { TechnologyCategory } from '../types/entities';

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
            const { title, description, shortDescription, liveUrl, githubUrl } = req.body;
            
            if (!title?.trim()) {
                throw new AppError('Title is required', 400);
            }
            if (!description?.trim()) {
                throw new AppError('Description is required', 400);
            }
            if (!shortDescription?.trim()) {
                throw new AppError('Short description is required', 400);
            }

            // URL validations if provided
            if (liveUrl && !this.isValidUrl(liveUrl)) {
                throw new AppError('Invalid live URL format', 400);
            }
            if (githubUrl && !this.isValidUrl(githubUrl)) {
                throw new AppError('Invalid GitHub URL format', 400);
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };

    validateProfile = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { fullName, email, title, bio, location } = req.body;
            
            if (!fullName?.trim()) {
                throw new AppError('Full name is required', 400);
            }
            if (!email?.trim()) {
                throw new AppError('Email is required', 400);
            }
            if (!this.isValidEmail(email)) {
                throw new AppError('Invalid email format', 400);
            }
            if (!title?.trim()) {
                throw new AppError('Title is required', 400);
            }
            if (!bio?.trim()) {
                throw new AppError('Bio is required', 400);
            }
            if (!location?.trim()) {
                throw new AppError('Location is required', 400);
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };

    validateTechnology = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, category, proficiencyLevel } = req.body;
            
            // Required field validations
            if (!name?.trim()) {
                throw new AppError('Technology name is required', 400);
            }

            // Category validation
            if (!category?.trim()) {
                throw new AppError('Category is required', 400);
            }
            if (!Object.values(TechnologyCategory).includes(category)) {
                throw new AppError('Invalid technology category', 400);
            }

            // Proficiency level validation
            if (proficiencyLevel !== undefined) {
                if (typeof proficiencyLevel !== 'number' || 
                    proficiencyLevel < 1 || 
                    proficiencyLevel > 10) {
                    throw new AppError('Proficiency level must be between 1 and 10', 400);
                }
            }
            
            next();
        } catch (error) {
            next(error);
        }
    };

    validateMessage = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { senderName, senderEmail, subject, message } = req.body;

            if (!senderName?.trim()) {
                throw new AppError('Sender name is required', 400);
            }
            if (!senderEmail?.trim()) {
                throw new AppError('Sender email is required', 400);
            }
            if (!this.isValidEmail(senderEmail)) {
                throw new AppError('Invalid email format', 400);
            }
            if (!subject?.trim()) {
                throw new AppError('Subject is required', 400);
            }
            if (!message?.trim()) {
                throw new AppError('Message content is required', 400);
            }

            next();
        } catch (error) {
            next(error);
        }
    };

    validateAnalytics = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { pageViews, eventType, eventData } = req.body;

            if (pageViews !== undefined && typeof pageViews !== 'number') {
                throw new AppError('Page views must be a number', 400);
            }
            if (eventType && typeof eventType !== 'string') {
                throw new AppError('Event type must be a string', 400);
            }
            if (eventData && typeof eventData !== 'object') {
                throw new AppError('Event data must be an object', 400);
            }

            next();
        } catch (error) {
            next(error);
        }
    };

    private isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
}

const validationMiddleware = ValidationMiddleware.getInstance();
export const { 
    validateProject, 
    validateProfile, 
    validateTechnology,
    validateMessage,
    validateAnalytics 
} = validationMiddleware;
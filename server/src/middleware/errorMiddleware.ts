import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';
import { AnalyticsObserver } from '../utils/observers/analyticsObservers';

export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const logger = Logger.getInstance();
    const analytics = AnalyticsObserver.getInstance();

    // Log error details
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        statusCode: err instanceof AppError ? err.statusCode : 500
    });

    // Track error for analytics
    analytics.trackPageView(`error_${err instanceof AppError ? err.statusCode : 500}`);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    // Handle unexpected errors
    const statusCode = 500;
    const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;

    res.status(statusCode).json({
        error: errorMessage
    });
};
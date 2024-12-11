import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { errorHandler, AppError } from './middleware/errorMiddleware';
import { Logger } from './utils/logger';
import { router as projectRoutes } from './routes/ProjectRoutes';
import { router as technologyRoutes } from './routes/TechnologyRoutes';
import { router as profileRoutes } from './routes/ProfileRoutes';
import { router as messageRoutes } from './routes/MessageRoutes';
import { router as analyticsRoutes } from './routes/AnalyticsRoutes';

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize logger
const logger = Logger.getInstance();

// Create Express app
const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError('Not Found', 404));
});

// Error handling
app.use(errorHandler);

export default app;
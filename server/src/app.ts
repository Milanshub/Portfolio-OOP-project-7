import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { errorHandler, AppError } from './middleware/errorMiddleware';
import { Logger } from './utils/logger';

// Import all routes
import { router as projectRoutes } from './routes/ProjectRoutes';
import { router as technologyRoutes } from './routes/TechnologyRoutes';
import { router as profileRoutes } from './routes/ProfileRoutes';
import { router as messageRoutes } from './routes/MessageRoutes';
import { router as analyticsRoutes } from './routes/AnalyticsRoutes';
import { router as adminRoutes } from './routes/AdminRoutes';
import { router as adminProfileRoutes } from './routes/AdminProfileRoutes';
import { router as authRoutes } from './routes/AuthRoutes';
import { router as githubRoutes } from './routes/GitHubRoutes';
import { router as storageRoutes } from './routes/StorageRoutes';

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/projects', projectRoutes);
app.use('/api/technologies', technologyRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-profile', adminProfileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/storage', storageRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// 404 handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new AppError('Not Found', 404));
});

// Error handling
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Performing graceful shutdown...');
    // Add any cleanup logic here (close database connections, etc.)
    process.exit(0);
});

export default app;
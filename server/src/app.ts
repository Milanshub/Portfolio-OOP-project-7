import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { projectRoutes } from './routes/projectRoutes';
import { profileRoutes } from './routes/profileRoutes';
import { errorHandler } from './middleware/errorMiddleware';
import { adminRoutes } from './routes/AdminRoutes';
import { analyticsRoutes } from './routes/AnalyticsRoutes';
import { messageRoutes } from './routes/MessageRoutes';
import { technologyRoutes } from './routes/TechnologyRoutes';

export class App {
    private app: express.Application;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    private configureMiddleware(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
    }

    private configureRoutes(): void {
        this.app.use('/api/projects', projectRoutes);
        this.app.use('/api/profile', profileRoutes);
        this.app.use('/api/admin', adminRoutes);
        this.app.use('/api/analytics', analyticsRoutes);
        this.app.use('/api/messages', messageRoutes);
        this.app.use('/api/technologies', technologyRoutes);
    }

    private configureErrorHandling(): void {
        this.app.use(errorHandler);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
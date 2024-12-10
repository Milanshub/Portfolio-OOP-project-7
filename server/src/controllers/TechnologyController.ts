import { Request, Response } from 'express';
import { TechnologyService } from '../services/TechnologyService';
import { ICreateTechnology, IUpdateTechnology } from '../types/entities';
import { Logger } from '../utils/logger';
import { Cache } from '../utils/cache';

export class TechnologyController {
    private technologyService: TechnologyService;
    private logger = Logger.getInstance();
    private cache = new Cache<any>(15 * 60 * 1000); // 15 minute cache

    constructor() {
        this.technologyService = new TechnologyService();
    }

    async getAllTechnologies(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'all-technologies';
            const cached = this.cache.get(cacheKey);
            
            if (cached) {
                this.logger.debug('Serving technologies from cache');
                res.status(200).json(cached);
                return;
            }

            const technologies = await this.technologyService.getAllTechnologies();
            this.cache.set(cacheKey, technologies);
            this.logger.info('Technologies fetched successfully');
            res.status(200).json(technologies);
        } catch (error: any) {
            this.logger.error('Failed to get technologies:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getTechnologiesByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { category } = req.params;
            const cacheKey = `technologies-${category}`;
            const cached = this.cache.get(cacheKey);

            if (cached) {
                this.logger.debug(`Serving ${category} technologies from cache`);
                res.status(200).json(cached);
                return;
            }

            const technologies = await this.technologyService.getTechnologiesByCategory(category);
            this.cache.set(cacheKey, technologies);
            this.logger.info(`Technologies for category ${category} fetched successfully`);
            res.status(200).json(technologies);
        } catch (error: any) {
            this.logger.error(`Failed to get technologies for category ${req.params.category}:`, error);
            res.status(400).json({ error: error.message });
        }
    }

    async updateProficiencyLevel(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { level } = req.body;

            if (typeof level !== 'number' || level < 0 || level > 100) {
                this.logger.warn(`Invalid proficiency level: ${level}`);
                res.status(400).json({ error: 'Proficiency level must be between 0 and 100' });
                return;
            }

            const technology = await this.technologyService.updateProficiencyLevel(id, level);
            this.logger.info(`Proficiency level updated for technology ${id}`);
            this.cache.clear();
            res.status(200).json(technology);
        } catch (error: any) {
            this.logger.error(`Failed to update proficiency level for technology ${req.params.id}:`, error);
            res.status(400).json({ error: error.message });
        }
    }

    // ... similar updates for other methods
}
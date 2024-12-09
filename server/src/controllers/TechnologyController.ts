import { Request, Response } from 'express';
import { TechnologyService } from '../services/TechnologyService';
import { ICreateTechnology, IUpdateTechnology } from '../types/entities';

export class TechnologyController {
    private technologyService: TechnologyService;

    constructor() {
        this.technologyService = new TechnologyService();
    }

    async getAllTechnologies(req: Request, res: Response): Promise<void> {
        try {
            const technologies = await this.technologyService.getAllTechnologies();
            res.status(200).json(technologies);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getTechnologyById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const technology = await this.technologyService.getTechnologyById(id);
            res.status(200).json(technology);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async getTechnologiesByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { category } = req.params;
            const technologies = await this.technologyService.getTechnologiesByCategory(category);
            res.status(200).json(technologies);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async createTechnology(req: Request, res: Response): Promise<void> {
        try {
            const technologyData: ICreateTechnology = req.body;
            const technology = await this.technologyService.createTechnology(technologyData);
            res.status(201).json(technology);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateTechnology(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const technologyData: IUpdateTechnology = req.body;
            const technology = await this.technologyService.updateTechnology(id, technologyData);
            res.status(200).json(technology);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteTechnology(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.technologyService.deleteTechnology(id);
            res.status(200).json({ message: 'Technology deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProficiencyLevel(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { level } = req.body;
            const technology = await this.technologyService.updateProficiencyLevel(id, level);
            res.status(200).json(technology);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
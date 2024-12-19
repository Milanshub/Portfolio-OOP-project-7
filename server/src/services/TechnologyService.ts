import { ITechnology, ICreateTechnology, IUpdateTechnology, TechnologyCategory } from '../types/entities';
import { TechnologyRepository } from '../respositories/TechnologyRepository';
import { Logger } from '../utils/logger';

export class TechnologyService {
    private technologyRepository: TechnologyRepository;
    private logger = Logger.getInstance();
    

    constructor() {
        this.technologyRepository = new TechnologyRepository();
    }

    async getAllTechnologies(): Promise<ITechnology[]> {
        try {
            const technologies = await this.technologyRepository.findAll();
            this.logger.info('All technologies retrieved successfully');
            return technologies;
        } catch (error: any) {
            this.logger.error('Failed to get technologies:', error);
            throw new Error(`Failed to get technologies: ${error.message}`);
        }
    }

    async getTechnologyById(id: string): Promise<ITechnology> {
        try {
            const technology = await this.technologyRepository.findById(id);
            if (!technology) {
                this.logger.warn(`Technology not found with ID: ${id}`);
                throw new Error('Technology not found');
            }
            this.logger.debug(`Technology retrieved: ${id}`);
            return technology;
        } catch (error: any) {
            this.logger.error(`Failed to get technology: ${id}`, error);
            throw new Error(`Failed to get technology: ${error.message}`);
        }
    }

    async getTechnologiesByCategory(category: string): Promise<ITechnology[]> {
        try {
            // Validate category
            if (!Object.values(TechnologyCategory).includes(category as TechnologyCategory)) {
                this.logger.warn(`Invalid category attempted: ${category}`);
                throw new Error('Invalid category');
            }
            const technologies = await this.technologyRepository.findByCategory(category);
            this.logger.info(`Technologies retrieved for category: ${category}`);
            return technologies;
        } catch (error: any) {
            this.logger.error(`Failed to get technologies for category: ${category}`, error);
            throw new Error(`Failed to get technologies by category: ${error.message}`);
        }
    }

    async createTechnology(technologyData: ICreateTechnology): Promise<ITechnology> {
        try {
            // Validate category
            if (!Object.values(TechnologyCategory).includes(technologyData.category)) {
                this.logger.warn(`Invalid category attempted: ${technologyData.category}`);
                throw new Error('Invalid category');
            }

            // Validate proficiency level
            if (technologyData.proficiencyLevel < 1 || technologyData.proficiencyLevel > 10) {
                this.logger.warn(`Invalid proficiency level attempted: ${technologyData.proficiencyLevel}`);
                throw new Error('Proficiency level must be between 1 and 10');
            }

            const technology = await this.technologyRepository.create(technologyData);
            this.logger.info(`New technology created: ${technology.id}`);
            return technology;
        } catch (error: any) {
            this.logger.error('Failed to create technology:', error);
            throw new Error(`Failed to create technology: ${error.message}`);
        }
    }

    async updateTechnology(id: string, technologyData: IUpdateTechnology): Promise<ITechnology> {
        try {
            // Validate category if provided
            if (technologyData.category && !Object.values(TechnologyCategory).includes(technologyData.category)) {
                this.logger.warn(`Invalid category attempted for update: ${technologyData.category}`);
                throw new Error('Invalid category');
            }

            // Validate proficiency level if provided
            if (technologyData.proficiencyLevel && 
                (technologyData.proficiencyLevel < 1 || technologyData.proficiencyLevel > 10)) {
                this.logger.warn(`Invalid proficiency level attempted for update: ${technologyData.proficiencyLevel}`);
                throw new Error('Proficiency level must be between 1 and 10');
            }

            const technology = await this.technologyRepository.update(id, technologyData);
            if (!technology) {
                this.logger.warn(`Technology not found for update: ${id}`);
                throw new Error('Technology not found');
            }
            this.logger.info(`Technology updated successfully: ${id}`);
            return technology;
        } catch (error: any) {
            this.logger.error(`Failed to update technology: ${id}`, error);
            throw new Error(`Failed to update technology: ${error.message}`);
        }
    }

    async deleteTechnology(id: string): Promise<boolean> {
        try {
            const technology = await this.technologyRepository.findById(id);
            if (!technology) {
                this.logger.warn(`Technology not found for deletion: ${id}`);
                throw new Error('Technology not found');
            }
            const result = await this.technologyRepository.delete(id);
            if (result) {
                this.logger.info(`Technology deleted successfully: ${id}`);
            }
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to delete technology: ${id}`, error);
            throw new Error(`Failed to delete technology: ${error.message}`);
        }
    }

    async updateProficiencyLevel(id: string, level: number): Promise<ITechnology> {
        try {
            if (level < 1 || level > 10) {
                this.logger.warn(`Invalid proficiency level attempted: ${level}`);
                throw new Error('Proficiency level must be between 1 and 10');
            }

            const technology = await this.technologyRepository.updateProficiencyLevel(id, level);
            if (!technology) {
                this.logger.warn(`Technology not found for proficiency update: ${id}`);
                throw new Error('Technology not found');
            }
            this.logger.info(`Proficiency level updated for technology: ${id}`);
            return technology;
        } catch (error: any) {
            this.logger.error(`Failed to update proficiency level: ${id}`, error);
            throw new Error(`Failed to update proficiency level: ${error.message}`);
        }
    }
}
import { ITechnology, ICreateTechnology, IUpdateTechnology, TechnologyCategory } from '../types/entities';
import { Technology } from '../models/Technology';

export class TechnologyService {
    private technologyModel: Technology;

    constructor() {
        this.technologyModel = new Technology();
    }

    async getAllTechnologies(): Promise<ITechnology[]> {
        try {
            return await this.technologyModel.findAll();
        } catch (error: any) {
            throw new Error(`Failed to get technologies: ${error.message}`);
        }
    }

    async getTechnologyById(id: string): Promise<ITechnology> {
        try {
            const technology = await this.technologyModel.findById(id);
            if (!technology) {
                throw new Error('Technology not found');
            }
            return technology;
        } catch (error: any) {
            throw new Error(`Failed to get technology: ${error.message}`);
        }
    }

    async getTechnologiesByCategory(category: string): Promise<ITechnology[]> {
        try {
            // Validate category
            if (!Object.values(TechnologyCategory).includes(category as TechnologyCategory)) {
                throw new Error('Invalid category');
            }
            return await this.technologyModel.findByCategory(category);
        } catch (error: any) {
            throw new Error(`Failed to get technologies by category: ${error.message}`);
        }
    }

    async createTechnology(technologyData: ICreateTechnology): Promise<ITechnology> {
        try {
            // Validate category
            if (!Object.values(TechnologyCategory).includes(technologyData.category)) {
                throw new Error('Invalid category');
            }

            // Validate proficiency level
            if (technologyData.proficiencyLevel < 1 || technologyData.proficiencyLevel > 10) {
                throw new Error('Proficiency level must be between 1 and 10');
            }

            return await this.technologyModel.create(technologyData);
        } catch (error: any) {
            throw new Error(`Failed to create technology: ${error.message}`);
        }
    }

    async updateTechnology(id: string, technologyData: IUpdateTechnology): Promise<ITechnology> {
        try {
            // Validate category if provided
            if (technologyData.category && !Object.values(TechnologyCategory).includes(technologyData.category)) {
                throw new Error('Invalid category');
            }

            // Validate proficiency level if provided
            if (technologyData.proficiencyLevel && 
                (technologyData.proficiencyLevel < 1 || technologyData.proficiencyLevel > 10)) {
                throw new Error('Proficiency level must be between 1 and 10');
            }

            const technology = await this.technologyModel.update(id, technologyData);
            if (!technology) {
                throw new Error('Technology not found');
            }
            return technology;
        } catch (error: any) {
            throw new Error(`Failed to update technology: ${error.message}`);
        }
    }

    async deleteTechnology(id: string): Promise<boolean> {
        try {
            const technology = await this.technologyModel.findById(id);
            if (!technology) {
                throw new Error('Technology not found');
            }
            return await this.technologyModel.delete(id);
        } catch (error: any) {
            throw new Error(`Failed to delete technology: ${error.message}`);
        }
    }

    async updateProficiencyLevel(id: string, level: number): Promise<ITechnology> {
        try {
            if (level < 1 || level > 10) {
                throw new Error('Proficiency level must be between 1 and 10');
            }

            const technology = await this.technologyModel.updateProficiencyLevel(id, level);
            if (!technology) {
                throw new Error('Technology not found');
            }
            return technology;
        } catch (error: any) {
            throw new Error(`Failed to update proficiency level: ${error.message}`);
        }
    }
}
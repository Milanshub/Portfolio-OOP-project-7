import { TechnologyService } from '../../src/services/TechnologyService';
import { TechnologyRepository } from '../../src/respositories/TechnologyRepository';
import { Logger } from '../../src/utils/logger';
import { mockTechnology } from '../utils/mockHelpers';
import { TechnologyCategory } from '../../src/types/entities';

// Mock dependencies
jest.mock('../../src/respositories/TechnologyRepository');
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));

describe('TechnologyService', () => {
    let technologyService: TechnologyService;
    let mockLogger: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        technologyService = new TechnologyService();
    });

    describe('getAllTechnologies', () => {
        it('should get all technologies successfully', async () => {
            (TechnologyRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockTechnology]);

            const result = await technologyService.getAllTechnologies();

            expect(result).toEqual([mockTechnology]);
            expect(mockLogger.info).toHaveBeenCalledWith('All technologies retrieved successfully');
        });

        it('should handle errors when getting technologies', async () => {
            const error = new Error('Database error');
            (TechnologyRepository.prototype.findAll as jest.Mock).mockRejectedValue(error);

            await expect(technologyService.getAllTechnologies())
                .rejects.toThrow('Failed to get technologies: Database error');
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get technologies:',
                error
            );
        });
    });

    describe('getTechnologyById', () => {
        it('should get technology by id successfully', async () => {
            (TechnologyRepository.prototype.findById as jest.Mock).mockResolvedValue(mockTechnology);

            const result = await technologyService.getTechnologyById(mockTechnology.id);

            expect(result).toEqual(mockTechnology);
            expect(mockLogger.debug).toHaveBeenCalledWith(
                `Technology retrieved: ${mockTechnology.id}`
            );
        });

        it('should throw error when technology not found', async () => {
            (TechnologyRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.getTechnologyById('999'))
                .rejects.toThrow('Failed to get technology: Technology not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Technology not found with ID: 999'
            );
        });
    });

    describe('getTechnologiesByCategory', () => {
        it('should get technologies by category successfully', async () => {
            (TechnologyRepository.prototype.findByCategory as jest.Mock).mockResolvedValue([mockTechnology]);

            const result = await technologyService.getTechnologiesByCategory(TechnologyCategory.FRONTEND);

            expect(result).toEqual([mockTechnology]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Technologies retrieved for category: ${TechnologyCategory.FRONTEND}`
            );
        });

        it('should throw error for invalid category', async () => {
            await expect(technologyService.getTechnologiesByCategory('INVALID' as TechnologyCategory))
                .rejects.toThrow('Failed to get technologies by category: Invalid category');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid category attempted: INVALID'
            );
        });
    });

    describe('createTechnology', () => {
        const createData = {
            name: 'Test Technology',
            category: TechnologyCategory.FRONTEND,
            proficiencyLevel: 5,
            icon: 'test-icon.svg'
        };

        it('should create technology successfully', async () => {
            (TechnologyRepository.prototype.create as jest.Mock).mockResolvedValue({
                id: '1',
                ...createData
            });

            const result = await technologyService.createTechnology(createData);

            expect(result).toHaveProperty('id');
            expect(result.name).toBe(createData.name);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'New technology created: 1'
            );
        });

        it('should throw error for invalid category', async () => {
            const invalidData = {
                ...createData,
                category: 'INVALID' as TechnologyCategory
            };

            await expect(technologyService.createTechnology(invalidData))
                .rejects.toThrow('Failed to create technology: Invalid category');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid category attempted: INVALID'
            );
        });

        it('should throw error for invalid proficiency level', async () => {
            const invalidData = {
                ...createData,
                proficiencyLevel: 11
            };

            await expect(technologyService.createTechnology(invalidData))
                .rejects.toThrow('Failed to create technology: Proficiency level must be between 1 and 10');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid proficiency level attempted: 11'
            );
        });
    });

    describe('updateTechnology', () => {
        const updateData = {
            name: 'Updated Technology',
            category: TechnologyCategory.BACKEND
        };

        it('should update technology successfully', async () => {
            const updatedTechnology = {
                ...mockTechnology,
                ...updateData
            };
            (TechnologyRepository.prototype.update as jest.Mock).mockResolvedValue(updatedTechnology);

            const result = await technologyService.updateTechnology(mockTechnology.id, updateData);

            expect(result.name).toBe(updateData.name);
            expect(result.category).toBe(updateData.category);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Technology updated successfully: ${mockTechnology.id}`
            );
        });

        it('should throw error for invalid category', async () => {
            const invalidData = {
                category: 'INVALID' as TechnologyCategory
            };

            await expect(technologyService.updateTechnology(mockTechnology.id, invalidData))
                .rejects.toThrow('Failed to update technology: Invalid category');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid category attempted for update: INVALID'
            );
        });

        it('should throw error for invalid proficiency level', async () => {
            const invalidData = {
                proficiencyLevel: 11
            };

            await expect(technologyService.updateTechnology(mockTechnology.id, invalidData))
                .rejects.toThrow('Failed to update technology: Proficiency level must be between 1 and 10');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid proficiency level attempted for update: 11'
            );
        });

        it('should throw error when technology not found', async () => {
            (TechnologyRepository.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.updateTechnology('999', updateData))
                .rejects.toThrow('Failed to update technology: Technology not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Technology not found for update: 999'
            );
        });
    });

    describe('deleteTechnology', () => {
        it('should delete technology successfully', async () => {
            (TechnologyRepository.prototype.findById as jest.Mock).mockResolvedValue(mockTechnology);
            (TechnologyRepository.prototype.delete as jest.Mock).mockResolvedValue(true);

            const result = await technologyService.deleteTechnology(mockTechnology.id);

            expect(result).toBe(true);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Technology deleted successfully: ${mockTechnology.id}`
            );
        });

        it('should throw error when technology not found', async () => {
            (TechnologyRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.deleteTechnology('999'))
                .rejects.toThrow('Failed to delete technology: Technology not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Technology not found for deletion: 999'
            );
        });
    });

    describe('updateProficiencyLevel', () => {
        it('should update proficiency level successfully', async () => {
            const newLevel = 8;
            const updatedTechnology = {
                ...mockTechnology,
                proficiencyLevel: newLevel
            };
            
            (TechnologyRepository.prototype.updateProficiencyLevel as jest.Mock).mockResolvedValue(updatedTechnology);

            const result = await technologyService.updateProficiencyLevel(mockTechnology.id, newLevel);

            expect(result.proficiencyLevel).toBe(newLevel);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Proficiency level updated for technology: ${mockTechnology.id}`
            );
        });

        it('should throw error for invalid proficiency level', async () => {
            await expect(technologyService.updateProficiencyLevel(mockTechnology.id, 11))
                .rejects.toThrow('Failed to update proficiency level: Proficiency level must be between 1 and 10');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid proficiency level attempted: 11'
            );
        });

        it('should throw error when technology not found', async () => {
            (TechnologyRepository.prototype.updateProficiencyLevel as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.updateProficiencyLevel('999', 5))
                .rejects.toThrow('Failed to update proficiency level: Technology not found');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Technology not found for proficiency update: 999'
            );
        });
    });
});
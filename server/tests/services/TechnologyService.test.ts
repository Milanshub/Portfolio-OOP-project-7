import { TechnologyService } from '../../src/services/TechnologyService';
import { Technology } from '../../src/models/Technology';
import { Logger } from '../../src/utils/logger';
import { 
    ITechnology, 
    ICreateTechnology, 
    IUpdateTechnology, 
    TechnologyCategory 
} from '../../src/types/entities';

// Mock Technology model
jest.mock('../../src/models/Technology');

// Mock Logger
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => mockLogger
    }
}));

// Mock Technology data
const mockTechnology: ITechnology = {
    id: '1',
    name: 'Test Technology',
    category: TechnologyCategory.FRONTEND,
    proficiencyLevel: 5,
    icon: 'test-icon.svg'
};

describe('TechnologyService', () => {
    let technologyService: TechnologyService;

    beforeEach(() => {
        jest.clearAllMocks();
        technologyService = new TechnologyService();
    });

    describe('getAllTechnologies', () => {
        it('should get all technologies successfully', async () => {
            (Technology.prototype.findAll as jest.Mock).mockResolvedValue([mockTechnology]);

            const result = await technologyService.getAllTechnologies();

            expect(result).toEqual([mockTechnology]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                'All technologies retrieved successfully'
            );
        });

        it('should handle errors when getting technologies', async () => {
            const error = new Error('Database error');
            (Technology.prototype.findAll as jest.Mock).mockRejectedValue(error);

            await expect(technologyService.getAllTechnologies())
                .rejects.toThrow('Failed to get technologies');
            expect(mockLogger.error).toHaveBeenCalledWith(
                'Failed to get technologies:',
                error
            );
        });
    });

    describe('getTechnologyById', () => {
        it('should get technology by id successfully', async () => {
            (Technology.prototype.findById as jest.Mock).mockResolvedValue(mockTechnology);

            const result = await technologyService.getTechnologyById(mockTechnology.id);

            expect(result).toEqual(mockTechnology);
            expect(mockLogger.debug).toHaveBeenCalledWith(
                `Technology retrieved: ${mockTechnology.id}`
            );
        });

        it('should throw error when technology not found', async () => {
            (Technology.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.getTechnologyById('999'))
                .rejects.toThrow('Technology not found');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('getTechnologiesByCategory', () => {
        it('should get technologies by category successfully', async () => {
            (Technology.prototype.findByCategory as jest.Mock).mockResolvedValue([mockTechnology]);

            const result = await technologyService.getTechnologiesByCategory(TechnologyCategory.FRONTEND);

            expect(result).toEqual([mockTechnology]);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Technologies retrieved for category: ${TechnologyCategory.FRONTEND}`
            );
        });

        it('should throw error for invalid category', async () => {
            await expect(technologyService.getTechnologiesByCategory('INVALID' as TechnologyCategory))
                .rejects.toThrow('Invalid category');
            expect(mockLogger.warn).toHaveBeenCalledWith(
                'Invalid category attempted: INVALID'
            );
        });
    });

    describe('createTechnology', () => {
        const createData: ICreateTechnology = {
            name: 'Test Technology',
            category: TechnologyCategory.FRONTEND,
            proficiencyLevel: 5,
            icon: 'test-icon.svg'
        };

        it('should create technology successfully', async () => {
            (Technology.prototype.create as jest.Mock).mockResolvedValue({
                id: '1',
                ...createData
            });

            const result = await technologyService.createTechnology(createData);

            expect(result).toHaveProperty('id');
            expect(result.name).toBe(createData.name);
            expect(mockLogger.info).toHaveBeenCalledWith(
                expect.stringContaining('New technology created')
            );
        });

        it('should throw error for invalid category', async () => {
            const invalidData = {
                ...createData,
                category: 'INVALID' as TechnologyCategory
            };

            await expect(technologyService.createTechnology(invalidData))
                .rejects.toThrow('Invalid category');
            expect(mockLogger.warn).toHaveBeenCalled();
        });

        it('should throw error for invalid proficiency level', async () => {
            const invalidData = {
                ...createData,
                proficiencyLevel: 11
            };

            await expect(technologyService.createTechnology(invalidData))
                .rejects.toThrow('Proficiency level must be between 1 and 10');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('updateTechnology', () => {
        const updateData: IUpdateTechnology = {
            name: 'Updated Technology',
            category: TechnologyCategory.BACKEND
        };

        it('should update technology successfully', async () => {
            const updatedTechnology = {
                ...mockTechnology,
                ...updateData
            };
            (Technology.prototype.update as jest.Mock).mockResolvedValue(updatedTechnology);

            const result = await technologyService.updateTechnology(mockTechnology.id, updateData);

            expect(result.name).toBe(updateData.name);
            expect(result.category).toBe(updateData.category);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Technology updated successfully: ${mockTechnology.id}`
            );
        });

        it('should throw error for invalid category', async () => {
            const invalidData: IUpdateTechnology = {
                category: 'INVALID' as TechnologyCategory
            };

            await expect(technologyService.updateTechnology(mockTechnology.id, invalidData))
                .rejects.toThrow('Invalid category');
            expect(mockLogger.warn).toHaveBeenCalled();
        });

        it('should throw error for invalid proficiency level', async () => {
            const invalidData: IUpdateTechnology = {
                proficiencyLevel: 11
            };

            (Technology.prototype.update as jest.Mock).mockImplementation(() => {
                throw new Error('Proficiency level must be between 1 and 10');
            });

            await expect(technologyService.updateTechnology(mockTechnology.id, invalidData))
                .rejects.toThrow('Proficiency level must be between 1 and 10');
            expect(mockLogger.warn).toHaveBeenCalled();
        });

        it('should throw error when technology not found', async () => {
            (Technology.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.updateTechnology('999', updateData))
                .rejects.toThrow('Technology not found');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('deleteTechnology', () => {
        it('should delete technology successfully', async () => {
            (Technology.prototype.findById as jest.Mock).mockResolvedValue(mockTechnology);
            (Technology.prototype.delete as jest.Mock).mockResolvedValue(true);

            const result = await technologyService.deleteTechnology(mockTechnology.id);

            expect(result).toBe(true);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Technology deleted successfully: ${mockTechnology.id}`
            );
        });

        it('should throw error when technology not found', async () => {
            (Technology.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.deleteTechnology('999'))
                .rejects.toThrow('Technology not found');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('updateProficiencyLevel', () => {
        it('should update proficiency level successfully', async () => {
            const newLevel = 8;
            const updatedTechnology = {
                ...mockTechnology,
                proficiencyLevel: newLevel
            };
            
            (Technology.prototype.updateProficiencyLevel as jest.Mock).mockResolvedValue(updatedTechnology);

            const result = await technologyService.updateProficiencyLevel(mockTechnology.id, newLevel);

            expect(result.proficiencyLevel).toBe(newLevel);
            expect(mockLogger.info).toHaveBeenCalledWith(
                `Proficiency level updated for technology: ${mockTechnology.id}`
            );
        });

        it('should throw error for invalid proficiency level', async () => {
            await expect(technologyService.updateProficiencyLevel(mockTechnology.id, 11))
                .rejects.toThrow('Proficiency level must be between 1 and 10');
            expect(mockLogger.warn).toHaveBeenCalled();
        });

        it('should throw error when technology not found', async () => {
            (Technology.prototype.updateProficiencyLevel as jest.Mock).mockResolvedValue(null);

            await expect(technologyService.updateProficiencyLevel('999', 5))
                .rejects.toThrow('Technology not found');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });
});
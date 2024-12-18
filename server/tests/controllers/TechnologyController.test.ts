import { Request, Response } from 'express';
import { TechnologyController } from '../../src/controllers/TechnologyController';
import { TechnologyService } from '../../src/services/TechnologyService';
import { mockRequest, mockResponse } from '../utils/mockHelpers';
import { TechnologyCategory } from '../../src/types/entities';
import { mockTechnology } from '../utils/mockHelpers';
import { AppError } from '../../src/middleware/errorMiddleware';

// Mock dependencies
jest.mock('../../src/services/TechnologyService');
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            error: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));

// Simplified cache mock
const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn(),
    delete: jest.fn()
};

jest.mock('../../src/utils/cache', () => ({
    Cache: jest.fn().mockImplementation(() => mockCache)
}));

describe('TechnologyController', () => {
    let technologyController: TechnologyController;

    beforeEach(() => {
        jest.clearAllMocks();
        technologyController = new TechnologyController();
    });

    describe('getAllTechnologies', () => {
        it('should return cached technologies if available', async () => {
            const technologies = [mockTechnology];
            mockCache.get.mockReturnValue(technologies);

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(mockCache.get).toHaveBeenCalledWith('all-technologies');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
        });

        it('should fetch and cache technologies if not cached', async () => {
            const technologies = [mockTechnology];
            mockCache.get.mockReturnValue(null);
            jest.spyOn(TechnologyService.prototype, 'getAllTechnologies')
                .mockResolvedValue(technologies);

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(mockCache.set).toHaveBeenCalledWith('all-technologies', technologies);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
        });

        it('should handle errors appropriately', async () => {
            mockCache.get.mockReturnValue(null);
            jest.spyOn(TechnologyService.prototype, 'getAllTechnologies')
                .mockRejectedValue(new Error('Database error'));

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('getTechnologiesByCategory', () => {
        it('should return technologies by category from cache', async () => {
            const technologies = [mockTechnology];
            mockCache.get.mockReturnValue(technologies);

            const req = mockRequest({
                params: { category: TechnologyCategory.FRONTEND }
            });
            const res = mockResponse();

            await technologyController.getTechnologiesByCategory(req as Request, res as Response);

            expect(mockCache.get).toHaveBeenCalledWith('technologies-FRONTEND');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
        });
    });

    describe('updateProficiencyLevel', () => {
        it('should update proficiency level successfully', async () => {
            const updatedTechnology = { ...mockTechnology, proficiencyLevel: 8 };
            jest.spyOn(TechnologyService.prototype, 'updateProficiencyLevel')
                .mockResolvedValue(updatedTechnology);

            const req = mockRequest({
                params: { id: '1' },
                body: { level: 8 }
            });
            const res = mockResponse();

            await technologyController.updateProficiencyLevel(req as Request, res as Response);

            expect(mockCache.clear).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedTechnology);
        });

        it('should validate proficiency level range', async () => {
            const req = mockRequest({
                params: { id: '1' },
                body: { level: 11 }
            });
            const res = mockResponse();

            await technologyController.updateProficiencyLevel(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Proficiency level must be between 1 and 10' 
            });
        });
    });
});
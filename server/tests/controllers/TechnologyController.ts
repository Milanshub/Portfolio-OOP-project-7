import { Request, Response } from 'express';
import { TechnologyController } from '../../src/controllers/TechnologyController';
import { TechnologyService } from '../../src/services/TechnologyService';
import { mockRequest, mockResponse } from '../utils/mockHelpers';
import { TechnologyCategory } from '../../src/types/entities';
import { mockTechnology } from '../utils/mockHelpers';
import { Cache } from '../../src/utils/cache';

// Mock Cache class
jest.mock('../../src/utils/cache', () => {
    return {
        Cache: jest.fn().mockImplementation(() => ({
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
            clear: jest.fn()
        }))
    };
});

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

describe('TechnologyController', () => {
    let technologyController: TechnologyController;
    let mockCache: jest.Mocked<Cache<any>>;

    beforeEach(() => {
        jest.clearAllMocks();
        technologyController = new TechnologyController();
        mockCache = new Cache() as jest.Mocked<Cache<any>>;
    });

    describe('getAllTechnologies', () => {
        it('should return cached technologies if available', async () => {
            const cachedTechnologies = [mockTechnology];
            (mockCache.get as jest.Mock).mockReturnValue(cachedTechnologies);

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(mockCache.get).toHaveBeenCalledWith('all-technologies');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(cachedTechnologies);
        });

        it('should fetch and cache technologies if not cached', async () => {
            const technologies = [mockTechnology];
            (mockCache.get as jest.Mock).mockReturnValue(null);
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
            (mockCache.get as jest.Mock).mockReturnValue(null);
            jest.spyOn(TechnologyService.prototype, 'getAllTechnologies')
                .mockRejectedValue(new Error('Database error'));

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
        });
    });

    describe('getTechnologyById', () => {
        it('should return technology by id successfully', async () => {
            jest.spyOn(TechnologyService.prototype, 'getTechnologyById')
                .mockResolvedValue(mockTechnology);

            const req = mockRequest({
                params: { id: '1' }
            });
            const res = mockResponse();

            await technologyController.getTechnologyById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTechnology);
        });

        it('should handle not found error', async () => {
            jest.spyOn(TechnologyService.prototype, 'getTechnologyById')
                .mockRejectedValue(new Error('Technology not found'));

            const req = mockRequest({
                params: { id: 'invalid-id' }
            });
            const res = mockResponse();

            await technologyController.getTechnologyById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Technology not found' });
        });
    });

    describe('createTechnology', () => {
        it('should create technology successfully', async () => {
            jest.spyOn(TechnologyService.prototype, 'createTechnology')
                .mockResolvedValue(mockTechnology);

            const req = mockRequest({
                body: {
                    name: 'React',
                    icon: 'react-icon',
                    category: TechnologyCategory.FRONTEND,
                    proficiencyLevel: 80
                }
            });
            const res = mockResponse();

            await technologyController.createTechnology(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockTechnology);
        });

        it('should handle validation errors', async () => {
            jest.spyOn(TechnologyService.prototype, 'createTechnology')
                .mockRejectedValue(new Error('Validation failed'));

            const req = mockRequest({
                body: { invalid: 'data' }
            });
            const res = mockResponse();

            await technologyController.createTechnology(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Validation failed' });
        });
    });

    describe('updateTechnology', () => {
        it('should update technology successfully', async () => {
            const updatedTechnology = { ...mockTechnology, proficiencyLevel: 90 };
            jest.spyOn(TechnologyService.prototype, 'updateTechnology')
                .mockResolvedValue(updatedTechnology);

            const req = mockRequest({
                params: { id: '1' },
                body: { proficiencyLevel: 90 }
            });
            const res = mockResponse();

            await technologyController.updateTechnology(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedTechnology);
        });

        it('should handle not found error', async () => {
            jest.spyOn(TechnologyService.prototype, 'updateTechnology')
                .mockRejectedValue(new Error('Technology not found'));

            const req = mockRequest({
                params: { id: 'invalid-id' },
                body: { proficiencyLevel: 90 }
            });
            const res = mockResponse();

            await technologyController.updateTechnology(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Technology not found' });
        });
    });

    describe('deleteTechnology', () => {
        it('should delete technology successfully', async () => {
            jest.spyOn(TechnologyService.prototype, 'deleteTechnology')
                .mockResolvedValue(true);

            const req = mockRequest({
                params: { id: '1' }
            });
            const res = mockResponse();

            await technologyController.deleteTechnology(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should handle not found error', async () => {
            jest.spyOn(TechnologyService.prototype, 'deleteTechnology')
                .mockRejectedValue(new Error('Technology not found'));

            const req = mockRequest({
                params: { id: 'invalid-id' }
            });
            const res = mockResponse();

            await technologyController.deleteTechnology(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Technology not found' });
        });
    });

    describe('getTechnologiesByCategory', () => {
        it('should return cached technologies by category if available', async () => {
            const cachedTechnologies = [mockTechnology];
            (mockCache.get as jest.Mock).mockReturnValue(cachedTechnologies);

            const req = mockRequest({
                params: { category: TechnologyCategory.FRONTEND }
            });
            const res = mockResponse();

            await technologyController.getTechnologiesByCategory(req as Request, res as Response);

            expect(mockCache.get).toHaveBeenCalledWith('technologies-FRONTEND');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(cachedTechnologies);
        });

        it('should fetch and cache technologies if not cached', async () => {
            const technologies = [mockTechnology];
            (mockCache.get as jest.Mock).mockReturnValue(null);
            jest.spyOn(TechnologyService.prototype, 'getTechnologiesByCategory')
                .mockResolvedValue(technologies);

            const req = mockRequest({
                params: { category: TechnologyCategory.FRONTEND }
            });
            const res = mockResponse();

            await technologyController.getTechnologiesByCategory(req as Request, res as Response);

            expect(mockCache.set).toHaveBeenCalledWith('technologies-FRONTEND', technologies);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
        });

        it('should handle errors appropriately', async () => {
            (mockCache.get as jest.Mock).mockReturnValue(null);
            jest.spyOn(TechnologyService.prototype, 'getTechnologiesByCategory')
                .mockRejectedValue(new Error('Invalid category'));

            const req = mockRequest({
                params: { category: 'INVALID' }
            });
            const res = mockResponse();

            await technologyController.getTechnologiesByCategory(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid category' });
        });
    });

    describe('updateProficiencyLevel', () => {
        it('should update proficiency level successfully', async () => {
            const updatedTechnology = { ...mockTechnology, proficiencyLevel: 85 };
            jest.spyOn(TechnologyService.prototype, 'updateProficiencyLevel')
                .mockResolvedValue(updatedTechnology);

            const req = mockRequest({
                params: { id: '1' },
                body: { level: 85 }
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
                body: { level: 101 }
            });
            const res = mockResponse();

            await technologyController.updateProficiencyLevel(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                error: 'Proficiency level must be between 0 and 100' 
            });
        });

        it('should handle not found error', async () => {
            jest.spyOn(TechnologyService.prototype, 'updateProficiencyLevel')
                .mockRejectedValue(new Error('Technology not found'));

            const req = mockRequest({
                params: { id: 'invalid-id' },
                body: { level: 85 }
            });
            const res = mockResponse();

            await technologyController.updateProficiencyLevel(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Technology not found' });
        });
    });
});
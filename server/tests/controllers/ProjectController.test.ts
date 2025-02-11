import { Request, Response } from 'express';
import { TechnologyController } from '../../src/controllers/TechnologyController';
import { TechnologyService } from '../../src/services/TechnologyService';
import { mockRequest, mockResponse } from '../utils/mockHelpers';
import { TechnologyCategory } from '../../src/types/entities';
import { mockTechnology } from '../utils/mockHelpers';
import { AppError } from '../../src/middleware/errorMiddleware';
import { Cache } from '../../src/utils/cache';

// Mock Cache
const mockCacheStore = new Map<string, { data: any; timestamp: number }>();
jest.mock('../../src/utils/cache', () => {
    return {
        Cache: jest.fn().mockImplementation(() => ({
            get: jest.fn((key: string) => {
                const item = mockCacheStore.get(key);
                if (!item) return null;
                if (Date.now() - item.timestamp > 15 * 60 * 1000) { // 15 minutes TTL
                    mockCacheStore.delete(key);
                    return null;
                }
                return item.data;
            }),
            set: jest.fn((key: string, value: any) => {
                mockCacheStore.set(key, {
                    data: value,
                    timestamp: Date.now()
                });
            }),
            clear: jest.fn(() => {
                mockCacheStore.clear();
            }),
            delete: jest.fn((key: string) => {
                mockCacheStore.delete(key);
            })
        }))
    };
});

// Mock other dependencies
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

    beforeEach(() => {
        jest.clearAllMocks();
        mockCacheStore.clear();
        technologyController = new TechnologyController();
    });

    describe('getAllTechnologies', () => {
        it('should return cached technologies if available', async () => {
            const technologies = [mockTechnology];
            mockCacheStore.set('all-technologies', {
                data: technologies,
                timestamp: Date.now()
            });

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
        });

        it('should fetch and cache technologies if not cached', async () => {
            const technologies = [mockTechnology];
            jest.spyOn(TechnologyService.prototype, 'getAllTechnologies')
                .mockResolvedValue(technologies);

            const req = mockRequest();
            const res = mockResponse();

            await technologyController.getAllTechnologies(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
            expect(mockCacheStore.get('all-technologies')?.data).toEqual(technologies);
        });

        it('should handle errors appropriately', async () => {
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
                .mockRejectedValue(new AppError('Technology not found', 404));

            const req = mockRequest({
                params: { id: 'invalid-id' }
            });
            const res = mockResponse();

            await technologyController.getTechnologyById(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Technology not found' });
        });
    });

    describe('getTechnologiesByCategory', () => {
        it('should return technologies by category from cache if available', async () => {
            const technologies = [mockTechnology];
            mockCacheStore.set('technologies-FRONTEND', {
                data: technologies,
                timestamp: Date.now()
            });

            const req = mockRequest({
                params: { category: TechnologyCategory.FRONTEND }
            });
            const res = mockResponse();

            await technologyController.getTechnologiesByCategory(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
        });

        it('should fetch and cache technologies by category if not cached', async () => {
            const technologies = [mockTechnology];
            jest.spyOn(TechnologyService.prototype, 'getTechnologiesByCategory')
                .mockResolvedValue(technologies);

            const req = mockRequest({
                params: { category: TechnologyCategory.FRONTEND }
            });
            const res = mockResponse();

            await technologyController.getTechnologiesByCategory(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(technologies);
            expect(mockCacheStore.get('technologies-FRONTEND')?.data).toEqual(technologies);
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

            expect(mockCacheStore.size).toBe(0); // Cache should be cleared
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

        it('should handle not found error', async () => {
            jest.spyOn(TechnologyService.prototype, 'updateProficiencyLevel')
                .mockRejectedValue(new AppError('Technology not found', 404));

            const req = mockRequest({
                params: { id: '1' },
                body: { level: 8 }
            });
            const res = mockResponse();

            await technologyController.updateProficiencyLevel(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Technology not found' });
        });
    });
});
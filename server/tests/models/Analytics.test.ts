import { Analytics } from '../../src/models/Analytics';
import { supabase } from '../../src/config/supabase';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockAnalytics } from '../utils/mockHelpers';

// Mock dependencies
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn()
                })),
                single: jest.fn(),
                order: jest.fn(() => ({
                    limit: jest.fn(() => ({
                        single: jest.fn()
                    }))
                }))
            })),
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn()
                }))
            })),
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn()
                    }))
                }))
            })),
            delete: jest.fn(() => ({
                eq: jest.fn()
            }))
        }))
    }
}));

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            error: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

describe('Analytics Model', () => {
    let analyticsModel: Analytics;

    beforeEach(() => {
        jest.clearAllMocks();
        analyticsModel = new Analytics();
    });

    describe('CRUD Operations', () => {
        it('should find all analytics records', async () => {
            const mockData = [mockAnalytics];
            const orderMock = jest.fn().mockReturnValue({
                ascending: false,
                data: mockData,
                error: null
            });
            
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    order: orderMock
                })
            });
        
            const result = await analyticsModel.findAll();
        
            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('analytics');
        });

        it('should find analytics by id', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: mockAnalytics, 
                error: null 
            });
            const eqMock = jest.fn().mockReturnValue({ single: singleMock });
            const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await analyticsModel.findById('1');

            expect(result).toEqual(mockAnalytics);
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should create new analytics record', async () => {
            const newAnalytics = {
                pageViews: 0,
                uniqueVisitors: 0,
                avgTimeOnSite: 0,
                mostViewedProjects: []
            };

            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...newAnalytics, id: '2' }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const insertMock = jest.fn().mockReturnValue({ select: selectMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: insertMock
            });

            const result = await analyticsModel.create(newAnalytics);

            expect(result).toHaveProperty('id', '2');
            expect(insertMock).toHaveBeenCalledWith({
                ...newAnalytics,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            });
        });

        it('should update analytics record', async () => {
            const updateData = { pageViews: 150 };

            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: { ...mockAnalytics, ...updateData }, 
                error: null 
            });
            const selectMock = jest.fn().mockReturnValue({ single: singleMock });
            const eqMock = jest.fn().mockReturnValue({ select: selectMock });
            const updateMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: updateMock
            });

            const result = await analyticsModel.update('1', updateData);

            expect(result).toEqual({ ...mockAnalytics, ...updateData });
            expect(updateMock).toHaveBeenCalledWith({
                ...updateData,
                updatedAt: expect.any(Date)
            });
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });

        it('should delete analytics record', async () => {
            const eqMock = jest.fn().mockResolvedValueOnce({ error: null });
            const deleteMock = jest.fn().mockReturnValue({ eq: eqMock });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                delete: deleteMock
            });

            const result = await analyticsModel.delete('1');

            expect(result).toBe(true);
            expect(deleteMock).toHaveBeenCalled();
            expect(eqMock).toHaveBeenCalledWith('id', '1');
        });
    });

    describe('Analytics-specific methods', () => {
        it('should get latest analytics', async () => {
            const singleMock = jest.fn().mockResolvedValueOnce({ 
                data: mockAnalytics, 
                error: null 
            });
            const limitMock = jest.fn().mockReturnValue({ single: singleMock });
            const orderMock = jest.fn().mockReturnValue({ limit: limitMock });
            const selectMock = jest.fn().mockReturnValue({ 
                order: orderMock 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            const result = await analyticsModel.getLatestAnalytics();

            expect(result).toEqual(mockAnalytics);
            expect(selectMock).toHaveBeenCalledWith('*');
            expect(orderMock).toHaveBeenCalledWith('createdAt', { ascending: false });
            expect(limitMock).toHaveBeenCalledWith(1);
        });

        it('should increment page views', async () => {
            jest.spyOn(analyticsModel, 'getLatestAnalytics')
                .mockImplementationOnce(async () => mockAnalytics);
            jest.spyOn(analyticsModel, 'update')
                .mockImplementationOnce(async () => mockAnalytics);

            await analyticsModel.incrementPageViews();

            expect(analyticsModel.getLatestAnalytics).toHaveBeenCalled();
            expect(analyticsModel.update).toHaveBeenCalledWith('1', {
                pageViews: mockAnalytics.pageViews + 1
            });
        });

        it('should update most viewed projects', async () => {
            const newProjectIds = ['project3', 'project4'];
            
            jest.spyOn(analyticsModel, 'getLatestAnalytics')
                .mockImplementationOnce(async () => mockAnalytics);
            jest.spyOn(analyticsModel, 'update')
                .mockImplementationOnce(async () => mockAnalytics);

            await analyticsModel.updateMostViewedProjects(newProjectIds);

            expect(analyticsModel.getLatestAnalytics).toHaveBeenCalled();
            expect(analyticsModel.update).toHaveBeenCalledWith('1', {
                mostViewedProjects: newProjectIds
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors', async () => {
            const selectMock = jest.fn().mockResolvedValueOnce({ 
                data: null, 
                error: new Error('Database error') 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: selectMock
            });

            await expect(analyticsModel.findAll())
                .rejects
                .toThrow(AppError);
        });

        it('should handle missing latest analytics record', async () => {
            jest.spyOn(analyticsModel, 'getLatestAnalytics')
                .mockImplementationOnce(async () => null);

            await analyticsModel.incrementPageViews();
            
            expect(analyticsModel.getLatestAnalytics).toHaveBeenCalled();
        });
    });
});
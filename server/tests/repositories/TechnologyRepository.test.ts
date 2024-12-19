import { TechnologyRepository } from '../../src/respositories/TechnologyRepository';
import { supabase } from '../../src/config/supabase';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockTechnology } from '../utils/mockHelpers';

jest.mock('../../src/config/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn(),
                    order: jest.fn()
                })),
                single: jest.fn(),
                order: jest.fn()
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

describe('Technology Model', () => {
    let technologyModel: TechnologyRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        technologyModel = new TechnologyRepository();
    });

    describe('CRUD Operations', () => {
        it('should find all technologies', async () => {
            const mockData = [mockTechnology];
            const orderMock = jest.fn().mockResolvedValue({
                data: mockData,
                error: null
            });
            
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    order: orderMock
                })
            });

            const result = await technologyModel.findAll();
            expect(result).toEqual(mockData);
        });

        it('should find technology by id', async () => {
            const singleMock = jest.fn().mockResolvedValue({
                data: mockTechnology,
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await technologyModel.findById('1');
            expect(result).toEqual(mockTechnology);
        });

        it('should create new technology', async () => {
            const { id, ...newTechnology } = mockTechnology;
            const singleMock = jest.fn().mockResolvedValue({
                data: mockTechnology,
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await technologyModel.create(newTechnology);
            expect(result).toEqual(mockTechnology);
        });
    });

    describe('Technology-specific methods', () => {
        it('should find by category', async () => {
            const orderMock = jest.fn().mockResolvedValue({
                data: [mockTechnology],
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        order: orderMock
                    })
                })
            });

            const result = await technologyModel.findByCategory('FRONTEND');
            expect(result).toEqual([mockTechnology]);
        });

        it('should update proficiency level', async () => {
            const newLevel = 90;
            const singleMock = jest.fn().mockResolvedValue({
                data: { ...mockTechnology, proficiencyLevel: newLevel },
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: singleMock
                        })
                    })
                })
            });

            const result = await technologyModel.updateProficiencyLevel('1', newLevel);
            expect(result?.proficiencyLevel).toBe(newLevel);
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors', async () => {
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockResolvedValue({
                    data: null,
                    error: new Error('Database error')
                })
            });

            await expect(technologyModel.findAll())
                .rejects
                .toThrow(AppError);
        });
    });
});
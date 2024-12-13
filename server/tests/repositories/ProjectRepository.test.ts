import { ProjectRepository } from '../../src/respositories/ProjectRepository';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockProject } from '../utils/mockHelpers';
import { supabase } from '../../src/config/supabase';

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

describe('ProjectRepository', () => {
    let repository: ProjectRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = ProjectRepository.getInstance();
    });

    describe('Singleton Pattern', () => {
        it('should return the same instance', () => {
            const instance1 = ProjectRepository.getInstance();
            const instance2 = ProjectRepository.getInstance();
            expect(instance1).toBe(instance2);
        });
    });

    describe('CRUD Operations', () => {
        it('should find all projects', async () => {
            const mockData = [mockProject];
            const orderMock = jest.fn().mockResolvedValue({
                data: mockData,
                error: null
            });
            
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    order: orderMock
                })
            });

            const result = await repository.findAll();
            expect(result).toEqual(mockData);
        });

        it('should find project by id', async () => {
            const singleMock = jest.fn().mockResolvedValue({
                data: mockProject,
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await repository.findById('1');
            expect(result).toEqual(mockProject);
        });

        it('should create new project', async () => {
            const { id, ...newProject } = mockProject;
            const singleMock = jest.fn().mockResolvedValue({
                data: mockProject,
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await repository.create(newProject);
            expect(result).toEqual(mockProject);
        });
    });

    describe('Project-specific methods', () => {
        it('should get featured projects', async () => {
            const mockFeatured = { ...mockProject, featured: true };
            const orderMock = jest.fn().mockResolvedValue({
                data: [mockFeatured],
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        order: orderMock
                    })
                })
            });

            const result = await repository.getFeaturedProjects();
            expect(result).toEqual([mockFeatured]);
        });

        it('should update project order', async () => {
            const newOrder = 2;
            const singleMock = jest.fn().mockResolvedValue({
                data: { ...mockProject, order: newOrder },
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

            const result = await repository.updateOrder('1', newOrder);
            expect(result?.order).toBe(newOrder);
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

            await expect(repository.findAll())
                .rejects
                .toThrow(AppError);
        });
    });
});
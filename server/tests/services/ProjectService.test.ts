import { Project } from '../../src/models/Project';
import { supabase } from '../../src/config/supabase';
import { Logger } from '../../src/utils/logger';
import { mockProject } from '../utils/mockHelpers';
import { AppError } from '../../src/middleware/errorMiddleware';

// Mock Supabase
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
    }
}));

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

describe('Project Model', () => {
    let projectModel: Project;
    const mockSupabaseResponse = (data: any = null, error: any = null) => ({
        data,
        error,
        count: null
    });

    beforeEach(() => {
        jest.clearAllMocks();
        projectModel = new Project();
    });

    describe('findAll', () => {
        it('should fetch all projects successfully', async () => {
            const mockData = [mockProject];
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: () => ({
                    order: () => Promise.resolve(mockSupabaseResponse(mockData))
                })
            }));

            const result = await projectModel.findAll();

            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith('Fetching all projects');
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: () => ({
                    order: () => Promise.resolve(mockSupabaseResponse(null, error))
                })
            }));

            await expect(projectModel.findAll())
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should fetch project by id successfully', async () => {
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve(mockSupabaseResponse(mockProject))
                    })
                })
            }));

            const result = await projectModel.findById(mockProject.id);

            expect(result).toEqual(mockProject);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith(`Fetching project with id: ${mockProject.id}`);
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: () => ({
                    eq: () => ({
                        single: () => Promise.resolve(mockSupabaseResponse(null, error))
                    })
                })
            }));

            await expect(projectModel.findById('999'))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        const createData = {
            title: mockProject.title,
            description: mockProject.description,
            shortDescription: mockProject.shortDescription,
            thumbnail: mockProject.thumbnail,
            images: mockProject.images,
            liveUrl: mockProject.liveUrl,
            githubUrl: mockProject.githubUrl,
            featured: mockProject.featured,
            order: mockProject.order,
            startDate: mockProject.startDate,
            endDate: mockProject.endDate
        };

        it('should create project successfully', async () => {
            (supabase.from as jest.Mock).mockImplementation(() => ({
                insert: () => ({
                    select: () => ({
                        single: () => Promise.resolve(mockSupabaseResponse(mockProject))
                    })
                })
            }));

            const result = await projectModel.create(createData);

            expect(result).toEqual(mockProject);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith('Creating new project:', createData);
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                insert: () => ({
                    select: () => ({
                        single: () => Promise.resolve(mockSupabaseResponse(null, error))
                    })
                })
            }));

            await expect(projectModel.create(createData))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        const updateData = {
            title: 'Updated Title',
            description: 'Updated Description'
        };

        it('should update project successfully', async () => {
            const updatedProject = { ...mockProject, ...updateData };
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(updatedProject))
                        })
                    })
                })
            }));

            const result = await projectModel.update(mockProject.id, updateData);

            expect(result).toEqual(updatedProject);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith(`Updating project ${mockProject.id}:`, updateData);
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(null, error))
                        })
                    })
                })
            }));

            await expect(projectModel.update(mockProject.id, updateData))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete project successfully', async () => {
            (supabase.from as jest.Mock).mockImplementation(() => ({
                delete: () => ({
                    eq: () => Promise.resolve(mockSupabaseResponse(true))
                })
            }));

            const result = await projectModel.delete(mockProject.id);

            expect(result).toBe(true);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith(`Deleting project ${mockProject.id}`);
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                delete: () => ({
                    eq: () => Promise.resolve(mockSupabaseResponse(null, error))
                })
            }));

            await expect(projectModel.delete(mockProject.id))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('findFeatured', () => {
        it('should fetch featured projects successfully', async () => {
            const mockData = [mockProject];
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: () => ({
                    eq: () => ({
                        order: () => Promise.resolve(mockSupabaseResponse(mockData))
                    })
                })
            }));

            const result = await projectModel.findFeatured();

            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith('Fetching featured projects');
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: () => ({
                    eq: () => ({
                        order: () => Promise.resolve(mockSupabaseResponse(null, error))
                    })
                })
            }));

            await expect(projectModel.findFeatured())
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateThumbnail', () => {
        const newThumbnailUrl = 'new-thumbnail.jpg';

        it('should update thumbnail successfully', async () => {
            const updatedProject = { ...mockProject, thumbnail: newThumbnailUrl };
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(updatedProject))
                        })
                    })
                })
            }));

            const result = await projectModel.updateThumbnail(mockProject.id, newThumbnailUrl);

            expect(result).toEqual(updatedProject);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith(
                `Updating thumbnail for project ${mockProject.id} to ${newThumbnailUrl}`
            );
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(null, error))
                        })
                    })
                })
            }));

            await expect(projectModel.updateThumbnail(mockProject.id, newThumbnailUrl))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateImages', () => {
        const newImageUrls = ['new-image1.jpg', 'new-image2.jpg'];

        it('should update images successfully', async () => {
            const updatedProject = { ...mockProject, images: newImageUrls };
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(updatedProject))
                        })
                    })
                })
            }));

            const result = await projectModel.updateImages(mockProject.id, newImageUrls);

            expect(result).toEqual(updatedProject);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith(
                `Updating images for project ${mockProject.id}:`,
                newImageUrls
            );
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(null, error))
                        })
                    })
                })
            }));

            await expect(projectModel.updateImages(mockProject.id, newImageUrls))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateOrder', () => {
        const newOrder = 5;

        it('should update order successfully', async () => {
            const updatedProject = { ...mockProject, order: newOrder };
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(updatedProject))
                        })
                    })
                })
            }));

            const result = await projectModel.updateOrder(mockProject.id, newOrder);

            expect(result).toEqual(updatedProject);
            expect(supabase.from).toHaveBeenCalledWith('projects');
            expect(mockLogger.debug).toHaveBeenCalledWith(
                `Updating order for project ${mockProject.id} to ${newOrder}`
            );
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (supabase.from as jest.Mock).mockImplementation(() => ({
                update: () => ({
                    eq: () => ({
                        select: () => ({
                            single: () => Promise.resolve(mockSupabaseResponse(null, error))
                        })
                    })
                })
            }));

            await expect(projectModel.updateOrder(mockProject.id, newOrder))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
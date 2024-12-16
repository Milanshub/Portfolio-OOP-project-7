// tests/utils/validators/projectValidator.test.ts
import { projectValidator } from '../../../src/utils/validators/projectValidator';
import { ICreateProject, IUpdateProject } from '../../../src/types/entities';
import { dateHelpers } from '../../../src/utils/helpers/dateHelpers';
import { mockProject } from '../mockHelpers';

// Mock dateHelpers
jest.mock('../../../src/utils/helpers/dateHelpers', () => ({
    dateHelpers: {
        isValidDate: jest.fn()
    }
}));

describe.skip('projectValidator', () => {
    // Mock the URL validation functions at the top level
    beforeAll(() => {
        // Override the internal functions with mocked versions
        (projectValidator as any).isValidUrl = jest.fn().mockReturnValue(true);
        (projectValidator as any).isValidImageUrl = jest.fn().mockReturnValue(true);
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (dateHelpers.isValidDate as jest.Mock).mockReturnValue(true);
        // Reset the mock implementations for each test
        (projectValidator as any).isValidUrl.mockReturnValue(true);
        (projectValidator as any).isValidImageUrl.mockReturnValue(true);
    });

    describe('validateCreate', () => {
        const validProject: ICreateProject = {
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

        it('should return empty array for valid project', () => {
            const errors = projectValidator.validateCreate(validProject);
            expect(errors).toEqual([]);
        });

        it('should validate required title', () => {
            const invalidProject = { ...validProject, title: '' };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Title is required');
        });

        it('should validate required description', () => {
            const invalidProject = { ...validProject, description: '' };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Description is required');
        });

        it('should validate required short description', () => {
            const invalidProject = { ...validProject, shortDescription: '' };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Short description is required');
        });

        it('should validate live URL format', () => {
            (projectValidator as any).isValidUrl.mockReturnValue(false);
            const invalidProject = { ...validProject, liveUrl: 'invalid-url' };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Invalid live URL format');
        });

        it('should validate GitHub URL format', () => {
            (projectValidator as any).isValidUrl.mockReturnValue(false);
            const invalidProject = { ...validProject, githubUrl: 'invalid-url' };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Invalid GitHub URL format');
        });

        it('should validate start date', () => {
            (dateHelpers.isValidDate as jest.Mock).mockReturnValue(false);
            const invalidProject = { ...validProject, startDate: new Date('invalid') };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Invalid start date');
        });

        it('should validate end date', () => {
            (dateHelpers.isValidDate as jest.Mock).mockReturnValue(false);
            const invalidProject = { ...validProject, endDate: new Date('invalid') };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Invalid end date');
        });

        it('should validate date order', () => {
            const invalidProject = {
                ...validProject,
                startDate: new Date('2023-12-31'),
                endDate: new Date('2023-01-01')
            };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Start date cannot be after end date');
        });

        it('should validate thumbnail URL format', () => {
            (projectValidator as any).isValidImageUrl.mockReturnValue(false);
            const invalidProject = { ...validProject, thumbnail: 'invalid-image' };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Invalid thumbnail URL format');
        });

        it('should validate image URLs format', () => {
            (projectValidator as any).isValidImageUrl
                .mockImplementation((url: string) => !url.includes('invalid'));
            const invalidProject = {
                ...validProject,
                images: ['invalid-image-1', 'https://example.com/image.jpg', 'invalid-image-2']
            };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Invalid image URL format at position 1');
            expect(errors).toContain('Invalid image URL format at position 3');
        });

        it('should handle whitespace-only values', () => {
            const invalidProject: ICreateProject = {
                ...validProject,
                title: '   ',
                description: '   ',
                shortDescription: '   '
            };
            const errors = projectValidator.validateCreate(invalidProject);
            expect(errors).toContain('Title is required');
            expect(errors).toContain('Description is required');
            expect(errors).toContain('Short description is required');
        });
    });

    describe('validateUpdate', () => {
        it('should return empty array for valid update data', () => {
            const validUpdate: IUpdateProject = {
                title: mockProject.title,
                description: mockProject.description
            };
            const errors = projectValidator.validateUpdate(validUpdate);
            expect(errors).toEqual([]);
        });

        it('should validate title if provided', () => {
            const invalidUpdate: IUpdateProject = { title: '' };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Title cannot be empty');
        });

        it('should validate description if provided', () => {
            const invalidUpdate: IUpdateProject = { description: '' };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Description cannot be empty');
        });

        it('should validate short description if provided', () => {
            const invalidUpdate: IUpdateProject = { shortDescription: '' };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Short description cannot be empty');
        });

        it('should validate live URL if provided', () => {
            (projectValidator as any).isValidUrl.mockReturnValue(false);
            const invalidUpdate: IUpdateProject = { liveUrl: 'invalid-url' };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Invalid live URL format');
        });

        it('should validate GitHub URL if provided', () => {
            (projectValidator as any).isValidUrl.mockReturnValue(false);
            const invalidUpdate: IUpdateProject = { githubUrl: 'invalid-url' };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Invalid GitHub URL format');
        });

        it('should validate dates if both provided', () => {
            const invalidUpdate: IUpdateProject = {
                startDate: new Date('2023-12-31'),
                endDate: new Date('2023-01-01')
            };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Start date cannot be after end date');
        });

        it('should validate thumbnail URL if provided', () => {
            (projectValidator as any).isValidImageUrl.mockReturnValue(false);
            const invalidUpdate: IUpdateProject = { thumbnail: 'invalid-image' };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Invalid thumbnail URL format');
        });

        it('should validate image URLs if provided', () => {
            (projectValidator as any).isValidImageUrl
                .mockImplementation((url: string) => !url.includes('invalid'));
            const invalidUpdate: IUpdateProject = {
                images: ['invalid-image-1', 'https://example.com/image.jpg', 'invalid-image-2']
            };
            const errors = projectValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Invalid image URL format at position 1');
            expect(errors).toContain('Invalid image URL format at position 3');
        });

        it('should allow partial updates', () => {
            const validUpdate: IUpdateProject = {
                title: mockProject.title
            };
            const errors = projectValidator.validateUpdate(validUpdate);
            expect(errors).toEqual([]);
        });
    });
});
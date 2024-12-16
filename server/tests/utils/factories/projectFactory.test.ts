import { ProjectFactory } from '../../../src/utils/factories/projectFactory';
import { IProject } from '../../../src/types/entities';

describe('ProjectFactory', () => {
    it('should create project with default values when no data provided', () => {
        const project = ProjectFactory.create({});
        
        expect(project).toMatchObject({
            id: '',
            title: '',
            description: '',
            shortDescription: '',
            thumbnail: '',
            images: [],
            liveUrl: '',
            githubUrl: '',
            featured: false,
            order: 0
        });
        
        expect(project.startDate).toBeInstanceOf(Date);
        expect(project.endDate).toBeInstanceOf(Date);
    });

    it('should create project with provided values', () => {
        const now = new Date();
        const projectData: Partial<IProject> = {
            id: '1',
            title: 'Test Project',
            description: 'Test Description',
            shortDescription: 'Short Description',
            thumbnail: 'thumbnail.jpg',
            images: ['image1.jpg', 'image2.jpg'],
            liveUrl: 'https://example.com',
            githubUrl: 'https://github.com/test',
            featured: true,
            order: 1,
            startDate: now,
            endDate: now
        };

        const project = ProjectFactory.create(projectData);

        expect(project).toEqual(projectData);
    });

    it('should create project with mixed default and provided values', () => {
        const partialData: Partial<IProject> = {
            title: 'Test Project',
            description: 'Test Description',
            featured: true
        };

        const project = ProjectFactory.create(partialData);

        expect(project).toMatchObject({
            id: '',
            title: 'Test Project',
            description: 'Test Description',
            shortDescription: '',
            thumbnail: '',
            images: [],
            liveUrl: '',
            githubUrl: '',
            featured: true,
            order: 0
        });
        
        expect(project.startDate).toBeInstanceOf(Date);
        expect(project.endDate).toBeInstanceOf(Date);
    });

    it('should handle null or undefined values', () => {
        const partialData: Partial<IProject> = {
            title: undefined,
            description: null as any,
            images: undefined
        };

        const project = ProjectFactory.create(partialData);

        expect(project).toMatchObject({
            title: '',
            description: '',
            images: []
        });
    });
});
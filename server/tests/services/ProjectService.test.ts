import { ProjectService } from '../../src/services/ProjectService';
import { ProjectRepository } from '../../src/respositories/ProjectRepository';
import { GitHubService } from '../../src/services/GitHubService';
import { StorageService } from '../../src/services/StorageService';
import { TechnologyService } from '../../src/services/TechnologyService';
import { AnalyticsService } from '../../src/services/AnalyticsService';
import { Logger } from '../../src/utils/logger';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockProject, createMockFile } from '../utils/mockHelpers';
import { ICreateProject, IUpdateProject } from '../../src/types/entities';

// Mock all dependencies
jest.mock('../../src/respositories/ProjectRepository');
jest.mock('../../src/services/GitHubService');
jest.mock('../../src/services/StorageService');
jest.mock('../../src/services/TechnologyService');
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn(),
            recordPageView: jest.fn(),
            updateMostViewedProjects: jest.fn()
        })
    }
}));
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: jest.fn().mockReturnValue({
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn()
        })
    }
}));

describe('ProjectService', () => {
    let projectService: ProjectService;
    let mockLogger: any;
    let mockAnalytics: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogger = Logger.getInstance();
        mockAnalytics = AnalyticsService.getInstance();
        projectService = new ProjectService();
    });

    describe('getAllProjects', () => {
        it('should get all projects successfully', async () => {
            (ProjectRepository.prototype.findAll as jest.Mock).mockResolvedValue([mockProject]);

            const result = await projectService.getAllProjects();

            expect(result).toEqual([mockProject]);
            expect(mockLogger.info).toHaveBeenCalledWith('All projects retrieved successfully');
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (ProjectRepository.prototype.findAll as jest.Mock).mockRejectedValue(error);

            await expect(projectService.getAllProjects())
                .rejects.toThrow(new AppError('Failed to get projects: Database error', 500));
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getFeaturedProjects', () => {
        it('should get featured projects successfully', async () => {
            (ProjectRepository.prototype.findFeatured as jest.Mock).mockResolvedValue([mockProject]);

            const result = await projectService.getFeaturedProjects();

            expect(result).toEqual([mockProject]);
            expect(mockLogger.info).toHaveBeenCalledWith('Featured projects retrieved successfully');
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            (ProjectRepository.prototype.findFeatured as jest.Mock).mockRejectedValue(error);

            await expect(projectService.getFeaturedProjects())
                .rejects.toThrow(new AppError('Failed to get featured projects: Database error', 500));
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('getProjectById', () => {
        it('should get project by id successfully', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.getProjectById(mockProject.id);

            expect(result).toEqual(mockProject);
            expect(mockAnalytics.recordPageView).toHaveBeenCalled();
            expect(mockAnalytics.updateMostViewedProjects).toHaveBeenCalledWith([mockProject.id]);
            expect(mockLogger.info).toHaveBeenCalled();
        });

        it('should throw error for non-existent project', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(projectService.getProjectById('999'))
                .rejects.toThrow(new AppError('Project not found', 404));
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('createProject', () => {
        const projectData: ICreateProject = {
            ...mockProject,
            id: undefined
        } as ICreateProject;

        it('should create project successfully', async () => {
            (ProjectRepository.prototype.create as jest.Mock).mockResolvedValue(mockProject);
            (TechnologyService.prototype.getTechnologyById as jest.Mock).mockResolvedValue({});
            (GitHubService.prototype.getRepositoryMetadata as jest.Mock).mockResolvedValue({});
            (ProjectRepository.prototype.updateTechnologies as jest.Mock).mockResolvedValue(mockProject);
            (ProjectRepository.prototype.updateGitHubData as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.createProject(projectData);

            expect(result).toEqual(mockProject);
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('project_created', {
                projectId: mockProject.id,
                title: mockProject.title
            });
        });

        it('should handle technology association errors', async () => {
            (ProjectRepository.prototype.create as jest.Mock).mockResolvedValue(mockProject);
            (TechnologyService.prototype.getTechnologyById as jest.Mock).mockRejectedValue(new Error('Invalid technology'));

            await expect(projectService.createProject(projectData))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateProject', () => {
        const updateData: IUpdateProject = {
            title: 'Updated Title',
            shortDescription: 'Updated short description',
            technologies: ['tech1'],
            githubUrl: 'https://github.com/updated'
        };

        it('should update project successfully', async () => {
            (ProjectRepository.prototype.update as jest.Mock).mockResolvedValue(mockProject);
            (TechnologyService.prototype.getTechnologyById as jest.Mock).mockResolvedValue({});
            (GitHubService.prototype.getRepositoryMetadata as jest.Mock).mockResolvedValue({});
            (ProjectRepository.prototype.updateTechnologies as jest.Mock).mockResolvedValue(mockProject);
            (ProjectRepository.prototype.updateGitHubData as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.updateProject(mockProject.id, updateData);

            expect(result).toEqual(mockProject);
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('project_updated', {
                projectId: mockProject.id,
                updates: Object.keys(updateData)
            });
        });

        it('should throw error for non-existent project', async () => {
            (ProjectRepository.prototype.update as jest.Mock).mockResolvedValue(null);

            await expect(projectService.updateProject('999', updateData))
                .rejects.toThrow('Failed to update project: Project not found');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('deleteProject', () => {
        it('should delete project successfully', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(mockProject);
            (ProjectRepository.prototype.delete as jest.Mock).mockResolvedValue(true);
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);

            const result = await projectService.deleteProject(mockProject.id);

            expect(result).toBe(true);
            expect(mockAnalytics.trackEvent).toHaveBeenCalledWith('project_deleted', {
                projectId: mockProject.id
            });
        });

        it('should throw error for non-existent project', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(null);

            await expect(projectService.deleteProject('999'))
                .rejects.toThrow('Failed to delete project: Project not found');
            expect(mockLogger.warn).toHaveBeenCalled();
        });
    });

    describe('updateThumbnail', () => {
        const mockFile = createMockFile();

        it('should update thumbnail successfully', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(mockProject);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue('new-thumbnail.jpg');
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);
            (ProjectRepository.prototype.updateThumbnail as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.updateThumbnail(mockProject.id, mockFile);

            expect(result).toEqual(mockProject);
            expect(StorageService.prototype.uploadFile).toHaveBeenCalledWith(
                mockFile,
                'projects',
                ['image/jpeg', 'image/png']
            );
        });

        it('should handle file upload errors', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(mockProject);
            (StorageService.prototype.uploadFile as jest.Mock).mockRejectedValue(new Error('Upload failed'));

            await expect(projectService.updateThumbnail(mockProject.id, mockFile))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('updateImages', () => {
        const mockFiles = [createMockFile(), createMockFile()];

        it('should update images successfully', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(mockProject);
            (StorageService.prototype.uploadFile as jest.Mock).mockResolvedValue('new-image.jpg');
            (StorageService.prototype.deleteFile as jest.Mock).mockResolvedValue(undefined);
            (ProjectRepository.prototype.updateImages as jest.Mock).mockResolvedValue(mockProject);

            const result = await projectService.updateImages(mockProject.id, mockFiles);

            expect(result).toEqual(mockProject);
            expect(StorageService.prototype.uploadFile).toHaveBeenCalledTimes(mockFiles.length);
        });

        it('should handle file upload errors', async () => {
            (ProjectRepository.prototype.findById as jest.Mock).mockResolvedValue(mockProject);
            (StorageService.prototype.uploadFile as jest.Mock).mockRejectedValue(new Error('Upload failed'));

            await expect(projectService.updateImages(mockProject.id, mockFiles))
                .rejects.toThrow(AppError);
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});
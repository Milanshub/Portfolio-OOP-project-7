import { ProjectController } from '../../src/controllers/ProjectController';
import { ProjectService } from '../../src/services/ProjectService';
import { AnalyticsObserver } from '../../src/utils/observers/analyticsObservers';
import { mockProject, mockRequest, mockResponse } from '../utils/mockHelpers';
import { projectValidator } from '../../src/utils/validators/projectValidator';

// Mock the dependencies
jest.mock('../../src/services/ProjectService');
jest.mock('../../src/utils/observers/analyticsObservers');
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

// Mock AnalyticsObserver singleton
(AnalyticsObserver.getInstance as jest.Mock).mockReturnValue({
    trackProjectView: jest.fn(),
    trackPageView: jest.fn(),
    trackEvent: jest.fn()
});

describe('ProjectController', () => {
    let projectController: ProjectController;

    beforeEach(() => {
        jest.clearAllMocks();
        projectController = new ProjectController();
    });

    describe('getAllProjects', () => {
        it('should return all projects successfully', async () => {
            const mockProjects = [mockProject];
            jest.spyOn(ProjectService.prototype, 'getAllProjects')
                .mockResolvedValue(mockProjects);

            const req = mockRequest();
            const res = mockResponse();

            await projectController.getAllProjects(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProjects);
        });

        it('should handle errors appropriately', async () => {
            const errorMessage = 'Test error';
            jest.spyOn(ProjectService.prototype, 'getAllProjects')
                .mockRejectedValue(new Error(errorMessage));

            const req = mockRequest();
            const res = mockResponse();

            await projectController.getAllProjects(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });

    describe('getProjectById', () => {
        it('should return a project successfully', async () => {
            jest.spyOn(ProjectService.prototype, 'getProjectById')
                .mockResolvedValue(mockProject);

            const req = mockRequest();
            req.params = { id: '1' };
            const res = mockResponse();

            await projectController.getProjectById(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockProject);
        });

        it('should handle not found error', async () => {
            jest.spyOn(ProjectService.prototype, 'getProjectById')
                .mockRejectedValue(new Error('Project not found'));

            const req = mockRequest();
            req.params = { id: '999' };
            const res = mockResponse();

            await projectController.getProjectById(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
        });
    });

    describe.skip('createProject', () => {
        it('should create a project successfully', async () => {
            jest.spyOn(ProjectService.prototype, 'createProject')
                .mockResolvedValue(mockProject);
            
            (projectValidator.validateCreate as jest.Mock).mockReturnValue([]);
    
            const req = mockRequest();
            req.body = mockProject;
            const res = mockResponse();
    
            await projectController.createProject(req as any, res as any);
    
            expect(projectValidator.validateCreate).toHaveBeenCalledWith(mockProject);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockProject);
        });
    });

    describe('updateProject', () => {
        it('should update a project successfully', async () => {
            const updatedProject = { ...mockProject, title: 'Updated Title' };
            jest.spyOn(ProjectService.prototype, 'updateProject')
                .mockResolvedValue(updatedProject);

            const req = mockRequest();
            req.params = { id: '1' };
            req.body = { title: 'Updated Title' };
            const res = mockResponse();

            await projectController.updateProject(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedProject);
        });
    });

    describe('deleteProject', () => {
        it('should delete a project successfully', async () => {
            jest.spyOn(ProjectService.prototype, 'deleteProject')
                .mockResolvedValue(true);

            const req = mockRequest();
            req.params = { id: '1' };
            const res = mockResponse();

            await projectController.deleteProject(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Project deleted successfully' });
        });

        it('should handle not found error', async () => {
            jest.spyOn(ProjectService.prototype, 'deleteProject')
                .mockRejectedValue(new Error('Project not found'));

            const req = mockRequest();
            req.params = { id: '999' };
            const res = mockResponse();

            await projectController.deleteProject(req as any, res as any);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Project not found' });
        });
    });
});
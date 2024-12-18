import { Request, Response } from 'express';
import { GitHubController } from '../../src/controllers/GitHubController';
import { mockRequest, mockResponse } from '../utils/mockHelpers';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../../src/services/AnalyticsService', () => ({
    AnalyticsService: {
        getInstance: jest.fn().mockReturnValue({
            trackEvent: jest.fn()
        })
    }
}));
jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
        })
    }
}));

// Mock GitHub API responses
const mockRepositoryData = {
    id: 1,
    name: 'test-repo',
    description: 'Test repository',
    html_url: 'https://github.com/test/test-repo',
    homepage: 'https://test-repo.com',
    stargazers_count: 10,
    forks_count: 5,
    language: 'TypeScript',
    updated_at: '2024-01-01T00:00:00Z',
    topics: ['typescript', 'testing'],
    created_at: '2023-01-01T00:00:00Z',
    size: 1000,
    default_branch: 'main'
};

const mockCommitData = {
    sha: 'abc123',
    commit: {
        message: 'Test commit',
        author: {
            name: 'Test Author',
            date: '2024-01-01T00:00:00Z'
        }
    },
    html_url: 'https://github.com/test/test-repo/commit/abc123'
};

describe('GitHubController', () => {
    let githubController: GitHubController;
    const originalEnv = process.env;

    beforeEach(() => {
        process.env.GITHUB_TOKEN = 'mock-token';
        process.env.GITHUB_USERNAME = 'test-user';
        githubController = new GitHubController();
        jest.clearAllMocks();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('constructor', () => {
        it('should throw error if GitHub token is not provided', () => {
            delete process.env.GITHUB_TOKEN;
            expect(() => new GitHubController()).toThrow('GitHub token is required');
        });
    });

    describe('getRepositories', () => {
        it('should fetch repositories successfully', async () => {
            const req = mockRequest();
            const res = mockResponse();

            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: [mockRepositoryData]
            });

            await githubController.getRepositories(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{
                id: mockRepositoryData.id,
                name: mockRepositoryData.name,
                description: mockRepositoryData.description,
                url: mockRepositoryData.html_url,
                stars: mockRepositoryData.stargazers_count,
                forks: mockRepositoryData.forks_count,
                language: mockRepositoryData.language,
                updatedAt: mockRepositoryData.updated_at
            }]);
        });

        it('should serve from cache if available', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const cachedData = [{
                id: 1,
                name: 'cached-repo',
                description: 'Cached repository',
                url: 'https://github.com/test/cached-repo',
                stars: 5,
                forks: 2,
                language: 'JavaScript',
                updatedAt: '2024-01-01T00:00:00Z'
            }];

            // First call to populate cache
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: [mockRepositoryData]
            });
            await githubController.getRepositories(req as Request, res as Response);

            // Second call should use cache
            await githubController.getRepositories(req as Request, res as Response);

            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        it('should handle API errors', async () => {
            const req = mockRequest();
            const res = mockResponse();

            (axios.get as jest.Mock).mockRejectedValueOnce({
                response: {
                    status: 403,
                    data: {
                        message: 'API rate limit exceeded'
                    }
                }
            });

            await githubController.getRepositories(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                error: 'API rate limit exceeded'
            });
        });
    });

    describe('getRepository', () => {
        it('should fetch single repository successfully', async () => {
            const req = mockRequest({
                params: { name: 'test-repo' }
            });
            const res = mockResponse();

            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: mockRepositoryData
            });

            await githubController.getRepository(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: mockRepositoryData.id,
                name: mockRepositoryData.name,
                description: mockRepositoryData.description,
                url: mockRepositoryData.html_url,
                stars: mockRepositoryData.stargazers_count,
                forks: mockRepositoryData.forks_count,
                language: mockRepositoryData.language,
                topics: mockRepositoryData.topics,
                createdAt: mockRepositoryData.created_at,
                updatedAt: mockRepositoryData.updated_at,
                homepage: mockRepositoryData.homepage,
                size: mockRepositoryData.size,
                defaultBranch: mockRepositoryData.default_branch
            });
        });

        it('should serve repository from cache if available', async () => {
            const req = mockRequest({
                params: { name: 'test-repo' }
            });
            const res = mockResponse();

            // First call to populate cache
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: mockRepositoryData
            });
            await githubController.getRepository(req as Request, res as Response);

            // Second call should use cache
            await githubController.getRepository(req as Request, res as Response);

            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        it('should handle repository not found', async () => {
            const req = mockRequest({
                params: { name: 'non-existent-repo' }
            });
            const res = mockResponse();

            (axios.get as jest.Mock).mockRejectedValueOnce({
                response: {
                    status: 404,
                    data: {
                        message: 'Repository not found'
                    }
                }
            });

            await githubController.getRepository(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Repository not found'
            });
        });
    });

    describe('getCommits', () => {
        it('should fetch commits successfully', async () => {
            const req = mockRequest({
                params: { name: 'test-repo' }
            });
            const res = mockResponse();

            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: [mockCommitData]
            });

            await githubController.getCommits(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{
                sha: mockCommitData.sha,
                message: mockCommitData.commit.message,
                author: mockCommitData.commit.author.name,
                date: mockCommitData.commit.author.date,
                url: mockCommitData.html_url
            }]);
        });

        it('should serve commits from cache if available', async () => {
            const req = mockRequest({
                params: { name: 'test-repo' }
            });
            const res = mockResponse();

            // First call to populate cache
            (axios.get as jest.Mock).mockResolvedValueOnce({
                data: [mockCommitData]
            });
            await githubController.getCommits(req as Request, res as Response);

            // Second call should use cache
            await githubController.getCommits(req as Request, res as Response);

            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        it('should handle API errors', async () => {
            const req = mockRequest({
                params: { name: 'test-repo' }
            });
            const res = mockResponse();

            (axios.get as jest.Mock).mockRejectedValueOnce({
                response: {
                    status: 404,
                    data: {
                        message: 'Repository not found'
                    }
                }
            });

            await githubController.getCommits(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Repository not found'
            });
        });
    });
});
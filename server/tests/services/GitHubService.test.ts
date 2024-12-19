import { GitHubService } from '../../src/services/GitHubService';
import { Logger } from '../../src/utils/logger';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
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

describe('GitHubService', () => {
    let gitHubService: GitHubService;
    let mockLogger: any;
    const mockToken = 'mock-github-token';
    
    // Mock response data
    const mockRepoData = {
        stargazers_count: 100,
        forks_count: 50
    };
    
    const mockLanguagesData = {
        TypeScript: 10000,
        JavaScript: 5000
    };
    
    const mockCommitsData = [{
        commit: {
            author: {
                date: '2024-01-01T00:00:00Z'
            }
        }
    }];

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.GITHUB_TOKEN = mockToken;
        mockLogger = Logger.getInstance();
        gitHubService = new GitHubService();

        // Default successful response for all GitHub API calls
        (axios.get as jest.Mock).mockResolvedValue({ data: mockRepoData });
    });

    afterEach(() => {
        delete process.env.GITHUB_TOKEN;
    });

    describe('getRepositoryMetadata', () => {
        const validRepoUrl = 'https://github.com/username/repo';

        it('should fetch repository metadata successfully', async () => {
            (axios.get as jest.Mock)
                .mockImplementation((url: string) => {
                    if (url.includes('/repos/') && !url.includes('/languages') && !url.includes('/commits')) {
                        return Promise.resolve({ data: mockRepoData });
                    }
                    if (url.includes('/languages')) {
                        return Promise.resolve({ data: mockLanguagesData });
                    }
                    if (url.includes('/commits')) {
                        return Promise.resolve({ data: mockCommitsData });
                    }
                    return Promise.resolve({ data: {} });
                });

            const result = await gitHubService.getRepositoryMetadata(validRepoUrl);

            expect(result).toEqual({
                stars: mockRepoData.stargazers_count,
                forks: mockRepoData.forks_count,
                lastCommit: new Date(mockCommitsData[0].commit.author.date),
                languages: mockLanguagesData
            });
        });

        it('should handle API errors gracefully', async () => {
            (axios.get as jest.Mock).mockRejectedValueOnce({
                message: 'API Error'
            });

            await expect(gitHubService.getRepositoryMetadata(validRepoUrl))
                .rejects.toThrow('GitHub sync failed: API Error');
        });

        it('should handle rate limiting', async () => {
            (axios.get as jest.Mock).mockRejectedValueOnce({
                message: 'API rate limit exceeded'
            });

            await expect(gitHubService.getRepositoryMetadata(validRepoUrl))
                .rejects.toThrow('GitHub sync failed: API rate limit exceeded');
        });
    });

    describe('parseRepoUrl', () => {
        it('should parse valid GitHub URLs', () => {
            const result = gitHubService.parseRepoUrl('https://github.com/username/repo');
            expect(result).toEqual({ owner: 'username', repo: 'repo' });
        });

        it('should handle invalid URLs', () => {
            expect(() => gitHubService.parseRepoUrl('invalid-url'))
                .toThrow('Invalid GitHub repository URL');
        });
    });

    describe('fetchRepoData', () => {
        it('should fetch repository data successfully', async () => {
            const result = await gitHubService.fetchRepoData('username', 'repo');
            expect(result).toEqual(mockRepoData);
        });

        it('should include auth token when available', async () => {
            await gitHubService.fetchRepoData('username', 'repo');

            expect(axios.get).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': `token ${mockToken}`
                    })
                })
            );
        });
    });

    describe('fetchLanguages', () => {
        it('should fetch languages data successfully', async () => {
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockLanguagesData });
            const result = await gitHubService.fetchLanguages('username', 'repo');
            expect(result).toEqual(mockLanguagesData);
        });
    });

    describe('fetchLastCommit', () => {
        it('should fetch last commit data successfully', async () => {
            (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockCommitsData });
            const result = await gitHubService.fetchLastCommit('username', 'repo');
            expect(result).toEqual(mockCommitsData);
        });
    });
});
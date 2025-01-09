import { api } from '@/lib/api/client';
import { GitHubRepository, GitHubCommit } from '@/types';
import { endpoints } from '@/lib/api/endpoints';
import { logger } from '@/config/logger';

export class GitHubService {
  private static instance: GitHubService;

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  async getRepositories(): Promise<GitHubRepository[]> {
    try {
      const response = await api.get<GitHubRepository[]>(endpoints.GITHUB.GET_REPOS);
      logger.debug('GitHub repositories retrieved successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch GitHub repositories:', error as Error);
      throw error;
    }
  }

  async getRepository(name: string): Promise<GitHubRepository> {
    try {
      const response = await api.get<GitHubRepository>(
        endpoints.GITHUB.GET_REPO(name)
      );
      logger.debug(`GitHub repository retrieved successfully: ${name}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch GitHub repository ${name}:`, error as Error);
      throw error;
    }
  }

  async getCommits(name: string): Promise<GitHubCommit[]> {
    try {
      const response = await api.get<GitHubCommit[]>(
        endpoints.GITHUB.GET_COMMITS(name)
      );
      logger.debug(`GitHub commits retrieved successfully for: ${name}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch commits for repository ${name}:`, error as Error);
      throw error;
    }
  }
}

export const githubService = GitHubService.getInstance();
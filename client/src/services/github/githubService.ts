import { api } from '@/lib/api';
import { GitHubRepository, GitHubCommit } from '@/types';

class GitHubService {
  private static instance: GitHubService;

  private constructor() {}

  public static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  async getRepositories(): Promise<GitHubRepository[]> {
    const response = await api.get<GitHubRepository[]>('/github/repositories');
    return response;
  }

  async getRepository(name: string): Promise<GitHubRepository> {
    const response = await api.get<GitHubRepository>(`/github/repository/${name}`);
    return response;
  }

  async getCommits(name: string): Promise<GitHubCommit[]> {
    const response = await api.get<GitHubCommit[]>(`/github/repository/${name}/commits`);
    return response;
  }
}

export const githubService = GitHubService.getInstance(); 
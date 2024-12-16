import { IRepository } from './IRepository';

export interface IGitHubRepoMetadata {
    stars: number;
    forks: number;
    lastCommit: Date;
    languages: Record<string, number>;
}

export interface IGitHubModel {
    getRepositoryMetadata(repoUrl: string): Promise<IGitHubRepoMetadata>;
    parseRepoUrl(repoUrl: string): { owner: string; repo: string };
    fetchRepoData(owner: string, repo: string): Promise<any>;
    fetchLanguages(owner: string, repo: string): Promise<Record<string, number>>;
    fetchLastCommit(owner: string, repo: string): Promise<any>;
}
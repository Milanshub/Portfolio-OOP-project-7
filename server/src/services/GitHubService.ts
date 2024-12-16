import axios from 'axios';
import { Logger } from '../utils/logger';
import { IGitHubModel, IGitHubRepoMetadata } from '../models/interfaces/IGitHubModel';

export class GitHubService implements IGitHubModel {
    private logger = Logger.getInstance();
    private baseUrl = 'https://api.github.com';
    private token: string;

    constructor() {
        this.token = process.env.GITHUB_TOKEN!;
        if (!this.token) {
            this.logger.warn('GitHub token not found in environment variables');
        }
    }

    async getRepositoryMetadata(repoUrl: string): Promise<IGitHubRepoMetadata> {
        try {
            const { owner, repo } = this.parseRepoUrl(repoUrl);
            
            const [repoData, languagesData, commitsData] = await Promise.all([
                this.fetchRepoData(owner, repo),
                this.fetchLanguages(owner, repo),
                this.fetchLastCommit(owner, repo)
            ]);

            return {
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
                lastCommit: new Date(commitsData[0].commit.author.date),
                languages: languagesData
            };
        } catch (error: any) {
            this.logger.error(`Failed to fetch GitHub data: ${error.message}`);
            throw new Error(`GitHub sync failed: ${error.message}`);
        }
    }

    parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
        try {
            const url = new URL(repoUrl);
            const [, owner, repo] = url.pathname.split('/');
            return { owner, repo: repo.replace('.git', '') };
        } catch (error) {
            throw new Error('Invalid GitHub repository URL');
        }
    }

    async fetchRepoData(owner: string, repo: string): Promise<any> {
        const { data } = await axios.get(
            `${this.baseUrl}/repos/${owner}/${repo}`,
            this.getRequestConfig()
        );
        return data;
    }

    async fetchLanguages(owner: string, repo: string): Promise<Record<string, number>> {
        const { data } = await axios.get(
            `${this.baseUrl}/repos/${owner}/${repo}/languages`,
            this.getRequestConfig()
        );
        return data;
    }

    async fetchLastCommit(owner: string, repo: string): Promise<any> {
        const { data } = await axios.get(
            `${this.baseUrl}/repos/${owner}/${repo}/commits`,
            this.getRequestConfig()
        );
        return data;
    }

    private getRequestConfig() {
        return {
            headers: this.token ? {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            } : {
                'Accept': 'application/vnd.github.v3+json'
            }
        };
    }
}
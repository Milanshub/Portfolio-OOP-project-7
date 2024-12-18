import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { AnalyticsService } from '../services/AnalyticsService';
import { Cache } from '../utils/cache';
import { AppError } from '../middleware/errorMiddleware';
import axios from 'axios';

export class GitHubController {
    private logger = Logger.getInstance();
    private analytics = AnalyticsService.getInstance();
    private cache = new Cache<any>(60 * 60 * 1000); // 1 hour cache

    private readonly GITHUB_API_URL = 'https://api.github.com';
    private readonly GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    constructor() {
        if (!this.GITHUB_TOKEN) {
            this.logger.error('GitHub token not found in environment variables');
            throw new Error('GitHub token is required');
        }
    }

    async getRepositories(req: Request, res: Response): Promise<void> {
        try {
            const cacheKey = 'github-repositories';
            const cachedData = this.cache.get(cacheKey);

            if (cachedData) {
                this.logger.debug('Serving GitHub repositories from cache');
                res.status(200).json(cachedData);
                return;
            }

            const response = await axios.get(`${this.GITHUB_API_URL}/user/repos`, {
                headers: {
                    Authorization: `token ${this.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            const repositories = response.data.map((repo: any) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                updatedAt: repo.updated_at
            }));

            this.cache.set(cacheKey, repositories);
            await this.analytics.trackEvent('github_repositories_fetched');
            this.logger.info('GitHub repositories fetched successfully');
            res.status(200).json(repositories);
        } catch (error: any) {
            this.logger.error('Failed to fetch GitHub repositories:', error);
            res.status(error.response?.status || 500).json({ 
                error: error.response?.data?.message || 'Failed to fetch repositories' 
            });
        }
    }

    async getRepository(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.params;
            const cacheKey = `github-repository-${name}`;
            const cachedData = this.cache.get(cacheKey);

            if (cachedData) {
                this.logger.debug(`Serving GitHub repository ${name} from cache`);
                res.status(200).json(cachedData);
                return;
            }

            const response = await axios.get(`${this.GITHUB_API_URL}/repos/${process.env.GITHUB_USERNAME}/${name}`, {
                headers: {
                    Authorization: `token ${this.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            });

            const repository = {
                id: response.data.id,
                name: response.data.name,
                description: response.data.description,
                url: response.data.html_url,
                stars: response.data.stargazers_count,
                forks: response.data.forks_count,
                language: response.data.language,
                topics: response.data.topics,
                createdAt: response.data.created_at,
                updatedAt: response.data.updated_at,
                homepage: response.data.homepage,
                size: response.data.size,
                defaultBranch: response.data.default_branch
            };

            this.cache.set(cacheKey, repository);
            await this.analytics.trackEvent('github_repository_fetched', { repository: name });
            this.logger.info(`GitHub repository ${name} fetched successfully`);
            res.status(200).json(repository);
        } catch (error: any) {
            this.logger.error(`Failed to fetch GitHub repository ${req.params.name}:`, error);
            res.status(error.response?.status || 500).json({ 
                error: error.response?.data?.message || 'Failed to fetch repository' 
            });
        }
    }

    async getCommits(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.params;
            const cacheKey = `github-commits-${name}`;
            const cachedData = this.cache.get(cacheKey);

            if (cachedData) {
                this.logger.debug(`Serving GitHub commits for ${name} from cache`);
                res.status(200).json(cachedData);
                return;
            }

            const response = await axios.get(
                `${this.GITHUB_API_URL}/repos/${process.env.GITHUB_USERNAME}/${name}/commits`,
                {
                    headers: {
                        Authorization: `token ${this.GITHUB_TOKEN}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                }
            );

            const commits = response.data.map((commit: any) => ({
                sha: commit.sha,
                message: commit.commit.message,
                author: commit.commit.author.name,
                date: commit.commit.author.date,
                url: commit.html_url
            }));

            this.cache.set(cacheKey, commits);
            await this.analytics.trackEvent('github_commits_fetched', { repository: name });
            this.logger.info(`GitHub commits for ${name} fetched successfully`);
            res.status(200).json(commits);
        } catch (error: any) {
            this.logger.error(`Failed to fetch commits for ${req.params.name}:`, error);
            res.status(error.response?.status || 500).json({ 
                error: error.response?.data?.message || 'Failed to fetch commits' 
            });
        }
    }
}
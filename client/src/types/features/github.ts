export interface GitHubRepository {
    id: number;
    name: string;
    description: string;
    url: string;
    stars: number;
    forks: number;
    language: string;
    updatedAt: string;
}

export interface GitHubCommit {
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
}

export interface GitHubLanguage {
    name: string;
    percentage: number;
    color?: string;
}

export interface GitHubStats {
    totalStars: number;
    totalForks: number;
    totalRepos: number;
    mainLanguages: GitHubLanguage[];
}
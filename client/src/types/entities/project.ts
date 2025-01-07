export interface Project {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    images: string[];
    liveUrl: string;
    githubUrl?: string;
    featured: boolean;
    order: number;
    startDate: Date;
    endDate: Date;
    technologies: string[];
    githubData?: {
        stars: number;
        forks: number;
        lastCommit: Date;
        languages: Record<string, number>;
    };
}

export interface CreateProject extends Omit<Project, 'id'> {}
export interface UpdateProject extends Partial<CreateProject> {}
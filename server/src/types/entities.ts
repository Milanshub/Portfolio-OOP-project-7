// Define an interface for a project
export interface IProject {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    images: string[];
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    order: number;
    startDate: Date;
    endDate: Date;
};

// Define an interface for creating a project
export interface ICreateProject extends Omit<IProject, 'id'> {};
// Define an interface for updating a project
export interface IUpdateProject extends Partial<ICreateProject> {};
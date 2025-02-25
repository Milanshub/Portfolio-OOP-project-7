// Project interfaces
export interface IProject {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    images: string[];
    liveUrl: string;
    githubUrl?: string;  // Make githubUrl optional in base interface
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

// No need to redeclare optional fields that are already optional in IProject
export interface ICreateProject extends Omit<IProject, 'id'> {}

export interface IUpdateProject extends Partial<ICreateProject> {}

// Profile interfaces
export interface IProfile {
    id: string;
    fullName: string;
    title: string;
    bio: string;
    avatar: string;
    resume: string;
    location: string;
    email: string;
};

export interface ICreateProfile extends Omit<IProfile, 'id'> {};
export interface IUpdateProfile extends Partial<ICreateProfile> {};

// Admin interfaces
export interface IAdmin {
    id: string;
    name?: string;
    email: string;
    password: string;
    lastLogin: Date;
}

export interface ICreateAdmin extends Omit<IAdmin, 'id' | 'lastLogin'> {};
export interface IUpdateAdmin extends Partial<ICreateAdmin> {};

// Technology interfaces
export interface ITechnology {
    id: string;
    name: string;
    icon: string;
    category: TechnologyCategory;
    proficiencyLevel: number;
}

export enum TechnologyCategory {
    FRONTEND = 'FRONTEND',
    BACKEND = 'BACKEND',
    DATABASE = 'DATABASE',
    DEVOPS = 'DEVOPS',
    OTHER = 'OTHER'
}

export interface ICreateTechnology extends Omit<ITechnology, 'id'> {};
export interface IUpdateTechnology extends Partial<ICreateTechnology> {};

// Message interfaces
export interface IMessage {
    id: string;
    sender_name: string;
    sender_email: string;
    subject: string;
    message: string;
    created_at: Date;
    read: boolean;
}

export interface ICreateMessage extends Omit<IMessage, 'id' | 'created_at' | 'read'> {};
export interface IUpdateMessage extends Partial<ICreateMessage> {};

// Analytics interfaces
export interface IAnalytics {
    id: string;
    pageViews: number;
    uniqueVisitors: number;
    avgTimeOnSite: number;
    mostViewedProjects: string[]; // Array of project IDs
    createdAt: Date;
    updatedAt: Date;
}

// Add these new interfaces
export interface IAnalyticsEvent {
    id: string;
    event_name: string;
    event_data: any;
    timestamp: Date;
    created_at: Date;
}

export interface ICreateAnalyticsEvent extends Omit<IAnalyticsEvent, 'id' | 'created_at'> {}
export interface IUpdateAnalyticsEvent extends Partial<ICreateAnalyticsEvent> {}

export interface ICreateAnalytics extends Omit<IAnalytics, 'id' | 'createdAt' | 'updatedAt'> {}
export interface IUpdateAnalytics extends Partial<ICreateAnalytics> {}
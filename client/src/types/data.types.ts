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

export interface Profile {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  avatar: string;
  resume: string;
  location: string;
  email: string;
}

export interface Technology {
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
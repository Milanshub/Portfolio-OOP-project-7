export enum TechnologyCategory {
    FRONTEND = 'FRONTEND',
    BACKEND = 'BACKEND',
    DATABASE = 'DATABASE',
    DEVOPS = 'DEVOPS',
    OTHER = 'OTHER'
}

export interface Technology {
    id: string;
    name: string;
    icon: string;
    category: TechnologyCategory;
    proficiencyLevel: number;
}

export interface CreateTechnology extends Omit<Technology, 'id'> {}
export interface UpdateTechnology extends Partial<CreateTechnology> {}
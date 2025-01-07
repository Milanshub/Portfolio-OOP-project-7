// Technology Categories
export const TECH_CATEGORIES = {
    FRONTEND: 'frontend',
    BACKEND: 'backend',
    DATABASE: 'database',
    DEVOPS: 'devops',
    TOOLS: 'tools',
    LANGUAGES: 'languages',
  } as const;
  
  // Proficiency Levels
  export const PROFICIENCY_LEVELS = {
    BEGINNER: 1,
    INTERMEDIATE: 2,
    ADVANCED: 3,
    EXPERT: 4,
  } as const;
  
  // Technology Icons Path
  export const TECH_ICONS_PATH = '/icons/technologies';
  
  // Technology Stack Groups
  export const TECH_STACK = {
    FRONTEND: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
    ],
    BACKEND: [
      'Node.js',
      'Express',
      'NestJS',
    ],
    DATABASE: [
      'PostgreSQL',
      'MongoDB',
      'Redis',
    ],
    DEVOPS: [
      'Docker',
      'AWS',
      'GitHub Actions',
    ],
  } as const;
  
  // Types
  export type TechCategory = keyof typeof TECH_CATEGORIES;
  export type ProficiencyLevel = typeof PROFICIENCY_LEVELS[keyof typeof PROFICIENCY_LEVELS];
  export type TechStack = typeof TECH_STACK;
  
  export interface Technology {
    id: string;
    name: string;
    category: TechCategory;
    proficiency: ProficiencyLevel;
    icon?: string;
    description?: string;
  }
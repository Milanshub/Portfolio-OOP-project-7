import { Request, Response } from 'express';
import { 
    IProject, 
    IAnalytics, 
    IAdmin, 
    IMessage, 
    IProfile, 
    ITechnology, 
    TechnologyCategory,
    IAnalyticsEvent
} from '../../src/types/entities';
import { Express } from 'express';

// Auth related interfaces
export interface AuthRequest extends Request {
    admin?: IAdmin;
}

export interface AuthResponse {
    admin: IAdmin;
    token: string;
}

// Mock Project
export const mockProject: IProject = {
    id: '1',
    title: 'Test Project',
    description: 'Test Description',
    shortDescription: 'Short Description',
    thumbnail: 'thumbnail.jpg',
    images: ['image1.jpg', 'image2.jpg'],
    liveUrl: 'https://test.com',
    githubUrl: 'https://github.com/test',
    featured: false,
    order: 1,
    startDate: new Date(),
    endDate: new Date(),
    technologies: ['React', 'Node.js'],
    githubData: {
        stars: 10,
        forks: 5,
        lastCommit: new Date(),
        languages: { TypeScript: 80, JavaScript: 20 }
    }
};

// Mock Technology
export const mockTechnology: ITechnology = {
    id: '1',
    name: 'React',
    icon: 'react-icon',
    category: TechnologyCategory.FRONTEND,
    proficiencyLevel: 80
};

// Mock Message
export const mockMessage: IMessage = {
    id: '1',
    senderName: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Test Subject',
    message: 'Test Message Content',
    createdAt: new Date(),
    read: false
};

// Mock Profile
export const mockProfile: IProfile = {
    id: '1',
    fullName: 'John Doe',
    title: 'Software Engineer',
    bio: 'Experienced developer',
    avatar: 'avatar.jpg',
    resume: 'resume.pdf',
    location: 'New York',
    email: 'john@example.com'
};

// Mock Analytics
export const mockAnalytics: IAnalytics = {
    id: '1',
    pageViews: 100,
    uniqueVisitors: 50,
    avgTimeOnSite: 300,
    mostViewedProjects: ['1', '2', '3'],
    createdAt: new Date(),
    updatedAt: new Date()
};

// Mock Analytics Event
export const mockAnalyticsEvent: IAnalyticsEvent = {
    id: '1',
    event_name: 'page_view',
    event_data: { page: 'home' },
    timestamp: new Date(),
    created_at: new Date()
};

// Mock Admin
export const mockAdmin: IAdmin = {
    id: '1',
    email: 'test@example.com',
    name: 'Test Admin',
    password: 'password123',
    lastLogin: new Date()
};

// Mock Auth Response
export const mockAuthResponse: AuthResponse = {
    admin: mockAdmin,
    token: 'mock-jwt-token'
};

// Mock Request Helper
export const mockRequest = (options: Partial<AuthRequest> = {}): Partial<AuthRequest> => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    ...options
});

// Mock Response Helper
export const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
    };
    return res;
};

// Mock File Helper
export const createMockFile = (partial: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024 * 1024,
    stream: {} as any,
    destination: '/tmp',
    filename: 'test.jpg',
    path: '/tmp/test.jpg',
    buffer: Buffer.from([]),
    ...partial
});
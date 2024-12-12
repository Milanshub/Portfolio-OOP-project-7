import { Request, Response } from 'express';
import { IProject, IAnalytics, IAdmin, IMessage, IProfile, ITechnology, TechnologyCategory } from '../../src/types/entities';
import { Express } from 'express';

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
    endDate: new Date()
};

export const mockTechnology: ITechnology = {
    id: '1',
    name: 'React',
    icon: 'react-icon',
    category: TechnologyCategory.FRONTEND,
    proficiencyLevel: 80
};


export const mockMessage: IMessage = {
    id: '1',
    senderName: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Test Subject',
    message: 'Test Message Content',
    createdAt: new Date(),
    read: false
};

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

export const mockAnalytics: IAnalytics = {
    id: '1',
    pageViews: 100,
    uniqueVisitors: 50,
    avgTimeOnSite: 300,
    mostViewedProjects: ['1', '2', '3'],
    createdAt: new Date(),
    updatedAt: new Date()
};

export const mockAdmin: IAdmin = {
    id: '1',
    email: 'test@example.com',
    name: 'Test Admin',
    password: 'password123',
    lastLogin: new Date()
};

export const mockRequest = (options: Partial<Request> = {}): Partial<Request> => ({
    body: {},
    params: {},
    query: {},
    headers: {}, 
    ...options
});

export const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
    };
    return res;
};

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


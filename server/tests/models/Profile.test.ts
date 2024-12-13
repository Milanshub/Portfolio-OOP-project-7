import { Profile } from '../../src/models/Profile';
import { supabase } from '../../src/config/supabase';
import { AppError } from '../../src/middleware/errorMiddleware';
import { mockProfile } from '../utils/mockHelpers';

// Mock dependencies
jest.mock('../../src/config/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    single: jest.fn()
                })),
                single: jest.fn()
            })),
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn()
                }))
            })),
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn()
                    }))
                }))
            })),
            delete: jest.fn(() => ({
                eq: jest.fn()
            }))
        }))
    }
}));

jest.mock('../../src/utils/logger', () => ({
    Logger: {
        getInstance: () => ({
            error: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn()
        })
    }
}));

describe('Profile Model', () => {
    let profileModel: Profile;

    beforeEach(() => {
        jest.clearAllMocks();
        profileModel = new Profile();
    });

    describe('CRUD Operations', () => {
        it('should find all profiles', async () => {
            const mockData = [mockProfile];
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockResolvedValue({
                    data: mockData,
                    error: null
                })
            });

            const result = await profileModel.findAll();

            expect(result).toEqual(mockData);
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should find profile by id', async () => {
            const singleMock = jest.fn().mockResolvedValue({ 
                data: mockProfile, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await profileModel.findById('1');

            expect(result).toEqual(mockProfile);
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should create new profile', async () => {
            const newProfile = {
                fullName: 'Test User',
                email: 'test@example.com',
                bio: 'Test Bio',
                title: 'Software Engineer',
                avatar: 'avatar.jpg',
                resume: 'resume.pdf',
                location: 'New York'
            };

            const singleMock = jest.fn().mockResolvedValue({ 
                data: { ...newProfile, id: '1' }, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await profileModel.create(newProfile);

            expect(result).toHaveProperty('id', '1');
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should update profile', async () => {
            const updateData = { bio: 'Updated Bio' };
            const singleMock = jest.fn().mockResolvedValue({ 
                data: { ...mockProfile, ...updateData }, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: singleMock
                        })
                    })
                })
            });

            const result = await profileModel.update('1', updateData);

            expect(result).toEqual({ ...mockProfile, ...updateData });
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should delete profile', async () => {
            (supabase.from as jest.Mock).mockReturnValueOnce({
                delete: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ error: null })
                })
            });

            const result = await profileModel.delete('1');

            expect(result).toBe(true);
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });
    });

    describe('Profile-specific methods', () => {
        it('should find profile by email', async () => {
            const singleMock = jest.fn().mockResolvedValue({ 
                data: mockProfile, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: singleMock
                    })
                })
            });

            const result = await profileModel.findByEmail('test@example.com');

            expect(result).toEqual(mockProfile);
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should update avatar', async () => {
            const avatarUrl = 'new-avatar.jpg';
            const singleMock = jest.fn().mockResolvedValue({ 
                data: { ...mockProfile, avatar: avatarUrl }, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: singleMock
                        })
                    })
                })
            });

            const result = await profileModel.updateAvatar('1', avatarUrl);

            expect(result).toHaveProperty('avatar', avatarUrl);
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should update resume', async () => {
            const resumeUrl = 'new-resume.pdf';
            const singleMock = jest.fn().mockResolvedValue({ 
                data: { ...mockProfile, resume: resumeUrl }, 
                error: null 
            });

            (supabase.from as jest.Mock).mockReturnValueOnce({
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        select: jest.fn().mockReturnValue({
                            single: singleMock
                        })
                    })
                })
            });

            const result = await profileModel.updateResume('1', resumeUrl);

            expect(result).toHaveProperty('resume', resumeUrl);
            expect(supabase.from).toHaveBeenCalledWith('profiles');
        });

        it('should validate email format', async () => {
            const invalidProfile = {
                email: 'invalid-email'
            };

            await expect(profileModel.update('1', invalidProfile))
                .rejects
                .toThrow(AppError);
        });
    });

    describe('Error Handling', () => {
        it('should handle database errors', async () => {
            (supabase.from as jest.Mock).mockReturnValueOnce({
                select: jest.fn().mockResolvedValue({ 
                    data: null, 
                    error: new Error('Database error') 
                })
            });

            await expect(profileModel.findAll())
                .rejects
                .toThrow(AppError);
        });
    });
});
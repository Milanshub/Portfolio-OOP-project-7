// tests/utils/validators/profileValidator.test.ts
import { profileValidator } from '../../../src/utils/validators/profileValidator';
import { ICreateProfile, IUpdateProfile } from '../../../src/types/entities';
import { stringHelpers } from '../../../src/utils/helpers/stringHelpers';
import { mockProfile } from '../mockHelpers';

// Mock stringHelpers
jest.mock('../../../src/utils/helpers/stringHelpers', () => ({
    stringHelpers: {
        isValidEmail: jest.fn()
    }
}));

describe('profileValidator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (stringHelpers.isValidEmail as jest.Mock).mockReturnValue(true);
    });

    describe('validateCreate', () => {
        // Use mockProfile to create valid profile data
        const validProfile: ICreateProfile = {
            fullName: mockProfile.fullName,
            title: mockProfile.title,
            bio: mockProfile.bio,
            email: mockProfile.email,
            location: mockProfile.location,
            avatar: mockProfile.avatar,
            resume: mockProfile.resume
        };

        it('should return empty array for valid profile', () => {
            const errors = profileValidator.validateCreate(validProfile);
            expect(errors).toEqual([]);
        });

        it('should validate required full name', () => {
            const invalidProfile = { ...validProfile, fullName: '' };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Full name is required');
        });

        it('should validate required title', () => {
            const invalidProfile = { ...validProfile, title: '' };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Title is required');
        });

        it('should validate required bio', () => {
            const invalidProfile = { ...validProfile, bio: '' };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Bio is required');
        });

        it('should validate required email', () => {
            const invalidProfile = { ...validProfile, email: '' };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Email is required');
        });

        it('should validate email format', () => {
            (stringHelpers.isValidEmail as jest.Mock).mockReturnValue(false);
            const invalidProfile = { ...validProfile, email: 'invalid-email' };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Invalid email format');
        });

        it('should validate required location', () => {
            const invalidProfile = { ...validProfile, location: '' };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Location is required');
        });

        it('should handle whitespace-only values', () => {
            const invalidProfile: ICreateProfile = {
                ...validProfile,
                fullName: '   ',
                title: '   ',
                bio: '   ',
                email: '   ',
                location: '   '
            };
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Full name is required');
            expect(errors).toContain('Title is required');
            expect(errors).toContain('Bio is required');
            expect(errors).toContain('Email is required');
            expect(errors).toContain('Location is required');
        });

        it('should handle undefined values', () => {
            const invalidProfile = {
                avatar: mockProfile.avatar,
                resume: mockProfile.resume
            } as ICreateProfile;
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Full name is required');
            expect(errors).toContain('Title is required');
            expect(errors).toContain('Bio is required');
            expect(errors).toContain('Email is required');
            expect(errors).toContain('Location is required');
        });

        it('should handle null values', () => {
            const invalidProfile = {
                fullName: null,
                title: null,
                bio: null,
                email: null,
                location: null,
                avatar: mockProfile.avatar,
                resume: mockProfile.resume
            } as unknown as ICreateProfile;
            
            const errors = profileValidator.validateCreate(invalidProfile);
            expect(errors).toContain('Full name is required');
            expect(errors).toContain('Title is required');
            expect(errors).toContain('Bio is required');
            expect(errors).toContain('Email is required');
            expect(errors).toContain('Location is required');
        });
    });

    describe('validateUpdate', () => {
        it('should return empty array for valid update data', () => {
            const validUpdate: IUpdateProfile = {
                fullName: mockProfile.fullName,
                email: mockProfile.email
            };
            const errors = profileValidator.validateUpdate(validUpdate);
            expect(errors).toEqual([]);
        });

        it('should validate email format if provided', () => {
            (stringHelpers.isValidEmail as jest.Mock).mockReturnValue(false);
            const invalidUpdate: IUpdateProfile = {
                email: 'invalid-email'
            };
            const errors = profileValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Invalid email format');
        });

        it('should not require email for update', () => {
            const validUpdate: IUpdateProfile = {
                fullName: mockProfile.fullName
            };
            const errors = profileValidator.validateUpdate(validUpdate);
            expect(errors).not.toContain('Email is required');
        });

        it('should validate non-empty fullName if provided', () => {
            const invalidUpdate: IUpdateProfile = {
                fullName: ''
            };
            const errors = profileValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Full name cannot be empty');
        });

        it('should validate non-empty title if provided', () => {
            const invalidUpdate: IUpdateProfile = {
                title: ''
            };
            const errors = profileValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Title cannot be empty');
        });

        it('should validate non-empty bio if provided', () => {
            const invalidUpdate: IUpdateProfile = {
                bio: ''
            };
            const errors = profileValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Bio cannot be empty');
        });

        it('should validate non-empty location if provided', () => {
            const invalidUpdate: IUpdateProfile = {
                location: ''
            };
            const errors = profileValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Location cannot be empty');
        });

        it('should handle whitespace-only values in update', () => {
            const invalidUpdate: IUpdateProfile = {
                fullName: '   ',
                title: '   ',
                bio: '   ',
                location: '   '
            };
            const errors = profileValidator.validateUpdate(invalidUpdate);
            expect(errors).toContain('Full name cannot be empty');
            expect(errors).toContain('Title cannot be empty');
            expect(errors).toContain('Bio cannot be empty');
            expect(errors).toContain('Location cannot be empty');
        });

        it('should allow partial updates', () => {
            const validUpdate: IUpdateProfile = {
                fullName: mockProfile.fullName
            };
            const errors = profileValidator.validateUpdate(validUpdate);
            expect(errors).toEqual([]);
        });
    });
});
import { ICreateProfile, IUpdateProfile } from '../../types/entities';
import { stringHelpers } from '../helpers/stringHelpers';

export const profileValidator = {
    validateCreate: (data: ICreateProfile): string[] => {
        const errors: string[] = [];

        if (!data.fullName?.trim()) {
            errors.push('Full name is required');
        }

        if (!data.title?.trim()) {
            errors.push('Title is required');
        }

        if (!data.bio?.trim()) {
            errors.push('Bio is required');
        }

        if (!data.email?.trim()) {
            errors.push('Email is required');
        } else if (!stringHelpers.isValidEmail(data.email)) {
            errors.push('Invalid email format');
        }

        if (!data.location?.trim()) {
            errors.push('Location is required');
        }

        return errors;
    },

    validateUpdate: (data: IUpdateProfile): string[] => {
        const errors: string[] = [];

        if (data.email && !stringHelpers.isValidEmail(data.email)) {
            errors.push('Invalid email format');
        }

        // Check if provided fields are not empty strings
        if (data.fullName !== undefined && !data.fullName.trim()) {
            errors.push('Full name cannot be empty');
        }

        if (data.title !== undefined && !data.title.trim()) {
            errors.push('Title cannot be empty');
        }

        if (data.bio !== undefined && !data.bio.trim()) {
            errors.push('Bio cannot be empty');
        }

        if (data.location !== undefined && !data.location.trim()) {
            errors.push('Location cannot be empty');
        }

        return errors;
    }
};
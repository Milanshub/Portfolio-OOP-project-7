import { ICreateProject, IUpdateProject } from '../../types/entities';
import { dateHelpers } from '../helpers/dateHelpers';
import { fileHelpers } from '../helpers/fileHelpers';

export const projectValidator = {
    validateCreate: (data: ICreateProject): string[] => {
        const errors: string[] = [];

        // Required fields
        if (!data.title?.trim()) {
            errors.push('Title is required');
        }

        if (!data.description?.trim()) {
            errors.push('Description is required');
        }

        if (!data.shortDescription?.trim()) {
            errors.push('Short description is required');
        }

        // URL validations
        if (data.liveUrl && !isValidUrl(data.liveUrl)) {
            errors.push('Invalid live URL format');
        }

        if (data.githubUrl && !isValidUrl(data.githubUrl)) {
            errors.push('Invalid GitHub URL format');
        }

        // Date validations
        if (!dateHelpers.isValidDate(data.startDate)) {
            errors.push('Invalid start date');
        }

        if (!dateHelpers.isValidDate(data.endDate)) {
            errors.push('Invalid end date');
        }

        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            errors.push('Start date cannot be after end date');
        }

        // Image validations
        if (data.thumbnail && !isValidImageUrl(data.thumbnail)) {
            errors.push('Invalid thumbnail URL format');
        }

        if (data.images?.length > 0) {
            data.images.forEach((img, index) => {
                if (!isValidImageUrl(img)) {
                    errors.push(`Invalid image URL format at position ${index + 1}`);
                }
            });
        }

        return errors;
    },

    validateUpdate: (data: IUpdateProject): string[] => {
        const errors: string[] = [];

        // Only validate fields that are provided
        if (data.title !== undefined && !data.title.trim()) {
            errors.push('Title cannot be empty');
        }

        if (data.description !== undefined && !data.description.trim()) {
            errors.push('Description cannot be empty');
        }

        if (data.shortDescription !== undefined && !data.shortDescription.trim()) {
            errors.push('Short description cannot be empty');
        }

        if (data.liveUrl && !isValidUrl(data.liveUrl)) {
            errors.push('Invalid live URL format');
        }

        if (data.githubUrl && !isValidUrl(data.githubUrl)) {
            errors.push('Invalid GitHub URL format');
        }

        if (data.startDate && !dateHelpers.isValidDate(data.startDate)) {
            errors.push('Invalid start date');
        }

        if (data.endDate && !dateHelpers.isValidDate(data.endDate)) {
            errors.push('Invalid end date');
        }

        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            errors.push('Start date cannot be after end date');
        }

        if (data.thumbnail && !isValidImageUrl(data.thumbnail)) {
            errors.push('Invalid thumbnail URL format');
        }

        if (data.images && data.images.length > 0) {
            data.images.forEach((img, index) => {
                if (!isValidImageUrl(img)) {
                    errors.push(`Invalid image URL format at position ${index + 1}`);
                }
            });
        }

        return errors;
    }
};

// Helper functions
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function isValidImageUrl(url: string): boolean {
    if (!isValidUrl(url)) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
}
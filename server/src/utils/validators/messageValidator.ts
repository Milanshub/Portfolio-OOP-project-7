// src/utils/validators/messageValidator.ts
import { ICreateMessage } from '../../types/entities';
import { stringHelpers } from '../helpers/stringHelpers';

export const messageValidator = {
    validateCreate: (data: ICreateMessage): string[] => {
        const errors: string[] = [];

        if (!data.sender_name?.trim()) {
            errors.push('Sender name is required');
        }

        if (!data.sender_email?.trim()) {
            errors.push('Sender email is required');
        } else if (!stringHelpers.isValidEmail(data.sender_email)) {
            errors.push('Invalid email format');
        }

        if (!data.subject?.trim()) {
            errors.push('Subject is required');
        }

        if (!data.message?.trim()) {
            errors.push('Message content is required');
        }

        return errors;
    }
};
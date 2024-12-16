// src/utils/validators/messageValidator.ts
import { ICreateMessage } from '../../types/entities';
import { stringHelpers } from '../helpers/stringHelpers';

export const messageValidator = {
    validateCreate: (data: ICreateMessage): string[] => {
        const errors: string[] = [];

        if (!data.senderName?.trim()) {
            errors.push('Sender name is required');
        }

        if (!data.senderEmail?.trim()) {
            errors.push('Sender email is required');
        } else if (!stringHelpers.isValidEmail(data.senderEmail)) {
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
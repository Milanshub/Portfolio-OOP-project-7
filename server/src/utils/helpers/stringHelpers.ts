// src/utils/helpers/stringHelpers.ts
import * as crypto from 'crypto';

export const stringHelpers = {
    capitalize: (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    slugify: (str: string): string => {
        return str
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    },

    truncate: (str: string, length: number): string => {
        if (length <= 0) return '...';  // Handle zero or negative length
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
    },

    isValidEmail: (email: string): boolean => {
        // More strict email regex that doesn't allow special characters in local part
        const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9.+]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
        return emailRegex.test(email);
    },

    generateRandomString: (length: number): string => {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    },

    sanitize: (str: string): string => {
        return str.replace(/[&<>"']/g, (match) => {
            const escape: { [key: string]: string } = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escape[match];
        });
    },

    formatPhoneNumber: (phone: string): string => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },

    removeSpecialCharacters: (str: string): string => {
        return str.replace(/[^a-zA-Z0-9 ]/g, '');
    },

    normalizeString: (str: string): string => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    },

    isStrongPassword: (password: string): boolean => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar;
    },

    maskEmail: (email: string): string => {
        const [username, domain] = email.split('@');
        const maskedUsername = username.charAt(0) + 
            '*'.repeat(username.length - 2) + 
            username.charAt(username.length - 1);
        return `${maskedUsername}@${domain}`;
    },

    countWords: (str: string): number => {
        return str.trim().split(/\s+/).length;
    },

    reverseString: (str: string): string => {
        return str.split('').reverse().join('');
    },

    extractNumbers: (str: string): number[] => {
        return str.match(/\d+/g)?.map(Number) || [];
    },

    toTitleCase: (str: string): string => {
        return str.replace(
            /\w\S*/g,
            txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
};
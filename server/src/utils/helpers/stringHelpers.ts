// src/utils/helpers/stringHelpers.ts
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
    }
};
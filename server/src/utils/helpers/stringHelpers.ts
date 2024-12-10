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
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
    },

    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};
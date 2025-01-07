export const stringUtils = {
    capitalize: (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

    getInitials: (name: string): string => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    }
};
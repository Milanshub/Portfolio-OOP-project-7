export const dateHelpers = {
    formatDate: (date: Date): string => {
        return date.toISOString().split('T')[0];
    },

    isValidDate: (date: Date): boolean => {
        return date instanceof Date && !isNaN(date.getTime());
    },

    getDateDifference: (date1: Date, date2: Date): number => {
        return Math.abs(date1.getTime() - date2.getTime());
    },

    addDays: (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
};


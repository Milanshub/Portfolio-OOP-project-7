export const formatUtils = {
    fileSize: (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    },

    proficiencyToText: (level: number): string => {
        const levels: Record<number, string> = {
            1: 'Beginner',
            2: 'Intermediate',
            3: 'Advanced',
            4: 'Expert'
        };
        return levels[level] || 'Unknown';
    },

    truncateText: (text: string, length: number = 100): string => {
        if (text.length <= length) return text;
        return `${text.slice(0, length)}...`;
    }
};
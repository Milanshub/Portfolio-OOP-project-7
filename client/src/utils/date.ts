import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const dateUtils = {
    formatDate: (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
        return dayjs(date).format(format);
    },

    formatDateTime: (date: Date | string): string => {
        return dayjs(date).format('YYYY-MM-DD HH:mm');
    },

    fromNow: (date: Date | string): string => {
        return dayjs(date).fromNow();
    },

    isToday: (date: Date | string): boolean => {
        return dayjs(date).isSame(dayjs(), 'day');
    },

    isFuture: (date: Date | string): boolean => {
        return dayjs(date).isAfter(dayjs());
    },

    getDuration: (startDate: Date | string, endDate: Date | string): string => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const months = end.diff(start, 'month');
        return months < 12 
            ? `${months} months` 
            : `${Math.floor(months / 12)} years`;
    }
};
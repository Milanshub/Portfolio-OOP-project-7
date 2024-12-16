// tests/utils/helpers/dateHelpers.test.ts
import { dateHelpers } from '../../../src/utils/helpers/dateHelpers';

describe('dateHelpers', () => {
    describe('formatDate', () => {
        it('should format date to YYYY-MM-DD', () => {
            const date = new Date('2023-12-25T10:30:00Z');
            expect(dateHelpers.formatDate(date)).toBe('2023-12-25');
        });

        it('should handle single digit months and days', () => {
            const date = new Date('2023-05-05T10:30:00Z');
            expect(dateHelpers.formatDate(date)).toBe('2023-05-05');
        });

        it('should handle year boundaries', () => {
            const date = new Date('2023-12-31T23:59:59Z');
            expect(dateHelpers.formatDate(date)).toBe('2023-12-31');
            
            const newYear = new Date('2024-01-01T00:00:00Z');
            expect(dateHelpers.formatDate(newYear)).toBe('2024-01-01');
        });
    });

    describe('isValidDate', () => {
        it('should return true for valid dates', () => {
            const validDate = new Date('2023-12-25');
            expect(dateHelpers.isValidDate(validDate)).toBe(true);
        });

        it('should return false for invalid dates', () => {
            const invalidDate = new Date('invalid');
            expect(dateHelpers.isValidDate(invalidDate)).toBe(false);
        });

        it('should handle edge cases', () => {
            // Testing with current date
            expect(dateHelpers.isValidDate(new Date())).toBe(true);
            
            // Testing with timestamp
            expect(dateHelpers.isValidDate(new Date(1672531200000))).toBe(true); // 2023-01-01
            
            // Testing with invalid timestamp
            expect(dateHelpers.isValidDate(new Date(NaN))).toBe(false);
        });
    });

    describe('getDateDifference', () => {
        it('should calculate difference between two dates in milliseconds', () => {
            const date1 = new Date('2023-12-25T00:00:00Z');
            const date2 = new Date('2023-12-26T00:00:00Z');
            const oneDayInMs = 24 * 60 * 60 * 1000;
            
            expect(dateHelpers.getDateDifference(date1, date2)).toBe(oneDayInMs);
        });

        it('should return positive difference regardless of date order', () => {
            const date1 = new Date('2023-12-25T00:00:00Z');
            const date2 = new Date('2023-12-26T00:00:00Z');
            const difference = dateHelpers.getDateDifference(date1, date2);
            
            expect(dateHelpers.getDateDifference(date2, date1)).toBe(difference);
        });

        it('should handle same dates', () => {
            const date = new Date('2023-12-25T00:00:00Z');
            expect(dateHelpers.getDateDifference(date, date)).toBe(0);
        });
    });

    describe('addDays', () => {
        it('should add positive days correctly', () => {
            const startDate = new Date('2023-12-25');
            const result = dateHelpers.addDays(startDate, 5);
            expect(dateHelpers.formatDate(result)).toBe('2023-12-30');
        });

        it('should handle negative days correctly', () => {
            const startDate = new Date('2023-12-25');
            const result = dateHelpers.addDays(startDate, -5);
            expect(dateHelpers.formatDate(result)).toBe('2023-12-20');
        });

        it('should handle month/year boundaries', () => {
            // Month boundary
            const monthEnd = new Date('2023-12-31');
            expect(dateHelpers.formatDate(dateHelpers.addDays(monthEnd, 1)))
                .toBe('2024-01-01');

            // Year boundary
            const yearEnd = new Date('2023-12-31');
            expect(dateHelpers.formatDate(dateHelpers.addDays(yearEnd, 1)))
                .toBe('2024-01-01');
        });

        it('should not modify original date', () => {
            const originalDate = new Date('2023-12-25');
            const originalDateString = originalDate.toISOString();
            
            dateHelpers.addDays(originalDate, 5);
            
            expect(originalDate.toISOString()).toBe(originalDateString);
        });

        it('should handle zero days', () => {
            const date = new Date('2023-12-25');
            const result = dateHelpers.addDays(date, 0);
            expect(dateHelpers.formatDate(result)).toBe('2023-12-25');
        });
    });
});
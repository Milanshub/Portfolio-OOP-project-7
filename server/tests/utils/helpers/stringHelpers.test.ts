import { stringHelpers } from '../../../src/utils/helpers/stringHelpers';

describe('stringHelpers', () => {
    // ... other tests remain the same ...

    describe('truncate', () => {
        it('should truncate string longer than specified length', () => {
            expect(stringHelpers.truncate('hello world', 5)).toBe('hello...');
        });

        it('should not truncate string shorter than specified length', () => {
            expect(stringHelpers.truncate('hello', 10)).toBe('hello');
        });

        it('should handle string equal to specified length', () => {
            expect(stringHelpers.truncate('hello', 5)).toBe('hello');
        });

        it('should handle empty string', () => {
            expect(stringHelpers.truncate('', 5)).toBe('');
        });

        it('should handle zero length', () => {
            expect(stringHelpers.truncate('hello', 0)).toBe('...');
        });

        it('should handle negative length', () => {
            expect(stringHelpers.truncate('hello', -1)).toBe('...');
        });
    });

    describe('isValidEmail', () => {
        it('should validate correct email formats', () => {
            expect(stringHelpers.isValidEmail('test@example.com')).toBe(true);
            expect(stringHelpers.isValidEmail('user.name@domain.com')).toBe(true);
            expect(stringHelpers.isValidEmail('user+tag@domain.com')).toBe(true);
        });

        it('should reject invalid email formats', () => {
            expect(stringHelpers.isValidEmail('invalid')).toBe(false);
            expect(stringHelpers.isValidEmail('invalid@')).toBe(false);
            expect(stringHelpers.isValidEmail('@domain.com')).toBe(false);
            expect(stringHelpers.isValidEmail('user@.com')).toBe(false);
            expect(stringHelpers.isValidEmail('user@domain')).toBe(false);
        });

        it('should handle empty string', () => {
            expect(stringHelpers.isValidEmail('')).toBe(false);
        });

        it('should reject strings with spaces', () => {
            expect(stringHelpers.isValidEmail('user @domain.com')).toBe(false);
            expect(stringHelpers.isValidEmail('user@ domain.com')).toBe(false);
        });

        it('should handle special characters correctly', () => {
            // Valid email formats
            expect(stringHelpers.isValidEmail('user.name@domain-test.co.uk')).toBe(true);
            expect(stringHelpers.isValidEmail('user+tag@domain.com')).toBe(true);
            
            // Invalid email formats with special characters
            expect(stringHelpers.isValidEmail('user!@domain.com')).toBe(false);
            expect(stringHelpers.isValidEmail('user#$%@domain.com')).toBe(false);
        });
    });
});
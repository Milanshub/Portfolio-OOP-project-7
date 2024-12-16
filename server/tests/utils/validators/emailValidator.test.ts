// tests/utils/validators/emailValidator.test.ts
import { emailValidator } from '../../../src/utils/validators/emailValidator';

describe.skip('emailValidator', () => {
    describe('isValidEmail', () => {
        it('should validate correct email formats', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.com',
                'user+label@domain.com',
                'user123@domain.co.uk',
                'first.last@subdomain.domain.com'
            ];

            validEmails.forEach(email => {
                expect(emailValidator.isValidEmail(email)).toBe(true);
            });
        });

        it('should reject invalid email formats', () => {
            const invalidEmails = [
                'invalid-email',
                '@domain.com',
                'user@',
                'user@.',
                'user@domain',
                'user.@domain.com',
                '.user@domain.com',
                'user@domain..com',
                'user name@domain.com',
                'user@domain.com.',
                '@'
            ];

            invalidEmails.forEach(email => {
                expect(emailValidator.isValidEmail(email)).toBe(false);
            });
        });

        it('should handle empty string', () => {
            expect(emailValidator.isValidEmail('')).toBe(false);
        });

        it('should handle whitespace-only string', () => {
            expect(emailValidator.isValidEmail('   ')).toBe(false);
        });

        it('should handle null and undefined', () => {
            expect(emailValidator.isValidEmail(null as unknown as string)).toBe(false);
            expect(emailValidator.isValidEmail(undefined as unknown as string)).toBe(false);
        });

        it('should reject emails with special characters in local part', () => {
            const invalidEmails = [
                '"user"@domain.com',
                'user(comment)@domain.com',
                'user<script>@domain.com',
                'user\\@domain.com'
            ];

            invalidEmails.forEach(email => {
                expect(emailValidator.isValidEmail(email)).toBe(false);
            });
        });

        it('should validate emails with numbers', () => {
            const validEmails = [
                'user123@domain.com',
                '123user@domain.com',
                'user@123domain.com'
            ];

            validEmails.forEach(email => {
                expect(emailValidator.isValidEmail(email)).toBe(true);
            });
        });

        it('should validate emails with hyphens and underscores', () => {
            const validEmails = [
                'user-name@domain.com',
                'user_name@domain.com',
                'user@domain-name.com'
            ];

            validEmails.forEach(email => {
                expect(emailValidator.isValidEmail(email)).toBe(true);
            });
        });
    });
});
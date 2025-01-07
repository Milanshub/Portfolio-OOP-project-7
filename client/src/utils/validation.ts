// Simple frontend validations for quick checks
// For form validations, use the Zod schemas from @lib/utils/validation.ts
export const validationUtils = {
    // Quick email check (for instant feedback)
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Quick URL check
    isValidUrl: (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // Quick file validation
    isValidImageFile: (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        return validTypes.includes(file.type) && file.size <= maxSize;
    },

    // Quick password strength check
    isStrongPassword: (password: string): boolean => {
        return password.length >= 8 && 
               /[A-Z]/.test(password) && // Has uppercase
               /[a-z]/.test(password) && // Has lowercase
               /[0-9]/.test(password) && // Has number
               /[^A-Za-z0-9]/.test(password); // Has special char
    }
};
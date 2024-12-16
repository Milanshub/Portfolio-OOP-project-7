export const emailValidator = {
    isValidEmail: (email: string): boolean => {
        if (!email || typeof email !== 'string') return false;

        // Updated regex to allow more valid email formats
        const emailRegex = /^[a-zA-Z0-9][-+.a-zA-Z0-9]*[a-zA-Z0-9]@[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        
        return emailRegex.test(email.trim());
    }
};
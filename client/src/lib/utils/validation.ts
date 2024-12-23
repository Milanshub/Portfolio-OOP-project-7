export const validationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9][-+.a-zA-Z0-9]*[a-zA-Z0-9]@[a-zA-Z0-9][-a-zA-Z0-9.]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  },

  isValidPassword: (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone.trim());
  },

  validateRequired: (value: any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  validateLength: (value: string, min: number, max: number): boolean => {
    const length = value.trim().length;
    return length >= min && length <= max;
  },

  validateFileSize: (file: File, maxSizeMB: number): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },

  validateFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  }
}; 
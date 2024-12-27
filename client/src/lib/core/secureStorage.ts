import { AES, enc } from 'crypto-js';
import { env } from '@/lib/config/env';

// ===== SECURE STORAGE =====
// This file contains the secure storage for our application
// It includes the SecureStorage class and the setItem, getItem, removeItem, and clear methods
// The setItem method is used to store data in the secure storage
// The getItem method is used to retrieve data from the secure storage
// The removeItem method is used to remove data from the secure storage
// The clear method is used to clear all data from the secure storage

const ENCRYPTION_KEY = env.NEXT_PUBLIC_STORAGE_KEY;

export class SecureStorage {
  private static prefix = 'secure_';

  static setItem(key: string, value: any): void {
    try {
      const encryptedValue = AES.encrypt(
        JSON.stringify(value),
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(this.prefix + key, encryptedValue);
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw new Error('Failed to securely store data');
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(this.prefix + key);
      if (!encryptedValue) return null;

      const decryptedBytes = AES.decrypt(encryptedValue, ENCRYPTION_KEY);
      const decryptedValue = decryptedBytes.toString(enc.Utf8);
      
      if (!decryptedValue) return null;
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  static clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
} 
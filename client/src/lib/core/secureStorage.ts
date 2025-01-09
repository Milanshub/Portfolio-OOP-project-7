import { config } from '@/config/env';
import { logger } from '@/config/logger';
import CryptoJS from 'crypto-js';

// SecureStorage is a class that provides a way to store and retrieve data in a secure manner using AES encryption.
export class SecureStorage {
  private static encryptionKey = config.storage.key;

  static setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      const encryptedValue = CryptoJS.AES.encrypt(
        serializedValue,
        this.encryptionKey
      ).toString();
      
      localStorage.setItem(key, encryptedValue);
      logger.debug(`SecureStorage: Item encrypted and stored - ${key}`);
    } catch (error) {
      logger.error('SecureStorage: Failed to set item', error as Error);
      throw error;
    }
  }

  static getItem<T>(key: string): T | null {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = CryptoJS.AES.decrypt(
        encryptedValue,
        this.encryptionKey
      ).toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(decryptedValue) as T;
    } catch (error) {
      logger.error('SecureStorage: Failed to get item', error as Error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
      logger.debug(`SecureStorage: Item removed - ${key}`);
    } catch (error) {
      logger.error('SecureStorage: Failed to remove item', error as Error);
      throw error;
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
      logger.debug('SecureStorage: Storage cleared');
    } catch (error) {
      logger.error('SecureStorage: Failed to clear storage', error as Error);
      throw error;
    }
  }
}
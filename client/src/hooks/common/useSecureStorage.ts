import { useState, useEffect } from 'react';
import { SecureStorage } from '@/lib/core/secureStorage';

export function useSecureStorage<T>(key: string, initialValue: T) {
  // Get stored value on hook initialization
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      return SecureStorage.getItem<T>(key) ?? initialValue;
    } catch (error) {
      console.error('Error reading from SecureStorage:', error);
      return initialValue;
    }
  });

  // Update SecureStorage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Handle both direct values and updater functions
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to SecureStorage
      SecureStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error saving to SecureStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}
import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Custom hook for synchronizing state with LocalStorage
 * @param {string} key
 * @param {*} initialValue
 * @returns {[*, Function]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return getStorageItem(key, initialValue);
  });

  useEffect(() => {
    setStorageItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

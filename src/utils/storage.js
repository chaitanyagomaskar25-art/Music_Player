/**
 * Helper to safely retrieve items from LocalStorage
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
export function getStorageItem(key, defaultValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Helper to safely set items to LocalStorage
 * @param {string} key
 * @param {*} value
 */
export function setStorageItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage key "${key}":`, error);
  }
}

/**
 * Helper to remove items from LocalStorage
 * @param {string} key
 */
export function removeStorageItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}

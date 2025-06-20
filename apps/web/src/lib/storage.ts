import { getCookie } from './getCookie';
import { setCookie } from './setCookie';

const STORAGE_KEY = 'preferences';
const STORAGE_PERIOD_IN_DAYS = 30;

interface BaseProvider {
  removeItem: (name: string) => void;
}

interface StorageProvider extends BaseProvider {
  getItem: Storage['getItem'];
  setItem: Storage['setItem'];
}

interface CookieStorageProvider extends BaseProvider {
  getItem: typeof getCookie;
  setItem: (name: string, value: string, exdays?: number) => void;
}

const isWebStorageAvailable = (storage: Storage) => {
  try {
    storage.setItem(STORAGE_KEY, STORAGE_KEY);
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};

export const areDocumentCookiesAvailable = () => {
  // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking
  // configurations.

  try {
    // Create cookie
    if (getCookie(STORAGE_KEY) === undefined) {
      setCookie(STORAGE_KEY, STORAGE_KEY, 1);
      const cookieHasBeenWritten = getCookie(STORAGE_KEY) !== undefined;

      // Delete cookie
      setCookie(STORAGE_KEY, '', -1);

      return cookieHasBeenWritten;
    }

    return true;
  } catch {
    return false;
  }
};

const cookieProvider: CookieStorageProvider = {
  getItem: (name: string) => {
    const value = getCookie(name);
    return value ? decodeURIComponent(value) : '';
  },
  setItem: (name: string, value: string, expirationInDays: number = STORAGE_PERIOD_IN_DAYS) => {
    setCookie(name, encodeURIComponent(value), expirationInDays);
  },
  removeItem: (name: string) => setCookie(name, '', -1),
};

const unavailableProvider: StorageProvider = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const getStorageProvider = (): CookieStorageProvider | StorageProvider => {
  if (areDocumentCookiesAvailable()) {
    return cookieProvider;
  }

  try {
    if (isWebStorageAvailable(global.localStorage)) {
      return localStorage;
    }

    // Least ideal situation; data is not persisted between sessions, but at least for as long as
    // a visitor has the tab open
    if (isWebStorageAvailable(global.sessionStorage)) {
      return sessionStorage;
    }
  } catch {
    // no-op
  }

  // In case a visitor uses a browser in which all storage options are disabled, return a moot
  // provider so that code calling the provider can still function without throwing errors.
  return unavailableProvider;
};

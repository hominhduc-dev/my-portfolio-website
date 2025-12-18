import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '@/lib/storage';

export function isAuthenticated(): boolean {
  return getStorageItem(STORAGE_KEYS.AUTH, false);
}

export function login(): void {
  setStorageItem(STORAGE_KEYS.AUTH, true);
}

export function logout(): void {
  removeStorageItem(STORAGE_KEYS.AUTH);
}

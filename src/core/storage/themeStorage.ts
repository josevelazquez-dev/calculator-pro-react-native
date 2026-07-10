import { createMMKV } from 'react-native-mmkv';

export type ThemePreference = 'light' | 'dark' | 'auto';

const STORAGE_KEY = '@calculator/theme';

const storage = createMMKV({ id: 'calculator-theme' });

export function loadThemePreference(): ThemePreference {
  try {
    const raw = storage.getString(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'auto') return raw;
    return 'auto';
  } catch {
    return 'auto';
  }
}

export function saveThemePreference(preference: ThemePreference): void {
  try {
    storage.set(STORAGE_KEY, preference);
  } catch {
    // Silently fail — theme is non-critical
  }
}

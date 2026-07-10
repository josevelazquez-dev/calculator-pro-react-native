import { createMMKV } from 'react-native-mmkv';

export type Language = 'es' | 'en';

const STORAGE_KEY = '@calculator/language';

const storage = createMMKV({ id: 'calculator-language' });

export function loadLanguage(): Language {
  try {
    const raw = storage.getString(STORAGE_KEY);
    if (raw === 'es' || raw === 'en') return raw;
    return 'es';
  } catch {
    return 'es';
  }
}

export function saveLanguage(language: Language): void {
  try {
    storage.set(STORAGE_KEY, language);
  } catch {
    // Silently fail
  }
}

import { createMMKV } from 'react-native-mmkv';
import type { CalculationEntry } from '@/domain/entities';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '@/core/constants';

export const storage = createMMKV({
  id: 'calculator-pro-storage',
});

export class HistoryLocalDataSource {
  getHistory(): CalculationEntry[] {
    const raw = storage.getString(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw) as CalculationEntry[];
  }

  saveHistory(entries: CalculationEntry[]): void {
    const trimmed = entries.slice(0, MAX_HISTORY_ITEMS);
    storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
  }

  clearHistory(): void {
    storage.remove(STORAGE_KEYS.HISTORY);
  }
}

export class SettingsLocalDataSource {
  getTheme(): 'light' | 'dark' | 'system' {
    return (storage.getString(STORAGE_KEYS.THEME) as 'light' | 'dark' | 'system') ?? 'system';
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    storage.set(STORAGE_KEYS.THEME, theme);
  }

  getHapticFeedback(): boolean {
    return storage.getBoolean(STORAGE_KEYS.SETTINGS) ?? true;
  }

  setHapticFeedback(enabled: boolean): void {
    storage.set(STORAGE_KEYS.SETTINGS, enabled);
  }
}

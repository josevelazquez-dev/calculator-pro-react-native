import { createMMKV } from 'react-native-mmkv';
import type { CalculationEntry } from '@/domain/entities';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '@/core/constants';

export const storage = createMMKV({
  id: 'calculator-pro-storage',
});

export class HistoryLocalDataSource {
  getHistory(): CalculationEntry[] {
    try {
      const raw = storage.getString(STORAGE_KEYS.HISTORY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as CalculationEntry[];
    } catch {
      return [];
    }
  }

  saveHistory(entries: CalculationEntry[]): void {
    try {
      const trimmed = entries.slice(0, MAX_HISTORY_ITEMS);
      storage.set(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
    } catch {
      // Silently fail
    }
  }

  clearHistory(): void {
    try {
      storage.remove(STORAGE_KEYS.HISTORY);
    } catch {
      // Silently fail
    }
  }
}

export class SettingsLocalDataSource {
  getTheme(): 'light' | 'dark' | 'system' {
    try {
      const raw = storage.getString(STORAGE_KEYS.THEME);
      if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
      return 'system';
    } catch {
      return 'system';
    }
  }

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    try {
      storage.set(STORAGE_KEYS.THEME, theme);
    } catch {
      // Silently fail
    }
  }

  getHapticFeedback(): boolean {
    try {
      return storage.getBoolean(STORAGE_KEYS.SETTINGS) ?? true;
    } catch {
      return true;
    }
  }

  setHapticFeedback(enabled: boolean): void {
    try {
      storage.set(STORAGE_KEYS.SETTINGS, enabled);
    } catch {
      // Silently fail
    }
  }
}

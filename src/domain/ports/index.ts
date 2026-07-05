import type { CalculationEntry } from '@/domain/entities';

export interface HistoryRepository {
  getHistory(): Promise<CalculationEntry[]>;
  addEntry(entry: CalculationEntry): Promise<void>;
  clearHistory(): Promise<void>;
  deleteEntry(id: string): Promise<void>;
}

export interface SettingsRepository {
  getTheme(): Promise<'light' | 'dark' | 'system'>;
  setTheme(theme: 'light' | 'dark' | 'system'): Promise<void>;
  getHapticFeedback(): Promise<boolean>;
  setHapticFeedback(enabled: boolean): Promise<void>;
}

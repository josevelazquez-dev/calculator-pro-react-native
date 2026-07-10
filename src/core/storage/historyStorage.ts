import { createMMKV } from 'react-native-mmkv';
import type { CalculationEntry } from '@/domain/entities';

const STORAGE_KEY = '@calculator/history';

const storage = createMMKV({ id: 'calculator-history' });

export function loadHistory(): CalculationEntry[] {
  try {
    const raw = storage.getString(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CalculationEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: CalculationEntry[]): void {
  try {
    storage.set(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Silently fail — history is non-critical
  }
}

export function clearStoredHistory(): void {
  try {
    storage.remove(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

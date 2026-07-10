import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import type { CalculationEntry } from '@/domain/entities';
import { loadHistory, saveHistory, clearStoredHistory } from '@/core/storage/historyStorage';

interface HistoryContextValue {
  entries: CalculationEntry[];
  addEntry: (expression: string, result: string) => void;
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  refresh: () => void;
  loadResult: (value: string) => void;
  consumePendingLoad: () => string | null;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<CalculationEntry[]>(loadHistory);
  const pendingLoadRef = useRef<string | null>(null);

  const MAX_HISTORY_LENGTH = 500;

  const addEntry = useCallback((expression: string, result: string) => {
    setEntries((prev) => {
      if (prev.length > 0) {
        const last = prev[0];
        if (last.expression === expression && last.result === result) {
          return prev;
        }
      }
      const next: CalculationEntry[] = [
        {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          expression: expression.slice(0, MAX_HISTORY_LENGTH),
          result: result.slice(0, MAX_HISTORY_LENGTH),
          timestamp: Date.now(),
        },
        ...prev,
      ];
      return next;
    });
  }, []);

  useEffect(() => {
    saveHistory(entries);
  }, [entries]);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    clearStoredHistory();
  }, []);

  const refresh = useCallback(() => {
    setEntries(loadHistory());
  }, []);

  const loadResult = useCallback((value: string) => {
    pendingLoadRef.current = value;
  }, []);

  const consumePendingLoad = useCallback(() => {
    const value = pendingLoadRef.current;
    pendingLoadRef.current = null;
    return value;
  }, []);

  const value = useMemo(
    () => ({
      entries,
      addEntry,
      removeEntry,
      clearHistory,
      refresh,
      loadResult,
      consumePendingLoad,
    }),
    [entries, addEntry, removeEntry, clearHistory, refresh, loadResult, consumePendingLoad],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
}

import { loadHistory, saveHistory, clearStoredHistory } from '@/core/storage/historyStorage';
import type { CalculationEntry } from '@/domain/entities';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  let store: Record<string, string> = {};
  return {
    createMMKV: jest.fn(() => ({
      getString: jest.fn((key: string) => store[key] ?? null),
      set: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      remove: jest.fn((key: string) => {
        delete store[key];
      }),
      clearAll: jest.fn(() => {
        store = {};
      }),
      getAllKeys: jest.fn(() => Object.keys(store)),
    })),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  // Reset the module to clear the store between tests
  jest.resetModules();
});

describe('historyStorage', () => {
  it('loadHistory returns empty array when no data', () => {
    const entries = loadHistory();
    expect(entries).toEqual([]);
  });

  it('saveHistory and loadHistory roundtrip', () => {
    const entry: CalculationEntry = {
      id: 'test1',
      expression: '2 + 2',
      result: '4',
      timestamp: 1000,
    };
    saveHistory([entry]);
    const loaded = loadHistory();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].expression).toBe('2 + 2');
    expect(loaded[0].result).toBe('4');
  });

  it('clearStoredHistory removes all entries', () => {
    const entry: CalculationEntry = {
      id: 'test2',
      expression: '3 * 3',
      result: '9',
      timestamp: 2000,
    };
    saveHistory([entry]);
    clearStoredHistory();
    const loaded = loadHistory();
    expect(loaded).toEqual([]);
  });

  it('loadHistory returns empty array for corrupted data', () => {
    const entry: CalculationEntry = {
      id: 'test1',
      expression: '2 + 2',
      result: '4',
      timestamp: 1000,
    };
    saveHistory([entry]);
    const spy = jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      throw new Error('Corrupt');
    });
    const loaded = loadHistory();
    expect(loaded).toEqual([]);
    spy.mockRestore();
  });

  it('handles multiple entries', () => {
    const entries: CalculationEntry[] = [
      { id: '1', expression: '1+1', result: '2', timestamp: 1 },
      { id: '2', expression: '2+2', result: '4', timestamp: 2 },
    ];
    saveHistory(entries);
    const loaded = loadHistory();
    expect(loaded).toHaveLength(2);
    expect(loaded[0].id).toBe('1');
    expect(loaded[1].id).toBe('2');
  });
});

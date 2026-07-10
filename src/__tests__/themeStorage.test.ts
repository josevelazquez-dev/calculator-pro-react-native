import { loadThemePreference, saveThemePreference } from '@/core/storage/themeStorage';

jest.mock('react-native-mmkv', () => {
  let store: Record<string, string> = {};
  return {
    createMMKV: jest.fn(() => ({
      getString: jest.fn((key: string) => store[key] ?? null),
      set: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clearAll: jest.fn(() => {
        store = {};
      }),
    })),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('themeStorage', () => {
  it('loadThemePreference returns auto by default', () => {
    expect(loadThemePreference()).toBe('auto');
  });

  it('saveThemePreference and loadThemePreference roundtrip for dark', () => {
    saveThemePreference('dark');
    expect(loadThemePreference()).toBe('dark');
  });

  it('saveThemePreference and loadThemePreference roundtrip for light', () => {
    saveThemePreference('light');
    expect(loadThemePreference()).toBe('light');
  });

  it('saveThemePreference and loadThemePreference roundtrip for auto', () => {
    saveThemePreference('auto');
    expect(loadThemePreference()).toBe('auto');
  });

  it('loadThemePreference returns auto for invalid stored value', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mmkv = require('react-native-mmkv');
    const mockStorage = mmkv.createMMKV({ id: 'calculator-theme' });
    mockStorage.set('@calculator/theme', 'invalid_value');
    expect(loadThemePreference()).toBe('auto');
  });
});

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { colors, type ThemeColors } from '@/core/theme';
import {
  loadThemePreference,
  saveThemePreference,
  type ThemePreference,
} from '@/core/storage/themeStorage';

interface ThemeContextValue {
  preference: ThemePreference;
  theme: 'light' | 'dark';
  colors: ThemeColors;
  isDark: boolean;
  setPreference: (preference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(loadThemePreference);
  const systemScheme = useColorScheme();

  const systemIsDark = systemScheme === 'dark';

  const resolvedTheme: 'light' | 'dark' =
    preference === 'auto' ? (systemIsDark ? 'dark' : 'light') : preference;

  const setPreference = useCallback((newPreference: ThemePreference) => {
    setPreferenceState(newPreference);
    saveThemePreference(newPreference);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      theme: resolvedTheme,
      colors: colors[resolvedTheme] as ThemeColors,
      isDark: resolvedTheme === 'dark',
      setPreference,
    }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

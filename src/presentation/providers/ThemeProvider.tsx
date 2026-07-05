import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { colors, type ThemeColors } from '@/core/theme';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const theme = mode ?? systemScheme ?? 'dark';

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: colors[theme] as ThemeColors,
      isDark: theme === 'dark',
      toggleTheme: () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

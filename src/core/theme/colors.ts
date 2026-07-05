export const colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F7',
    primary: '#007AFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    display: '#1C1C1E',
    button: '#E5E5EA',
    buttonOperator: '#FF9F0A',
    buttonText: '#FFFFFF',
  },
  dark: {
    background: '#0A0A0F',
    surface: '#1C1C1E',
    primary: '#0A84FF',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
    display: '#000000',
    button: '#2C2C2E',
    buttonOperator: '#FF9F0A',
    buttonText: '#FFFFFF',
  },
} as const;

export type ThemeColors = typeof colors.light;

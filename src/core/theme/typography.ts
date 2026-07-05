import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'SF Pro',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  display: {
    fontSize: 48,
    fontWeight: '300' as const,
    fontFamily,
    lineHeight: 56,
  },
  displaySmall: {
    fontSize: 32,
    fontWeight: '300' as const,
    fontFamily,
    lineHeight: 40,
  },
  button: {
    fontSize: 24,
    fontWeight: '500' as const,
    fontFamily,
    lineHeight: 32,
  },
  buttonSmall: {
    fontSize: 18,
    fontWeight: '500' as const,
    fontFamily,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily,
    lineHeight: 16,
  },
} as const;

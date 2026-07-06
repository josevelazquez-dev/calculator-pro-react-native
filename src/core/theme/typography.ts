import { Platform, PixelRatio } from 'react-native';

const fontFamily = Platform.select({
  ios: undefined,
  android: 'System',
  default: 'System',
});

const scale = PixelRatio.getFontScale();

export const typography = {
  largeTitle: {
    fontSize: 64 / scale,
    fontWeight: '200' as const,
    fontFamily,
    lineHeight: 72 / scale,
    letterSpacing: -1.5,
  },
  display: {
    fontSize: 48 / scale,
    fontWeight: '200' as const,
    fontFamily,
    lineHeight: 56 / scale,
    letterSpacing: -0.5,
  },
  displaySmall: {
    fontSize: 32 / scale,
    fontWeight: '300' as const,
    fontFamily,
    lineHeight: 38 / scale,
  },
  title: {
    fontSize: 22 / scale,
    fontWeight: '500' as const,
    fontFamily,
    lineHeight: 28 / scale,
  },
  buttonLarge: {
    fontSize: 28 / scale,
    fontWeight: '400' as const,
    fontFamily,
    lineHeight: 34 / scale,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 22 / scale,
    fontWeight: '400' as const,
    fontFamily,
    lineHeight: 28 / scale,
    letterSpacing: 0.25,
  },
  buttonSmall: {
    fontSize: 16 / scale,
    fontWeight: '500' as const,
    fontFamily,
    lineHeight: 20 / scale,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 16 / scale,
    fontWeight: '400' as const,
    fontFamily,
    lineHeight: 22 / scale,
  },
  caption: {
    fontSize: 12 / scale,
    fontWeight: '400' as const,
    fontFamily,
    lineHeight: 16 / scale,
    letterSpacing: 0.15,
  },
  overline: {
    fontSize: 10 / scale,
    fontWeight: '600' as const,
    fontFamily,
    lineHeight: 12 / scale,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

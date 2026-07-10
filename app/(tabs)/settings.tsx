import { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Share, Linking, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Constants from 'expo-constants';
import { ScreenLayout } from '@/presentation/templates';
import { useTheme, useLanguage } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { spacing, borderRadius } from '@/core/theme';
import type { ThemePreference } from '@/core/storage/themeStorage';
import type { Language } from '@/core/storage/languageStorage';

const themeOptions: { value: ThemePreference; labelKey: string }[] = [
  { value: 'light', labelKey: 'settings.light' },
  { value: 'dark', labelKey: 'settings.dark' },
  { value: 'auto', labelKey: 'settings.auto' },
];

const languageOptions: { value: Language; label: string }[] = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
];

const GITHUB_URL = 'https://github.com/josevelazquez-dev';
const LINKEDIN_URL = 'https://www.linkedin.com/in/josevelazquezdev';
const PORTFOLIO_URL = 'https://portafolio-web-kappa-two.vercel.app/';
const PRIVACY_URL = 'https://github.com/josevelazquez-dev/calculator-pro/privacy';
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function SettingsScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: t('settings.shareMessage'),
        url: 'https://github.com/josevelazquez-dev/calculator-pro',
      });
    } catch {
      // User cancelled or share failed
    }
  }, [t]);

  const handleRate = useCallback(() => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id0000000000'
        : 'https://play.google.com/store/apps/details?id=com.josevelazquez.calculatorpro';
    Linking.openURL(url).catch(() => {});
  }, []);

  const handlePrivacy = useCallback(() => {
    Linking.openURL(PRIVACY_URL).catch(() => {});
  }, []);

  const handleLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  const content = (
    <View style={[styles.container, isWide && styles.containerWide]}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>

      <Animated.View
        entering={FadeIn.duration(300).springify()}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.themeSection')}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {t('settings.themeDescription')}
        </Text>
        <View style={styles.segmentedRow}>
          {themeOptions.map((option, index) => {
            const isActive = preference === option.value;
            const isLeft = index === 0;
            const isRight = index === themeOptions.length - 1;
            return (
              <Pressable
                key={option.value}
                onPress={() => setPreference(option.value)}
                style={[
                  styles.segment,
                  isLeft && styles.segmentLeft,
                  isRight && styles.segmentRight,
                  { borderColor: colors.border },
                  isActive && { backgroundColor: colors.primary },
                  !isActive && { backgroundColor: 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    isActive ? { color: '#FFFFFF', fontWeight: '700' } : { color: colors.text },
                  ]}
                >
                  {t(option.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(350).springify()}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.languageSection')}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {t('settings.languageDescription')}
        </Text>
        <View style={styles.segmentedRow}>
          {languageOptions.map((option, index) => {
            const isActive = language === option.value;
            const isLeft = index === 0;
            const isRight = index === languageOptions.length - 1;
            return (
              <Pressable
                key={option.value}
                onPress={() => setLanguage(option.value)}
                style={[
                  styles.segment,
                  isLeft && styles.segmentLeft,
                  isRight && styles.segmentRight,
                  { borderColor: colors.border },
                  isActive && { backgroundColor: colors.primary },
                  !isActive && { backgroundColor: 'transparent' },
                ]}
              >
                <Text
                  style={[
                    styles.segmentLabel,
                    isActive ? { color: '#FFFFFF', fontWeight: '700' } : { color: colors.text },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(400).springify()}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rowLabel, { color: colors.textTertiary }]}>v{APP_VERSION}</Text>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('settings.version')}</Text>
          </View>
        </View>

        <View style={[styles.separator, { backgroundColor: colors.separator }]} />

        <Pressable style={styles.row} onPress={handleShare}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('settings.shareApp')}</Text>
          </View>
          <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
        </Pressable>

        <View style={[styles.separator, { backgroundColor: colors.separator }]} />

        <Pressable style={styles.row} onPress={handleRate}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('settings.rateApp')}</Text>
          </View>
          <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
        </Pressable>

        <View style={[styles.separator, { backgroundColor: colors.separator }]} />

        <Pressable style={styles.row} onPress={handlePrivacy}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>{t('settings.privacyPolicy')}</Text>
          </View>
          <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        entering={FadeIn.duration(450).springify()}
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.aboutSection')}</Text>

        <View style={styles.aboutContent}>
          <Text style={[styles.developedBy, { color: colors.textSecondary }]}>
            {t('settings.developedBy')}
          </Text>
          <Text style={[styles.devName, { color: colors.text }]}>José Velázquez</Text>
        </View>

        <View style={styles.socialRow}>
          <Pressable
            style={[styles.socialBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
            onPress={() => handleLink(GITHUB_URL)}
          >
            <Text style={[styles.socialBtnText, { color: colors.text }]}>GitHub</Text>
          </Pressable>
          <Pressable
            style={[styles.socialBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
            onPress={() => handleLink(LINKEDIN_URL)}
          >
            <Text style={[styles.socialBtnText, { color: colors.text }]}>LinkedIn</Text>
          </Pressable>
          <Pressable
            style={[styles.socialBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => handleLink(PORTFOLIO_URL)}
          >
            <Text style={[styles.socialBtnTextPrimary, { color: '#FFFFFF' }]}>Portfolio</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.xxxl,
  },
  containerWide: {
    padding: spacing.huge,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: spacing.xxxl,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: spacing.xxs,
    marginBottom: spacing.lg,
  },
  segmentedRow: {
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderRightWidth: 0,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLeft: {
    borderTopLeftRadius: borderRadius.lg,
    borderBottomLeftRadius: borderRadius.lg,
  },
  segmentRight: {
    borderTopRightRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    borderRightWidth: 1,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
  },
  rowLeft: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: spacing.md,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.sm,
  },
  aboutContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  developedBy: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: spacing.xxs,
  },
  devName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  socialBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  socialBtnTextPrimary: {
    fontSize: 13,
    fontWeight: '700',
  },
});

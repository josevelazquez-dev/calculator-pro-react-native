import { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ScreenLayout } from '@/presentation/templates';
import { useTheme, useHistory } from '@/presentation/providers';
import { useResponsive } from '@/core/hooks';
import { spacing, borderRadius } from '@/core/theme';
import type { CalculationEntry } from '@/domain/entities';

const keyExtractor = (item: CalculationEntry) => item.id;

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { entries, removeEntry, clearHistory, refresh, loadResult } = useHistory();
  const { isDesktop, isTablet } = useResponsive();
  const isWide = isDesktop || isTablet;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const handleCopy = useCallback(async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch {
      // Clipboard not available
    }
  }, []);

  const handleReuse = useCallback(
    (result: string) => {
      loadResult(result);
      router.navigate('/');
    },
    [loadResult],
  );

  const handleClearAll = useCallback(() => {
    if (Platform.OS === 'web') {
      clearHistory();
    } else {
      Alert.alert('Clear History', 'Delete all calculations?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory },
      ]);
    }
  }, [clearHistory]);

  const handleDelete = useCallback(
    (id: string) => {
      removeEntry(id);
    },
    [removeEntry],
  );

  const formatDate = useCallback((timestamp: number) => {
    const d = new Date(timestamp);
    const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: CalculationEntry }) => (
      <Animated.View entering={FadeIn.duration(300)}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
              {formatDate(item.timestamp)}
            </Text>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleReuse(item.result)}
              >
                <Text style={[styles.actionText, { color: colors.primary }]}>Use</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleCopy(item.result)}
              >
                <Text style={[styles.actionText, { color: colors.primary }]}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={[styles.actionText, { color: colors.error }]}>Del</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.expression, { color: colors.textSecondary }]}>
            {item.expression}
          </Text>
          <Text style={[styles.result, { color: colors.text }]}>{item.result}</Text>
        </View>
      </Animated.View>
    ),
    [colors, formatDate, handleReuse, handleCopy, handleDelete],
  );

  if (entries.length === 0) {
    return (
      <ScreenLayout>
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>History</Text>
          <View
            style={[
              styles.emptyState,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Animated.View entering={FadeIn.duration(400).springify()}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No calculations yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                Your calculation history will appear here
              </Text>
            </Animated.View>
          </View>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>History</Text>
          <TouchableOpacity
            style={[styles.clearBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={handleClearAll}
          >
            <Text style={[styles.clearBtnText, { color: colors.error }]}>Clear All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[styles.list, isWide && styles.listWide]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
  },
  clearBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: spacing.huge,
  },
  listWide: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  emptyState: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.huge,
  },
  emptyIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
    borderRadius: borderRadius.md,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expression: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: spacing.xxs,
  },
  result: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
});

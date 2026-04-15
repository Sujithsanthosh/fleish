import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import { IndianRupee, TrendingUp, ShoppingBag, Calendar, ArrowUpRight } from 'lucide-react-native';
import useDeliveryStore from '../../../src/store/useDeliveryStore';

export default function EarningsScreen() {
  const { earnings, completedHistory, loading, fetchDeliveries } = useDeliveryStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  };

  // Calculate next Monday
  const getNextMonday = () => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  // Calculate avg per order
  const avgPerOrder = earnings.count > 0 ? Math.round(earnings.today / earnings.count) : 0;

  // Calculate today's progress toward incentive (target: 18 deliveries for bonus)
  const incentiveTarget = 18;
  const incentiveProgress = Math.min((earnings.count / incentiveTarget) * 100, 100);
  const remaining = Math.max(incentiveTarget - earnings.count, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Earnings</Text>
        {loading && <ActivityIndicator color={colors.primary} />}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {loading && earnings.count === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading earnings data...</Text>
          </View>
        ) : (
          <>
            <View style={styles.mainCard}>
              <Text style={styles.mainLabel}>TODAY'S EARNINGS</Text>
              <Text style={styles.mainValue}>₹{earnings.today}</Text>
              <View style={styles.mainRow}>
                <View style={styles.chip}>
                  <ShoppingBag size={14} color="white" />
                  <Text style={styles.chipText}>{earnings.count} Deliveries</Text>
                </View>
                {avgPerOrder > 0 && (
                  <View style={styles.chip}>
                    <ArrowUpRight size={14} color="white" />
                    <Text style={styles.chipText}>₹{avgPerOrder} Avg/Order</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>SUMMARY</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>This Week</Text>
                <Text style={styles.infoValue}>₹{earnings.weekly}</Text>
                <Text style={styles.infoSub}>Keep it up!</Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>Total Completed</Text>
                <Text style={styles.infoValue}>{completedHistory.length}</Text>
                <Text style={styles.infoSub}>All time</Text>
              </View>
            </View>

            <View style={styles.payoutCard}>
              <View style={styles.payoutHeader}>
                <Calendar size={20} color={colors.primary} />
                <Text style={styles.payoutTitle}>Next Payout</Text>
              </View>
              <Text style={styles.payoutDate}>{getNextMonday()}</Text>
              <Text style={styles.payoutStatus}>Automatic Transfer to your bank account</Text>
            </View>

            <View style={styles.incentiveCard}>
              <TrendingUp size={24} color={colors.success} />
              <View style={styles.incentiveInfo}>
                <Text style={styles.incentiveTitle}>Daily Incentive</Text>
                {remaining > 0 ? (
                  <Text style={styles.incentiveText}>Complete {remaining} more orders to unlock bonus</Text>
                ) : (
                  <Text style={styles.incentiveText}>🎉 Daily target achieved! Bonus unlocked.</Text>
                )}
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: `${incentiveProgress}%` }]} />
                </View>
              </View>
            </View>

            {completedHistory.length === 0 && (
              <View style={styles.emptyState}>
                <ShoppingBag size={48} color={colors.border} />
                <Text style={styles.emptyText}>No deliveries yet</Text>
                <Text style={styles.emptySubtext}>Complete your first delivery to see earnings</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    backgroundColor: 'white', ...shadows.high, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.primary },
  scrollContent: { padding: spacing.lg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  loadingText: { marginTop: 12, color: colors.textSecondary, fontSize: 14 },
  mainCard: {
    backgroundColor: colors.primary, padding: 30, borderRadius: borderRadius.lg,
    alignItems: 'center', marginBottom: spacing.xl, ...shadows.high,
  },
  mainLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  mainValue: { color: colors.accent, fontSize: 48, fontWeight: '900', marginVertical: 10 },
  mainRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  chipText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  sectionHeader: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: colors.textSecondary, letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  infoCard: { flex: 1, backgroundColor: 'white', padding: 20, borderRadius: borderRadius.md, ...shadows.high },
  infoLabel: { fontSize: 12, fontWeight: 'bold', color: colors.textSecondary },
  infoValue: { fontSize: 24, fontWeight: '900', color: colors.text, marginVertical: 4 },
  infoSub: { fontSize: 10, color: colors.success, fontWeight: 'bold' },
  payoutCard: {
    backgroundColor: 'white', padding: 24, borderRadius: borderRadius.md, marginBottom: 15,
    borderLeftWidth: 6, borderLeftColor: colors.primary, ...shadows.high,
  },
  payoutHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  payoutTitle: { fontSize: 14, fontWeight: '900', color: colors.primary },
  payoutDate: { fontSize: 22, fontWeight: '900', color: colors.text },
  payoutStatus: { fontSize: 12, color: colors.textSecondary, marginTop: 4, fontWeight: '600' },
  incentiveCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F0ED',
    padding: 20, borderRadius: borderRadius.md, gap: 15,
  },
  incentiveInfo: { flex: 1 },
  incentiveTitle: { fontSize: 16, fontWeight: '900', color: colors.primary },
  incentiveText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  progressBar: {
    height: 6, backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 3, marginTop: 12, overflow: 'hidden',
  },
  progress: { height: '100%', backgroundColor: colors.success },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginTop: spacing.md },
  emptySubtext: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});

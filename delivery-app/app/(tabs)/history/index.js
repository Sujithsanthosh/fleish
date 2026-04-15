import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import { ShoppingBag, CheckCircle2 } from 'lucide-react-native';
import useDeliveryStore from '../../../src/store/useDeliveryStore';

export default function HistoryScreen() {
  const completedHistory = useDeliveryStore((state) => state.completedHistory);
  const fetchDeliveries = useDeliveryStore((state) => state.fetchDeliveries);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.iconCircle}>
          <ShoppingBag size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
          {item.customerName && <Text style={styles.customerName}>{item.customerName}</Text>}
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.orderEarnings}>₹{item.earnings}</Text>
        <View style={styles.statusRow}>
          <CheckCircle2 size={12} color={colors.success} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        {item.distance && <Text style={styles.distance}>{item.distance}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order History</Text>
      </View>

      <FlatList
        data={completedHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListHeaderComponent={
          completedHistory.length > 0 ? (
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>SHOWING LAST {completedHistory.length} DELIVERIES</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ShoppingBag size={48} color={colors.border} />
            <Text style={styles.emptyText}>No delivery history</Text>
            <Text style={styles.emptySubtext}>Completed deliveries will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    backgroundColor: 'white', ...shadows.high,
  },
  title: { fontSize: 24, fontWeight: '900', color: colors.primary },
  listPadding: { padding: spacing.lg },
  listHeader: { marginBottom: 15 },
  listHeaderText: { fontSize: 12, fontWeight: '900', color: colors.textSecondary, letterSpacing: 1 },
  card: {
    flexDirection: 'row', backgroundColor: 'white', padding: 18, borderRadius: borderRadius.md,
    marginBottom: 12, alignItems: 'center', justifyContent: 'space-between', ...shadows.high,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  orderId: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  orderDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  customerName: { fontSize: 11, color: colors.textSecondary, fontStyle: 'italic' },
  cardRight: { alignItems: 'flex-end' },
  orderEarnings: { fontSize: 18, fontWeight: '900', color: colors.primary },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  statusText: { fontSize: 10, fontWeight: '900', color: colors.success },
  distance: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginTop: 16 },
  emptySubtext: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
});

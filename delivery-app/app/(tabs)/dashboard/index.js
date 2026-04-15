import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import useDeliveryStore from '../../../src/store/useDeliveryStore';
import socketService from '../../../src/services/socketService';
import { MapPin, ShoppingBag, Battery, Wifi, Navigation, Phone, ChevronRight } from 'lucide-react-native';

export default function Dashboard() {
  const router = useRouter();
  const { isOnline, toggleAvailability, activeOrder, orderRequest, earnings, loading, error, fetchDeliveries } = useDeliveryStore();
  const rider = useDeliveryStore((state) => state.rider);
  const [refreshing, setRefreshing] = useState(false);
  const [locationPerm, setLocationPerm] = useState(false);

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPerm(status === 'granted');
    })();
  }, []);

  // Connect socket when authenticated
  useEffect(() => {
    const { isAuthenticated, authToken, rider } = useDeliveryStore.getState();
    if (isAuthenticated && rider?.id) {
      socketService.connect(rider.id);

      // Listen for new delivery assignments
      socketService.onNewDelivery((data) => {
        const { setOrderRequest } = useDeliveryStore.getState();
        setOrderRequest(data.delivery);
        router.push('/order-modal');
      });
    }
    return () => socketService.disconnect();
  }, []);

  // Track location when online with active order
  useEffect(() => {
    if (!isOnline || !activeOrder || !locationPerm) return;

    const interval = setInterval(async () => {
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { updateLocation } = useDeliveryStore.getState();
        updateLocation(loc.coords.latitude, loc.coords.longitude);
        socketService.emitLocation(loc.coords.latitude, loc.coords.longitude);
      } catch (e) {
        console.warn('Location update failed:', e.message);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, activeOrder, locationPerm]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  };

  const greeting = rider?.name || rider?.phone ? `Hello, ${rider?.name || rider?.phone}` : 'Hello, Rider';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtext}>{isOnline ? 'You are receiving orders' : 'Go online to start earning'}</Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={toggleAvailability}
          trackColor={{ false: '#d1d1d1', true: colors.success }}
          thumbColor={'white'}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {loading && <ActivityIndicator style={styles.loadingIndicator} color={colors.primary} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Status Indicators */}
        <View style={styles.statusRow}>
          <View style={styles.indicator}>
            <Battery size={16} color={locationPerm ? colors.success : colors.warning} />
            <Text style={styles.indicatorText}>{locationPerm ? 'GPS Active' : 'GPS Off'}</Text>
          </View>
          <View style={styles.indicator}>
            <Wifi size={16} color={colors.success} />
            <Text style={styles.indicatorText}>Stable Internet</Text>
          </View>
        </View>

        {/* Online/Offline Large Toggle */}
        {!activeOrder && (
          <TouchableOpacity
            style={[styles.bigToggle, isOnline ? styles.bgOnline : styles.bgOffline]}
            onPress={toggleAvailability}
          >
            <Text style={styles.bigToggleText}>{isOnline ? 'GO OFFLINE' : 'GO ONLINE'}</Text>
          </TouchableOpacity>
        )}

        {/* Current order or Summary */}
        {activeOrder ? (
          <View style={styles.activeSection}>
            <Text style={styles.sectionTitle}>ACTIVE DELIVERY</Text>
            <TouchableOpacity style={styles.activeCard} onPress={() => router.push('/navigation')}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>{activeOrder.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.warning }]}>
                  <Text style={styles.statusLabel}>IN PROGRESS</Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <View style={styles.dotLine}>
                  <View style={styles.dot} />
                  <View style={styles.line} />
                  <MapPin size={16} color={colors.error} />
                </View>
                <View style={styles.addresses}>
                  <Text style={styles.addrText} numberOfLines={1}>{activeOrder.vendor.name}</Text>
                  <View style={{ height: 20 }} />
                  <Text style={styles.addrText} numberOfLines={1}>{activeOrder.customer.address}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/navigation')}>
                <Navigation size={20} color="white" />
                <Text style={styles.navBtnText}>RESUME NAVIGATION</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>TODAY'S SUMMARY</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Earnings</Text>
                <Text style={styles.summaryValue}>₹{earnings.today}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Deliveries</Text>
                <Text style={styles.summaryValue}>{earnings.count}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {!isOnline && !activeOrder && (
        <View style={styles.offlineOverlay}>
          <View style={styles.offlineBox}>
            <ShoppingBag size={64} color={colors.offline} />
            <Text style={styles.offlineTitle}>YOU ARE OFFLINE</Text>
            <Text style={styles.offlineDesc}>Go online to see new delivery requests near you.</Text>
            <TouchableOpacity style={styles.onlineBtn} onPress={toggleAvailability}>
              <Text style={styles.onlineBtnText}>GO ONLINE NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg,
    backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', ...shadows.high,
  },
  greeting: { fontSize: 24, fontWeight: '900', color: colors.primary },
  subtext: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  content: { padding: spacing.lg },
  loadingIndicator: { marginVertical: spacing.md },
  errorText: { color: colors.error, textAlign: 'center', marginBottom: spacing.md, fontSize: 13 },
  statusRow: { flexDirection: 'row', gap: 15, marginBottom: spacing.xl },
  indicator: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'white',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border,
  },
  indicatorText: { fontSize: 12, fontWeight: 'bold', color: colors.textSecondary },
  bigToggle: {
    height: 80, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.xl, ...shadows.high,
  },
  bgOnline: { backgroundColor: colors.error },
  bgOffline: { backgroundColor: colors.success },
  bigToggleText: { color: 'white', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: colors.textSecondary, marginBottom: 15, letterSpacing: 1 },
  activeCard: {
    backgroundColor: 'white', borderRadius: borderRadius.lg, padding: 20, ...shadows.high,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  orderId: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusLabel: { fontSize: 10, fontWeight: '900', color: 'white' },
  locationRow: { flexDirection: 'row', marginBottom: 25 },
  dotLine: { alignItems: 'center', width: 20, marginRight: 15 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.success },
  line: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 4 },
  addresses: { flex: 1 },
  addrText: { fontSize: 16, fontWeight: '700', color: colors.text },
  navBtn: {
    height: 56, backgroundColor: colors.primary, borderRadius: borderRadius.md,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  navBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  summaryGrid: { flexDirection: 'row', gap: 15 },
  summaryBox: {
    flex: 1, backgroundColor: 'white', padding: 20, borderRadius: borderRadius.md,
    ...shadows.high, alignItems: 'center',
  },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },
  summaryValue: { fontSize: 28, fontWeight: '900', color: colors.primary, marginTop: 5 },
  offlineOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(240, 242, 245, 0.95)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  offlineBox: {
    width: '85%', backgroundColor: 'white', padding: 40, borderRadius: borderRadius.lg,
    alignItems: 'center', ...shadows.high,
  },
  offlineTitle: { fontSize: 24, fontWeight: '900', color: colors.offline, marginTop: 20 },
  offlineDesc: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 10, marginBottom: 30, lineHeight: 22 },
  onlineBtn: { height: 60, width: '100%', backgroundColor: colors.success, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  onlineBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

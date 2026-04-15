import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../src/theme';
import useDeliveryStore from '../src/store/useDeliveryStore';
import { MapPin, X, ArrowRight, IndianRupee, Clock } from 'lucide-react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

export default function OrderModal() {
  const router = useRouter();
  const { orderRequest, acceptOrder, rejectOrder } = useDeliveryStore();
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      Vibration.vibrate([0, 500, 200, 500]);
    }, 1500);

    const timerInterval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerInterval);
          handleReject();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
      Vibration.cancel();
    };
  }, []);

  const handleAccept = () => {
    acceptOrder();
    router.replace('/navigation');
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Delivery',
      'Are you sure you want to reject this delivery request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            rejectOrder();
            router.back();
          },
        },
      ]
    );
  };

  if (!orderRequest) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View entering={SlideInDown.duration(400)} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>NEW DELIVERY READY!</Text>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{timer}S</Text>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <IndianRupee size={24} color={colors.primary} />
            <Text style={styles.earningsValue}>₹{orderRequest.earnings}</Text>
          </View>
          <Text style={styles.earningsLabel}>Your potential earnings</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <View style={styles.info}>
              <Text style={styles.infoLabel}>PICKUP</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{orderRequest.vendor.name}</Text>
            </View>
          </View>

          <View style={styles.line} />

          <View style={styles.routePoint}>
            <View style={[styles.dot, { backgroundColor: colors.error }]} />
            <View style={styles.info}>
              <Text style={styles.infoLabel}>DROP</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{orderRequest.customer.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.meta}>
            <MapPin size={18} color={colors.textSecondary} />
            <Text style={styles.metaText}>{orderRequest.distance}</Text>
          </View>
          <View style={styles.meta}>
            <Clock size={18} color={colors.textSecondary} />
            <Text style={styles.metaText}>{orderRequest.estTime}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
            <Text style={styles.rejectText}>REJECT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
            <Text style={styles.acceptText}>ACCEPT</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  container: {
    backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '900', color: colors.primary },
  timerCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.primary,
  },
  timerText: { fontWeight: '900', fontSize: 16, color: colors.primary },
  earningsCard: {
    backgroundColor: '#E6F0ED', padding: 20, borderRadius: borderRadius.md,
    alignItems: 'center', marginBottom: 24,
  },
  earningsRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  earningsValue: { fontSize: 32, fontWeight: '900', color: colors.primary },
  earningsLabel: { fontSize: 12, fontWeight: 'bold', color: colors.primary, marginTop: 4 },
  routeContainer: { backgroundColor: colors.background, padding: 20, borderRadius: borderRadius.md, marginBottom: 20 },
  routePoint: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  info: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: 'bold', color: colors.textSecondary, letterSpacing: 1 },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginTop: 2 },
  line: { width: 2, height: 30, backgroundColor: colors.border, marginLeft: 5, marginVertical: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 16, fontWeight: 'bold', color: colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: 15 },
  rejectBtn: {
    flex: 1, height: 64, backgroundColor: 'white', borderRadius: borderRadius.md,
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.error,
  },
  rejectText: { color: colors.error, fontSize: 18, fontWeight: '900' },
  acceptBtn: {
    flex: 2, height: 64, backgroundColor: colors.success, borderRadius: borderRadius.md,
    justifyContent: 'center', alignItems: 'center', ...shadows.high,
  },
  acceptText: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
});

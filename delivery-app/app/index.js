import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme';
import useDeliveryStore from '../src/store/useDeliveryStore';

export default function SplashScreen() {
  const router = useRouter();
  const isAuthenticated = useDeliveryStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(isAuthenticated ? '/(tabs)/dashboard' : '/(auth)/login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>D</Text>
      </View>
      <Text style={styles.brandName}>Fleish Delivery</Text>
      <Text style={styles.subtitle}>Partner App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  logoText: { fontSize: 40, fontWeight: 'bold', color: colors.primary },
  brandName: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 5 },
});

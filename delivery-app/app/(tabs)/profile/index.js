import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '../../../src/theme';
import { User, Phone, LogOut, ChevronRight, Shield, Bell, HelpCircle, Truck, Mail } from 'lucide-react-native';
import useDeliveryStore from '../../../src/store/useDeliveryStore';

export default function ProfileScreen() {
  const router = useRouter();
  const rider = useDeliveryStore((state) => state.rider);
  const logout = useDeliveryStore((state) => state.logout);

  const riderName = rider?.name || 'Rider';
  const riderPhone = rider?.phone || 'Not available';
  const riderRating = rider?.rating || 'N/A';
  const riderVehicle = rider?.vehicleType || 'Not set';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      icon: Bell,
      title: 'Notification Settings',
      subtitle: 'Manage delivery alerts',
      action: () => Alert.alert('Notifications', 'Push notification settings will be available when backend is connected.'),
    },
    {
      icon: Shield,
      title: 'Safety & Insurance',
      subtitle: 'Personal accident cover',
      action: () => Alert.alert('Safety', 'Your safety is our priority. Insurance details will be shown once configured.'),
    },
    {
      icon: HelpCircle,
      title: 'Support Helpdesk',
      subtitle: 'Chat with us',
      action: () => Linking.openURL('mailto:support@fleishfresh.com'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileBox}>
          <View style={styles.avatarCircle}>
            <User size={40} color="white" />
          </View>
          <Text style={styles.riderName}>{riderName}</Text>
          <View style={styles.phoneRow}>
            <Phone size={14} color={colors.textSecondary} />
            <Text style={styles.riderPhone}>+91 {riderPhone}</Text>
          </View>
          <Text style={styles.riderRating}>⭐ {riderRating} Rating</Text>

          {riderVehicle !== 'Not set' && (
            <View style={styles.vehicleCard}>
              <Truck size={20} color={colors.primary} />
              <Text style={styles.vehicleText}>{riderVehicle}</Text>
            </View>
          )}
        </View>

        <View style={styles.menuBox}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
              <View style={styles.menuIconBox}>
                <item.icon size={22} color={colors.primary} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color={colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={24} color={colors.error} />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Fleish Delivery Partner • v1.0.0</Text>
      </ScrollView>
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
  scrollContent: { padding: spacing.lg },
  profileBox: {
    backgroundColor: 'white', padding: 30, borderRadius: borderRadius.lg,
    alignItems: 'center', marginBottom: spacing.xl, ...shadows.high,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
  },
  riderName: { fontSize: 24, fontWeight: '900', color: colors.text },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  riderPhone: { fontSize: 14, color: colors.textSecondary },
  riderRating: { fontSize: 14, fontWeight: 'bold', color: colors.success, marginTop: 4 },
  vehicleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.background,
    paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 20,
    borderWidth: 1, borderColor: colors.border,
  },
  vehicleText: { fontSize: 14, fontWeight: 'bold', color: colors.primary },
  menuBox: { backgroundColor: 'white', borderRadius: borderRadius.md, ...shadows.high, marginBottom: spacing.xl },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderBottomWidth: 1, borderBottomColor: colors.background,
  },
  menuIconBox: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.background,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  menuSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 64,
    backgroundColor: 'white', borderRadius: borderRadius.md, ...shadows.high, gap: 10,
  },
  logoutText: { fontSize: 18, fontWeight: '900', color: colors.error, letterSpacing: 1 },
  footerText: { textAlign: 'center', marginTop: 30, color: colors.textSecondary, fontSize: 12, fontWeight: 'bold' },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, spacing, borderRadius } from '../../src/theme';
import useDeliveryStore from '../../src/store/useDeliveryStore';

export default function OTPScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const verifyOtp = useDeliveryStore((state) => state.verifyOtp);

  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (otp.length < 4) return;
    setLoading(true);
    try {
      await verifyOtp(phone, otp);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phone) { Alert.alert('Error', 'Phone number not found.'); return; }
    setLoading(true);
    try {
      const { login } = useDeliveryStore.getState();
      await login(phone);
      setTimer(30);
      Alert.alert('OTP Resent', 'A new code has been sent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Confirm OTP</Text>
        <Text style={styles.subtitle}>{phone ? `Code sent to +91 ${phone}` : 'Enter the code sent to your mobile'}</Text>

        <TextInput
          style={styles.otpInput} placeholder="0000" keyboardType="number-pad" maxLength={4}
          value={otp} onChangeText={setOtp} autoFocus placeholderTextColor={colors.border}
        />

        <TouchableOpacity
          style={[styles.button, (otp.length < 4 || loading) && styles.buttonDisabled]}
          onPress={handleVerify} disabled={otp.length < 4 || loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>VERIFY & LOGIN</Text>}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={styles.resendLink}>Resend Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40 },
  otpInput: {
    height: 80, fontSize: 48, fontWeight: '900', textAlign: 'center',
    borderBottomWidth: 4, borderBottomColor: colors.primary, marginBottom: 40,
    color: colors.text, letterSpacing: 20,
  },
  button: { height: 64, backgroundColor: colors.primary, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  resendText: { color: colors.textSecondary },
  timerText: { color: colors.textSecondary, fontWeight: '600' },
  resendLink: { color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' },
});

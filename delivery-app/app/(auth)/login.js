import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '../../src/theme';
import useDeliveryStore from '../../src/store/useDeliveryStore';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useDeliveryStore((state) => state.login);

  const handleLogin = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) return;

    setLoading(true);
    try {
      await login(cleaned);
      router.push({ pathname: '/(auth)/otp', params: { phone: cleaned } });
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Delivery Login</Text>
        <Text style={styles.subtitle}>Enter your registered phone number</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          maxLength={10}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          style={[styles.button, phoneNumber.length < 10 && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={phoneNumber.length < 10 || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>GET OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: 40 },
  input: {
    height: 64, backgroundColor: 'white', borderWidth: 2, borderColor: colors.border,
    borderRadius: borderRadius.md, paddingHorizontal: 20, fontSize: 22, fontWeight: '700',
    marginBottom: 20, color: colors.text,
  },
  button: { height: 64, backgroundColor: colors.primary, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
});

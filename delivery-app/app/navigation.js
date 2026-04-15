import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { colors, spacing, borderRadius, shadows } from '../src/theme';
import useDeliveryStore from '../src/store/useDeliveryStore';
import { Phone, Navigation as NavIcon, ChevronLeft, MapPin, CheckCircle2, AlertTriangle, Camera, X, Locate } from 'lucide-react-native';
import { Image } from 'react-native';

// Mappls SDK - try to import, fallback gracefully
let MapplsMapView, MapplsMarker, MapplsCamera;
try {
  const Mappls = require('mappls-map-react-native');
  MapplsMapView = Mappls.MapView;
  MapplsMarker = Mappls.Marker;
} catch (e) {
  console.warn('Mappls SDK not available, using fallback map');
}

const MAPPLS_API_KEY = '25baba9c270d32e7843ea729d679bc1f';

export default function NavigationScreen() {
  const router = useRouter();
  const { activeOrder, updateOrderStep, orderStep, completeOrder } = useDeliveryStore();

  const [step, setStep] = useState(orderStep || 1);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [proofPhoto, setProofPhoto] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);

  const destination = step <= 2
    ? { lat: activeOrder?.vendor?.coords?.lat, lng: activeOrder?.vendor?.coords?.lng, name: activeOrder?.vendor?.name, address: activeOrder?.vendor?.address }
    : { lat: activeOrder?.customer?.coords?.lat, lng: activeOrder?.customer?.coords?.lng, name: activeOrder?.customer?.name, address: activeOrder?.customer?.address };

  // Sync step with store
  useEffect(() => { if (orderStep) setStep(orderStep); }, [orderStep]);
  useEffect(() => { updateOrderStep(step); }, [step]);

  // Track rider location
  useEffect(() => {
    let subscription;
    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setRiderLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });

        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 50 },
          (location) => {
            setRiderLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
            // Update backend with rider location
            const { updateLocation } = useDeliveryStore.getState();
            if (activeOrder?.id) {
              updateLocation(activeOrder.id, location.coords.latitude, location.coords.longitude);
            }
          }
        );
      } catch (e) {
        console.warn('Location tracking error:', e.message);
      }
    };
    startTracking();
    return () => { if (subscription) subscription.remove(); };
  }, [activeOrder?.id]);

  if (!activeOrder) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.centerText}>No active delivery</Text>
          <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/(tabs)/dashboard')}>
            <Text style={styles.backHomeText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleNextStep = () => { if (step < 5) setStep(step + 1); };

  const handleComplete = () => {
    if (otp.length < 4) {
      Alert.alert('OTP Required', 'Please enter the 4-digit OTP from the customer.');
      return;
    }
    if (otp !== activeOrder.customer.otp) {
      Alert.alert('Invalid OTP', 'The OTP entered does not match. Please verify with the customer.');
      return;
    }
    setLoading(true);
    completeOrder();
    setLoading(false);
    router.replace('/(tabs)/dashboard');
  };

  const openGoogleMaps = () => {
    if (!destination?.lat || !destination?.lng) {
      Alert.alert('Location Unavailable', 'Coordinates not available for this delivery.');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
    Linking.openURL(url);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access to attach delivery proof.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setProofPhoto(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access to take a delivery proof photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setProofPhoto(result.assets[0].uri);
  };

  const recenterMap = useCallback(() => {
    // In production, use Mappls camera animation to center on rider location
    Alert.alert('Recenter', 'Map centered to your current location');
  }, []);

  return (
    <View style={styles.container}>
      {/* Mappls Interactive Map */}
      <View style={styles.mapContainer}>
        {MapplsMapView ? (
          <MapplsMapView
            key={MAPPLS_API_KEY}
            style={styles.mapView}
            showMyLocation={true}
            compassEnabled={true}
            zoomGesturesEnabled={true}
            onMapReady={() => setMapReady(true)}
            onError={() => setMapError(true)}
          >
            {/* Rider Location Marker */}
            {riderLocation && (
              <MapplsMarker
                lat={riderLocation.lat}
                lng={riderLocation.lng}
                title="You are here"
                icon={{ url: 'rider_marker' }}
              />
            )}
            {/* Destination Marker (Vendor or Customer) */}
            {destination?.lat && (
              <MapplsMarker
                lat={destination.lat}
                lng={destination.lng}
                title={step <= 2 ? `Pickup: ${destination.name}` : `Drop: ${destination.name}`}
                icon={{ url: 'destination_marker' }}
              />
            )}
          </MapplsMapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color={colors.primary} />
            <Text style={styles.mapPlaceholderText}>Mappls Map View</Text>
            <Text style={styles.mapPlaceholderSubtext}>Run with development build for native map</Text>
          </View>
        )}

        {mapError && (
          <View style={styles.mapErrorOverlay}>
            <MapPin size={32} color={colors.error} />
            <Text style={styles.mapErrorText}>Map failed to load</Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>

        {/* Recenter Button */}
        <TouchableOpacity style={styles.recenterBtn} onPress={recenterMap}>
          <Locate size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Google Maps Fallback */}
        <TouchableOpacity style={styles.gmapsBtn} onPress={openGoogleMaps}>
          <NavIcon size={24} color="white" />
          <Text style={styles.gmapsText}>OPEN IN GOOGLE MAPS</Text>
        </TouchableOpacity>
      </View>

      {/* Step Progress Panel */}
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepLabel}>STEP {step} OF 5</Text>
              <Text style={styles.targetName}>
                {step <= 2 ? `PICKUP: ${activeOrder.vendor.name}` : `DROP: ${activeOrder.customer.name}`}
              </Text>
            </View>
            <TouchableOpacity style={styles.supportBtn} onPress={() => Alert.alert('Support', 'Call: 1800-123-4567\nEmail: support@fleishfresh.com')}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={styles.supportText}>HELP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressCard}>
            <MapPin size={24} color={colors.error} />
            <Text style={styles.addressValue}>
              {step <= 2 ? activeOrder.vendor.address : activeOrder.customer.address}
            </Text>
          </View>

          {step >= 3 && activeOrder.customer.instructions ? (
            <View style={styles.instructionBox}>
              <Text style={styles.instructionTitle}>CUSTOMER INSTRUCTIONS:</Text>
              <Text style={styles.instructionText}>"{activeOrder.customer.instructions}"</Text>
            </View>
          ) : null}

          <View style={styles.contactRow}>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Linking.openURL(`tel:${step <= 2 ? activeOrder.vendor.phone : activeOrder.customer.phone}`)}
            >
              <Phone size={22} color="white" />
              <Text style={styles.callText}>CALL {step <= 2 ? 'VENDOR' : 'CUSTOMER'}</Text>
            </TouchableOpacity>
          </View>

          {step === 5 && (
            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>ENTER DELIVERY OTP (Sent to Customer)</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="X X X X"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                placeholderTextColor={colors.textSecondary}
              />

              <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                <Camera size={20} color={colors.primary} />
                <Text style={styles.photoBtnText}>ATTACH PHOTO PROOF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cameraBtn} onPress={takePhoto}>
                <Camera size={20} color={colors.primary} />
                <Text style={styles.photoBtnText}>TAKE PHOTO</Text>
              </TouchableOpacity>

              {proofPhoto && (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: proofPhoto }} style={styles.previewImg} />
                  <TouchableOpacity style={styles.removePhoto} onPress={() => setProofPhoto(null)}>
                    <X size={16} color="white" />
                  </TouchableOpacity>
                  <CheckCircle2 size={20} color={colors.success} style={styles.photoCheck} />
                </View>
              )}
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* Step Action Footer */}
      <View style={styles.footer}>
        {loading ? (
          <View style={[styles.mainBtn, { backgroundColor: colors.primary }]}>
            <ActivityIndicator color="white" />
          </View>
        ) : (
          <>
            {step === 1 && (
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={handleNextStep}>
                <Text style={styles.mainBtnText}>ARRIVED AT SHOP</Text>
              </TouchableOpacity>
            )}
            {step === 2 && (
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.success }]} onPress={handleNextStep}>
                <Text style={styles.mainBtnText}>PICKUP CONFIRMED</Text>
              </TouchableOpacity>
            )}
            {step === 3 && (
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.primary }]} onPress={handleNextStep}>
                <Text style={styles.mainBtnText}>ARRIVED AT CUSTOMER</Text>
              </TouchableOpacity>
            )}
            {step === 4 && (
              <TouchableOpacity style={[styles.mainBtn, { backgroundColor: colors.accent }]} onPress={handleNextStep}>
                <Text style={[styles.mainBtnText, { color: colors.primary }]}>CONFIRM DELIVERY DETAILS</Text>
              </TouchableOpacity>
            )}
            {step === 5 && (
              <TouchableOpacity
                style={[styles.mainBtn, { backgroundColor: colors.success }, otp.length < 4 && { opacity: 0.5 }]}
                onPress={handleComplete}
                disabled={otp.length < 4}
              >
                <Text style={styles.mainBtnText}>COMPLETE DELIVERY</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  mapContainer: { height: '40%', width: '100%', position: 'relative' },
  mapView: { width: '100%', height: '100%' },
  mapPlaceholder: { width: '100%', height: '100%', backgroundColor: '#E8F0FE', justifyContent: 'center', alignItems: 'center' },
  mapPlaceholderText: { marginTop: 12, fontSize: 14, fontWeight: '600', color: colors.primary },
  mapPlaceholderSubtext: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
  mapErrorOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center' },
  mapErrorText: { marginTop: 8, fontSize: 14, fontWeight: '600', color: colors.error },
  backBtn: {
    position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', ...shadows.high,
  },
  recenterBtn: {
    position: 'absolute', bottom: 80, right: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', ...shadows.high,
  },
  gmapsBtn: {
    position: 'absolute', bottom: 20, right: 20, left: 20, height: 56,
    backgroundColor: '#4285F4', borderRadius: 12, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 10, ...shadows.high,
  },
  gmapsText: { color: 'white', fontWeight: '900', fontSize: 14 },
  content: {
    flex: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    marginTop: -30, padding: 24,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  stepIndicator: { flex: 1 },
  stepLabel: { fontSize: 12, fontWeight: '900', color: colors.textSecondary, letterSpacing: 2 },
  targetName: { fontSize: 22, fontWeight: '900', color: colors.primary, marginTop: 4 },
  supportBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFFBEB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  supportText: { fontWeight: 'bold', fontSize: 12, color: colors.warning },
  addressCard: { flexDirection: 'row', backgroundColor: colors.background, padding: 20, borderRadius: borderRadius.md, alignItems: 'center', marginBottom: 20, gap: 15 },
  addressValue: { flex: 1, fontSize: 16, fontWeight: 'bold', color: colors.text },
  instructionBox: { backgroundColor: '#E8F0FE', padding: 20, borderRadius: borderRadius.md, marginBottom: 20 },
  instructionTitle: { fontSize: 12, fontWeight: '900', color: '#1A73E8' },
  instructionText: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 5 },
  contactRow: { marginBottom: 20 },
  callBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, height: 60, borderRadius: borderRadius.md, gap: 10 },
  callText: { color: 'white', fontSize: 18, fontWeight: '900' },
  otpSection: { alignItems: 'center', marginTop: 10 },
  otpLabel: { fontSize: 14, fontWeight: '900', color: colors.primary, marginBottom: 15 },
  otpInput: {
    width: '100%', height: 70, backgroundColor: colors.background, borderRadius: borderRadius.md,
    fontSize: 32, fontWeight: '900', textAlign: 'center', letterSpacing: 20,
    borderWidth: 2, borderColor: colors.primary, color: colors.text,
  },
  photoBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 8 },
  photoBtnText: { color: colors.primary, fontWeight: 'bold', textDecorationLine: 'underline' },
  cameraBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  photoPreview: { marginTop: 15, position: 'relative', width: '100%', height: 150 },
  previewImg: { width: '100%', height: '100%', borderRadius: borderRadius.md },
  removePhoto: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 4 },
  photoCheck: { position: 'absolute', bottom: 8, right: 8 },
  footer: { padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: colors.border },
  mainBtn: { height: 70, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center', ...shadows.high },
  mainBtnText: { color: 'white', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerText: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  backHomeBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: colors.primary, borderRadius: 8 },
  backHomeText: { color: 'white', fontWeight: 'bold' },
});

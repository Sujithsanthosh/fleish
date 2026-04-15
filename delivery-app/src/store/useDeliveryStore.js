import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, authenticatedRequest } from '../config/apiConfig';

const RIDER_STORAGE_KEY = '@delivery_rider';
const ORDERS_STORAGE_KEY = '@delivery_orders';
const HISTORY_STORAGE_KEY = '@delivery_history';

// Helpers
const loadFromStorage = async (key, fallback = null) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.warn(`Failed to load ${key}:`, e);
    return fallback;
  }
};

const saveToStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save ${key}:`, e);
  }
};

// Map backend delivery to app format
const mapDelivery = (backendDelivery) => ({
  id: backendDelivery.id || backendDelivery._id,
  vendor: {
    name: backendDelivery.vendor?.name || 'Vendor',
    address: backendDelivery.vendor?.address || '',
    phone: backendDelivery.vendor?.phone || '',
    coords: backendDelivery.vendor?.location || { lat: 0, lng: 0 },
  },
  customer: {
    name: backendDelivery.customer?.name || 'Customer',
    address: backendDelivery.customerAddress || backendDelivery.deliveryAddress?.address || '',
    phone: backendDelivery.customer?.phone || '',
    instructions: backendDelivery.instructions || backendDelivery.customerInstructions || '',
    otp: backendDelivery.customerOtp || '0000',
    coords: backendDelivery.customer?.location || backendDelivery.deliveryAddress || { lat: 0, lng: 0 },
  },
  payment: backendDelivery.paymentMethod || 'COD',
  earnings: backendDelivery.riderEarnings || backendDelivery.deliveryFee || 40,
  distance: backendDelivery.distanceKm ? `${backendDelivery.distanceKm.toFixed(1)} km` : 'N/A',
  estTime: backendDelivery.estimatedTimeMin ? `${backendDelivery.estimatedTimeMin} mins` : 'N/A',
  status: backendDelivery.status || 'ASSIGNED',
  createdAt: backendDelivery.createdAt,
  orderId: backendDelivery.orderId,
});

const useDeliveryStore = create((set, get) => ({
  // Auth state
  rider: null,
  authToken: null,
  isAuthenticated: false,

  // Operational state
  isOnline: false,
  activeOrder: null,
  orderRequest: null,
  orderStep: 1,
  completedHistory: [],

  // Earnings
  earnings: { today: 0, count: 0, weekly: 0 },

  // UI state
  loading: false,
  error: null,

  // ─── Auth ───

  login: async (phone) => {
    set({ loading: true, error: null });
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, role: 'rider' }),
      });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (phone, otp) => {
    set({ loading: true, error: null });
    try {
      const response = await apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp, role: 'rider' }),
      });

      if (response.token && response.user) {
        const riderData = response.user;
        saveToStorage(RIDER_STORAGE_KEY, { phone, token: response.token, rider: riderData });
        set({
          rider: riderData,
          authToken: response.token,
          isAuthenticated: true,
          isOnline: riderData.isOnline || false,
        });
        await get().fetchDeliveries();
      }
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    AsyncStorage.multiRemove([RIDER_STORAGE_KEY, ORDERS_STORAGE_KEY, HISTORY_STORAGE_KEY]);
    set({
      rider: null,
      authToken: null,
      isAuthenticated: false,
      isOnline: false,
      activeOrder: null,
      orderRequest: null,
      orderStep: 1,
      completedHistory: [],
      earnings: { today: 0, count: 0, weekly: 0 },
    });
  },

  // ─── Initialization ───

  initializeApp: async () => {
    const riderData = await loadFromStorage(RIDER_STORAGE_KEY, null);
    const history = await loadFromStorage(HISTORY_STORAGE_KEY, []);

    if (riderData?.token) {
      set({
        rider: riderData.rider || null,
        authToken: riderData.token,
        isAuthenticated: true,
        isOnline: riderData.rider?.isOnline || false,
        completedHistory: history,
      });

      // Fetch fresh data in background
      try {
        await get().fetchDeliveries();
      } catch (e) {
        console.warn('Initial delivery fetch failed, using cached:', e.message);
      }
    }
  },

  // ─── Data Fetching ───

  fetchDeliveries: async () => {
    const { authToken } = get();
    if (!authToken) return;

    set({ loading: true, error: null });
    try {
      // Fetch available deliveries for this rider
      const response = await authenticatedRequest('/deliveries/my', authToken);
      let deliveries = response.deliveries || response;
      if (!Array.isArray(deliveries)) deliveries = [];

      // Find active (in-progress) delivery
      const activeDelivery = deliveries.find(d =>
        ['assigned', 'picked_up', 'in_transit'].includes(d.status?.toLowerCase())
      );

      if (activeDelivery) {
        set({ activeOrder: mapDelivery(activeDelivery) });
      }

      // Fetch completed history
      const historyResponse = await authenticatedRequest('/deliveries/my?status=completed', authToken);
      let completedDeliveries = historyResponse.deliveries || historyResponse;
      if (!Array.isArray(completedDeliveries)) completedDeliveries = [];

      const mappedHistory = completedDeliveries.slice(0, 50).map(d => ({
        id: d.id || d._id,
        date: d.createdAt ? new Date(d.createdAt).toLocaleString() : 'Unknown',
        earnings: d.riderEarnings || d.deliveryFee || 40,
        status: 'DELIVERED',
        customerName: d.customer?.name || 'Customer',
        distance: d.distanceKm ? `${d.distanceKm.toFixed(1)} km` : 'N/A',
      }));

      saveToStorage(HISTORY_STORAGE_KEY, mappedHistory);

      // Calculate earnings
      const today = new Date().toDateString();
      const todayDeliveries = completedDeliveries.filter(d =>
        d.createdAt && new Date(d.createdAt).toDateString() === today
      );
      const todayEarnings = todayDeliveries.reduce((sum, d) => sum + (d.riderEarnings || d.deliveryFee || 0), 0);
      const weeklyEarnings = completedDeliveries
        .filter(d => d.createdAt && (Date.now() - new Date(d.createdAt).getTime()) < 7 * 86400000)
        .reduce((sum, d) => sum + (d.riderEarnings || d.deliveryFee || 0), 0);

      set({
        completedHistory: mappedHistory,
        earnings: {
          today: todayEarnings,
          count: todayDeliveries.length,
          weekly: weeklyEarnings,
        },
      });
    } catch (error) {
      set({ error: error.message });
      console.warn('Failed to fetch deliveries:', error.message);
    } finally {
      set({ loading: false });
    }
  },

  // ─── Order Actions ───

  toggleAvailability: async () => {
    const { isOnline, authToken, rider } = get();
    const newOnline = !isOnline;

    // Optimistic update
    set({ isOnline: newOnline });

    if (authToken && rider?.id) {
      try {
        await authenticatedRequest(`/riders/${rider.id}/online`, authToken, {
          method: 'PATCH',
          body: JSON.stringify({ isOnline: newOnline }),
        });
      } catch (error) {
        console.warn('Failed to update online status:', error.message);
        set({ isOnline: !newOnline }); // Rollback
      }
    }
  },

  acceptOrder: async () => {
    const { orderRequest, authToken } = get();
    if (!orderRequest) return;

    // Optimistic
    set({ activeOrder: orderRequest, orderRequest: null, orderStep: 1 });

    if (authToken) {
      try {
        await authenticatedRequest(`/deliveries/${orderRequest.id}/accept`, authToken, {
          method: 'POST',
        });
      } catch (error) {
        console.warn('Failed to accept delivery on server:', error.message);
      }
    }
  },

  rejectOrder: async () => {
    const { orderRequest, authToken } = get();
    set({ orderRequest: null });

    if (authToken && orderRequest?.id) {
      try {
        await authenticatedRequest(`/deliveries/${orderRequest.id}/reject`, authToken, {
          method: 'POST',
        });
      } catch (error) {
        console.warn('Failed to reject delivery on server:', error.message);
      }
    }
  },

  completeOrder: async () => {
    const { activeOrder, authToken, earnings, completedHistory } = get();
    if (!activeOrder) return;

    const earningAmount = activeOrder.earnings || 40;

    // Optimistic update
    const newHistory = [{
      id: activeOrder.id,
      date: new Date().toLocaleString(),
      earnings: earningAmount,
      status: 'DELIVERED',
      customerName: activeOrder.customer.name,
      distance: activeOrder.distance,
    }, ...completedHistory].slice(0, 50);

    saveToStorage(HISTORY_STORAGE_KEY, newHistory);
    set({
      activeOrder: null,
      orderStep: 1,
      completedHistory: newHistory,
      earnings: {
        today: earnings.today + earningAmount,
        count: earnings.count + 1,
        weekly: earnings.weekly + earningAmount,
      },
    });

    if (authToken) {
      try {
        await authenticatedRequest(`/deliveries/${activeOrder.id}/complete`, authToken, {
          method: 'POST',
        });
      } catch (error) {
        console.warn('Failed to complete delivery on server:', error.message);
      }
    }
  },

  updateOrderStep: (step) => set({ orderStep: step }),

  setOrderRequest: (order) => set({ orderRequest: order }),

  // ─── Location ───

  updateLocation: async (lat, lng) => {
    const { activeOrder, authToken } = get();
    if (!activeOrder || !authToken) return;

    try {
      await authenticatedRequest(`/deliveries/${activeOrder.id}/location`, authToken, {
        method: 'PATCH',
        body: JSON.stringify({ lat, lng }),
      });
    } catch (error) {
      console.warn('Failed to update location:', error.message);
    }
  },

  // ─── Utility ───

  clearError: () => set({ error: null }),
}));

export default useDeliveryStore;

import { Platform } from 'react-native';

const isDevelopment = __DEV__;
const DEVELOPMENT_IP = '192.168.1.100'; // UPDATE with your machine's IP
const PRODUCTION_URL = 'https://your-production-api.com';

const getBackendUrl = () => {
  if (isDevelopment) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }
    return `http://${DEVELOPMENT_IP}:3000`;
  }
  return PRODUCTION_URL;
};

const getWebSocketUrl = () => {
  const baseUrl = getBackendUrl();
  return baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
};

export const API_CONFIG = {
  BASE_URL: getBackendUrl(),
  WS_URL: getWebSocketUrl(),
  TIMEOUT: 10000,
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    const response = await fetch(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Check your connection.');
    }
    if (error.message?.includes('Network request failed')) {
      throw new Error(`Cannot connect to server at ${API_CONFIG.BASE_URL}.\nCheck:\n1. Backend running on port 3000\n2. Same WiFi network\n3. DEVELOPMENT_IP is correct`);
    }
    throw error;
  }
};

export const authenticatedRequest = async (endpoint, token, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${token}` },
  });
};

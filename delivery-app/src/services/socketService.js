import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/apiConfig';

class DeliverySocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(riderId) {
    if (this.socket && this.isConnected) return;

    try {
      this.socket = io(API_CONFIG.WS_URL, {
        query: { userId: riderId, role: 'rider' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('Delivery socket connected:', this.socket.id);
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Delivery socket disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Delivery socket error:', error);
        this.isConnected = false;
      });
    } catch (error) {
      console.error('Failed to connect delivery socket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  onNewDelivery(callback) {
    if (this.socket) {
      this.socket.on('new_delivery_assigned', callback);
    }
  }

  onUpdateLocation(callback) {
    if (this.socket) {
      this.socket.on('location_update', callback);
    }
  }

  onUpdateStatus(callback) {
    if (this.socket) {
      this.socket.on('delivery_status_update', callback);
    }
  }

  emitLocation(lat, lng) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_location', { lat, lng, timestamp: new Date().toISOString() });
    }
  }
}

export default new DeliverySocketService();

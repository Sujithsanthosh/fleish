// Real-time Sync Service for Admin Panel
// Enables WebSocket connections for live data updates

type EventType = 
  | 'order.created' | 'order.updated' | 'order.cancelled'
  | 'payment.received' | 'payment.refunded'
  | 'vendor.registered' | 'vendor.approved' | 'vendor.rejected'
  | 'delivery.assigned' | 'delivery.completed' | 'delivery.failed'
  | 'subscription.created' | 'subscription.cancelled' | 'subscription.renewed'
  | 'job.application' | 'application.status'
  | 'testimonial.submitted' | 'testimonial.approved'
  | 'user.registered' | 'user.updated';

interface SyncEvent {
  type: EventType;
  data: any;
  timestamp: string;
  source: string;
}

type EventCallback = (data: any) => void;

class RealtimeSyncService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<EventType, Set<EventCallback>> = new Map();
  private isConnected = false;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(private wsUrl: string = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080') {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 Real-time sync connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.startPingInterval();
        
        // Subscribe to all channels
        this.subscribeToChannels();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: SyncEvent = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      this.ws.onclose = () => {
        console.log('🔌 Real-time sync disconnected');
        this.isConnected = false;
        this.stopPingInterval();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      console.error('Failed to connect WebSocket:', err);
    }
  }

  disconnect() {
    this.stopPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPingInterval() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private subscribeToChannels() {
    const channels = [
      'orders', 'payments', 'vendors', 'delivery', 'subscriptions',
      'jobs', 'testimonials', 'users', 'analytics'
    ];
    
    this.ws?.send(JSON.stringify({
      type: 'subscribe',
      channels
    }));
  }

  private handleMessage(message: SyncEvent) {
    const callbacks = this.listeners.get(message.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(message.data);
        } catch (err) {
          console.error('Error in event callback:', err);
        }
      });
    }

    // Broadcast to all wildcard listeners
    const wildcardCallbacks = this.listeners.get('*' as EventType);
    if (wildcardCallbacks) {
      wildcardCallbacks.forEach(callback => {
        try {
          callback(message);
        } catch (err) {
          console.error('Error in wildcard callback:', err);
        }
      });
    }
  }

  on(event: EventType | '*', callback: EventCallback) {
    const key = event as EventType;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  off(event: EventType, callback: EventCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: EventType, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: event,
        data,
        timestamp: new Date().toISOString(),
        source: 'admin-panel'
      }));
    }
  }

  // Helper methods for common operations
  syncOrder(orderId: string) {
    this.emit('order.updated', { orderId });
  }

  syncPayment(paymentId: string) {
    this.emit('payment.received', { paymentId });
  }

  syncVendor(vendorId: string, status: string) {
    this.emit(`vendor.${status}` as EventType, { vendorId });
  }

  syncSubscription(subscriptionId: string, action: 'created' | 'cancelled' | 'renewed') {
    this.emit(`subscription.${action}`, { subscriptionId });
  }

  isRealtimeConnected() {
    return this.isConnected;
  }
}

// Singleton instance
export const realtime = new RealtimeSyncService();

// React hook for using real-time sync
export function useRealtime(event: EventType, callback: EventCallback) {
  useEffect(() => {
    const unsubscribe = realtime.on(event, callback);
    return () => unsubscribe();
  }, [event, callback]);
}

// Hook for multiple events
export function useRealtimeEvents(events: EventType[], callback: (data: any, event: EventType) => void) {
  useEffect(() => {
    const unsubscribes = events.map(event => 
      realtime.on(event, (data) => callback(data, event))
    );
    
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [events, callback]);
}

import { useEffect } from 'react';

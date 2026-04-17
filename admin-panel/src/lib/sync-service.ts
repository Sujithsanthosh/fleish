/**
 * Universal Sync Service for Fleish Platform
 * Ensures real-time synchronization across Admin Panel, Website, Customer App, Vendor App, Delivery App,
 * CA Panel, HR Panel, and Support Panel
 */

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Platform targets for sync
export type PlatformTarget = 
  | 'website'
  | 'customer-app'
  | 'vendor-app' 
  | 'delivery-app'
  | 'ca-panel'
  | 'hr-panel'
  | 'support-panel'
  | 'admin-panel'
  | 'all';

// Sync event types
export type SyncEventType =
  | 'product.created' | 'product.updated' | 'product.deleted' | 'product.price_changed' | 'product.stock_updated'
  | 'order.created' | 'order.updated' | 'order.status_changed' | 'order.cancelled' | 'order.completed'
  | 'user.registered' | 'user.updated' | 'user.deleted' | 'user.blocked' | 'user.unblocked'
  | 'vendor.registered' | 'vendor.approved' | 'vendor.rejected' | 'vendor.updated' | 'vendor.suspended'
  | 'rider.registered' | 'rider.approved' | 'rider.assigned' | 'rider.location_updated' | 'rider.status_changed'
  | 'pricing.updated' | 'subscription.created' | 'subscription.cancelled' | 'subscription.renewed' | 'plan.changed'
  | 'banner.updated' | 'promo.created' | 'promo.ended' | 'testimonial.added' | 'content.published'
  | 'team.member_added' | 'team.member_updated' | 'team.member_removed' | 'role.changed'
  | 'client.added' | 'client.updated' | 'task.created' | 'task.updated' | 'task.completed' | 'document.uploaded'
  | 'gst.filed' | 'compliance.updated'
  | 'ticket.created' | 'ticket.updated' | 'ticket.resolved' | 'chat.message' | 'notification.sent'
  | 'settings.updated' | 'config.changed' | 'feature.toggled'
  | 'app.published' | 'app.unpublished' | 'app.updated' | 'logo.changed'
  | 'sync.broadcast' | 'manual.sync' | '*';  // Added wildcard and internal events

interface SyncPayload {
  event: SyncEventType;
  data: any;
  timestamp: string;
  source: string;
  targets: PlatformTarget[];
  metadata?: {
    userId?: string;
    adminId?: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

interface BroadcastMessage {
  type: SyncEventType;
  data: any;
  timestamp: string;
  source: string;
  targets: PlatformTarget[];
}

// Platform connection status
const platformStatus: Record<PlatformTarget, boolean> = {
  'website': false,
  'customer-app': false,
  'vendor-app': false,
  'delivery-app': false,
  'ca-panel': false,
  'hr-panel': false,
  'support-panel': false,
  'admin-panel': true, // Always connected
  'all': false,
};

// Subscribers
const subscribers: Map<SyncEventType, Set<(payload: SyncPayload) => void>> = new Map();

/**
 * Universal Sync Service
 */
class UniversalSyncService {
  /**
   * Broadcast a sync event to all connected platforms
   */
  broadcast(event: SyncEventType, data: any, targets: PlatformTarget[] = ['all']): void {
    const payload: SyncPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
      source: 'admin-panel',
      targets,
    };

    // Log the sync
    console.log(`🔄 Sync: ${event} → ${targets.join(', ')}`);

    // Notify local subscribers
    this.notifySubscribers(payload);

    // Broadcast to other platforms via Supabase
    this.broadcastToPlatforms(payload);

    // Store sync log
    this.logSyncEvent(payload);
  }

  /**
   * Notify local subscribers
   */
  private notifySubscribers(payload: SyncPayload): void {
    const specificCallbacks = subscribers.get(payload.event);
    specificCallbacks?.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error('Error in sync subscriber:', error);
      }
    });

    // Notify wildcard subscribers
    const wildcardCallbacks = subscribers.get('*');
    wildcardCallbacks?.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error('Error in wildcard subscriber:', error);
      }
    });
  }

  /**
   * Broadcast to platforms via Supabase Realtime
   */
  private async broadcastToPlatforms(payload: SyncPayload): Promise<void> {
    try {
      // Insert into sync_log table for other platforms to poll
      if (supabase) {
        await supabase.from('sync_log').insert({
          event_type: payload.event,
          data: payload.data,
          targets: payload.targets,
          source: payload.source,
          created_at: payload.timestamp,
          processed: false,
        });
      }

      // Also try to send through realtime channel
      if (supabase) {
        const channel = supabase.channel('universal-sync');
        channel.send({
          type: 'broadcast',
          event: payload.event,
          payload: {
            data: payload.data,
            targets: payload.targets,
            timestamp: payload.timestamp,
          },
        });
      }
    } catch (error) {
      console.error('Failed to broadcast:', error);
    }
  }

  /**
   * Log sync event for audit
   */
  private async logSyncEvent(payload: SyncPayload): Promise<void> {
    try {
      if (supabase) {
        await supabase.from('sync_audit_log').insert({
          event_type: payload.event,
          source: payload.source,
          targets: payload.targets,
          data_size: JSON.stringify(payload.data).length,
          created_at: payload.timestamp,
        });
      }
    } catch (error) {
      // Silent fail for logging
      console.warn('Failed to log sync event:', error);
    }
  }

  /**
   * Subscribe to sync events
   */
  subscribe(event: SyncEventType, callback: (payload: SyncPayload) => void): () => void {
    if (!subscribers.has(event)) {
      subscribers.set(event, new Set());
    }
    subscribers.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      subscribers.get(event)?.delete(callback);
    };
  }

  /**
   * Sync specific table data to specific platforms
   */
  async syncTable(table: string, platforms: PlatformTarget[], filter?: string): Promise<void> {
    if (!supabase) {
      console.error('Supabase not available');
      return;
    }

    try {
      let query = supabase.from(table).select('*');
      if (filter) {
        const [column, value] = filter.split('=');
        query = query.eq(column, value);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Broadcast each row
      data?.forEach(row => {
        this.broadcast(`manual.sync` as SyncEventType, {
          table,
          row,
          action: 'SYNC',
        }, platforms);
      });

      console.log(`✅ Synced ${data?.length || 0} rows from ${table} to ${platforms.join(', ')}`);
    } catch (error) {
      console.error(`Failed to sync table ${table}:`, error);
    }
  }

  /**
   * Force full sync of all critical data
   */
  async forceFullSync(): Promise<void> {
    const platforms: PlatformTarget[] = ['website', 'customer-app', 'vendor-app', 'delivery-app'];
    const tables = ['products', 'pricing_plans', 'banners', 'promo_banners', 'testimonials', 'team_members'];

    for (const table of tables) {
      await this.syncTable(table, platforms);
    }

    // Update platform status
    platforms.forEach(p => platformStatus[p] = true);

    console.log('✅ Full sync completed');
  }

  /**
   * Get platform connection status
   */
  getPlatformStatus(): Record<PlatformTarget, boolean> {
    return { ...platformStatus };
  }

  /**
   * Check if platform is connected
   */
  isPlatformConnected(platform: PlatformTarget): boolean {
    return platformStatus[platform] || false;
  }

  /**
   * Update platform connection status
   */
  setPlatformStatus(platform: PlatformTarget, connected: boolean): void {
    platformStatus[platform] = connected;
  }

  /**
   * Revalidate website pages
   */
  async revalidateWebsite(paths: string[]): Promise<void> {
    try {
      for (const path of paths) {
        await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, {
          method: 'POST',
        });
        console.log(`✅ Revalidated: ${path}`);
      }
    } catch (error) {
      console.error('Failed to revalidate website:', error);
    }
  }

  /**
   * Send push notification to mobile apps
   */
  async sendPushNotification(
    target: 'customer-app' | 'vendor-app' | 'delivery-app',
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      if (supabase) {
        await supabase.from('push_notifications').insert({
          target_platform: target,
          title,
          body,
          data: data || {},
          sent: false,
          created_at: new Date().toISOString(),
        });
      }
      console.log(`📱 Push notification queued for ${target}: ${title}`);
    } catch (error) {
      console.error('Failed to queue push notification:', error);
    }
  }

  /**
   * Setup realtime subscriptions for automatic sync
   */
  setupRealtimeSync(): void {
    if (!supabase) {
      console.warn('Supabase not available for realtime sync');
      return;
    }

    const supabaseClient = supabase; // Store in local variable

    const tablesToWatch = [
      { table: 'products', targets: ['website', 'customer-app', 'vendor-app'] as PlatformTarget[] },
      { table: 'orders', targets: ['customer-app', 'vendor-app', 'delivery-app'] as PlatformTarget[] },
      { table: 'vendors', targets: ['vendor-app', 'ca-panel'] as PlatformTarget[] },
      { table: 'pricing_plans', targets: ['website', 'customer-app'] as PlatformTarget[] },
      { table: 'banners', targets: ['website'] as PlatformTarget[] },
      { table: 'promo_banners', targets: ['website', 'customer-app', 'vendor-app'] as PlatformTarget[] },
      { table: 'testimonials', targets: ['website'] as PlatformTarget[] },
      { table: 'team_members', targets: ['website'] as PlatformTarget[] },
      { table: 'ecosystem_apps', targets: ['website', 'customer-app', 'vendor-app', 'delivery-app'] as PlatformTarget[] },
    ];

    tablesToWatch.forEach(({ table, targets }) => {
      supabaseClient
        .channel(`${table}_sync`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          (payload) => {
            const eventType = this.mapEventType(table, payload.eventType);
            if (eventType) {
              this.broadcast(eventType, payload.new || payload.old, targets);
            }
          }
        )
        .subscribe();
    });

    console.log('✅ Realtime sync setup complete');
  }

  /**
   * Map database event to sync event type
   */
  private mapEventType(table: string, dbEvent: string): SyncEventType | null {
    const map: Record<string, Record<string, SyncEventType>> = {
      'products': { INSERT: 'product.created', UPDATE: 'product.updated', DELETE: 'product.deleted' },
      'orders': { INSERT: 'order.created', UPDATE: 'order.status_changed', DELETE: 'order.cancelled' },
      'vendors': { INSERT: 'vendor.registered', UPDATE: 'vendor.updated', DELETE: 'vendor.suspended' },
      'pricing_plans': { INSERT: 'pricing.updated', UPDATE: 'pricing.updated', DELETE: 'plan.changed' },
      'banners': { INSERT: 'banner.updated', UPDATE: 'banner.updated', DELETE: 'banner.updated' },
      'promo_banners': { INSERT: 'promo.created', UPDATE: 'promo.created', DELETE: 'promo.ended' },
      'testimonials': { INSERT: 'testimonial.added', UPDATE: 'testimonial.added', DELETE: 'content.published' },
      'team_members': { INSERT: 'team.member_added', UPDATE: 'team.member_updated', DELETE: 'team.member_removed' },
      'ecosystem_apps': { INSERT: 'app.published', UPDATE: 'app.updated', DELETE: 'app.unpublished' },
    };
    return map[table]?.[dbEvent] || null;
  }
}

// Export singleton
export const syncService = new UniversalSyncService();

// React hook for sync
export function useSync(
  event: SyncEventType | SyncEventType[],
  callback: (payload: SyncPayload) => void
) {
  useEffect(() => {
    const events = Array.isArray(event) ? event : [event];
    const unsubscribes = events.map(e => syncService.subscribe(e, callback));
    return () => unsubscribes.forEach(unsub => unsub());
  }, [event, callback]);
}

// Hook for manual sync operations
export function useSyncOperations() {
  return {
    syncTable: (table: string, platforms: PlatformTarget[]) => 
      syncService.syncTable(table, platforms),
    forceFullSync: () => syncService.forceFullSync(),
    getStatus: () => syncService.getPlatformStatus(),
    revalidateWebsite: (paths: string[]) => syncService.revalidateWebsite(paths),
    sendNotification: (
      target: 'customer-app' | 'vendor-app' | 'delivery-app',
      title: string,
      body: string,
      data?: any
    ) => syncService.sendPushNotification(target, title, body, data),
  };
}

export default syncService;

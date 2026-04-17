"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { syncService, useSync, PlatformTarget } from '@/lib/sync-service';
import { cn } from '@/lib/utils';

interface SyncProviderProps {
  children: React.ReactNode;
}

interface SyncStatus {
  website: boolean;
  'customer-app': boolean;
  'vendor-app': boolean;
  'delivery-app': boolean;
  'ca-panel': boolean;
  'hr-panel': boolean;
  'support-panel': boolean;
}

export function SyncProvider({ children }: SyncProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [platformStatus, setPlatformStatus] = useState<SyncStatus>({
    website: false,
    'customer-app': false,
    'vendor-app': false,
    'delivery-app': false,
    'ca-panel': false,
    'hr-panel': false,
    'support-panel': false,
  });
  const [showSyncPanel, setShowSyncPanel] = useState(false);
  const [syncNotifications, setSyncNotifications] = useState<string[]>([]);

  // Listen to all sync events
  useSync('*', (payload) => {
    const message = `Synced: ${payload.event} → ${payload.targets.join(', ')}`;
    setSyncNotifications(prev => [message, ...prev].slice(0, 5));
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setSyncNotifications(prev => prev.filter(m => m !== message));
    }, 3000);
  });

  useEffect(() => {
    // Setup realtime sync
    syncService.setupRealtimeSync();
    setIsInitialized(true);

    // Update platform status periodically
    const interval = setInterval(() => {
      setPlatformStatus(syncService.getPlatformStatus() as SyncStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleForceSync = async () => {
    await syncService.forceFullSync();
  };

  const connectedCount = Object.values(platformStatus).filter(Boolean).length;
  const totalPlatforms = Object.keys(platformStatus).length;

  return (
    <>
      {children}
      
      {/* Sync Status Indicator */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Sync Notifications */}
        <AnimatePresence>
          {syncNotifications.map((message, index) => (
            <motion.div
              key={message + index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Sync Control Panel Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSyncPanel(!showSyncPanel)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg font-semibold text-sm transition-all",
            connectedCount === totalPlatforms
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
          )}
        >
          {connectedCount === totalPlatforms ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
          <span>Sync: {connectedCount}/{totalPlatforms}</span>
        </motion.button>

        {/* Sync Panel */}
        <AnimatePresence>
          {showSyncPanel && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-[#dbc4a4] p-4 w-72"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1a3c28]">Platform Sync Status</h3>
                <button
                  onClick={() => setShowSyncPanel(false)}
                  className="p-1 hover:bg-[#f0e6d3] rounded-lg transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-4 h-4 text-[#5c3d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {Object.entries(platformStatus).map(([platform, connected]) => (
                  <div key={platform} className="flex items-center justify-between p-2 rounded-lg bg-[#faf9f6]">
                    <span className="text-sm text-[#5c3d1f] capitalize">{platform.replace(/-/g, ' ')}</span>
                    {connected ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleForceSync}
                className="w-full py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Force Full Sync
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default SyncProvider;

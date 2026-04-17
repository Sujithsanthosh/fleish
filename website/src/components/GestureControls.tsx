'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hand,
  Settings,
  X,
  Wifi,
  WifiOff,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointerClick,
  RotateCw,
  Minimize2,
  Maximize2,
  ChevronsUp,
  ChevronsDown,
  Info,
  Sparkles,
  Camera,
  Fingerprint,
  Zap,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useGestureContext } from '@/components/GestureProvider';

type GestureCategory = 'touch' | 'hand';

interface GestureItem {
  emoji: string;
  name: string;
  description: string;
  action: string;
  category: GestureCategory;
  color: string;
}

const allGestures: GestureItem[] = [
  // Touch gestures
  { emoji: '⬆️', name: 'Swipe Up', description: 'Single finger swipe upward', action: 'Scroll page down', category: 'touch', color: '#3B82F6' },
  { emoji: '⬇️', name: 'Swipe Down', description: 'Single finger swipe downward', action: 'Scroll page up', category: 'touch', color: '#10B981' },
  { emoji: '⬅️', name: 'Swipe Left', description: 'Single finger swipe left', action: 'Navigate forward', category: 'touch', color: '#F59E0B' },
  { emoji: '➡️', name: 'Swipe Right', description: 'Single finger swipe right', action: 'Navigate back', category: 'touch', color: '#8B5CF6' },
  { emoji: '👆', name: 'Tap', description: 'Quick single tap', action: 'Select / Click', category: 'touch', color: '#06B6D4' },
  { emoji: '🔄', name: 'Long Press', description: 'Press and hold for 500ms', action: 'Reload page', category: 'touch', color: '#EF4444' },
  { emoji: '⏫', name: '2-Finger Swipe Up', description: 'Two fingers swipe up', action: 'Fast scroll down', category: 'touch', color: '#EC4899' },
  { emoji: '⏬', name: '2-Finger Swipe Down', description: 'Two fingers swipe down', action: 'Fast scroll up', category: 'touch', color: '#14B8A6' },
  { emoji: '🔍', name: 'Pinch In', description: 'Pinch fingers together', action: 'Zoom out', category: 'touch', color: '#F97316' },
  { emoji: '🔎', name: 'Pinch Out', description: 'Spread fingers apart', action: 'Zoom in', category: 'touch', color: '#6366F1' },
  // Hand gestures (camera)
  { emoji: '👆', name: 'Swipe Hand Up', description: 'Move hand upward in air', action: 'Scroll page up', category: 'hand', color: '#3B82F6' },
  { emoji: '👇', name: 'Swipe Hand Down', description: 'Move hand downward in air', action: 'Scroll page down', category: 'hand', color: '#10B981' },
  { emoji: '👈', name: 'Swipe Hand Left', description: 'Move hand left in air', action: 'Navigate back', category: 'hand', color: '#F59E0B' },
  { emoji: '👉', name: 'Swipe Hand Right', description: 'Move hand right in air', action: 'Navigate forward', category: 'hand', color: '#8B5CF6' },
  { emoji: '☝️', name: 'Point (Index Finger)', description: 'Extend only index finger', action: 'Select / Cursor mode', category: 'hand', color: '#0EA5E9' },
  { emoji: '✊', name: 'Closed Fist', description: 'Close all fingers into fist', action: 'Go back', category: 'hand', color: '#EF4444' },
  { emoji: '✋', name: 'Open Palm', description: 'Show open hand, all fingers extended', action: 'Reload page', category: 'hand', color: '#10B981' },
  { emoji: '✌️', name: 'Peace Sign', description: 'Index + middle finger extended', action: 'Scroll to top', category: 'hand', color: '#A855F7' },
  { emoji: '🤟', name: 'Three Fingers', description: 'Index + middle + ring extended', action: 'Scroll to bottom', category: 'hand', color: '#F97316' },
  { emoji: '👍', name: 'Thumbs Up', description: 'Thumb up, fist closed', action: 'Confirm action', category: 'hand', color: '#22C55E' },
  { emoji: '👎', name: 'Thumbs Down', description: 'Thumb down, fist closed', action: 'Cancel action', category: 'hand', color: '#EF4444' },
  { emoji: '🤏', name: 'Pinch (Air)', description: 'Thumb and index finger close', action: 'Zoom toggle', category: 'hand', color: '#6366F1' },
];

export function GestureControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<GestureCategory>('touch');
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    touchEnabled,
    handGestureEnabled,
    setTouchEnabled,
    setHandGestureEnabled,
    handActive,
    handGesture,
    handError,
  } = useGestureContext();

  // Keyboard shortcut: Ctrl+G to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'g' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredGestures = allGestures.filter(g => g.category === activeTab);

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: (handGestureEnabled || touchEnabled)
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
          boxShadow: (handGestureEnabled || touchEnabled)
            ? '0 0 30px rgba(16,185,129,0.4), 0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        aria-label="Gesture Controls"
        id="gesture-controls-btn"
      >
        <Hand size={24} className="text-white" />
        {(handGestureEnabled || touchEnabled) && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-gray-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-22 z-[9997] px-3 py-2 rounded-lg text-xs text-white whitespace-nowrap"
            style={{
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Gesture Controls
            <span className="ml-2 text-gray-400">(Ctrl+G)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997]"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 z-[9998] w-[400px] max-w-[calc(100vw-48px)] max-h-[70vh] overflow-hidden rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(15,15,25,0.98) 0%, rgba(10,10,20,0.95) 100%)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Header */}
              <div className="p-5 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.2) 100%)',
                        border: '1px solid rgba(16,185,129,0.2)',
                      }}
                    >
                      <Sparkles size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base tracking-tight">Gesture Controls</h3>
                      <p className="text-gray-500 text-xs mt-0.5">Navigate with hands & touch</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* Toggle Cards */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {/* Touch Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setTouchEnabled(!touchEnabled)}
                    className="relative p-3 rounded-xl text-left transition-all duration-300 overflow-hidden"
                    style={{
                      background: touchEnabled
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${touchEnabled ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Fingerprint size={16} className={touchEnabled ? 'text-emerald-400' : 'text-gray-500'} />
                      <span className="text-xs font-semibold text-white">Touch</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {touchEnabled ? 'Active' : 'Off'}
                      </span>
                      <div
                        className="w-8 h-4 rounded-full transition-colors relative"
                        style={{ background: touchEnabled ? '#10b981' : '#374151' }}
                      >
                        <motion.div
                          animate={{ x: touchEnabled ? 16 : 2 }}
                          className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-md"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                    {touchEnabled && (
                      <motion.div
                        className="absolute top-0 right-0 w-16 h-16 opacity-10"
                        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      />
                    )}
                  </motion.button>

                  {/* Hand Gesture Toggle */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setHandGestureEnabled(!handGestureEnabled)}
                    className="relative p-3 rounded-xl text-left transition-all duration-300 overflow-hidden"
                    style={{
                      background: handGestureEnabled
                        ? 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0.05) 100%)'
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${handGestureEnabled ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Camera size={16} className={handGestureEnabled ? 'text-cyan-400' : 'text-gray-500'} />
                      <span className="text-xs font-semibold text-white">Camera</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">
                        {handGestureEnabled ? (handActive ? 'Tracking' : 'Loading...') : 'Off'}
                      </span>
                      <div
                        className="w-8 h-4 rounded-full transition-colors relative"
                        style={{ background: handGestureEnabled ? '#06b6d4' : '#374151' }}
                      >
                        <motion.div
                          animate={{ x: handGestureEnabled ? 16 : 2 }}
                          className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-md"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                    {handGestureEnabled && (
                      <motion.div
                        className="absolute top-0 right-0 w-16 h-16 opacity-10"
                        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      />
                    )}
                  </motion.button>
                </div>

                {/* Status bar */}
                {handGestureEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 p-2.5 rounded-lg overflow-hidden"
                    style={{
                      background: handError
                        ? 'rgba(239,68,68,0.08)'
                        : handActive
                          ? 'rgba(16,185,129,0.08)'
                          : 'rgba(249,115,22,0.08)',
                      border: `1px solid ${handError ? 'rgba(239,68,68,0.2)' : handActive ? 'rgba(16,185,129,0.2)' : 'rgba(249,115,22,0.2)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: handError ? '#EF4444' : handActive ? '#10B981' : '#F59E0B',
                          boxShadow: `0 0 8px ${handError ? 'rgba(239,68,68,0.5)' : handActive ? 'rgba(16,185,129,0.5)' : 'rgba(249,115,22,0.5)'}`,
                        }}
                      />
                      <span className="text-[11px] text-gray-300">
                        {handError
                          ? 'Camera access denied'
                          : handActive
                            ? `Hand detected — ${handGesture || 'idle'}`
                            : 'Waiting for hand...'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Tab Switcher */}
              <div className="flex px-5 pt-4 gap-1">
                {[
                  { key: 'touch' as GestureCategory, label: 'Touch Gestures', icon: Fingerprint, count: allGestures.filter(g => g.category === 'touch').length },
                  { key: 'hand' as GestureCategory, label: 'Hand Gestures', icon: Hand, count: allGestures.filter(g => g.category === 'hand').length },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      color: activeTab === tab.key ? '#fff' : '#6b7280',
                      background: activeTab === tab.key ? 'rgba(255,255,255,0.06)' : 'transparent',
                    }}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
                      style={{
                        background: activeTab === tab.key ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                        color: activeTab === tab.key ? '#10b981' : '#6b7280',
                      }}
                    >
                      {tab.count}
                    </span>
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="gesture-tab-indicator"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Gesture List */}
              <div className="px-5 py-3 overflow-y-auto max-h-[35vh] custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'hand' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === 'hand' ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    {filteredGestures.map((gesture, index) => (
                      <motion.div
                        key={gesture.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 cursor-default"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${gesture.color}20`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                        }}
                      >
                        {/* Emoji */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{
                            background: `${gesture.color}10`,
                            border: `1px solid ${gesture.color}15`,
                          }}
                        >
                          {gesture.emoji}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">{gesture.name}</p>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">{gesture.description}</p>
                        </div>

                        {/* Action badge */}
                        <div className="shrink-0">
                          <span
                            className="px-2 py-1 rounded-md text-[10px] font-semibold"
                            style={{
                              background: `${gesture.color}12`,
                              color: gesture.color,
                              border: `1px solid ${gesture.color}15`,
                            }}
                          >
                            {gesture.action}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Shield size={12} />
                    <span>All processing is local & private</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">G</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

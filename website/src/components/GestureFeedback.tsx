'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Hand,
  RotateCw,
  MousePointerClick,
  Minimize2,
  Maximize2,
  ChevronsUp,
  ChevronsDown,
  ThumbsUp,
  ThumbsDown,
  Grab,
  Target,
} from 'lucide-react';

interface GestureFeedbackProps {
  gesture: string | null;
  visible: boolean;
}

const gestureConfig: Record<string, { icon: any; label: string; color: string; emoji: string }> = {
  'swipe-up': { icon: ArrowUp, label: 'Scroll Down', color: '#3B82F6', emoji: '⬆️' },
  'swipe-down': { icon: ArrowDown, label: 'Scroll Up', color: '#10B981', emoji: '⬇️' },
  'swipe-left': { icon: ArrowLeft, label: 'Forward', color: '#F59E0B', emoji: '⬅️' },
  'swipe-right': { icon: ArrowRight, label: 'Back', color: '#8B5CF6', emoji: '➡️' },
  'tap': { icon: MousePointerClick, label: 'Select', color: '#06B6D4', emoji: '👆' },
  'long-press': { icon: RotateCw, label: 'Reload', color: '#EF4444', emoji: '🔄' },
  'two-finger-swipe-up': { icon: ChevronsUp, label: 'Fast Scroll Down', color: '#EC4899', emoji: '⏫' },
  'two-finger-swipe-down': { icon: ChevronsDown, label: 'Fast Scroll Up', color: '#14B8A6', emoji: '⏬' },
  'pinch-in': { icon: Minimize2, label: 'Zoom Out', color: '#F97316', emoji: '🔍' },
  'pinch-out': { icon: Maximize2, label: 'Zoom In', color: '#6366F1', emoji: '🔎' },
  'open-palm': { icon: Hand, label: 'Reload Page', color: '#10B981', emoji: '✋' },
  'fist': { icon: Grab, label: 'Go Back', color: '#EF4444', emoji: '✊' },
  'pointing-up': { icon: Target, label: 'Select Mode', color: '#0EA5E9', emoji: '☝️' },
  'thumbs-up': { icon: ThumbsUp, label: 'Confirm', color: '#22C55E', emoji: '👍' },
  'thumbs-down': { icon: ThumbsDown, label: 'Cancel', color: '#EF4444', emoji: '👎' },
  'peace-sign': { icon: ChevronsUp, label: 'Scroll to Top', color: '#A855F7', emoji: '✌️' },
  'three-fingers': { icon: ChevronsDown, label: 'Scroll to Bottom', color: '#F97316', emoji: '🤟' },
  'pinch-air': { icon: Target, label: 'Zoom Toggle', color: '#6366F1', emoji: '🤏' },
  'swipe-air-left': { icon: ArrowLeft, label: 'Go Back', color: '#F59E0B', emoji: '👈' },
  'swipe-air-right': { icon: ArrowRight, label: 'Go Forward', color: '#8B5CF6', emoji: '👉' },
  'swipe-air-up': { icon: ArrowUp, label: 'Scroll Up', color: '#3B82F6', emoji: '👆' },
  'swipe-air-down': { icon: ArrowDown, label: 'Scroll Down', color: '#10B981', emoji: '👇' },
};

export function GestureFeedback({ gesture, visible }: GestureFeedbackProps) {
  const config = gesture ? gestureConfig[gesture] : null;

  return (
    <AnimatePresence>
      {visible && gesture && config && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div
            className="gesture-feedback-card px-6 py-4 rounded-2xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${config.color}15 0%, ${config.color}08 100%)`,
              borderColor: `${config.color}40`,
              boxShadow: `0 0 40px ${config.color}20, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
              border: `1px solid ${config.color}30`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex items-center gap-4">
              {/* Animated emoji */}
              <motion.span
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-2xl"
              >
                {config.emoji}
              </motion.span>

              {/* Icon with glow */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div
                  className="absolute inset-0 blur-lg rounded-full opacity-60"
                  style={{ backgroundColor: config.color }}
                />
                <config.icon
                  size={28}
                  color={config.color}
                  strokeWidth={2.5}
                  className="relative z-10"
                />
              </motion.div>

              {/* Label */}
              <div>
                <span className="text-white font-bold text-base tracking-wide">
                  {config.label}
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="h-0.5 rounded-full mt-1 origin-left"
                  style={{ backgroundColor: config.color }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

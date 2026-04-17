'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export type GestureType =
  | 'swipe-up'
  | 'swipe-down'
  | 'swipe-left'
  | 'swipe-right'
  | 'tap'
  | 'long-press'
  | 'two-finger-swipe-up'
  | 'two-finger-swipe-down'
  | 'two-finger-swipe-left'
  | 'two-finger-swipe-right'
  | 'pinch-in'
  | 'pinch-out'
  | 'drag';

export interface GestureEvent {
  type: GestureType;
  direction?: 'up' | 'down' | 'left' | 'right';
  deltaX?: number;
  deltaY?: number;
  velocity?: number;
  timestamp: number;
}

export interface UseTouchGestureOptions {
  onGesture?: (event: GestureEvent) => void;
  threshold?: number;
  longPressDuration?: number;
  enabled?: boolean;
}

export function useTouchGesture({
  onGesture,
  threshold = 50,
  longPressDuration = 500,
  enabled = true,
}: UseTouchGestureOptions) {
  const [isGestureActive, setIsGestureActive] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchStartRefs = useRef<Map<number, { x: number; y: number; time: number }>>(new Map());
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDistanceRef = useRef<number | null>(null);

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Track multiple touches
      touchStartRefs.current.clear();
      for (let i = 0; i < e.touches.length; i++) {
        touchStartRefs.current.set(e.touches[i].identifier, {
          x: e.touches[i].clientX,
          y: e.touches[i].clientY,
          time: Date.now(),
        });
      }

      // Initialize pinch distance
      if (e.touches.length === 2) {
        initialDistanceRef.current = getDistance(e.touches[0], e.touches[1]);
      }

      // Long press detection
      if (e.touches.length === 1) {
        longPressTimerRef.current = setTimeout(() => {
          if (touchStartRef.current && onGesture) {
            onGesture({
              type: 'long-press',
              timestamp: Date.now(),
            });
            setIsGestureActive(true);
          }
        }, longPressDuration);
      }

      setIsGestureActive(true);
    },
    [enabled, onGesture, longPressDuration]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStartRef.current) return;

      // Cancel long press if moving
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Pinch detection
      if (e.touches.length === 2 && initialDistanceRef.current !== null) {
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const distanceDelta = currentDistance - initialDistanceRef.current;

        if (Math.abs(distanceDelta) > threshold) {
          if (onGesture) {
            onGesture({
              type: distanceDelta > 0 ? 'pinch-out' : 'pinch-in',
              deltaX,
              deltaY,
              timestamp: Date.now(),
            });
          }
          initialDistanceRef.current = currentDistance;
        }
        return;
      }

      // Two-finger swipe detection
      if (e.touches.length === 2) {
        if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
          let gestureType: GestureType = 'two-finger-swipe-up';

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            gestureType = deltaX > 0 ? 'two-finger-swipe-right' : 'two-finger-swipe-left';
          } else {
            gestureType = deltaY > 0 ? 'two-finger-swipe-down' : 'two-finger-swipe-up';
          }

          if (onGesture) {
            onGesture({
              type: gestureType,
              deltaX,
              deltaY,
              velocity: Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime,
              timestamp: Date.now(),
            });
          }
        }
        return;
      }

      // Single-finger swipe detection (only on end, but we track here)
    },
    [enabled, threshold, onGesture]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStartRef.current) return;

      // Clear long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Tap detection
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        if (onGesture) {
          onGesture({
            type: 'tap',
            timestamp: Date.now(),
          });
        }
        setIsGestureActive(false);
        touchStartRef.current = null;
        return;
      }

      // Swipe detection
      if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        let gestureType: GestureType = 'swipe-up';
        let direction: 'up' | 'down' | 'left' | 'right' = 'up';

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            gestureType = 'swipe-right';
            direction = 'right';
          } else {
            gestureType = 'swipe-left';
            direction = 'left';
          }
        } else {
          if (deltaY > 0) {
            gestureType = 'swipe-down';
            direction = 'down';
          } else {
            gestureType = 'swipe-up';
            direction = 'up';
          }
        }

        if (onGesture) {
          onGesture({
            type: gestureType,
            direction,
            deltaX,
            deltaY,
            velocity: Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime,
            timestamp: Date.now(),
          });
        }
      }

      setIsGestureActive(false);
      touchStartRef.current = null;
      initialDistanceRef.current = null;
    },
    [enabled, threshold, onGesture]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isGestureActive,
  };
}

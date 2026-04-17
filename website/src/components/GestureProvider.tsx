'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useTouchGesture, GestureEvent } from '@/hooks/useTouchGesture';
import { useHandGesture, HandGestureEvent } from '@/hooks/useHandGesture';
import { GestureFeedback } from '@/components/GestureFeedback';

interface GestureContextType {
  lastGesture: string | null;
  dispatchGesture: (action: string) => void;
  touchEnabled: boolean;
  handGestureEnabled: boolean;
  setTouchEnabled: (enabled: boolean) => void;
  setHandGestureEnabled: (enabled: boolean) => void;
  handActive: boolean;
  handGesture: string;
  handError: string | null;
}

const GestureContext = createContext<GestureContextType | null>(null);

export function useGestureContext() {
  const context = useContext(GestureContext);
  if (!context) {
    throw new Error('useGestureContext must be used within GestureProvider');
  }
  return context;
}

interface GestureProviderProps {
  children: ReactNode;
}

export function GestureProvider({ children }: GestureProviderProps) {
  const [lastGesture, setLastGesture] = useState<string | null>(null);
  const [gestureVisible, setGestureVisible] = useState(false);
  const [touchEnabled, setTouchEnabled] = useState(true);
  const [handGestureEnabled, setHandGestureEnabled] = useState(false);

  const showGesture = useCallback((gesture: string) => {
    setLastGesture(gesture);
    setGestureVisible(true);
    setTimeout(() => {
      setGestureVisible(false);
    }, 1000);
  }, []);

  const handleTouchGesture = useCallback(
    (event: GestureEvent) => {
      showGesture(event.type);

      switch (event.type) {
        case 'swipe-up':
          window.scrollBy({ top: 300, behavior: 'smooth' });
          break;
        case 'swipe-down':
          window.scrollBy({ top: -300, behavior: 'smooth' });
          break;
        case 'swipe-left':
          window.history.forward();
          break;
        case 'swipe-right':
          window.history.back();
          break;
        case 'tap':
          // Select/click - handled by native touch
          break;
        case 'long-press':
          window.location.reload();
          break;
        case 'two-finger-swipe-up':
          window.scrollBy({ top: 600, behavior: 'smooth' });
          break;
        case 'two-finger-swipe-down':
          window.scrollBy({ top: -600, behavior: 'smooth' });
          break;
        case 'pinch-in':
          document.documentElement.style.fontSize = '90%';
          setTimeout(() => {
            document.documentElement.style.fontSize = '100%';
          }, 2000);
          break;
        case 'pinch-out':
          document.documentElement.style.fontSize = '110%';
          setTimeout(() => {
            document.documentElement.style.fontSize = '100%';
          }, 2000);
          break;
        default:
          break;
      }
    },
    [showGesture]
  );

  const handleHandGesture = useCallback(
    (event: HandGestureEvent) => {
      showGesture(event.gesture);

      switch (event.gesture) {
        case 'swipe-air-up':
          window.scrollBy({ top: -250, behavior: 'smooth' });
          break;
        case 'swipe-air-down':
          window.scrollBy({ top: 250, behavior: 'smooth' });
          break;
        case 'swipe-air-left':
          window.history.back();
          break;
        case 'swipe-air-right':
          window.history.forward();
          break;
        case 'pointing-up':
          // Select mode - click element under cursor
          break;
        case 'fist':
          // Go back
          window.history.back();
          break;
        case 'open-palm':
          // Reload
          window.location.reload();
          break;
        case 'peace-sign':
          // Scroll to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'three-fingers':
          // Scroll to bottom
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          break;
        case 'thumbs-up':
          // Confirm / positive 
          break;
        case 'thumbs-down':
          // Cancel / negative
          break;
        case 'pinch-air':
          // Zoom toggle
          break;
        default:
          break;
      }
    },
    [showGesture]
  );

  useTouchGesture({
    onGesture: handleTouchGesture,
    threshold: 50,
    longPressDuration: 500,
    enabled: touchEnabled,
  });

  const { isActive: handActive, currentGesture: handGesture, error: handError } = useHandGesture({
    onGesture: handleHandGesture,
    enabled: handGestureEnabled,
    cooldownMs: 600,
    swipeThreshold: 0.08,
  });

  const dispatchGesture = useCallback((action: string) => {
    showGesture(action);
  }, [showGesture]);

  return (
    <GestureContext.Provider
      value={{
        lastGesture,
        dispatchGesture,
        touchEnabled,
        handGestureEnabled,
        setTouchEnabled,
        setHandGestureEnabled,
        handActive,
        handGesture,
        handError,
      }}
    >
      {children}
      <GestureFeedback gesture={lastGesture} visible={gestureVisible} />
    </GestureContext.Provider>
  );
}

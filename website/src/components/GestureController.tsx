"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useHandGestures, GestureType } from "@/hooks/useHandGestures";
import { GestureOverlay } from "./GestureOverlay";
import { GestureIcon } from "./GestureIcon";

interface GestureControllerProps {
  children: React.ReactNode;
  enabled?: boolean;
}

const gestureDescriptions: Record<GestureType, { label: string; icon: string; action: string }> = {
  swipe_up: { label: "Swipe Up", icon: "arrow-up", action: "Scroll Up" },
  swipe_down: { label: "Swipe Down", icon: "arrow-down", action: "Scroll Down" },
  swipe_left: { label: "Swipe Left", icon: "arrow-left", action: "Previous Page" },
  swipe_right: { label: "Swipe Right", icon: "arrow-right", action: "Next Page" },
  select: { label: "Select", icon: "pointer", action: "Click/Select" },
  back: { label: "Back", icon: "undo", action: "Go Back" },
  reload: { label: "Reload", icon: "refresh-cw", action: "Refresh Page" },
  scroll_up: { label: "Scroll Up", icon: "chevron-up", action: "Scroll Up" },
  scroll_down: { label: "Scroll Down", icon: "chevron-down", action: "Scroll Down" },
  pinch: { label: "Pinch", icon: "maximize", action: "Zoom" },
  open_palm: { label: "Open Palm", icon: "hand", action: "Stop" },
  closed_fist: { label: "Closed Fist", icon: "fist", action: "Grab" },
  point: { label: "Point", icon: "mouse-pointer", action: "Move Cursor" },
  none: { label: "None", icon: "hand", action: "No Action" },
};

export function GestureController({ children, enabled = true }: GestureControllerProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [recentGesture, setRecentGesture] = useState<GestureType>("none");
  const [gestureHistory, setGestureHistory] = useState<GestureType[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [isActive, setIsActive] = useState(enabled);

  const { state, setVideoRef, setCanvasRef, onGesture, isInitialized } = useHandGestures(isActive);

  const executeGestureAction = useCallback((gesture: GestureType) => {
    setRecentGesture(gesture);
    setGestureHistory((prev) => [gesture, ...prev].slice(0, 5));

    switch (gesture) {
      case "swipe_up":
      case "scroll_up":
        window.scrollBy({ top: -300, behavior: "smooth" });
        break;
      case "swipe_down":
      case "scroll_down":
        window.scrollBy({ top: 300, behavior: "smooth" });
        break;
      case "swipe_left":
        router.back();
        break;
      case "swipe_right":
        // Could navigate forward if history allows
        break;
      case "back":
        router.back();
        break;
      case "reload":
        window.location.reload();
        break;
      case "select":
        // Trigger click at cursor position
        const element = document.elementFromPoint(
          (cursorPosition.x / 100) * window.innerWidth,
          (cursorPosition.y / 100) * window.innerHeight
        );
        if (element) {
          (element as HTMLElement).click();
        }
        break;
      case "point":
        // Cursor is already updated via hand position
        break;
      default:
        break;
    }
  }, [cursorPosition, router]);

  useEffect(() => {
    onGesture(executeGestureAction);
  }, [onGesture, executeGestureAction]);

  // Update cursor position based on hand tracking
  useEffect(() => {
    if (state.handPosition && state.currentGesture === "point") {
      setCursorPosition({
        x: (1 - state.handPosition.x) * 100,
        y: state.handPosition.y * 100,
      });
    }
  }, [state.handPosition, state.currentGesture]);

  // Keyboard shortcut to toggle gesture mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "g" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsActive((prev) => !prev);
        setShowOverlay((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowOverlay(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {children}

      {/* Gesture Toggle Button */}
      <button
        onClick={() => {
          setIsActive(!isActive);
          setShowOverlay(!showOverlay);
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
          isActive
            ? "bg-green-500 hover:bg-green-600 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
        }`}
        title={isActive ? "Disable Hand Gestures (Ctrl+G)" : "Enable Hand Gestures (Ctrl+G)"}
      >
        <GestureIcon name="hand" className="w-6 h-6" />
      </button>

      {/* Virtual Cursor */}
      {isActive && state.handDetected && (
        <div
          className="fixed w-6 h-6 pointer-events-none z-[9999] transition-all duration-100 ease-out"
          style={{
            left: `${cursorPosition}%`,
            top: `${cursorPosition.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-full h-full rounded-full bg-green-500/50 border-2 border-green-400 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-green-400" />
        </div>
      )}

      {/* Gesture Feedback */}
      {isActive && recentGesture !== "none" && (
        <div className="fixed top-6 right-6 z-50 pointer-events-none">
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-700 shadow-xl animate-in slide-in-from-right">
            <div className="flex items-center gap-3">
              <GestureIcon name={gestureDescriptions[recentGesture].icon} className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">{gestureDescriptions[recentGesture].label}</p>
                <p className="text-xs text-gray-400">{gestureDescriptions[recentGesture].action}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gesture History */}
      {isActive && gestureHistory.length > 0 && (
        <div className="fixed bottom-24 right-6 z-40">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Recent Gestures</p>
            <div className="flex gap-2">
              {gestureHistory.map((gesture, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"
                  title={gestureDescriptions[gesture].label}
                >
                  <GestureIcon name={gestureDescriptions[gesture].icon} className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gesture Overlay with Camera Feed */}
      <GestureOverlay
        isOpen={showOverlay}
        onClose={() => setShowOverlay(false)}
        videoRef={setVideoRef}
        canvasRef={setCanvasRef}
        handDetected={state.handDetected}
        currentGesture={state.currentGesture}
        confidence={state.confidence}
        gestureDescriptions={gestureDescriptions}
      />
    </>
  );
}

"use client";

import React from "react";
import { X, Hand, Info } from "lucide-react";
import { GestureType } from "@/hooks/useHandGestures";

interface GestureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  videoRef: (el: HTMLVideoElement | null) => void;
  canvasRef: (el: HTMLCanvasElement | null) => void;
  handDetected: boolean;
  currentGesture: GestureType;
  confidence: number;
  gestureDescriptions: Record<GestureType, { label: string; icon: string; action: string }>;
}

export function GestureOverlay({
  isOpen,
  onClose,
  videoRef,
  canvasRef,
  handDetected,
  currentGesture,
  confidence,
  gestureDescriptions,
}: GestureOverlayProps) {
  if (!isOpen) return null;

  const gestures = [
    { gesture: "swipe_up" as GestureType, desc: "Swipe hand up to scroll up" },
    { gesture: "swipe_down" as GestureType, desc: "Swipe hand down to scroll down" },
    { gesture: "swipe_left" as GestureType, desc: "Swipe left to go back" },
    { gesture: "select" as GestureType, desc: "Point with index finger & hold to click" },
    { gesture: "back" as GestureType, desc: "Closed fist to go back" },
    { gesture: "reload" as GestureType, desc: "Open palm to reload page" },
  ];

  return (
    <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Hand className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Hand Gesture Control</h2>
              <p className="text-sm text-gray-400">Control the website with your hands</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Camera Feed */}
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-700">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full transform -scale-x-100"
                width={320}
                height={240}
              />

              {/* Status Indicator */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    handDetected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                <span className="text-xs text-white/80 font-medium">
                  {handDetected ? "Hand Detected" : "No Hand"}
                </span>
              </div>

              {/* Current Gesture */}
              {handDetected && currentGesture !== "none" && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
                    <p className="text-sm font-medium text-green-400">
                      {gestureDescriptions[currentGesture]?.label || currentGesture}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {!handDetected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Hand className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Show your hand to begin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tip */}
            <div className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">
                Make sure your hand is well-lit and clearly visible. The camera works best with good lighting.
              </p>
            </div>
          </div>

          {/* Gesture Guide */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Available Gestures</h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {gestures.map(({ gesture, desc }) => (
                <div
                  key={gesture}
                  className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                    currentGesture === gesture
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentGesture === gesture ? "bg-green-500/20" : "bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">
                      {gesture.includes("up") && "↑"}
                      {gesture.includes("down") && "↓"}
                      {gesture.includes("left") && "←"}
                      {gesture.includes("right") && "→"}
                      {gesture === "select" && "☝️"}
                      {gesture === "back" && "✊"}
                      {gesture === "reload" && "✋"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {gestureDescriptions[gesture]?.label || gesture}
                    </p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  {currentGesture === gesture && (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>

            {/* Keyboard Shortcut Reminder */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">Ctrl</kbd> +{" "}
                <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300">G</kbd> to toggle gesture mode
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GestureType =
  | "swipe_up"
  | "swipe_down"
  | "swipe_left"
  | "swipe_right"
  | "select"
  | "back"
  | "reload"
  | "scroll_up"
  | "scroll_down"
  | "pinch"
  | "open_palm"
  | "closed_fist"
  | "point"
  | "none";

interface GestureConfig {
  swipeThreshold: number;
  scrollThreshold: number;
  gestureCooldown: number;
}

interface HandPosition {
  x: number;
  y: number;
  z: number;
}

interface GestureState {
  currentGesture: GestureType;
  confidence: number;
  handDetected: boolean;
  handPosition: HandPosition | null;
}

const defaultConfig: GestureConfig = {
  swipeThreshold: 50,
  scrollThreshold: 30,
  gestureCooldown: 800,
};

export function useHandGestures(
  enabled: boolean = true,
  config: Partial<GestureConfig> = {}
) {
  const mergedConfig = { ...defaultConfig, ...config };
  const [state, setState] = useState<GestureState>({
    currentGesture: "none",
    confidence: 0,
    handDetected: false,
    handPosition: null,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const lastGestureTime = useRef<number>(0);
  const positionHistory = useRef<HandPosition[]>([]);
  const gestureCallback = useRef<((gesture: GestureType) => void) | null>(null);

  const detectGesture = useCallback(
    (landmarks: any[]): GestureType => {
      if (!landmarks || landmarks.length < 21) return "none";

      const wrist = landmarks[0];
      const indexTip = landmarks[8];
      const middleTip = landmarks[12];
      const ringTip = landmarks[16];
      const pinkyTip = landmarks[20];
      const thumbTip = landmarks[4];
      const indexMCP = landmarks[5];
      const middleMCP = landmarks[9];

      // Add to position history for swipe detection
      positionHistory.current.push({ x: wrist.x, y: wrist.y, z: wrist.z });
      if (positionHistory.current.length > 10) {
        positionHistory.current.shift();
      }

      // Swipe detection
      if (positionHistory.current.length >= 5) {
        const recent = positionHistory.current.slice(-5);
        const first = recent[0];
        const last = recent[recent.length - 1];
        const dx = (first.x - last.x) * 1000;
        const dy = (first.y - last.y) * 1000;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > mergedConfig.swipeThreshold) return "swipe_right";
          if (dx < -mergedConfig.swipeThreshold) return "swipe_left";
        } else {
          if (dy > mergedConfig.scrollThreshold) return "scroll_up";
          if (dy < -mergedConfig.scrollThreshold) return "scroll_down";
        }
      }

      // Finger states (extended or curled)
      const isFingerExtended = (tip: any, mcp: any) =>
        Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2)) >
        Math.sqrt(Math.pow(mcp.x - wrist.x, 2) + Math.pow(mcp.y - wrist.y, 2)) * 1.2;

      const indexExtended = isFingerExtended(indexTip, indexMCP);
      const middleExtended = isFingerExtended(middleTip, middleMCP);
      const ringExtended = isFingerExtended(ringTip, landmarks[13]);
      const pinkyExtended = isFingerExtended(pinkyTip, landmarks[17]);
      const thumbExtended =
        Math.sqrt(Math.pow(thumbTip.x - wrist.x, 2) + Math.pow(thumbTip.y - wrist.y, 2)) > 0.15;

      // Gesture detection
      const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

      // Closed fist (back gesture)
      if (extendedCount === 0 && !thumbExtended) {
        return "back";
      }

      // Open palm (reload gesture when held)
      if (extendedCount === 4 && thumbExtended) {
        return "reload";
      }

      // Point/Select (only index extended)
      if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        // Check if hand is stable for select
        if (positionHistory.current.length >= 3) {
          const recent = positionHistory.current.slice(-3);
          const variance = recent.reduce((sum, pos, i) => {
            if (i === 0) return 0;
            return sum + Math.abs(pos.x - recent[i - 1].x) + Math.abs(pos.y - recent[i - 1].y);
          }, 0);
          if (variance < 0.01) return "select";
        }
        return "point";
      }

      // Pinch gesture (thumb and index close together)
      const pinchDistance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2)
      );
      if (pinchDistance < 0.05 && extendedCount >= 2) {
        return "pinch";
      }

      return "none";
    },
    [mergedConfig]
  );

  const onResults = useCallback(
    (results: any) => {
      if (!canvasRef.current || !videoRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const gesture = detectGesture(landmarks);

        // Draw hand skeleton
        drawHandSkeleton(ctx, landmarks, canvas.width, canvas.height);

        // Update state
        const now = Date.now();
        const canTriggerGesture = now - lastGestureTime.current > mergedConfig.gestureCooldown;

        if (gesture !== "none" && canTriggerGesture) {
          lastGestureTime.current = now;
          setState({
            currentGesture: gesture,
            confidence: results.multiHandedness?.[0]?.score || 0.8,
            handDetected: true,
            handPosition: { x: landmarks[9].x, y: landmarks[9].y, z: landmarks[9].z },
          });
          gestureCallback.current?.(gesture);
        } else {
          setState((prev) => ({
            ...prev,
            handDetected: true,
            handPosition: { x: landmarks[9].x, y: landmarks[9].y, z: landmarks[9].z },
          }));
        }
      } else {
        setState((prev) => ({ ...prev, handDetected: false, currentGesture: "none" }));
      }

      ctx.restore();
    },
    [detectGesture, mergedConfig.gestureCooldown]
  );

  const drawHandSkeleton = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    width: number,
    height: number
  ) => {
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#00ff88";

    // Draw landmarks
    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark.x * width, landmark.y * height, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20],
      [5, 9], [9, 13], [13, 17],
    ];

    ctx.beginPath();
    connections.forEach(([start, end]) => {
      ctx.moveTo(landmarks[start].x * width, landmarks[start].y * height);
      ctx.lineTo(landmarks[end].x * width, landmarks[end].y * height);
    });
    ctx.stroke();
  };

  const initHands = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const { Hands } = await import("@mediapipe/hands");
      const { Camera } = await import("@mediapipe/camera_utils");

      handsRef.current = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      handsRef.current.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      handsRef.current.onResults(onResults);

      if (videoRef.current) {
        cameraRef.current = new Camera(videoRef.current, {
          onFrame: async () => {
            await handsRef.current?.send({ image: videoRef.current! });
          },
          width: 320,
          height: 240,
        });

        await cameraRef.current.start();
      }
    } catch (error) {
      console.error("Failed to initialize hand tracking:", error);
    }
  }, [onResults]);

  const stopHands = useCallback(() => {
    cameraRef.current?.stop();
    handsRef.current?.close();
    cameraRef.current = null;
    handsRef.current = null;
  }, []);

  useEffect(() => {
    if (enabled) {
      initHands();
    } else {
      stopHands();
    }

    return () => {
      stopHands();
    };
  }, [enabled, initHands, stopHands]);

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
  }, []);

  const setCanvasRef = useCallback((el: HTMLCanvasElement | null) => {
    canvasRef.current = el;
  }, []);

  const onGesture = useCallback((callback: (gesture: GestureType) => void) => {
    gestureCallback.current = callback;
  }, []);

  return {
    state,
    setVideoRef,
    setCanvasRef,
    onGesture,
    isInitialized: !!handsRef.current,
  };
}

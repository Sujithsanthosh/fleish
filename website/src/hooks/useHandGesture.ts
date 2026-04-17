'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type HandGesture =
  | 'none'
  | 'open-palm'
  | 'fist'
  | 'pointing-up'
  | 'thumbs-up'
  | 'thumbs-down'
  | 'swipe-air-left'
  | 'swipe-air-right'
  | 'swipe-air-up'
  | 'swipe-air-down'
  | 'pinch-air'
  | 'peace-sign'
  | 'three-fingers';

export interface HandGestureEvent {
  gesture: HandGesture;
  confidence: number;
  handPosition?: { x: number; y: number; z: number };
  timestamp: number;
}

interface UseHandGestureOptions {
  onGesture?: (event: HandGestureEvent) => void;
  enabled?: boolean;
  cooldownMs?: number;
  swipeThreshold?: number;
}

function detectStaticGesture(landmarks: any[]): HandGesture {
  if (!landmarks || landmarks.length === 0) return 'none';

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];
  const wrist = landmarks[0];
  const indexMCP = landmarks[5];
  const middleMCP = landmarks[9];
  const thumbIP = landmarks[3];

  // Use y-comparison for finger extension (camera-relative)
  const isIndexExtended = indexTip.y < indexMCP.y;
  const isMiddleExtended = middleTip.y < middleMCP.y;
  const isRingExtended = ringTip.y < landmarks[13].y;
  const isPinkyExtended = pinkyTip.y < landmarks[17].y;

  // Thumb detection is more complex (lateral movement)
  const isThumbExtended = Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbIP.x - wrist.x) * 1.3;

  const thumbIndexDist = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) +
    Math.pow(thumbTip.y - indexTip.y, 2)
  );

  // Pinch: thumb and index close
  if (thumbIndexDist < 0.05 && isIndexExtended) {
    return 'pinch-air';
  }

  // Peace sign: index + middle extended, rest curled
  if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'peace-sign';
  }

  // Three fingers: index + middle + ring extended
  if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) {
    return 'three-fingers';
  }

  // Point: only index extended
  if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    return 'pointing-up';
  }

  // Open palm: all fingers extended
  if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
    return 'open-palm';
  }

  // Fist: no fingers extended
  if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    // Check for thumbs up/down
    if (isThumbExtended) {
      return thumbTip.y < wrist.y ? 'thumbs-up' : 'thumbs-down';
    }
    return 'fist';
  }

  return 'none';
}

export function useHandGesture({
  onGesture,
  enabled = false,
  cooldownMs = 600,
  swipeThreshold = 0.08,
}: UseHandGestureOptions) {
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<HandGesture>('none');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const previousPositionsRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const lastGestureTimeRef = useRef<number>(0);
  const lastSwipeTimeRef = useRef<number>(0);
  const onGestureRef = useRef(onGesture);

  // Keep callback ref updated without re-running effect
  useEffect(() => {
    onGestureRef.current = onGesture;
  }, [onGesture]);

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;
    let hands: any;

    const emitGesture = (gesture: HandGesture, confidence: number, handPosition?: { x: number; y: number; z: number }) => {
      const now = Date.now();
      if (now - lastGestureTimeRef.current < cooldownMs) return;
      lastGestureTimeRef.current = now;

      setCurrentGesture(gesture);
      if (onGestureRef.current && gesture !== 'none') {
        onGestureRef.current({
          gesture,
          confidence,
          handPosition,
          timestamp: now,
        });
      }
    };

    const emitSwipe = (gesture: HandGesture, confidence: number, handPosition?: { x: number; y: number; z: number }) => {
      const now = Date.now();
      // Swipes have their own separate cooldown
      if (now - lastSwipeTimeRef.current < cooldownMs * 1.5) return;
      lastSwipeTimeRef.current = now;
      lastGestureTimeRef.current = now;

      setCurrentGesture(gesture);
      if (onGestureRef.current) {
        onGestureRef.current({
          gesture,
          confidence,
          handPosition,
          timestamp: now,
        });
      }
    };

    const setupHandDetection = async () => {
      try {
        const handsModule = await import('@mediapipe/hands');
        const Hands = handsModule.Hands;

        hands = new Hands({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            setIsActive(true);

            const landmarks = results.multiHandLandmarks[0];
            const handPosition = {
              x: landmarks[9].x,
              y: landmarks[9].y,
              z: landmarks[9].z,
            };

            // Store position history for swipe detection
            const now = Date.now();
            previousPositionsRef.current.push({ x: handPosition.x, y: handPosition.y, time: now });
            // Keep last 8 frames
            if (previousPositionsRef.current.length > 8) {
              previousPositionsRef.current.shift();
            }

            // Swipe detection with velocity check
            const positions = previousPositionsRef.current;
            if (positions.length >= 5) {
              const oldest = positions[0];
              const newest = positions[positions.length - 1];
              const deltaX = newest.x - oldest.x;
              const deltaY = newest.y - oldest.y;
              const timeDelta = newest.time - oldest.time;

              // Only detect swipes that happen in < 400ms
              if (timeDelta < 400 && timeDelta > 50) {
                const absX = Math.abs(deltaX);
                const absY = Math.abs(deltaY);

                if (absX > swipeThreshold && absX > absY * 1.3) {
                  const airGesture: HandGesture = deltaX > 0 ? 'swipe-air-right' : 'swipe-air-left';
                  emitSwipe(airGesture, 0.85, handPosition);
                  previousPositionsRef.current = []; // Reset after swipe
                  return;
                } else if (absY > swipeThreshold && absY > absX * 1.3) {
                  const airGesture: HandGesture = deltaY > 0 ? 'swipe-air-down' : 'swipe-air-up';
                  emitSwipe(airGesture, 0.85, handPosition);
                  previousPositionsRef.current = []; // Reset after swipe
                  return;
                }
              }
            }

            // Static gesture detection
            const gesture = detectStaticGesture(landmarks);
            if (gesture !== 'none') {
              emitGesture(gesture, 0.9, handPosition);
            } else {
              setCurrentGesture('none');
            }
          } else {
            setIsActive(false);
            setCurrentGesture('none');
            previousPositionsRef.current = [];
          }
        });

        handsRef.current = hands;

        // Access camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        });

        streamRef.current = stream;

        const video = document.createElement('video');
        video.srcObject = stream;
        video.width = 640;
        video.height = 480;
        video.play();
        videoRef.current = video;

        // Process frames
        const processFrame = async () => {
          if (video.readyState >= 2) {
            await hands.send({ image: video });
          }
          animationId = requestAnimationFrame(processFrame);
        };

        processFrame();
      } catch (err) {
        console.error('Hand detection setup error:', err);
        setError('Failed to initialize hand detection. Please grant camera permission.');
      }
    };

    setupHandDetection();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (handsRef.current) {
        handsRef.current.close();
      }
    };
  }, [enabled, cooldownMs, swipeThreshold]);

  return {
    isActive,
    currentGesture,
    error,
    videoRef,
  };
}

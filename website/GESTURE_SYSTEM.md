# Hand, Touch & Voice Control System

This Next.js website includes AI-powered hand gesture controls using MediaPipe Hands, comprehensive touch gesture support, and full voice command control using the Web Speech API.

## Features

### Touch Gestures (Mobile/Tablet)
- **Swipe Up**: Scroll page down
- **Swipe Down**: Scroll page up
- **Swipe Left**: Navigate forward
- **Swipe Right**: Navigate back
- **Tap**: Select / Click
- **Long Press (500ms)**: Reload page
- **2-Finger Swipe Up**: Fast scroll down
- **2-Finger Swipe Down**: Fast scroll up
- **Pinch In**: Zoom out
- **Pinch Out**: Zoom in

### Hand Gestures (Camera-based)
- **Swipe Hand Up**: Scroll page up
- **Swipe Hand Down**: Scroll page down
- **Swipe Hand Left**: Navigate back
- **Swipe Hand Right**: Navigate forward
- **Point (Index Finger)**: Select / Cursor mode
- **Closed Fist ✊**: Go back
- **Open Palm ✋**: Reload page
- **Peace Sign ✌️**: Scroll to top
- **Three Fingers 🤟**: Scroll to bottom
- **Thumbs Up 👍**: Confirm action
- **Thumbs Down 👎**: Cancel action
- **Pinch (Air) 🤏**: Zoom toggle

### Voice Commands (Speech-based) 🎙️
#### Navigation
- **"Go home"** / **"Home page"**: Navigate to home
- **"Go to about"** / **"About us"**: Scroll to About section
- **"Show pricing"** / **"How much"**: Scroll to Pricing
- **"Contact us"** / **"Get in touch"**: Scroll to Contact
- **"How it works"**: Scroll to How It Works
- **"Order now"** / **"Ecosystem"**: Scroll to Ecosystem
- **"Partner with us"**: Go to Partner page
- **"Become vendor"**: Go to Vendor page
- **"Show jobs"** / **"Careers"**: Go to Careers page

#### Scrolling
- **"Scroll up"** / **"Go up"**: Scroll page up
- **"Scroll down"** / **"Go down"**: Scroll page down
- **"Scroll to top"** / **"Back to top"**: Jump to top
- **"Scroll to bottom"** / **"End of page"**: Jump to bottom

#### Page Actions
- **"Go back"** / **"Back"**: Browser back
- **"Go forward"** / **"Forward"**: Browser forward
- **"Reload"** / **"Refresh"**: Reload page

#### Interface
- **"Dark mode"**: Switch to dark theme
- **"Light mode"**: Switch to light theme
- **"Open search"** / **"Find"**: Open command palette
- **"Fullscreen"**: Toggle fullscreen
- **"Zoom in"** / **"Zoom out"**: Adjust text size
- **"Reset zoom"**: Reset to default size

## How to Use

### Opening the Gesture Panel
1. **Click the Hand Button**: Look for the green floating button at the bottom-right corner
2. **Keyboard Shortcut**: Press `Ctrl + G` to toggle the panel

### Enabling Voice Commands 🎙️
1. **Click the Microphone Button**: Look for the purple floating button next to the gesture button
2. **Keyboard Shortcut**: Press `Ctrl + Shift + V` to toggle voice listening
3. **Speak naturally**: Say commands like "scroll down", "go to pricing", or "open search"
4. **Visual feedback**: Real-time waveform, transcript display, and command confirmation toast

### Enabling Gesture Modes
- **Touch** toggle: Enables swipe, tap, pinch gestures on touch devices (enabled by default)
- **Camera** toggle: Activates webcam-based hand tracking using MediaPipe

### Visual Feedback
- Animated gesture feedback popup appears at bottom-center when gestures are detected
- Shows emoji, icon, and action description
- Camera status indicator shows hand detection state
- Voice command toast shows recognized command with confidence level

## Browser Support

Requires a webcam and modern browser with WebGL support for hand gestures:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Voice commands require Web Speech API support:
- Chrome/Edge (best support)
- Safari 14.1+
- Firefox (limited support)

Touch gestures work on all modern mobile browsers.

## Privacy

All hand tracking and voice recognition is performed locally in your browser. No video or audio data is sent to any server.

## Installation

If dependencies aren't installed yet, run:

```bash
cd website
npm install @mediapipe/camera_utils @mediapipe/control_utils @mediapipe/drawing_utils @mediapipe/hands --legacy-peer-deps
```

## Architecture

```
src/
├── hooks/
│   ├── useHandGesture.ts    # MediaPipe hand tracking hook with gesture detection
│   ├── useTouchGesture.ts   # Touch event gesture detection hook
│   └── useVoiceCommand.ts   # Web Speech API voice command hook
├── components/
│   ├── GestureProvider.tsx   # Context provider - orchestrates gesture handling
│   ├── GestureControls.tsx   # Settings panel UI with gesture reference
│   ├── GestureFeedback.tsx   # Animated feedback popup for detected gestures
│   ├── GestureController.tsx # Camera overlay with hand skeleton visualization
│   ├── GestureOverlay.tsx    # Full-screen camera view with gesture guide
│   ├── GestureIcon.tsx       # Icon mapping utility
│   └── VoiceCommandUI.tsx    # Voice command panel with waveform & transcript
```

## Troubleshooting

- **Camera not working**: Ensure you've granted camera permissions in your browser
- **Gestures not detected**: Ensure good lighting and clear hand visibility
- **Too many triggers**: Gesture cooldown is set to 600ms to prevent rapid-fire events
- **Laggy performance**: Close other browser tabs to free GPU resources
- **Microphone not working**: Ensure browser has microphone permission granted
- **Voice commands not recognized**: Speak clearly at a moderate pace; check browser compatibility
- **Voice keeps stopping**: Chrome may stop after silence; the system auto-restarts

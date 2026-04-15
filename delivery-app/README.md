# Fleish Delivery - Partner App

Fleish Delivery is a high-performance, safety-first mobile application designed for delivery partners. It is optimized for one-handed operation and works reliably on low-end devices in varied network conditions.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd delivery-app
   npm install
   ```

2. **Start the App**:
   ```bash
   npx expo start
   ```

## 📂 Project Structure

- `app/`: Expo Router navigation.
  - `(auth)`: Rider login and OTP verification.
  - `(tabs)`: Dashboard (Availability), Earnings, History, and Profile.
  - `order-modal`: High-priority pop-up for new delivery requests with auto-timeout.
  - `navigation`: Step-by-step delivery workflow from pickup to drop.
- `src/`: Core logic.
  - `store/`: Zustand state for real-time order tracking and availability.
  - `theme/`: High-contrast, large-button design tokens.

## ✨ Key Features

- **Availability Toggle**: Large, rider-friendly "GO ONLINE / OFFLINE" switches.
- **New Order Request**: Popup with loud vibration and high-contrast earnings visibility.
- **Workflow Navigation**: 5-step guided flow (Arrived at Shop -> Pickup -> Arrived at Customer -> OTP/Photo Confirmation).
- **Google Maps Integration**: One-tap link to open destination in external navigation.
- **Incentive Progress**: Visual tracking of daily targets and additional earnings.

## 🎨 Design System
- **Colors**: High-contrast safety colors (Safety Yellow, Deep Green, Alert Red).
- **Control**: BIG buttons (min 64px height) optimized for fast interaction.
- **Reliability**: Minimal animations and efficient state handling for low-end devices.

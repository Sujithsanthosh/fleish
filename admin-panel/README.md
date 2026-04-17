# Fleish Admin - Hyperlocal Operational Panel

Fleish Admin is a production-grade enterprise dashboard for managing the Fleish Fresh delivery ecosystem. It features a robust Dynamic RBAC system that adapts the entire UI based on user permissions.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   cd admin-panel
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Key Architecture Features

### 🔐 Dynamic RBAC (Role-Based Access Control)
- **Module-Level Visibility**: Modules like `Payments`, `Roles`, and `Settings` are automatically hidden from the sidebar if the user lacks `VIEW` permission.
- **Action-Level Control**: Buttons like "Reassign Vendor" or "Cancel Order" are conditionally rendered based on `EDIT` / `DELETE` permissions within the Order module.
- **Zustand Auth Store**: Centralized permission logic in `src/store/useAuthStore.ts` for fast, reactive UI updates.

### 📱 Implemented Modules
- **Overview Dashboard**: High-level KPI tracking with Recharts integration.
- **Live Tracking**: Real-time simulation of Rider, Vendor, and Customer locations.
- **Order Management**: Advanced data tables with multi-status filtering and operational actions.
- **Support System**: Ticket management with an interactive chat resolution interface.
- **Role Management**: Centralized UI to manage role-based permission matrices.

## 🎨 Design System
- **Framework**: Next.js 14+ (App Router).
- **Styling**: TailwindCSS for rapid, consistent layout.
- **Icons**: Lucide React.
- **Charts**: Recharts for data visualization.

## 🛡️ Security
- **Protected Layout**: Dashboard views are wrapped in a layout that validates auth state.
- **Permission Guards**: Modules use `hasPermission` check before mounting critical actions.

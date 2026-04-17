# Fleish Backend - Hyperlocal Delivery Engine

The core engine powering Fleish Fresh, Vendor, and Delivery apps. Built for scale, reliability, and real-time operations.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Real-time**: Socket.io (WebSockets)
- **Background Jobs**: BullMQ + Redis (for Smart Assignment)
- **Payments**: Razorpay
- **Containerization**: Ready for Docker/Kubernetes

## 🏗 Modular Architecture

1. **Auth Service**: Phone-based OTP login & JWT role management.
2. **Order Engine**: Lifecycle management (Created -> Assigned -> Accepted -> Delivered).
3. **Smart Assignment**: Finds nearest available vendors & riders based on geo-location and load.
4. **Real-time Gateway**: Push updates to all party apps (Customer, Vendor, Rider).
5. **Payment Gateway**: Secure transaction handling with Razorpay.

## 🚀 Getting Started

1. **Setup Database**:
   Ensure PostgreSQL and Redis are running. Create a DB named `fleish_fresh`.

2. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your keys.

4. **Start Development Server**:
   ```bash
   npm run start:dev
   ```

## 🧠 Smart Assignment Flow

1. Order placed -> Search for nearest vendors (spatial filter).
2. Assign best match -> Order status: `VENDOR_ASSIGNED`.
3. Background job: Start 30s timeout.
4. If vendor rejects/timeouts -> Automatically re-assign to next best vendor.
5. Once vendor accepts -> Search and assign nearest available rider.

## 🔒 Security
- JWT header authentication.
- Role-based Access Control (RBAC).
- Input validation using `class-validator`.

-- Fleish Fresh Complete Database Migration
-- Created: 2026-04-10
-- This migration creates all tables, enums, indexes, and relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- CLEANUP EXISTING TABLES (if any)
-- ==========================================

-- Drop tables in reverse dependency order to avoid FK constraint errors
-- CASCADE will automatically drop dependent objects (indexes, triggers, etc.)
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS settlements CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing enums if they exist (safe with CASCADE)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS delivery_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS settlement_status CASCADE;
DROP TYPE IF EXISTS application_status CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;

-- User Roles
CREATE TYPE user_role AS ENUM (
  'customer',
  'vendor',
  'rider',
  'admin',
  'hr',
  'ca',
  'support'
);

-- Order Status
CREATE TYPE order_status AS ENUM (
  'created',
  'vendor_assigned',
  'accepted',
  'cutting',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

-- Delivery Status
CREATE TYPE delivery_status AS ENUM (
  'assigned',
  'picked_up',
  'arrived_at_drop',
  'delivered',
  'failed'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

-- Ticket Status
CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'resolved',
  'closed'
);

-- Settlement Status
CREATE TYPE settlement_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

-- Application Status
CREATE TYPE application_status AS ENUM (
  'under_review',
  'interview',
  'approved',
  'rejected'
);

-- Subscription Status
CREATE TYPE subscription_status AS ENUM (
  'active',
  'expired',
  'cancelled',
  'pending'
);

-- ==========================================
-- TABLES
-- ==========================================

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  email VARCHAR,
  role user_role DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  fcm_token VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  rating DOUBLE PRECISION DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  current_load INTEGER DEFAULT 0,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description VARCHAR,
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR NOT NULL,
  is_available BOOLEAN DEFAULT true,
  category VARCHAR,
  vendor_id UUID REFERENCES vendors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status order_status DEFAULT 'created',
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address VARCHAR,
  delivery_lat DOUBLE PRECISION,
  delivery_lng DOUBLE PRECISION,
  user_id UUID NOT NULL REFERENCES users(id),
  vendor_id UUID REFERENCES vendors(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries Table
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status delivery_status DEFAULT 'assigned',
  otp VARCHAR,
  rider_id UUID REFERENCES users(id),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id),
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  razorpay_order_id VARCHAR NOT NULL,
  razorpay_payment_id VARCHAR,
  status payment_status DEFAULT 'pending',
  amount DECIMAL(10, 2) NOT NULL,
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Tickets Table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject VARCHAR NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  created_by_id UUID NOT NULL REFERENCES users(id),
  assigned_to_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settlements Table
CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  status settlement_status DEFAULT 'pending',
  payee_id UUID NOT NULL REFERENCES users(id),
  processed_by_id UUID REFERENCES users(id),
  transaction_reference VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  email VARCHAR,
  applying_for_role user_role NOT NULL,
  resume_url VARCHAR,
  documents JSONB,
  status application_status DEFAULT 'under_review',
  reviewed_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans Table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER DEFAULT 30,
  is_free_delivery BOOLEAN DEFAULT false,
  min_order_for_free_delivery DECIMAL(10, 2) DEFAULT 0,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  is_priority BOOLEAN DEFAULT false,
  is_multi_user BOOLEAN DEFAULT false,
  benefits TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
-- Note: userId and planId are exposed as both FK relations and raw columns per TypeORM pattern
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status subscription_status DEFAULT 'pending',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_id VARCHAR,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

-- Users
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Vendors
CREATE INDEX idx_vendors_owner ON vendors(owner_id);
CREATE INDEX idx_vendors_available ON vendors(is_available);

-- Products
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available);

-- Orders
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Deliveries
CREATE INDEX idx_deliveries_rider ON deliveries(rider_id);
CREATE INDEX idx_deliveries_order ON deliveries(order_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- Payments
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay_order ON payments(razorpay_order_id);

-- Support Tickets
CREATE INDEX idx_tickets_created_by ON support_tickets(created_by_id);
CREATE INDEX idx_tickets_assigned_to ON support_tickets(assigned_to_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);

-- Settlements
CREATE INDEX idx_settlements_payee ON settlements(payee_id);
CREATE INDEX idx_settlements_processed_by ON settlements(processed_by_id);
CREATE INDEX idx_settlements_status ON settlements(status);

-- Job Applications
CREATE INDEX idx_applications_role ON job_applications(applying_for_role);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_applications_phone ON job_applications(phone);

-- Subscription Plans
CREATE INDEX idx_plans_active ON subscription_plans(is_active);

-- User Subscriptions
CREATE INDEX idx_user_subs_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subs_plan ON user_subscriptions(plan_id);
CREATE INDEX idx_user_subs_status ON user_subscriptions(status);
CREATE INDEX idx_user_subs_dates ON user_subscriptions(start_date, end_date);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subs_updated_at BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ENABLE REALTIME FOR ALL TABLES
-- ==========================================

-- Enable realtime for all tables (for Supabase Realtime subscriptions)
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE settlements;
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE subscription_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE user_subscriptions;

-- ==========================================
-- SEED DATA - Subscription Plans
-- ==========================================

INSERT INTO subscription_plans (id, name, price, duration_days, is_free_delivery, min_order_for_free_delivery, discount_percentage, is_priority, is_multi_user, benefits) VALUES
('00000000-0000-0000-0000-000000000001', 'Free', 0, 36500, false, 0, 0, false, false, ARRAY['Standard delivery charges', 'Basic order tracking', 'Customer support']),
('00000000-0000-0000-0000-000000000002', 'Basic', 99, 30, false, 199, 5, false, false, ARRAY['Free delivery on orders above ₹199', '5% discount on all orders', 'Priority customer support', 'Early access to offers']),
('00000000-0000-0000-0000-000000000003', 'Pro', 199, 30, true, 0, 10, true, false, ARRAY['Free delivery on all orders', '10% discount on every order', 'Priority order processing', 'Exclusive member deals', 'Premium customer support', 'No surge pricing']),
('00000000-0000-0000-0000-000000000004', 'Family', 299, 30, true, 0, 15, true, true, ARRAY['Everything in Pro plan', 'Multi-user access (up to 4)', 'Bulk order discounts (15%)', 'Scheduled weekly delivery', 'Dedicated account manager', 'Free premium cuts upgrade', 'Family recipe recommendations'])
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE users IS 'All users in the system (customers, vendors, riders, admin, hr, ca, support)';
COMMENT ON TABLE vendors IS 'Vendor shops with location and availability';
COMMENT ON TABLE products IS 'Products/meat items offered by vendors';
COMMENT ON TABLE orders IS 'Customer orders with delivery details';
COMMENT ON TABLE deliveries IS 'Delivery tracking with rider assignments';
COMMENT ON TABLE payments IS 'Payment records with Razorpay integration';
COMMENT ON TABLE support_tickets IS 'Customer support ticket system';
COMMENT ON TABLE settlements IS 'Financial settlements for vendors/riders';
COMMENT ON TABLE job_applications IS 'HR job applications and hiring pipeline';
COMMENT ON TABLE subscription_plans IS 'Subscription plans for customers';
COMMENT ON TABLE user_subscriptions IS 'Active user subscriptions';

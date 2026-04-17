-- Fleish Admin Panel Database Schema
-- Run this in Supabase SQL Editor

-- Pricing Plans Table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  monthly_price INTEGER NOT NULL,
  yearly_price INTEGER,
  popular BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT 'blue',
  features JSONB DEFAULT '[]',
  limits JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Applications Table
CREATE TABLE IF NOT EXISTS vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  business_type TEXT,
  gst_number TEXT,
  fssai_number TEXT,
  pan_number TEXT,
  bank_account_number TEXT,
  bank_ifsc TEXT,
  bank_name TEXT,
  documents JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  commission_rate INTEGER DEFAULT 15,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery Partners Table
CREATE TABLE IF NOT EXISTS delivery_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  alternate_phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  vehicle_type TEXT,
  vehicle_number TEXT,
  license_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  documents JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0,
  commission_per_delivery INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  plan_id UUID REFERENCES pricing_plans(id),
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  billing_cycle TEXT DEFAULT 'monthly',
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  payment_method TEXT,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Transactions Table
CREATE TABLE IF NOT EXISTS subscription_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'completed',
  payment_method TEXT,
  transaction_id TEXT,
  refunded_amount INTEGER DEFAULT 0,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Careers/Job Postings Table
CREATE TABLE IF NOT EXISTS careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT,
  type TEXT DEFAULT 'full-time',
  experience TEXT,
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]',
  responsibilities JSONB DEFAULT '[]',
  benefits JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  applications_count INTEGER DEFAULT 0,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  current_company TEXT,
  current_position TEXT,
  experience_years INTEGER,
  expected_salary TEXT,
  notice_period TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending',
  category TEXT DEFAULT 'customer',
  featured BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID
);

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT,
  bio TEXT,
  avatar TEXT,
  location TEXT,
  joined_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_github TEXT,
  skills JSONB DEFAULT '[]',
  achievements JSONB DEFAULT '[]',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ecosystem Apps Table
CREATE TABLE IF NOT EXISTS ecosystem_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT 'blue',
  features JSONB DEFAULT '[]',
  screenshots JSONB DEFAULT '[]',
  play_store_url TEXT,
  app_store_url TEXT,
  web_url TEXT,
  version TEXT DEFAULT '1.0.0',
  status TEXT DEFAULT 'active',
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo Banners Table
CREATE TABLE IF NOT EXISTS promo_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  position TEXT DEFAULT 'homepage',
  background_color TEXT DEFAULT '#3b82f6',
  text_color TEXT DEFAULT '#ffffff',
  button_text TEXT,
  button_color TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON vendor_applications(status);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_status ON delivery_partners(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_career_id ON job_applications(career_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(featured);
CREATE INDEX IF NOT EXISTS idx_team_members_department ON team_members(department);
CREATE INDEX IF NOT EXISTS idx_team_members_is_public ON team_members(is_public);
CREATE INDEX IF NOT EXISTS idx_careers_status ON careers(status);
CREATE INDEX IF NOT EXISTS idx_ecosystem_apps_type ON ecosystem_apps(type);
CREATE INDEX IF NOT EXISTS idx_promo_banners_position ON promo_banners(position);
CREATE INDEX IF NOT EXISTS idx_promo_banners_is_active ON promo_banners(is_active);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow admin full access" ON pricing_plans FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON vendor_applications FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON delivery_partners FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON subscriptions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON subscription_transactions FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON careers FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON job_applications FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON testimonials FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON team_members FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON ecosystem_apps FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Allow admin full access" ON promo_banners FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data
INSERT INTO pricing_plans (name, description, monthly_price, yearly_price, color, features, popular) VALUES
('Free', 'Basic features for individuals', 0, 0, 'slate', '["Browse products", "View prices", "Basic support"]', FALSE),
('Basic', 'Perfect for home chefs', 199, 1990, 'emerald', '["Everything in Free", "5% discount on orders", "Priority delivery", "Email support"]', FALSE),
('Pro', 'Best for restaurants', 499, 4990, 'violet', '["Everything in Basic", "10% discount on orders", "Free delivery", "24/7 phone support", "Dedicated account manager"]', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO ecosystem_apps (name, type, description, color, features, version, status, downloads, rating, reviews) VALUES
('Fleish Customer', 'customer', 'Browse, order, and track fresh meat deliveries', 'emerald', '["Real-time tracking", "Multiple payment options", "Subscription plans"]', '2.5.1', 'active', 50000, 4.6, 1250),
('Fleish Vendor', 'vendor', 'Manage inventory and track orders', 'orange', '["Inventory management", "Order tracking", "Revenue analytics"]', '2.3.0', 'active', 8500, 4.4, 320),
('Fleish Delivery', 'delivery', 'Optimized routes for riders', 'cyan', '["Route optimization", "Earnings tracker", "Live navigation"]', '1.8.5', 'active', 12000, 4.5, 480)
ON CONFLICT DO NOTHING;

-- Add foreign key constraints after all tables are created
ALTER TABLE job_applications ADD CONSTRAINT fk_job_applications_career 
  FOREIGN KEY (career_id) REFERENCES careers(id) ON DELETE SET NULL;

-- Create index for career_id
CREATE INDEX IF NOT EXISTS idx_job_applications_career_id ON job_applications(career_id);

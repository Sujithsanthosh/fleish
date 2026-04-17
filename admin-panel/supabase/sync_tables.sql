-- Universal Sync Service Database Schema
-- Creates tables needed for cross-platform synchronization

-- ==========================================
-- Sync Log Table
-- Stores all sync events for platforms to poll
-- ==========================================
CREATE TABLE IF NOT EXISTS sync_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    targets TEXT[] NOT NULL DEFAULT '{}',
    source TEXT NOT NULL DEFAULT 'admin-panel',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by TEXT,
    retry_count INTEGER DEFAULT 0
);

-- Enable RLS on sync_log
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read sync_log
CREATE POLICY "Allow read sync_log" ON sync_log
    FOR SELECT TO authenticated USING (true);

-- Allow admin to insert sync_log
CREATE POLICY "Allow insert sync_log" ON sync_log
    FOR INSERT TO authenticated WITH CHECK (source = 'admin-panel');

-- Allow admin to update sync_log
CREATE POLICY "Allow update sync_log" ON sync_log
    FOR UPDATE TO authenticated USING (true);

-- Create index for efficient polling
CREATE INDEX IF NOT EXISTS idx_sync_log_processed ON sync_log(processed, created_at);
CREATE INDEX IF NOT EXISTS idx_sync_log_targets ON sync_log USING GIN(targets);
CREATE INDEX IF NOT EXISTS idx_sync_log_event_type ON sync_log(event_type);

-- ==========================================
-- Sync Audit Log Table
-- For tracking and debugging sync operations
-- ==========================================
CREATE TABLE IF NOT EXISTS sync_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    targets TEXT[] NOT NULL,
    data_size INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sync_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read audit_log" ON sync_audit_log
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert audit_log" ON sync_audit_log
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON sync_audit_log(created_at DESC);

-- ==========================================
-- Push Notifications Table
-- For mobile app push notifications
-- ==========================================
CREATE TABLE IF NOT EXISTS push_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_platform TEXT NOT NULL CHECK (target_platform IN ('customer-app', 'vendor-app', 'delivery-app')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id),
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE,
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read own notifications" ON push_notifications
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Allow admin to manage notifications" ON push_notifications
    FOR ALL TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_push_notifications_user ON push_notifications(user_id, sent, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_notifications_platform ON push_notifications(target_platform, sent);

-- ==========================================
-- Platform Sync Status Table
-- Tracks connection status of each platform
-- ==========================================
CREATE TABLE IF NOT EXISTS platform_sync_status (
    platform TEXT PRIMARY KEY CHECK (platform IN (
        'website', 'customer-app', 'vendor-app', 'delivery-app',
        'ca-panel', 'hr-panel', 'support-panel', 'admin-panel'
    )),
    connected BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    config JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default records
INSERT INTO platform_sync_status (platform, connected) VALUES
    ('website', FALSE),
    ('customer-app', FALSE),
    ('vendor-app', FALSE),
    ('delivery-app', FALSE),
    ('ca-panel', FALSE),
    ('hr-panel', FALSE),
    ('support-panel', FALSE),
    ('admin-panel', TRUE)
ON CONFLICT (platform) DO NOTHING;

-- Enable RLS
ALTER TABLE platform_sync_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read platform_status" ON platform_sync_status
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin to update platform_status" ON platform_sync_status
    FOR ALL TO authenticated USING (true);

-- ==========================================
-- Platform-Specific Data Tables
-- For website data
-- ==========================================
CREATE TABLE IF NOT EXISTS website_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_key TEXT NOT NULL UNIQUE,
    content_data JSONB NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_from TEXT
);

CREATE INDEX IF NOT EXISTS idx_website_content_type ON website_content(content_type);
CREATE INDEX IF NOT EXISTS idx_website_content_key ON website_content(content_key);

-- ==========================================
-- App-Specific Data Tables
-- ==========================================
CREATE TABLE IF NOT EXISTS app_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    platform TEXT NOT NULL CHECK (platform IN ('customer-app', 'vendor-app', 'delivery-app')),
    data JSONB NOT NULL,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, platform)
);

CREATE TABLE IF NOT EXISTS app_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    platform TEXT NOT NULL CHECK (platform IN ('customer-app', 'vendor-app', 'delivery-app')),
    data JSONB NOT NULL,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(order_id, platform)
);

-- ==========================================
-- Enable Realtime for all sync tables
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE sync_log;
ALTER PUBLICATION supabase_realtime ADD TABLE push_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_sync_status;

-- ==========================================
-- Functions for Sync Management
-- ==========================================

-- Function to clean old sync logs
CREATE OR REPLACE FUNCTION cleanup_sync_logs(days INTEGER DEFAULT 7)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sync_log
    WHERE processed = TRUE
      AND created_at < NOW() - INTERVAL '1 day' * days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get pending sync items for a platform
CREATE OR REPLACE FUNCTION get_pending_sync(
    p_platform TEXT,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    id UUID,
    event_type TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.event_type, s.data, s.created_at
    FROM sync_log s
    WHERE NOT s.processed
      AND p_platform = ANY(s.targets)
    ORDER BY s.created_at ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark sync items as processed
CREATE OR REPLACE FUNCTION mark_sync_processed(
    p_ids UUID[],
    p_processed_by TEXT DEFAULT 'system'
)
RETURNS VOID AS $$
BEGIN
    UPDATE sync_log
    SET processed = TRUE,
        processed_at = NOW(),
        processed_by = p_processed_by
    WHERE id = ANY(p_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Triggers for automatic updates
-- ==========================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to website_content
DROP TRIGGER IF EXISTS update_website_content_timestamp ON website_content;
CREATE TRIGGER update_website_content_timestamp
    BEFORE UPDATE ON website_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply to platform_sync_status
DROP TRIGGER IF EXISTS update_platform_status_timestamp ON platform_sync_status;
CREATE TRIGGER update_platform_status_timestamp
    BEFORE UPDATE ON platform_sync_status
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Comments
-- ==========================================
COMMENT ON TABLE sync_log IS 'Stores all sync events for platforms to poll and process';
COMMENT ON TABLE sync_audit_log IS 'Audit trail for all sync operations';
COMMENT ON TABLE push_notifications IS 'Queue for mobile app push notifications';
COMMENT ON TABLE platform_sync_status IS 'Connection status of each platform';
COMMENT ON TABLE website_content IS 'Website-specific content synced from admin panel';
COMMENT ON TABLE app_products IS 'Product data cached for mobile apps';
COMMENT ON TABLE app_orders IS 'Order data cached for mobile apps';

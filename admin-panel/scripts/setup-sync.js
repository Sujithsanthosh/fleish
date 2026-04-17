/**
 * Universal Sync Setup Script
 * Initializes sync service and tests connections
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read SQL file
const sqlFile = path.join(__dirname, '..', 'supabase', 'sync_tables.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSync() {
  console.log('🚀 Setting up Universal Sync Service...\n');

  try {
    // Execute SQL to create tables
    console.log('📦 Creating sync tables...');
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql });
    
    if (sqlError) {
      console.log('⚠️  SQL execution failed, trying direct query...');
      // Tables might already exist, continue
    } else {
      console.log('✅ Sync tables created\n');
    }

    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['sync_log', 'push_notifications', 'platform_sync_status']);

    if (tablesError) {
      throw tablesError;
    }

    const existingTables = tables?.map(t => t.table_name) || [];
    const requiredTables = ['sync_log', 'push_notifications', 'platform_sync_status'];
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables.join(', '));
      console.log('Please run supabase/sync_tables.sql manually in Supabase Dashboard\n');
    } else {
      console.log('✅ All sync tables exist\n');
    }

    // Insert initial platform status
    console.log('📡 Initializing platform connections...');
    const platforms = [
      { platform: 'website', connected: false },
      { platform: 'customer-app', connected: false },
      { platform: 'vendor-app', connected: false },
      { platform: 'delivery-app', connected: false },
      { platform: 'ca-panel', connected: false },
      { platform: 'hr-panel', connected: false },
      { platform: 'support-panel', connected: false },
      { platform: 'admin-panel', connected: true },
    ];

    for (const p of platforms) {
      const { error } = await supabase
        .from('platform_sync_status')
        .upsert(p, { onConflict: 'platform' });
      
      if (error) {
        console.log(`⚠️  Failed to set status for ${p.platform}:`, error.message);
      }
    }

    console.log('✅ Platform status initialized\n');

    // Test realtime connection
    console.log('🔌 Testing realtime connection...');
    const channel = supabase.channel('test-sync');
    
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Realtime connection successful\n');
        
        // Send test broadcast
        channel.send({
          type: 'broadcast',
          event: 'sync.test',
          payload: { message: 'Setup complete' },
        });
        
        // Cleanup
        setTimeout(() => {
          channel.unsubscribe();
          console.log('\n🎉 Universal Sync Service setup complete!');
          console.log('\nNext steps:');
          console.log('1. Add SyncProvider to your layout.tsx');
          console.log('2. Test by making changes in admin panel');
          console.log('3. Check other platforms see the changes\n');
          process.exit(0);
        }, 1000);
      } else if (status === 'CHANNEL_ERROR') {
        console.log('❌ Realtime connection failed\n');
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup
setupSync();

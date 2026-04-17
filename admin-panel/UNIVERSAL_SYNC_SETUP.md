# Universal Sync Service Setup Guide

## Overview

The Universal Sync Service ensures all changes made in the Admin Panel automatically reflect across:
- **Website** (Next.js)
- **Customer App** (React Native/Expo)
- **Vendor App** (React Native/Expo)
- **Delivery App** (React Native/Expo)
- **CA Panel** (Electron/Next.js)
- **HR Panel** (Electron/Next.js)
- **Support Panel** (Electron/Next.js)

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Panel    │────▶│  Supabase       │◀────│  Website        │
│  (Changes made) │     │  (Realtime DB)  │     │  (Auto-update)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
         ▼              ▼                 ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│ Customer App    │  │ Vendor App   │  │ Delivery App │
│ (Push Notif)    │  │ (Sync Data)  │  │ (Live Track) │
└─────────────────┘  └──────────────┘  └──────────────┘
```

## Setup Steps

### 1. Database Setup

Run the SQL script to create sync tables:

```bash
# Using Supabase CLI
supabase db reset
supabase db push

# Or run directly in Supabase SQL Editor
cat supabase/sync_tables.sql | pbcopy
# Paste in Supabase Dashboard > SQL Editor
```

### 2. Environment Variables

Add to `.env.local`:

```env
# Sync Service
NEXT_PUBLIC_SYNC_ENABLED=true
REVALIDATION_SECRET=your-secret-key-here
NEXT_PUBLIC_WS_URL=ws://localhost:8080

# Platform URLs (for webhook notifications)
WEBSITE_URL=https://fleish.com
CUSTOMER_APP_API=https://api-customer.fleish.com
VENDOR_APP_API=https://api-vendor.fleish.com
DELIVERY_APP_API=https://api-delivery.fleish.com
```

### 3. Integrate SyncProvider

Add to your root layout (`app/layout.tsx`):

```tsx
import { SyncProvider } from '@/components/SyncProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SyncProvider>
          {children}
        </SyncProvider>
      </body>
    </html>
  );
}
```

### 4. Use Sync in Components

#### Automatic Sync (Real-time)
Changes are automatically synced when you use the API:

```tsx
import { api } from '@/lib/api';

// This automatically triggers sync to all platforms
await api.updateProduct(id, { price: 299 });
```

#### Manual Sync

```tsx
import { useSyncOperations } from '@/lib/sync-service';

function MyComponent() {
  const { syncTable, forceFullSync, revalidateWebsite } = useSyncOperations();
  
  const handleSync = async () => {
    // Sync specific table to specific platforms
    await syncTable('products', ['website', 'customer-app']);
    
    // Revalidate website pages
    await revalidateWebsite(['/', '/products', '/shop']);
  };
  
  const handleFullSync = async () => {
    await forceFullSync();
  };
  
  return (
    <button onClick={handleSync}>Sync Products</button>
  );
}
```

#### Subscribe to Sync Events

```tsx
import { useSync } from '@/lib/sync-service';

function MyComponent() {
  useSync('product.updated', (payload) => {
    console.log('Product updated:', payload.data);
    // Refresh your component data
  });
  
  useSync(['order.created', 'order.updated'], (payload) => {
    // Handle multiple events
    console.log('Order change:', payload);
  });
}
```

## How It Works

### 1. Automatic Real-time Sync
When you make changes in the admin panel:

1. **Database Change** → Supabase triggers realtime event
2. **Sync Service** catches the event and broadcasts to:
   - Other platforms via Supabase Realtime
   - Push notifications to mobile apps
   - Website revalidation via API

### 2. Platform-Specific Sync

Each platform receives only relevant data:

| Table | Website | Customer App | Vendor App | Delivery App |
|-------|---------|--------------|------------|--------------|
| products | ✓ | ✓ | ✓ | ✗ |
| orders | ✗ | ✓ | ✓ | ✓ |
| banners | ✓ | ✓ | ✗ | ✗ |
| pricing | ✓ | ✓ | ✗ | ✗ |
| riders | ✗ | ✗ | ✗ | ✓ |

### 3. Sync Status UI

The SyncProvider shows a floating widget:
- **Green**: All platforms connected
- **Amber**: Some platforms offline
- Shows sync notifications for each change
- **Force Full Sync** button for manual sync

## Supported Sync Events

### Products
- `product.created` - New product added
- `product.updated` - Product details changed
- `product.deleted` - Product removed
- `product.price_changed` - Price update
- `product.stock_updated` - Inventory change

### Orders
- `order.created` - New order placed
- `order.updated` - Order modified
- `order.status_changed` - Status updated
- `order.cancelled` - Order cancelled
- `order.completed` - Order delivered

### Users
- `user.registered` - New user signup
- `user.updated` - Profile updated
- `user.blocked` / `user.unblocked` - Access control

### Vendors
- `vendor.registered` - New vendor application
- `vendor.approved` / `vendor.rejected` - Application status
- `vendor.updated` - Details changed
- `vendor.suspended` - Account suspended

### Pricing
- `pricing.updated` - Plan changes
- `subscription.created` / `cancelled` / `renewed`

### Content
- `banner.updated` - Homepage banners
- `promo.created` / `ended` - Promotions
- `testimonial.added` - Customer reviews
- `content.published` - CMS updates

### Team & HR
- `team.member_added` / `updated` / `removed`
- `role.changed` - Permission changes

### Support
- `ticket.created` / `updated` / `resolved`
- `chat.message` - Live chat
- `notification.sent`

### CA & Compliance
- `client.added` / `updated`
- `task.created` / `completed`
- `gst.filed` - Tax filing
- `document.uploaded`

### Ecosystem Apps
- `app.published` / `unpublished`
- `app.updated` - Version updates
- `logo.changed` - Branding updates

## Testing Sync

### 1. Test Automatic Sync

```tsx
// In admin panel, update a product
await api.updateProduct('123', { price: 999 });

// Check website - price should update automatically
// Check customer app - price should update via realtime
```

### 2. Test Manual Sync

Click "Force Full Sync" button in the sync status widget or:

```tsx
import { syncService } from '@/lib/sync-service';
await syncService.forceFullSync();
```

### 3. Test Website Revalidation

```bash
# Update content in admin panel
# Website should revalidate automatically

# Or manual revalidation:
curl -X POST "http://localhost:3000/api/revalidate?path=/products"
```

## Troubleshooting

### Sync Not Working?

1. **Check Supabase Realtime**
   ```sql
   SELECT * FROM realtime.subscription;
   ```

2. **Check Sync Log**
   ```sql
   SELECT * FROM sync_log ORDER BY created_at DESC LIMIT 10;
   ```

3. **Check Platform Status**
   ```sql
   SELECT * FROM platform_sync_status;
   ```

4. **Enable Debug Mode**
   ```env
   NEXT_PUBLIC_SYNC_DEBUG=true
   ```

### Platform Offline?

- Check platform API endpoints are accessible
- Verify Supabase connection
- Check browser console for errors

### Website Not Updating?

- Check `/api/revalidate` endpoint works
- Verify `REVALIDATION_SECRET` is set
- Test revalidation manually

## Performance

- Sync events are batched (up to 10 per second)
- Old sync logs auto-cleaned after 7 days
- Platform-specific data reduces bandwidth
- Push notifications queued for batch processing

## Security

- All sync operations require authentication
- RLS policies protect sync tables
- Revalidation requires secret key
- Audit log tracks all sync operations

## Next Steps

1. ✅ Set up database tables
2. ✅ Add SyncProvider to layout
3. ✅ Test automatic sync
4. ⬜ Add sync to mobile apps (customer/vendor/delivery)
5. ⬜ Set up push notification service
6. ⬜ Configure webhooks for external platforms
7. ⬜ Monitor sync performance

## Support

For issues or questions:
1. Check sync logs in Supabase
2. Review browser console
3. Test API endpoints
4. Contact development team

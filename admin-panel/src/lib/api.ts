import { supabase } from '@/lib/supabase';

const API_BASE = typeof process !== 'undefined'
  ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000')
  : 'http://localhost:3000';

// Track backend availability - start false since backend often offline
let backendOnline = false;

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;

  // ALWAYS try Supabase first (primary data source)
  if (supabase) {
    try {
      const data = await fetchFromSupabase(endpoint);
      return data;
    } catch (supabaseErr: any) {
      console.warn(`⚠️ Supabase failed for ${endpoint}: ${supabaseErr.message}`);
      // If Supabase fails, continue to try backend
    }
  }

  // Get token from localStorage
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('admin_token') || '';
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (res.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
      }
      throw new Error('Authentication required');
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API ${res.status}`);
    }

    backendOnline = true; // Mark as online if successful
    return res.json();
  } catch (err: any) {
    // Both Supabase and backend failed
    console.error(`❌ Failed to fetch ${endpoint}: ${err.message}`);
    throw err;
  }
}

// Helper function to fetch data from Supabase
async function fetchFromSupabase(endpoint: string) {
  if (!supabase) throw new Error('Supabase not configured');

  // Map API endpoints to Supabase tables
  const tableMap: Record<string, { table: string; select?: string }> = {
    '/orders': { table: 'orders' },
    '/customers': { table: 'customers' },
    '/vendors': { table: 'vendors' },
    '/riders': { table: 'riders' },
    '/products': { table: 'products' },
    '/payments': { table: 'payments' },
    '/support-tickets': { table: 'support_tickets' },
    '/users': { table: 'users' },
    '/deliveries': { table: 'deliveries' },
    // New admin panel features
    '/admin/pricing-plans': { table: 'pricing_plans' },
    '/admin/vendor-applications': { table: 'vendor_applications' },
    '/admin/delivery-partners': { table: 'delivery_partners' },
    '/admin/subscriptions': { table: 'subscriptions' },
    '/admin/ecosystem-apps': { table: 'ecosystem_apps' },
    '/admin/testimonials': { table: 'testimonials' },
    '/admin/team-members': { table: 'team_members' },
    '/admin/promo-banners': { table: 'promo_banners' },
    '/admin/careers': { table: 'careers' },
    '/admin/job-applications': { table: 'job_applications' },
  };

  // Handle stats endpoints - return calculated stats from raw data
  if (endpoint.includes('/stats')) {
    const baseEndpoint = endpoint.replace(/\/stats.*$/, '');
    const mapping = tableMap[baseEndpoint];

    if (!mapping) {
      // Return empty stats for unmapped stats endpoints
      console.log(`ℹ️ Stats endpoint ${endpoint} not mapped, returning defaults`);
      return { total: 0, completed: 0, pending: 0, totalAmount: 0 };
    }

    // Special handling for payments stats
    if (baseEndpoint === '/payments') {
      const { data, error } = await supabase
        .from('payments')
        .select('*');

      if (error) {
        console.error('❌ Supabase payments query failed:', error.message);
        throw new Error(error.message);
      }

      const payments = data || [];
      return {
        total: payments.length,
        completed: payments.filter((p: any) => p.status === 'completed').length,
        pending: payments.filter((p: any) => p.status === 'pending').length,
        refunded: payments.filter((p: any) => p.status === 'refunded').length,
        disputed: payments.filter((p: any) => p.status === 'disputed').length,
        totalAmount: payments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0),
      };
    }

    // Fetch raw data and calculate stats
    const { data, error } = await supabase
      .from(mapping.table)
      .select('*');

    if (error) {
      console.error(`❌ Supabase stats query failed for ${mapping.table}:`, error.message);
      throw new Error(error.message);
    }

    // Calculate basic stats from raw data
    const items = data || [];
    const stats = {
      total: items.length,
      completed: items.filter((i: any) => i.status === 'completed' || i.status === 'delivered').length,
      pending: items.filter((i: any) => i.status === 'pending' || i.status === 'open').length,
      refunded: items.filter((i: any) => i.status === 'refunded').length,
      disputed: items.filter((i: any) => i.status === 'disputed').length,
      totalAmount: items.reduce((sum: number, i: any) => sum + Number(i.amount || i.total_amount || 0), 0),
    };

    return stats;
  }

  // Extract base endpoint (remove query params and IDs for now)
  const basePath = endpoint.split('?')[0].replace(/\/[^/]+$/, (match) => {
    // If it's an ID endpoint like /orders/123, return the base
    if (match.match(/\/[0-9a-f-]{36}/i)) return endpoint.split('?')[0].replace(match, '');
    return match;
  });

  const mapping = tableMap[basePath];
  if (!mapping) {
    // Return empty array for unmapped endpoints instead of throwing
    console.warn(`⚠️ No Supabase mapping for: ${endpoint}, returning empty array`);
    return [];
  }

  console.log(`📡 Fetching from Supabase: ${mapping.table}`);
  let query = supabase.from(mapping.table).select(mapping.select || '*');

  // Only order by created_at if the table likely has it
  // Skip ordering for tables that might not have it
  const tablesWithoutCreatedAt = ['users']; // Add tables without created_at here
  if (!tablesWithoutCreatedAt.includes(mapping.table)) {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error(`❌ Supabase query failed for ${mapping.table}:`, error.message);
    // If ordering fails, try without ordering
    if (error.message.includes('created_at')) {
      console.warn(`⚠️ Retrying ${mapping.table} without ordering...`);
      const { data: retryData, error: retryError } = await supabase
        .from(mapping.table)
        .select(mapping.select || '*');
      if (retryError) {
        console.error(`❌ Retry failed for ${mapping.table}:`, retryError.message);
        throw new Error(retryError.message);
      }
      console.log(`✅ Got ${retryData?.length || 0} records from ${mapping.table} (no ordering)`);
      return retryData || [];
    }
    throw new Error(error.message);
  }

  console.log(`✅ Got ${data?.length || 0} records from ${mapping.table}`);
  return data || [];
}

export const api = {
  // Auth
  adminLogin: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    const data = await res.json();
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },

  // Orders - Full Supabase CRUD
  getOrders: () => fetchApi('/orders'),
  getOrder: (id: string) => fetchApi(`/orders/${id}`),
  updateOrderStatus: async (id: string, status: string) => {
    if (!backendOnline && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    return fetchApi(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  cancelOrder: async (id: string) => {
    if (!backendOnline && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    }
    return fetchApi(`/orders/${id}/cancel`, { method: 'POST' });
  },
  getOrderTracking: (id: string) => fetchApi(`/orders/${id}/tracking`),
  reorder: (id: string) => fetchApi(`/orders/${id}/reorder`, { method: 'POST' }),

  // Customers - Full Supabase CRUD
  getCustomers: (search?: string) => fetchApi(`/customers${search ? `?search=${search}` : ''}`),
  getCustomer: (id: string) => fetchApi(`/customers/${id}`),
  createCustomer: async (data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('customers')
        .insert([{ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi('/customers', { method: 'POST', body: JSON.stringify(data) });
  },
  updateCustomer: async (id: string, data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('customers')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  banCustomer: async (id: string, isBanned: boolean) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('customers')
        .update({ is_active: !isBanned, status: isBanned ? 'FLAGGED' : 'ACTIVE', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/customers/${id}/ban`, { method: 'PUT', body: JSON.stringify({ isBanned }) });
  },
  deleteCustomer: async (id: string) => {
    if (!backendOnline && supabase) {
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return { success: true };
    }
    return fetchApi(`/customers/${id}`, { method: 'DELETE' });
  },

  // Vendors - Full Supabase CRUD
  getVendors: () => fetchApi('/vendors'),
  getVendor: (id: string) => fetchApi(`/vendors/${id}`),
  createVendor: async (data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('vendors')
        .insert([{ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi('/vendors', { method: 'POST', body: JSON.stringify(data) });
  },
  updateVendor: async (id: string, data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('vendors')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteVendor: async (id: string) => {
    if (!backendOnline && supabase) {
      const { error } = await supabase.from('vendors').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return { success: true };
    }
    return fetchApi(`/vendors/${id}`, { method: 'DELETE' });
  },

  // Riders - Full Supabase CRUD
  getRiders: (search?: string) => fetchApi(`/riders${search ? `?search=${search}` : ''}`),
  getRider: (id: string) => fetchApi(`/riders/${id}`),
  createRider: async (data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('riders')
        .insert([{ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi('/riders', { method: 'POST', body: JSON.stringify(data) });
  },
  updateRider: async (id: string, data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('riders')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/riders/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  toggleRiderOnline: async (id: string, isOnline: boolean) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('riders')
        .update({ is_online: isOnline, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/riders/${id}/online`, { method: 'PUT', body: JSON.stringify({ isOnline }) });
  },
  deleteRider: async (id: string) => {
    if (!backendOnline && supabase) {
      const { error } = await supabase.from('riders').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return { success: true };
    }
    return fetchApi(`/riders/${id}`, { method: 'DELETE' });
  },

  // Products - Full Supabase CRUD
  getProducts: (search?: string) => fetchApi(`/products${search ? `?search=${search}` : ''}`),
  getProduct: (id: string) => fetchApi(`/products/${id}`),
  createProduct: async (data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('products')
        .insert([{ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi('/products', { method: 'POST', body: JSON.stringify(data) });
  },
  updateProduct: async (id: string, data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('products')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  deleteProduct: async (id: string) => {
    if (!backendOnline && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return { success: true };
    }
    return fetchApi(`/products/${id}`, { method: 'DELETE' });
  },

  // Payments - Full Supabase CRUD
  getPayments: (status?: string) => fetchApi(`/payments${status ? `?status=${status}` : ''}`),
  getPaymentStats: () => fetchApi('/payments/stats'),
  getPayment: (id: string) => fetchApi(`/payments/${id}`),
  reconcilePayment: async (id: string, utr: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('payments')
        .update({ utr_number: utr, status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/payments/${id}/reconcile`, { method: 'PUT', body: JSON.stringify({ utr }) });
  },
  refundPayment: async (id: string, reason: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('payments')
        .update({ status: 'refunded', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/payments/${id}/refund`, { method: 'PUT', body: JSON.stringify({ reason }) });
  },
  markPaymentDisputed: async (id: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('payments')
        .update({ status: 'disputed', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/payments/${id}/dispute`, { method: 'PUT' });
  },
  resolvePaymentDispute: async (id: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('payments')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/payments/${id}/resolve`, { method: 'PUT' });
  },

  // Deliveries - Full Supabase CRUD
  getDeliveries: () => fetchApi('/deliveries'),
  getDeliveryStats: () => fetchApi('/deliveries/stats'),
  assignDelivery: async (orderId: string, riderId: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('deliveries')
        .insert([{ order_id: orderId, rider_id: riderId, status: 'assigned', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi('/deliveries/assign', { method: 'POST', body: JSON.stringify({ orderId, riderId }) });
  },
  updateDeliveryLocation: async (id: string, lat: number, lng: number) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('deliveries')
        .update({ delivery_lat: lat, delivery_lng: lng, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/deliveries/${id}/location`, { method: 'PUT', body: JSON.stringify({ lat, lng }) });
  },
  completeDelivery: async (id: string, otp?: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('deliveries')
        .update({ status: 'completed', completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/deliveries/${id}/complete`, { method: 'PUT', body: JSON.stringify({ otp }) });
  },

  // Support Tickets - Full Supabase CRUD
  getTickets: (status?: string) => fetchApi(`/support-tickets${status ? `?status=${status}` : ''}`),
  getTicketStats: () => fetchApi('/support-tickets/stats'),
  createTicket: async (data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('support_tickets')
        .insert([{ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi('/support-tickets', { method: 'POST', body: JSON.stringify(data) });
  },
  updateTicket: async (id: string, data: any) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('support_tickets')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/support-tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  resolveTicket: async (id: string) => {
    if (!backendOnline && supabase) {
      const { data: result, error } = await supabase
        .from('support_tickets')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return result;
    }
    return fetchApi(`/support-tickets/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: 'resolved' }) });
  },

  // Users
  getUsers: () => fetchApi('/users'),

  // Dashboard aggregate
  getDashboardStats: async () => {
    const [orders, customers, vendors, riders, payments, tickets] = await Promise.all([
      fetchApi('/orders').catch(() => []),
      fetchApi('/customers').catch(() => []),
      fetchApi('/vendors').catch(() => []),
      fetchApi('/riders').catch(() => []),
      fetchApi('/payments/stats').catch(() => ({})),
      fetchApi('/support-tickets').catch(() => []),
    ]);
    return { orders, customers, vendors, riders, payments, tickets };
  },

  // Generic REST API methods for new admin features
  get: (endpoint: string) => fetchApi(endpoint),
  post: (endpoint: string, data?: any) => fetchApi(endpoint, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),
  put: (endpoint: string, data?: any) => fetchApi(endpoint, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),
  patch: (endpoint: string, data?: any) => fetchApi(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined }),
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),
};

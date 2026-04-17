"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useRealtime } from '@/hooks/useRealtime';
import { Search, Filter, Download, MoreVertical, ExternalLink, Ban, RefreshCcw, CheckCircle2, Clock, Car, AlertCircle, Bell, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  PENDING: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-700',
  created: 'bg-amber-100 text-amber-700',
  vendor_assigned: 'bg-blue-100 text-blue-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  cutting: 'bg-blue-100 text-blue-700',
  ready_for_pickup: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { hasPermission } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [stats, setStats] = useState({ total: 0, active: 0, delivered: 0, cancelled: 0 });
  const [useRealtimeData, setUseRealtimeData] = useState(false);

  // Real-time orders from Supabase
  const {
    data: realtimeOrders,
    loading: rtLoading,
    error: rtError
  } = useRealtime({
    table: 'orders',
    enabled: useRealtimeData,
    onInsert: (payload) => {
      console.log('🔔 New order received:', payload.new.id?.slice(0, 8));
      // Optionally play a sound or show notification
    },
    onUpdate: (payload) => {
      const status = payload.new.status;
      if (status === 'delivered') {
        console.log('✅ Order delivered:', payload.new.id?.slice(0, 8));
      } else if (status === 'out_for_delivery') {
        console.log('🚚 Order out for delivery:', payload.new.id?.slice(0, 8));
      }
    },
  });

  // Sync realtime data to local state
  useEffect(() => {
    if (useRealtimeData && realtimeOrders.length > 0) {
      setOrders(realtimeOrders);
      setLoading(rtLoading);
      if (rtError) {
        setError(rtError.message);
      }
    }
  }, [realtimeOrders, rtLoading, rtError, useRealtimeData]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getOrders();
      const orderArr = Array.isArray(data) ? data : [];
      setOrders(orderArr);

      // Calculate stats
      setStats({
        total: orderArr.length,
        active: orderArr.filter((o: any) => !['delivered', 'cancelled'].includes(o.status)).length,
        delivered: orderArr.filter((o: any) => o.status === 'delivered').length,
        cancelled: orderArr.filter((o: any) => o.status === 'cancelled').length,
      });
    } catch (e: any) {
      console.error('Failed to fetch orders:', e);
      setError(`Failed to load orders: ${e.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (e: any) {
      console.error('Failed to update order status:', e);
      setError(`Failed to update order: ${e.message}`);
      // Reload orders on error
      fetchOrders();
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = !searchTerm ||
      o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.phone?.includes(searchTerm) ||
      o.vendor?.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' ||
      o.status?.toLowerCase().replace(/_/g, ' ').includes(statusFilter.toLowerCase().replace(/_/g, ' '));
    return matchesSearch && matchesStatus;
  });

  // Status filter options based on actual data
  const statusOptions = ['All Status', 'created', 'vendor_assigned', 'accepted', 'cutting', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage all customer orders and their lifecycles</p>
          {useRealtimeData && (
            <div className="flex items-center gap-2 mt-2 text-emerald-600">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold">Live WebSocket Active</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setUseRealtimeData(!useRealtimeData)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${useRealtimeData
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-emerald-300'
              }`}
            title={useRealtimeData ? 'Disable Real-time Updates' : 'Enable Real-time Updates'}
          >
            {useRealtimeData ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {useRealtimeData ? 'Live' : 'Real-time'}
          </button>
          <button onClick={fetchOrders} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50">
            <RefreshCcw className="w-4 h-4" />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Orders</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase">Active Orders</p>
          <p className="text-2xl font-black text-blue-900 mt-1">{stats.active}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Delivered</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{stats.delivered}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <p className="text-xs font-semibold text-red-600 uppercase">Cancelled</p>
          <p className="text-2xl font-black text-red-900 mt-1">{stats.cancelled}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-2 text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={fetchOrders} className="ml-auto text-sm font-bold underline hover:text-red-900">Retry</button>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search by Order ID, Customer or Vendor..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-emerald-500"
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer & Vendor</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-emerald-600 tracking-tight">{order.id?.slice(0, 8)}</span>
                      <span className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{order.user?.fullName || order.user?.phone || 'N/A'}</span>
                      <span className="text-xs text-gray-500 mt-1">{order.vendor?.shopName || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-black text-gray-900">₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider",
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600')}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      {String(order.status).replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === 'created' || order.status === 'vendor_assigned' ? (
                        <button onClick={() => handleStatusChange(order.id, 'accepted')} className="p-2 text-gray-400 hover:text-emerald-600" title="Accept"><CheckCircle2 className="w-5 h-5" /></button>
                      ) : null}
                      {order.status !== 'cancelled' && order.status !== 'delivered' ? (
                        <button onClick={() => handleStatusChange(order.id, 'cancelled')} className="p-2 text-gray-400 hover:text-red-600" title="Cancel"><Ban className="w-5 h-5" /></button>
                      ) : null}
                      <button className="p-2 text-gray-400 hover:text-gray-900"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-500">No orders found</div>
          )}
          <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">{filtered.length}</span> orders</p>
          </div>
        </div>
      )}
    </div>
  );
}

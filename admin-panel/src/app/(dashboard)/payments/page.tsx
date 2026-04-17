"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { 
  Search, CreditCard, CheckCircle2, XCircle, RefreshCw, AlertCircle, AlertTriangle, 
  Wifi, WifiOff, Eye, Edit2, Download, Filter, MapPin, Calendar, Clock, User, 
  ArrowLeftRight, Receipt, Shield, Ban, MoreVertical, ChevronDown, X, TrendingUp,
  Smartphone, QrCode, Banknote, Landmark, Globe, LocateFixed
} from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import { cn } from '@/lib/utils';

// Payment Method Icons
const PAYMENT_METHODS: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  UPI: { icon: QrCode, label: 'UPI', color: 'text-[#2d5a42]', bg: 'bg-[#e8f5ed]' },
  Card: { icon: CreditCard, label: 'Card', color: 'text-[#8b6914]', bg: 'bg-[#f0e6d3]' },
  COD: { icon: Banknote, label: 'Cash', color: 'text-[#5c3d1f]', bg: 'bg-[#f0e6d3]' },
  NetBanking: { icon: Landmark, label: 'Net Banking', color: 'text-[#2c5282]', bg: 'bg-blue-50' },
  Wallet: { icon: Smartphone, label: 'Wallet', color: 'text-[#9b2335]', bg: 'bg-[#fff5f5]' },
};

// Enhanced Payment Type with location and history
interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'completed' | 'pending' | 'refunded' | 'disputed' | 'failed';
  method: 'UPI' | 'Card' | 'COD' | 'NetBanking' | 'Wallet';
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    ip: string;
    lat?: number;
    lng?: number;
  };
  device?: string;
  browser?: string;
  history?: {
    date: string;
    action: string;
    user: string;
    notes?: string;
  }[];
  refund?: {
    amount: number;
    reason: string;
    date: string;
    status: 'processed' | 'pending';
  };
  gstAmount?: number;
  platformFee?: number;
  netAmount?: number;
}

// Mock enhanced payments data
const MOCK_PAYMENTS: Payment[] = [
  { 
    id: 'PAY-001', orderId: 'ORD-9901', amount: 480, status: 'completed', method: 'UPI', 
    createdAt: '2024-04-12T18:30:00Z',
    customerName: 'Rahul Sharma', customerEmail: 'rahul@email.com', customerPhone: '+91 98765 43210',
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', ip: '103.21.45.123', lat: 19.0760, lng: 72.8777 },
    device: 'iPhone 14 Pro', browser: 'Safari',
    gstAmount: 24, platformFee: 12, netAmount: 444,
    history: [
      { date: '2024-04-12T18:30:00Z', action: 'Payment Initiated', user: 'System' },
      { date: '2024-04-12T18:30:15Z', action: 'UPI Verification', user: 'System' },
      { date: '2024-04-12T18:30:45Z', action: 'Payment Completed', user: 'System' },
    ]
  },
  { 
    id: 'PAY-002', orderId: 'ORD-9902', amount: 840, status: 'pending', method: 'COD', 
    createdAt: '2024-04-12T19:00:00Z',
    customerName: 'Priya Patel', customerEmail: 'priya@email.com', customerPhone: '+91 98765 12345',
    location: { city: 'Bangalore', state: 'Karnataka', country: 'India', ip: '103.22.67.89', lat: 12.9716, lng: 77.5946 },
    device: 'Android', browser: 'Chrome',
    gstAmount: 42, platformFee: 21, netAmount: 777,
    history: [
      { date: '2024-04-12T19:00:00Z', action: 'COD Order Placed', user: 'System' },
      { date: '2024-04-12T19:00:30Z', action: 'Awaiting Delivery', user: 'System' },
    ]
  },
  { 
    id: 'PAY-003', orderId: 'ORD-9903', amount: 2100, status: 'completed', method: 'Card', 
    createdAt: '2024-04-12T19:30:00Z',
    customerName: 'Amit Kumar', customerEmail: 'amit@email.com', customerPhone: '+91 98765 67890',
    location: { city: 'Delhi', state: 'Delhi', country: 'India', ip: '103.23.45.67', lat: 28.6139, lng: 77.2090 },
    device: 'Windows Laptop', browser: 'Edge',
    gstAmount: 105, platformFee: 52.5, netAmount: 1942.5,
    history: [
      { date: '2024-04-12T19:30:00Z', action: 'Payment Initiated', user: 'System' },
      { date: '2024-04-12T19:30:20Z', action: 'Card Verified', user: 'System' },
      { date: '2024-04-12T19:30:50Z', action: 'Payment Captured', user: 'System' },
    ]
  },
  { 
    id: 'PAY-004', orderId: 'ORD-9904', amount: 450, status: 'refunded', method: 'UPI', 
    createdAt: '2024-04-12T20:00:00Z',
    customerName: 'Sneha Gupta', customerEmail: 'sneha@email.com', customerPhone: '+91 98765 11111',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', ip: '103.24.56.78', lat: 18.5204, lng: 73.8567 },
    device: 'iPhone 13', browser: 'Safari',
    gstAmount: 22.5, platformFee: 11.25, netAmount: 416.25,
    history: [
      { date: '2024-04-12T20:00:00Z', action: 'Payment Initiated', user: 'System' },
      { date: '2024-04-12T20:00:30Z', action: 'Payment Completed', user: 'System' },
      { date: '2024-04-13T10:15:00Z', action: 'Refund Requested', user: 'Admin' },
      { date: '2024-04-13T14:30:00Z', action: 'Refund Processed', user: 'System' },
    ],
    refund: { amount: 450, reason: 'Customer cancelled order', date: '2024-04-13T14:30:00Z', status: 'processed' }
  },
  { 
    id: 'PAY-005', orderId: 'ORD-9905', amount: 1250, status: 'disputed', method: 'Card', 
    createdAt: '2024-04-12T21:00:00Z',
    customerName: 'Vikram Rao', customerEmail: 'vikram@email.com', customerPhone: '+91 98765 22222',
    location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India', ip: '103.25.78.90', lat: 13.0827, lng: 80.2707 },
    device: 'Android', browser: 'Chrome',
    gstAmount: 62.5, platformFee: 31.25, netAmount: 1156.25,
    history: [
      { date: '2024-04-12T21:00:00Z', action: 'Payment Initiated', user: 'System' },
      { date: '2024-04-12T21:00:40Z', action: 'Payment Completed', user: 'System' },
      { date: '2024-04-13T09:00:00Z', action: 'Dispute Raised', user: 'Customer' },
      { date: '2024-04-13T11:30:00Z', action: 'Under Investigation', user: 'Admin' },
    ]
  },
  { 
    id: 'PAY-006', orderId: 'ORD-9906', amount: 3200, status: 'completed', method: 'NetBanking', 
    createdAt: '2024-04-12T22:00:00Z',
    customerName: 'Meera Shah', customerEmail: 'meera@email.com', customerPhone: '+91 98765 33333',
    location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India', ip: '103.26.90.12', lat: 23.0225, lng: 72.5714 },
    device: 'MacBook Pro', browser: 'Safari',
    gstAmount: 160, platformFee: 80, netAmount: 2960,
    history: [
      { date: '2024-04-12T22:00:00Z', action: 'Payment Initiated', user: 'System' },
      { date: '2024-04-12T22:01:30Z', action: 'Bank Redirect', user: 'System' },
      { date: '2024-04-12T22:03:45Z', action: 'Payment Completed', user: 'System' },
    ]
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [dateRange, setDateRange] = useState('all');

  const { data: realtimePayments } = useRealtime({
    table: 'payments',
    enabled: useRealtimeData,
    onInsert: (payload) => console.log('[Payments] New payment:', payload),
    onUpdate: (payload) => console.log('[Payments] Payment updated:', payload),
  });

  // Calculate stats
  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    refunded: payments.filter(p => p.status === 'refunded').length,
    disputed: payments.filter(p => p.status === 'disputed').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + (p.status !== 'refunded' ? p.amount : 0), 0),
    totalRefunded: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
  };

  // Filter payments
  const filtered = payments.filter(p => {
    const matchesSearch = !search ||
      p.id?.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.customerPhone?.includes(search);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || p.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setRefundAmount(payment.amount);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const processRefund = () => {
    if (!selectedPayment || !refundReason) return;
    
    const updatedPayment: Payment = {
      ...selectedPayment,
      status: 'refunded',
      refund: {
        amount: refundAmount,
        reason: refundReason,
        date: new Date().toISOString(),
        status: 'processed'
      },
      history: [
        ...(selectedPayment.history || []),
        { date: new Date().toISOString(), action: 'Refund Processed', user: 'Admin', notes: refundReason }
      ]
    };
    
    setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
    setShowRefundModal(false);
    setSelectedPayment(null);
    setRefundReason('');
  };

  const handleDispute = (payment: Payment) => {
    const updatedPayment: Payment = {
      ...payment,
      status: 'disputed',
      history: [
        ...(payment.history || []),
        { date: new Date().toISOString(), action: 'Dispute Marked', user: 'Admin' }
      ]
    };
    setPayments(payments.map(p => p.id === payment.id ? updatedPayment : p));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#e8f5ed] text-[#2d5a42] border-[#9dd4b3]';
      case 'pending': return 'bg-[#f0e6d3] text-[#8b6914] border-[#c49a6c]';
      case 'refunded': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'disputed': return 'bg-[#fff5f5] text-[#9b2335] border-[#fecaca]';
      case 'failed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-[#f0e6d3] text-[#5c3d1f] border-[#c49a6c]';
    }
  };

  const getMethodConfig = (method: string) => {
    return PAYMENT_METHODS[method] || { icon: CreditCard, label: method, color: 'text-[#5c3d1f]', bg: 'bg-[#f0e6d3]' };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const openLocationMap = (payment: Payment) => {
    if (payment.location?.lat && payment.location?.lng) {
      window.open(`https://www.google.com/maps?q=${payment.location.lat},${payment.location.lng}`, '_blank');
    }
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl">
              <CreditCard className="w-6 h-6 text-[#e8f5ed]" />
            </div>
            Payment Management
          </h1>
          <p className="text-[#5c3d1f] mt-1">Monitor transactions, process refunds, and track payment analytics</p>
          {useRealtimeData && (
            <div className="flex items-center gap-2 mt-2 text-[#2d5a42]">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold">Live WebSocket Active</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setUseRealtimeData(!useRealtimeData)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border",
              useRealtimeData 
                ? 'bg-[#e8f5ed] text-[#2d5a42] border-[#9dd4b3]' 
                : 'bg-[#f0e6d3] text-[#5c3d1f] border-[#c49a6c]'
            )}
          >
            {useRealtimeData ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {useRealtimeData ? 'Live' : 'Real-time'}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl text-sm font-bold border border-[#c49a6c] hover:bg-[#e8f5ed] transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {}}
            disabled={loading}
            className="px-4 py-2.5 bg-[#2d5a42] text-[#e8f5ed] rounded-xl text-sm font-bold hover:bg-[#3d7a58] transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#fff5f5] border border-[#fecaca] p-4 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-[#9b2335]">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">{error}</span>
            </div>
            <button 
              onClick={() => setError('')} 
              className="p-2 hover:bg-[#fecaca] rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <motion.div whileHover={{ y: -2 }} className="p-4 bg-gradient-to-br from-[#faf9f6] to-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <p className="text-xs text-[#5c3d1f] uppercase font-bold">Total</p>
          <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.total}</p>
          <p className="text-xs text-[#a67c52]">Transactions</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-4 bg-gradient-to-br from-[#e8f5ed] to-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/50 shadow-sm">
          <p className="text-xs text-[#2d5a42] uppercase font-bold">Completed</p>
          <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.completed}</p>
          <p className="text-xs text-[#2d5a42]/70">Successful</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-4 bg-gradient-to-br from-[#f0e6d3] to-[#f0e6d3]/50 rounded-2xl border border-[#c49a6c]/50 shadow-sm">
          <p className="text-xs text-[#8b6914] uppercase font-bold">Pending</p>
          <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.pending}</p>
          <p className="text-xs text-[#8b6914]/70">Awaiting</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-4 bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl border border-blue-200/50 shadow-sm">
          <p className="text-xs text-blue-700 uppercase font-bold">Refunded</p>
          <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.refunded}</p>
          <p className="text-xs text-blue-600/70">Processed</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-4 bg-gradient-to-br from-[#fff5f5] to-[#fff5f5]/50 rounded-2xl border border-[#fecaca]/50 shadow-sm">
          <p className="text-xs text-[#9b2335] uppercase font-bold">Disputed</p>
          <p className="text-2xl font-black text-[#9b2335] mt-1">{stats.disputed}</p>
          <p className="text-xs text-[#9b2335]/70">Under review</p>
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="p-4 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-2xl shadow-sm lg:col-span-2">
          <p className="text-xs text-[#e8f5ed]/80 uppercase font-bold">Revenue</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-black text-[#e8f5ed]">₹{stats.totalAmount.toLocaleString()}</p>
            {stats.totalRefunded > 0 && (
              <p className="text-sm text-[#e8f5ed]/60">- ₹{stats.totalRefunded.toLocaleString()} refunded</p>
            )}
          </div>
          <p className="text-xs text-[#e8f5ed]/70">Total processed</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#a67c52]" />
          <input 
            type="text" 
            placeholder="Search by ID, order, customer name or phone..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 bg-[#faf9f6] border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="disputed">Disputed</option>
            <option value="failed">Failed</option>
          </select>
          <select 
            value={methodFilter} 
            onChange={e => setMethodFilter(e.target.value)}
            className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="COD">Cash on Delivery</option>
            <option value="NetBanking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>
          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/50 shadow-xl shadow-[#2d5a42]/5 overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b border-[#dbc4a4]/30 bg-[#f0e6d3]/30">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">
            <div className="col-span-3">Payment Details</div>
            <div className="col-span-2">Customer</div>
            <div className="col-span-2">Method</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-[#dbc4a4]/20">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <RefreshCw className="w-10 h-10 animate-spin text-[#2d5a42] mb-4" />
              <p className="text-[#5c3d1f] font-semibold">Loading payments...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#f0e6d3]/50 flex items-center justify-center">
                <CreditCard className="w-10 h-10 text-[#a67c52]/50" />
              </div>
              <h3 className="text-lg font-bold text-[#1a3c28] mb-2">No payments found</h3>
              <p className="text-[#5c3d1f]">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((payment, idx) => {
              const MethodIcon = getMethodConfig(payment.method).icon;
              return (
                <motion.div 
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 hover:bg-[#f0e6d3]/20 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Payment Info */}
                    <div className="col-span-3">
                      <p className="font-bold text-[#1a3c28]">{payment.id}</p>
                      <p className="text-xs text-[#a67c52]">Order: {payment.orderId}</p>
                      <p className="text-xs text-[#5c3d1f]">{formatDate(payment.createdAt)}</p>
                    </div>

                    {/* Customer */}
                    <div className="col-span-2">
                      <p className="text-sm font-semibold text-[#1a3c28]">{payment.customerName || 'N/A'}</p>
                      <p className="text-xs text-[#a67c52]">{payment.customerPhone || ''}</p>
                    </div>

                    {/* Method */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-lg", getMethodConfig(payment.method).bg)}>
                          <MethodIcon className={cn("w-4 h-4", getMethodConfig(payment.method).color)} />
                        </div>
                        <span className="text-sm text-[#5c3d1f]">{getMethodConfig(payment.method).label}</span>
                      </div>
                      {payment.location && (
                        <button 
                          onClick={() => openLocationMap(payment)}
                          className="text-xs text-[#2d5a42] flex items-center gap-1 mt-1 hover:underline"
                        >
                          <MapPin className="w-3 h-3" />
                          {payment.location.city}
                        </button>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="col-span-2">
                      <p className="font-bold text-[#1a3c28]">₹{payment.amount.toLocaleString()}</p>
                      {payment.gstAmount && (
                        <p className="text-xs text-[#a67c52]">GST: ₹{payment.gstAmount}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getStatusColor(payment.status))}>
                        {payment.status}
                      </span>
                      {payment.refund && (
                        <p className="text-xs text-blue-600 mt-1">Refunded: ₹{payment.refund.amount}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <button 
                        onClick={() => { setSelectedPayment(payment); setShowDetailModal(true); }}
                        className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'completed' && (
                        <button 
                          onClick={() => handleRefund(payment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Refund"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      {payment.status !== 'disputed' && payment.status !== 'refunded' && (
                        <button 
                          onClick={() => handleDispute(payment)}
                          className="p-2 text-[#9b2335] hover:bg-[#fff5f5] rounded-xl transition-all"
                          title="Mark Disputed"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3c28]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-3xl bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 p-6 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Receipt className="w-7 h-7 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#e8f5ed]">{selectedPayment.id}</h3>
                    <p className="text-sm text-[#e8f5ed]/70">{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 bg-[#e8f5ed]/10 hover:bg-[#9b2335] text-[#e8f5ed] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className={cn("p-4 rounded-2xl flex items-center gap-3", getStatusColor(selectedPayment.status))}>
                  <Shield className="w-5 h-5" />
                  <div>
                    <span className="font-bold text-lg capitalize">{selectedPayment.status}</span>
                    {selectedPayment.refund && (
                      <p className="text-sm">Refund: ₹{selectedPayment.refund.amount} - {selectedPayment.refund.reason}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#1a3c28] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#2d5a42]" />
                      Payment Information
                    </h4>
                    <div className="space-y-3">
                      <DetailRow label="Order ID" value={selectedPayment.orderId} />
                      <DetailRow label="Method" value={selectedPayment.method} />
                      <DetailRow label="Amount" value={`₹${selectedPayment.amount.toLocaleString()}`} />
                      {selectedPayment.gstAmount && (
                        <DetailRow label="GST" value={`₹${selectedPayment.gstAmount}`} />
                      )}
                      {selectedPayment.platformFee && (
                        <DetailRow label="Platform Fee" value={`₹${selectedPayment.platformFee}`} />
                      )}
                      {selectedPayment.netAmount && (
                        <DetailRow label="Net Amount" value={`₹${selectedPayment.netAmount.toLocaleString()}`} highlight />
                      )}
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#1a3c28] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#2d5a42]" />
                      Customer Details
                    </h4>
                    <div className="space-y-3">
                      <DetailRow label="Name" value={selectedPayment.customerName || 'N/A'} />
                      <DetailRow label="Email" value={selectedPayment.customerEmail || 'N/A'} />
                      <DetailRow label="Phone" value={selectedPayment.customerPhone || 'N/A'} />
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                {selectedPayment.location && (
                  <div className="p-4 bg-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-[#1a3c28] flex items-center gap-2">
                        <LocateFixed className="w-4 h-4 text-[#2d5a42]" />
                        Payment Location
                      </h4>
                      <button 
                        onClick={() => openLocationMap(selectedPayment)}
                        className="px-3 py-1.5 bg-[#2d5a42] text-[#e8f5ed] rounded-lg text-sm font-semibold hover:bg-[#3d7a58] transition-all flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        View on Map
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-[#a67c52] uppercase">City</p>
                        <p className="font-semibold text-[#1a3c28]">{selectedPayment.location.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a67c52] uppercase">State</p>
                        <p className="font-semibold text-[#1a3c28]">{selectedPayment.location.state}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a67c52] uppercase">Country</p>
                        <p className="font-semibold text-[#1a3c28]">{selectedPayment.location.country}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#a67c52] uppercase">IP Address</p>
                        <p className="font-mono text-sm text-[#1a3c28]">{selectedPayment.location.ip}</p>
                      </div>
                    </div>
                    {selectedPayment.device && (
                      <div className="mt-3 pt-3 border-t border-[#9dd4b3]/30 flex gap-4">
                        <div>
                          <p className="text-xs text-[#a67c52] uppercase">Device</p>
                          <p className="font-semibold text-[#1a3c28]">{selectedPayment.device}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#a67c52] uppercase">Browser</p>
                          <p className="font-semibold text-[#1a3c28]">{selectedPayment.browser}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Transaction History */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2d5a42]" />
                    Transaction History
                  </h4>
                  <div className="space-y-2">
                    {(selectedPayment.history || []).map((event, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                        <div className="w-2 h-2 mt-2 rounded-full bg-[#2d5a42]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#1a3c28]">{event.action}</p>
                            <p className="text-xs text-[#a67c52]">{formatDate(event.date)}</p>
                          </div>
                          <p className="text-sm text-[#5c3d1f]">by {event.user}</p>
                          {event.notes && (
                            <p className="text-xs text-[#a67c52] mt-1">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!selectedPayment.history || selectedPayment.history.length === 0) && (
                      <p className="text-sm text-[#a67c52] italic">No history available</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                  {selectedPayment.status === 'completed' && (
                    <button 
                      onClick={() => { setShowDetailModal(false); handleRefund(selectedPayment); }}
                      className="flex-1 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Process Refund
                    </button>
                  )}
                  <button 
                    onClick={() => { setShowDetailModal(false); }}
                    className="flex-1 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] font-semibold rounded-xl hover:bg-[#e8f5ed] transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refund Modal */}
      <AnimatePresence>
        {showRefundModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3c28]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Process Refund</h3>
                  <p className="text-sm text-white/70">{selectedPayment.id}</p>
                </div>
                <button 
                  onClick={() => setShowRefundModal(false)}
                  className="p-2 bg-white/10 hover:bg-[#9b2335] text-white rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-700 mb-1">Original Amount</p>
                  <p className="text-2xl font-bold text-blue-900">₹{selectedPayment.amount.toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5c3d1f] uppercase">Refund Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-[#a67c52]">₹</span>
                    <input 
                      type="number"
                      value={refundAmount}
                      onChange={e => setRefundAmount(Number(e.target.value))}
                      max={selectedPayment.amount}
                      className="w-full pl-8 pr-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <p className="text-xs text-[#a67c52]">Maximum: ₹{selectedPayment.amount.toLocaleString()}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5c3d1f] uppercase">Refund Reason</label>
                  <textarea 
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                    placeholder="Enter reason for refund..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowRefundModal(false)} 
                    className="flex-1 py-2.5 text-[#5c3d1f] font-semibold hover:bg-[#f0e6d3] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={processRefund}
                    disabled={!refundReason || refundAmount <= 0}
                    className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Confirm Refund
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#dbc4a4]/20 last:border-0">
      <span className="text-sm text-[#5c3d1f]">{label}</span>
      <span className={cn("font-semibold", highlight ? "text-[#2d5a42] text-lg" : "text-[#1a3c28]")}>{value}</span>
    </div>
  );
}

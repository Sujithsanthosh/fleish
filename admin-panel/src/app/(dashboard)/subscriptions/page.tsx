"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  CreditCard,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Crown,
  Zap,
  Sparkles,
  MoreHorizontal,
  Eye,
  Ban,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Wifi,
  WifiOff,
  Edit3,
  Trash2,
  Plus,
  X,
  ChevronDown,
  PieChart,
  Activity,
  DollarSign,
  Repeat,
  Gift,
  FileText,
  RefreshCw,
  CheckSquare,
  PauseCircle,
  PlayCircle,
  Globe,
  HardHat,
  Smartphone,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validUntil: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  method: string;
  description: string;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  planId: string;
  planName: string;
  planType: 'free' | 'basic' | 'pro';
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'suspended';
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  discount: number;
  gst: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'failed' | 'pending';
  autoRenew: boolean;
  couponCode?: string;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
  notes: string;
}

interface SubscriptionStats {
  totalActive: number;
  totalCancelled: number;
  totalExpired: number;
  totalSuspended: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  arpu: number;
  churnRate: number;
  growthRate: number;
  conversionRate: number;
  planDistribution: {
    free: number;
    basic: number;
    pro: number;
  };
  paymentMethodDistribution: {
    creditCard: number;
    upi: number;
    netBanking: number;
    wallet: number;
  };
}

const FALLBACK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1',
    userId: 'user_1',
    userName: 'Rahul Kumar',
    userEmail: 'rahul@example.com',
    userPhone: '+91 98765 43210',
    planId: 'pro',
    planName: 'Pro',
    planType: 'pro',
    billingCycle: 'monthly',
    status: 'active',
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 335).toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    amount: 199,
    discount: 0,
    gst: 35.82,
    total: 234.82,
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    autoRenew: true,
    couponCode: '',
    transactions: [
      {
        id: 'txn_1',
        date: new Date(Date.now() - 86400000 * 30).toISOString(),
        amount: 234.82,
        status: 'success',
        method: 'Credit Card',
        description: 'Monthly subscription'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    notes: 'Regular customer, no issues'
  },
  {
    id: 'sub_2',
    userId: 'user_2',
    userName: 'Priya Sharma',
    userEmail: 'priya@example.com',
    userPhone: '+91 98765 43211',
    planId: 'basic',
    planName: 'Basic',
    planType: 'basic',
    billingCycle: 'yearly',
    status: 'active',
    startDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 305).toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000 * 305).toISOString(),
    amount: 950,
    discount: 190,
    gst: 136.80,
    total: 896.80,
    paymentMethod: 'UPI',
    paymentStatus: 'paid',
    autoRenew: true,
    couponCode: 'YEARLY20',
    transactions: [
      {
        id: 'txn_2',
        date: new Date(Date.now() - 86400000 * 60).toISOString(),
        amount: 896.80,
        status: 'success',
        method: 'UPI',
        description: 'Yearly subscription (20% discount)'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    notes: 'Uses coupon codes frequently'
  },
  {
    id: 'sub_3',
    userId: 'user_3',
    userName: 'Amit Patel',
    userEmail: 'amit@example.com',
    userPhone: '+91 98765 43212',
    planId: 'free',
    planName: 'Free',
    planType: 'free',
    billingCycle: 'monthly',
    status: 'active',
    startDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 350).toISOString(),
    nextBillingDate: '',
    amount: 0,
    discount: 0,
    gst: 0,
    total: 0,
    paymentMethod: 'None',
    paymentStatus: 'paid',
    autoRenew: false,
    couponCode: '',
    transactions: [],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    notes: 'Trial user, might upgrade'
  },
  {
    id: 'sub_4',
    userId: 'user_4',
    userName: 'Neha Gupta',
    userEmail: 'neha@example.com',
    userPhone: '+91 98765 43213',
    planId: 'pro',
    planName: 'Pro',
    planType: 'pro',
    billingCycle: 'monthly',
    status: 'cancelled',
    startDate: new Date(Date.now() - 86400000 * 90).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    nextBillingDate: '',
    amount: 199,
    discount: 0,
    gst: 35.82,
    total: 234.82,
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    autoRenew: false,
    couponCode: '',
    transactions: [
      {
        id: 'txn_3',
        date: new Date(Date.now() - 86400000 * 90).toISOString(),
        amount: 234.82,
        status: 'success',
        method: 'Credit Card',
        description: 'Monthly subscription'
      },
      {
        id: 'txn_4',
        date: new Date(Date.now() - 86400000 * 60).toISOString(),
        amount: 234.82,
        status: 'success',
        method: 'Credit Card',
        description: 'Monthly subscription'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    notes: 'Cancelled due to pricing concerns'
  },
  {
    id: 'sub_5',
    userId: 'user_5',
    userName: 'Vikram Singh',
    userEmail: 'vikram@example.com',
    userPhone: '+91 98765 43214',
    planId: 'basic',
    planName: 'Basic',
    planType: 'basic',
    billingCycle: 'monthly',
    status: 'pending',
    startDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 28).toISOString(),
    nextBillingDate: new Date(Date.now() + 86400000 * 28).toISOString(),
    amount: 99,
    discount: 0,
    gst: 17.82,
    total: 116.82,
    paymentMethod: 'Net Banking',
    paymentStatus: 'pending',
    autoRenew: true,
    couponCode: '',
    transactions: [
      {
        id: 'txn_5',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        amount: 116.82,
        status: 'pending',
        method: 'Net Banking',
        description: 'Payment pending'
      }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: 'Payment pending, follow up required'
  }
];

const FALLBACK_STATS: SubscriptionStats = {
  totalActive: 850,
  totalCancelled: 125,
  totalExpired: 45,
  totalSuspended: 12,
  monthlyRevenue: 125000,
  yearlyRevenue: 1500000,
  arpu: 147,
  churnRate: 5.2,
  growthRate: 12.8,
  conversionRate: 18.5,
  planDistribution: {
    free: 400,
    basic: 300,
    pro: 150
  },
  paymentMethodDistribution: {
    creditCard: 450,
    upi: 280,
    netBanking: 120,
    wallet: 50
  }
};

const FALLBACK_COUPONS: Coupon[] = [
  { id: 'c1', code: 'WELCOME20', discount: 20, type: 'percentage', validUntil: new Date(Date.now() + 86400000 * 30).toISOString(), usageCount: 150, maxUsage: 500, isActive: true },
  { id: 'c2', code: 'YEARLY20', discount: 20, type: 'percentage', validUntil: new Date(Date.now() + 86400000 * 90).toISOString(), usageCount: 89, maxUsage: 200, isActive: true },
  { id: 'c3', code: 'FLAT50', discount: 50, type: 'fixed', validUntil: new Date(Date.now() + 86400000 * 15).toISOString(), usageCount: 45, maxUsage: 100, isActive: true },
];

// Leather Green Theme Config
const THEME_COLORS = {
  primary: '#2d5a42',
  secondary: '#3d7a58',
  accent: '#a67c52',
  light: '#e8f5ed',
  cream: '#f0e6d3',
  border: '#dbc4a4',
  text: '#1a3c28',
  muted: '#5c3d1f'
};

const PLAN_COLORS = {
  free: '#2d5a42',
  basic: '#8b6914',
  pro: '#6b21a8',
};

const PLAN_ICONS = {
  free: <Sparkles className="w-4 h-4" />,
  basic: <Zap className="w-4 h-4" />,
  pro: <Crown className="w-4 h-4" />,
};

const PLAN_CONFIG: Record<string, { icon: React.ReactNode; bg: string; text: string; border: string; gradient: string }> = {
  free: {
    icon: <Sparkles className="w-4 h-4" />,
    bg: 'bg-[#e8f5ed]',
    text: 'text-[#2d5a42]',
    border: 'border-[#2d5a42]/30',
    gradient: 'from-[#2d5a42] to-[#3d7a58]'
  },
  basic: {
    icon: <Zap className="w-4 h-4" />,
    bg: 'bg-[#f0e6d3]',
    text: 'text-[#8b6914]',
    border: 'border-[#a67c52]/30',
    gradient: 'from-[#8b6914] to-[#a67c52]'
  },
  pro: {
    icon: <Crown className="w-4 h-4" />,
    bg: 'bg-[#a67c52]/20',
    text: 'text-[#a67c52]',
    border: 'border-[#a67c52]/50',
    gradient: 'from-[#a67c52] to-[#c49c72]'
  }
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  active: { label: 'Active', color: 'text-[#2d5a42]', bg: 'bg-[#e8f5ed]', border: 'border-[#2d5a42]/30', icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', icon: <Ban className="w-4 h-4" /> },
  expired: { label: 'Expired', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', icon: <Clock className="w-4 h-4" /> },
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', icon: <Clock className="w-4 h-4" /> },
  suspended: { label: 'Suspended', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200', icon: <AlertCircle className="w-4 h-4" /> }
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(FALLBACK_SUBSCRIPTIONS);
  const [stats, setStats] = useState<SubscriptionStats>(FALLBACK_STATS);
  const [coupons, setCoupons] = useState<Coupon[]>(FALLBACK_COUPONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalTab, setModalTab] = useState('details');
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [websiteConnected, setWebsiteConnected] = useState(true);
  const [hrPanelConnected, setHrPanelConnected] = useState(true);
  const [mobileAppConnected, setMobileAppConnected] = useState(true);

  const { data: realtimeSubscriptions } = useRealtime({
    table: 'subscriptions',
    enabled: useRealtimeData,
  });

  const [editFormData, setEditFormData] = useState<Partial<Subscription>>({});
  const [newSubscription, setNewSubscription] = useState<Partial<Subscription>>({
    planType: 'basic',
    billingCycle: 'monthly',
    status: 'active',
    autoRenew: true
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setSubscriptions(FALLBACK_SUBSCRIPTIONS);
      setStats(FALLBACK_STATS);
      setCoupons(FALLBACK_COUPONS);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancelSubscription = (id: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id ? { ...sub, status: 'cancelled', autoRenew: false } : sub
    ));
  };

  const handleSuspendSubscription = (id: string) => {
    if (!confirm('Are you sure you want to suspend this subscription?')) return;
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id ? { ...sub, status: 'suspended' } : sub
    ));
  };

  const handleActivateSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id ? { ...sub, status: 'active' } : sub
    ));
  };

  const handleRefund = (subId: string, txnId: string) => {
    if (!confirm('Are you sure you want to refund this transaction?')) return;
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === subId) {
        return {
          ...sub,
          transactions: sub.transactions.map(txn =>
            txn.id === txnId ? { ...txn, status: 'refunded' as const } : txn
          )
        };
      }
      return sub;
    }));
  };

  const handleEditSubscription = (sub: Subscription) => {
    setSelectedSubscription(sub);
    setEditFormData({ ...sub });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedSubscription || !editFormData) return;
    setSubscriptions(prev => prev.map(sub =>
      sub.id === selectedSubscription.id ? { ...sub, ...editFormData } : sub
    ));
    setIsEditModalOpen(false);
    setSelectedSubscription(null);
    setEditFormData({});
  };

  const handleCreateSubscription = () => {
    const newSub: Subscription = {
      ...newSubscription,
      id: `sub_${Date.now()}`,
      userId: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactions: [],
      notes: ''
    } as Subscription;
    setSubscriptions(prev => [newSub, ...prev]);
    setIsCreateModalOpen(false);
    setNewSubscription({
      planType: 'basic',
      billingCycle: 'monthly',
      status: 'active',
      autoRenew: true
    });
    alert('Subscription created successfully!');
  };

  const handleBulkAction = (action: 'cancel' | 'suspend' | 'delete') => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} subscriptions?`)) return;
    }
    setSubscriptions(prev => {
      if (action === 'delete') {
        return prev.filter(sub => !selectedItems.includes(sub.id));
      }
      return prev.map(sub => {
        if (selectedItems.includes(sub.id)) {
          return {
            ...sub,
            status: action === 'cancel' ? 'cancelled' : 'suspended'
          };
        }
        return sub;
      });
    });
    setSelectedItems([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const exportData = () => {
    const data = filteredSubscriptions.map(sub => ({
      ID: sub.id,
      'User Name': sub.userName,
      Email: sub.userEmail,
      Phone: sub.userPhone,
      Plan: sub.planName,
      Status: sub.status,
      'Billing Cycle': sub.billingCycle,
      Amount: sub.total,
      'Start Date': new Date(sub.startDate).toLocaleDateString(),
      'Next Billing': sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A'
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch =
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.userPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesPlan = planFilter === 'all' || sub.planType === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#2d5a42] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Subscription Management
            </h1>
            <div className="flex gap-2">
              {websiteConnected && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  <Globe className="w-3 h-3" />
                  Website
                </span>
              )}
              {hrPanelConnected && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                  <HardHat className="w-3 h-3" />
                  HR Panel
                </span>
              )}
              {mobileAppConnected && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  <Smartphone className="w-3 h-3" />
                  Mobile App
                </span>
              )}
            </div>
          </div>
          <p className="text-[#5c3d1f] mt-2">
            Manage customer subscriptions, billing, and revenue
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUseRealtimeData(!useRealtimeData)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
              useRealtimeData 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' 
                : 'bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed] border border-[#dbc4a4]'
            )}
          >
            {useRealtimeData ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {useRealtimeData ? 'Live' : 'Offline'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCouponModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#a67c52] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Gift className="w-4 h-4" />
            Coupons
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            New Subscription
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-sm font-semibold underline">Dismiss</button>
        </div>
      )}

      {/* Stats Cards - Leather Green Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-[#e8f5ed]" />
            <span className="text-xs text-[#e8f5ed]/70">Active</span>
          </div>
          <p className="text-2xl font-black">{stats.totalActive}</p>
          <p className="text-xs text-[#e8f5ed]/70 mt-1">Subscriptions</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#a67c52] to-[#c49c72] p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <IndianRupee className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Monthly</span>
          </div>
          <p className="text-2xl font-black">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-white/70 mt-1">Revenue</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Growth</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{stats.growthRate}%</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Rate</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-red-500" />
            <span className="text-xs text-[#a67c52]">Churn</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.churnRate}%</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Rate</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-[#8b6914]" />
            <span className="text-xs text-[#a67c52]">ARPU</span>
          </div>
          <p className="text-2xl font-black text-[#8b6914]">₹{stats.arpu}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Per User</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-[#e8f5ed] p-4 rounded-2xl border border-[#2d5a42]/30">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#2d5a42]">Convert</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{stats.conversionRate}%</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Free to Paid</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Pro</span>
          </div>
          <p className="text-2xl font-black">{stats.planDistribution.pro}</p>
          <p className="text-xs text-white/70 mt-1">Pro Users</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Basic</span>
          </div>
          <p className="text-2xl font-black">{stats.planDistribution.basic}</p>
          <p className="text-xs text-white/70 mt-1">Basic Users</p>
        </motion.div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-[#e8f5ed] rounded-xl border border-[#2d5a42]/30"
        >
          <span className="text-[#2d5a42] font-semibold">{selectedItems.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleBulkAction('cancel')}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-200 transition-all"
            >
              Suspend
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subscriptions by user, email, phone..."
            className="w-full pl-12 pr-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Filter className="w-4 h-4 text-[#a67c52]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Crown className="w-4 h-4 text-[#a67c52]" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-[#dbc4a4] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#f0e6d3] to-[#e8f5ed]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredSubscriptions.map(s => s.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Billing</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Next Billing</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e6d3]">
              {filteredSubscriptions.map((sub, index) => {
                const status = STATUS_CONFIG[sub.status];
                const planConfig = PLAN_CONFIG[sub.planType];
                const isSelected = selectedItems.includes(sub.id);
                return (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn("hover:bg-[#faf9f6] transition-colors group", isSelected && "bg-[#e8f5ed]")}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelection(sub.id)}
                        className="w-4 h-4 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-sm">
                          {sub.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a3c28]">{sub.userName}</p>
                          <p className="text-xs text-[#a67c52]">{sub.userEmail}</p>
                          <p className="text-xs text-[#5c3d1f]">{sub.userPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border", planConfig.bg, planConfig.text, planConfig.border)}>
                        {planConfig.icon}
                        {sub.planName}
                      </span>
                      {sub.couponCode && (
                        <span className="ml-2 px-2 py-0.5 bg-[#f0e6d3] text-[#8b6914] rounded text-xs">
                          {sub.couponCode}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="capitalize text-[#5c3d1f] font-medium">{sub.billingCycle}</p>
                        <div className="flex items-center gap-1 text-xs text-[#a67c52] mt-1">
                          <Repeat className="w-3 h-3" />
                          {sub.autoRenew ? 'Auto-renew On' : 'Auto-renew Off'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border", status.bg, status.color, status.border)}>
                        {status.icon}
                        {status.label}
                      </span>
                      <p className="text-xs text-[#a67c52] mt-1 capitalize">{sub.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-bold text-[#1a3c28]">₹{sub.total.toFixed(2)}</p>
                        {sub.discount > 0 && (
                          <p className="text-xs text-emerald-600 font-medium">Saved ₹{sub.discount}</p>
                        )}
                        {sub.gst > 0 && (
                          <p className="text-xs text-[#a67c52]">GST: ₹{sub.gst}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#5c3d1f]">
                      {sub.nextBillingDate ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-8 rounded-lg bg-[#f0e6d3] flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-[#a67c52]" />
                          </div>
                          <span>{new Date(sub.nextBillingDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      ) : (
                        <span className="text-[#a67c52]">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setSelectedSubscription(sub);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditSubscription(sub)}
                          className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl"
                          title="Edit Subscription"
                        >
                          <Edit3 className="w-5 h-5" />
                        </motion.button>
                        {sub.status === 'active' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCancelSubscription(sub.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                            title="Cancel Subscription"
                          >
                            <Ban className="w-5 h-5" />
                          </motion.button>
                        )}
                        {sub.status === 'suspended' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleActivateSubscription(sub.id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl"
                            title="Activate Subscription"
                          >
                            <PlayCircle className="w-5 h-5" />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSuspendSubscription(sub.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl"
                          title="Suspend Subscription"
                        >
                          <PauseCircle className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedSubscription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Subscription Details
                  </h2>
                  <p className="text-sm text-slate-500">{selectedSubscription.id}</p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-500">User</p>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedSubscription.userName}</p>
                    <p className="text-sm text-slate-500">{selectedSubscription.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", STATUS_CONFIG[selectedSubscription.status].bg, STATUS_CONFIG[selectedSubscription.status].color)}>
                      {STATUS_CONFIG[selectedSubscription.status].icon}
                      {STATUS_CONFIG[selectedSubscription.status].label}
                    </span>
                  </div>
                </div>

                {/* Plan Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Plan</p>
                    <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                      {PLAN_ICONS[selectedSubscription.planType]}
                      {selectedSubscription.planName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Billing Cycle</p>
                    <p className="font-medium text-slate-900 dark:text-white capitalize">
                      {selectedSubscription.billingCycle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Start Date</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {new Date(selectedSubscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">End Date</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {new Date(selectedSubscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Payment Breakdown */}
                {selectedSubscription.amount > 0 && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="font-medium text-slate-900 dark:text-white mb-3">Payment Breakdown</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Subtotal</span>
                        <span>₹{selectedSubscription.amount}</span>
                      </div>
                      {selectedSubscription.discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount</span>
                          <span>-₹{selectedSubscription.discount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">GST (18%)</span>
                        <span>₹{selectedSubscription.gst}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-2 border-t border-slate-200 dark:border-slate-600">
                        <span>Total</span>
                        <span>₹{selectedSubscription.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transactions */}
                {selectedSubscription.transactions.length > 0 && (
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white mb-3">Transaction History</p>
                    <div className="space-y-2">
                      {selectedSubscription.transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{txn.description}</p>
                            <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()} • {txn.method}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium">₹{txn.amount}</span>
                            <span className={cn("px-2 py-1 rounded-full text-xs",
                              txn.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                                txn.status === 'failed' ? 'bg-red-100 text-red-600' :
                                  txn.status === 'refunded' ? 'bg-orange-100 text-orange-600' :
                                    'bg-yellow-100 text-yellow-600'
                            )}>
                              {txn.status}
                            </span>
                            {txn.status === 'success' && true && (
                              <button
                                onClick={() => handleRefund(selectedSubscription.id, txn.id)}
                                className="text-xs text-red-500 hover:underline"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {selectedSubscription.status === 'active' && (
                    <button
                      onClick={() => {
                        handleCancelSubscription(selectedSubscription.id);
                        setIsDetailModalOpen(false);
                      }}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Cancel Subscription
                    </button>
                  )}
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Subscription Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-[#e8f5ed]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Create New Subscription</h2>
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <SubscriptionForm 
                  onSave={handleCreateSubscription}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Subscription Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedSubscription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                      <Edit3 className="w-5 h-5 text-[#e8f5ed]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Edit Subscription</h2>
                  </div>
                  <button
                    onClick={() => { setIsEditModalOpen(false); setSelectedSubscription(null); }}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <SubscriptionForm 
                  initialData={selectedSubscription}
                  onSave={(data) => {
                    setSubscriptions(prev => prev.map(sub => 
                      sub.id === selectedSubscription.id ? { ...sub, ...data, updatedAt: new Date().toISOString() } : sub
                    ));
                    setIsEditModalOpen(false);
                    setSelectedSubscription(null);
                  }}
                  onCancel={() => { setIsEditModalOpen(false); setSelectedSubscription(null); }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Coupon Management Modal */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#a67c52] to-[#c49c72]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Coupon Management</h2>
                  </div>
                  <button
                    onClick={() => setIsCouponModalOpen(false)}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <motion.div
                      key={coupon.id}
                      whileHover={{ y: -2 }}
                      className="p-4 bg-white rounded-2xl border border-[#dbc4a4] shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-[#f0e6d3] text-[#8b6914] rounded-lg font-bold text-sm">
                          {coupon.code}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold",
                          coupon.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        )}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#a67c52]">Discount:</span>
                          <span className="font-bold text-[#1a3c28]">
                            {coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a67c52]">Usage:</span>
                          <span className="text-[#5c3d1f]">{coupon.usageCount} / {coupon.maxUsage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#a67c52]">Valid Until:</span>
                          <span className="text-[#5c3d1f]">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                        </div>
                        <div className="w-full bg-[#f0e6d3] rounded-full h-2 mt-3">
                          <div 
                            className="bg-[#2d5a42] h-2 rounded-full transition-all"
                            style={{ width: `${(coupon.usageCount / coupon.maxUsage) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-[#e8f5ed] rounded-2xl border border-[#2d5a42]/30">
                  <h3 className="font-bold text-[#2d5a42] mb-3">Create New Coupon</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      className="px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    />
                    <input
                      type="number"
                      placeholder="Discount Value"
                      className="px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    />
                  </div>
                  <button className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold">
                    Create Coupon
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubscriptionForm({ initialData, onSave, onCancel }: { 
  initialData?: Subscription; 
  onSave: (data: Partial<Subscription>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Subscription>>(initialData || {
    userName: '',
    userEmail: '',
    userPhone: '',
    planType: 'basic',
    billingCycle: 'monthly',
    status: 'active',
    amount: 99,
    discount: 0,
    gst: 17.82,
    total: 116.82,
    paymentMethod: 'Credit Card',
    autoRenew: true,
    notes: ''
  });

  const calculateTotals = () => {
    const amount = formData.amount || 0;
    const discount = formData.discount || 0;
    const gstAmount = (amount - discount) * 0.18;
    const total = amount - discount + gstAmount;
    setFormData(prev => ({ ...prev, gst: gstAmount, total }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">User Name *</label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Email *</label>
          <input
            type="email"
            value={formData.userEmail}
            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Phone</label>
          <input
            type="text"
            value={formData.userPhone}
            onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Plan Type *</label>
          <select
            value={formData.planType}
            onChange={(e) => setFormData({ ...formData, planType: e.target.value as Subscription['planType'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Billing Cycle *</label>
          <select
            value={formData.billingCycle}
            onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as Subscription['billingCycle'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Subscription['status'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Amount (₹)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            onBlur={calculateTotals}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Discount (₹)</label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
            onBlur={calculateTotals}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Total (₹)</label>
          <input
            type="number"
            value={formData.total?.toFixed(2)}
            readOnly
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-[#f0e6d3] text-[#1a3c28] font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Payment Method</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Wallet">Wallet</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="autoRenew"
            checked={formData.autoRenew}
            onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
            className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
          />
          <label htmlFor="autoRenew" className="text-sm font-medium text-[#5c3d1f]">Auto-renew subscription</label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] resize-none"
          placeholder="Add any notes about this subscription..."
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 text-[#5c3d1f] bg-[#f0e6d3] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {initialData ? 'Save Changes' : 'Create Subscription'}
        </button>
      </div>
    </form>
  );
}

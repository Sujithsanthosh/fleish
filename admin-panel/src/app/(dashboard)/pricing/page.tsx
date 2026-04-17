"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Crown,
  Percent,
  IndianRupee,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  X,
  RefreshCcw,
  Wifi,
  WifiOff,
  Globe,
  Smartphone,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Lock,
  Unlock,
  MoreVertical,
  Download,
  Copy,
  CheckSquare,
  Layout,
  Settings,
  Bell,
  Shield,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';
import { useAuthStore } from '@/store/useAuthStore';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  discount: number;
  features: string[];
  color: string;
  icon: string;
  isActive: boolean;
  popular: boolean;
  createdAt: string;
  updatedAt: string;
  trialDays?: number;
  maxOrdersPerMonth?: number;
  maxFamilyMembers?: number;
  prioritySupport: boolean;
  exclusiveDeals: boolean;
}

interface SubscriptionStats {
  totalSubscriptions: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  activeUsers: number;
  freeUsers: number;
  basicUsers: number;
  proUsers: number;
  churnRate: number;
  conversionRate: number;
  avgRevenuePerUser: number;
  websiteViews: number;
  appDownloads: number;
}

interface PlanUsage {
  planId: string;
  activeSubscribers: number;
  revenue: number;
  churn: number;
}

const FALLBACK_PLANS: PricingPlan[] = [
  {
    id: '1',
    name: 'Free',
    description: 'Perfect for trying out Fleish - Start your journey',
    monthlyPrice: 0,
    yearlyPrice: 0,
    discount: 0,
    features: ['Standard delivery', 'Basic order tracking', 'Access to all vendors', 'Email support', 'Basic analytics'],
    color: 'emerald',
    icon: 'Sparkles',
    isActive: true,
    popular: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trialDays: 0,
    maxOrdersPerMonth: 5,
    maxFamilyMembers: 1,
    prioritySupport: false,
    exclusiveDeals: false
  },
  {
    id: '2',
    name: 'Basic',
    description: 'For regular meat lovers - Great value for money',
    monthlyPrice: 99,
    yearlyPrice: 950,
    discount: 20,
    features: ['Free delivery on ₹199+ orders', '5% discount on all items', 'Priority email support', 'Early access to deals', 'Order history export', 'Up to 3 family members'],
    color: 'cyan',
    icon: 'Zap',
    isActive: true,
    popular: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trialDays: 7,
    maxOrdersPerMonth: 20,
    maxFamilyMembers: 3,
    prioritySupport: true,
    exclusiveDeals: false
  },
  {
    id: '3',
    name: 'Pro',
    description: 'For families & bulk buyers - Best value',
    monthlyPrice: 199,
    yearlyPrice: 1900,
    discount: 20,
    features: ['Free delivery on ALL orders', '10% discount on all items', '24/7 Premium phone support', 'Family sharing up to 5', 'Exclusive member deals', 'Advanced analytics', 'Priority order processing', 'Personal account manager'],
    color: 'orange',
    icon: 'Crown',
    isActive: true,
    popular: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    trialDays: 14,
    maxOrdersPerMonth: 999,
    maxFamilyMembers: 5,
    prioritySupport: true,
    exclusiveDeals: true
  }
];

const FALLBACK_STATS: SubscriptionStats = {
  totalSubscriptions: 2847,
  monthlyRevenue: 342500,
  yearlyRevenue: 4120000,
  activeUsers: 2156,
  freeUsers: 892,
  basicUsers: 876,
  proUsers: 388,
  churnRate: 2.4,
  conversionRate: 18.5,
  avgRevenuePerUser: 158,
  websiteViews: 12500,
  appDownloads: 8430
};

const ICONS: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />
};

// Leather Green Theme Colors
const THEME_COLORS: Record<string, { bg: string; text: string; border: string; light: string; gradient: string }> = {
  emerald: { 
    bg: 'bg-[#2d5a42]', 
    text: 'text-[#2d5a42]', 
    border: 'border-[#2d5a42]', 
    light: 'bg-[#e8f5ed]',
    gradient: 'from-[#2d5a42] to-[#3d7a58]'
  },
  cyan: { 
    bg: 'bg-[#3d7a58]', 
    text: 'text-[#3d7a58]', 
    border: 'border-[#3d7a58]', 
    light: 'bg-[#e8f5ed]',
    gradient: 'from-[#3d7a58] to-[#5a9a78]'
  },
  orange: { 
    bg: 'bg-[#a67c52]', 
    text: 'text-[#a67c52]', 
    border: 'border-[#a67c52]', 
    light: 'bg-[#f0e6d3]',
    gradient: 'from-[#a67c52] to-[#c49c72]'
  },
  violet: { 
    bg: 'bg-[#8b6914]', 
    text: 'text-[#8b6914]', 
    border: 'border-[#8b6914]', 
    light: 'bg-[#f0e6d3]',
    gradient: 'from-[#8b6914] to-[#a67c52]'
  },
  rose: { 
    bg: 'bg-red-500', 
    text: 'text-red-500', 
    border: 'border-red-500', 
    light: 'bg-red-50',
    gradient: 'from-red-500 to-red-400'
  }
};

export default function PricingManagementPage() {
  const { hasPermission } = useAuthStore();
  const [plans, setPlans] = useState<PricingPlan[]>(FALLBACK_PLANS);
  const [stats, setStats] = useState<SubscriptionStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [activeTab, setActiveTab] = useState('plans');
  const [websiteConnected, setWebsiteConnected] = useState(false);
  const [userAppConnected, setUserAppConnected] = useState(false);
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<PricingPlan>>({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    discount: 0,
    features: [],
    color: 'emerald',
    icon: 'Sparkles',
    isActive: true,
    popular: false,
    trialDays: 0,
    maxOrdersPerMonth: 0,
    maxFamilyMembers: 1,
    prioritySupport: false,
    exclusiveDeals: false
  });

  const { data: realtimePlans } = useRealtime({
    table: 'pricing_plans',
    enabled: useRealtimeData,
  });

  // Simulate connections
  useEffect(() => {
    setTimeout(() => {
      setWebsiteConnected(true);
      setUserAppConnected(true);
    }, 1500);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setPlans(FALLBACK_PLANS);
      setStats(FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (editingPlan) {
        setPlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...formData } as PricingPlan : p));
      } else {
        const newPlan: PricingPlan = {
          id: `plan_${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as PricingPlan;
        setPlans(prev => [...prev, newPlan]);
      }
      setIsModalOpen(false);
      setEditingPlan(null);
      resetForm();
    } catch (err) {
      setError('Failed to save pricing plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
    try {
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete pricing plan');
    }
  };

  const handleToggleActive = (plan: PricingPlan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleSetPopular = (plan: PricingPlan) => {
    setPlans(prev => prev.map(p => ({ ...p, popular: p.id === plan.id })));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      monthlyPrice: 0,
      yearlyPrice: 0,
      discount: 0,
      features: [],
      color: 'emerald',
      icon: 'Sparkles',
      isActive: true,
      popular: false,
      trialDays: 0,
      maxOrdersPerMonth: 0,
      maxFamilyMembers: 1,
      prioritySupport: false,
      exclusiveDeals: false
    });
    setNewFeature('');
  };

  const openEditModal = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openViewModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsViewModalOpen(true);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

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
              Pricing Management
            </h1>
            <div className="flex gap-2">
              {websiteConnected && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  <Globe className="w-3 h-3" />
                  Website Connected
                </span>
              )}
              {userAppConnected && (
                <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                  <Smartphone className="w-3 h-3" />
                  User App Connected
                </span>
              )}
            </div>
          </div>
          <p className="text-[#5c3d1f] mt-2">
            Manage subscription plans, pricing tiers, and sync with website and user app
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
            {useRealtimeData ? 'Live Sync' : 'Offline'}
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
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </motion.button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }} 
          className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Subscribers</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.totalSubscriptions.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-bold">+12%</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }} 
          className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8b6914] to-[#a67c52]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#8b6914] uppercase tracking-wider">Monthly Revenue</p>
              <p className="text-2xl font-black text-[#8b6914] mt-1">{formatCurrency(stats.monthlyRevenue)}</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-bold">+8%</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#8b6914] to-[#a67c52]">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }} 
          className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#a67c52] to-[#c49c72]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Conversion Rate</p>
              <p className="text-2xl font-black text-[#a67c52] mt-1">{stats.conversionRate}%</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-bold">+2.5%</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#a67c52] to-[#c49c72]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -2 }} 
          className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3d7a58] to-[#5a9a78]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#3d7a58] uppercase tracking-wider">Active Pro Users</p>
              <p className="text-2xl font-black text-[#3d7a58] mt-1">{stats.proUsers.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-bold">+20%</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#3d7a58] to-[#5a9a78]">
              <Crown className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-[#1a3c28]">{stats.websiteViews.toLocaleString()}</p>
              <p className="text-xs text-[#a67c52]">Website Views</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-[#1a3c28]">{stats.appDownloads.toLocaleString()}</p>
              <p className="text-xs text-[#a67c52]">App Downloads</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 text-red-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-[#1a3c28]">{stats.churnRate}%</p>
              <p className="text-xs text-[#a67c52]">Churn Rate</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-lg font-black text-[#1a3c28]">{formatCurrency(stats.avgRevenuePerUser)}</p>
              <p className="text-xs text-[#a67c52]">ARPU</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['plans', 'subscribers', 'analytics', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-bold transition-all capitalize",
              activeTab === tab 
                ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-lg'
                : 'bg-white text-[#5c3d1f] hover:bg-[#f0e6d3] border border-[#dbc4a4]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const theme = THEME_COLORS[plan.color] || THEME_COLORS.emerald;
            const planStats = {
              subscribers: plan.id === '1' ? stats.freeUsers : plan.id === '2' ? stats.basicUsers : stats.proUsers,
              revenue: plan.id === '1' ? 0 : plan.id === '2' ? stats.basicUsers * 99 : stats.proUsers * 199
            };
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "bg-white rounded-3xl border-2 overflow-hidden shadow-sm transition-all hover:shadow-lg",
                  plan.popular ? 'border-[#a67c52]' : 'border-[#dbc4a4]/50'
                )}
              >
                {plan.popular && (
                  <div className="px-4 py-2 bg-gradient-to-r from-[#a67c52] to-[#c49c72] text-white text-center text-sm font-bold flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl", theme.light)}>
                      {ICONS[plan.icon] || <Sparkles className={cn("w-6 h-6", theme.text)} />}
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openViewModal(plan)}
                        className="p-2 text-[#a67c52] hover:bg-[#f0e6d3] rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleActive(plan)}
                        className={cn(
                          "p-2 rounded-xl transition-all",
                          plan.isActive 
                            ? "text-emerald-600 hover:bg-emerald-50" 
                            : "text-slate-400 hover:bg-slate-100"
                        )}
                        title={plan.isActive ? 'Active' : 'Inactive'}
                      >
                        {plan.isActive ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(plan)}
                        className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                        title="Edit Plan"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#1a3c28] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#5c3d1f] mb-4">{plan.description}</p>

                  <div className="mb-4 p-4 bg-[#faf9f6] rounded-2xl">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-[#1a3c28]">
                        ₹{plan.monthlyPrice}
                      </span>
                      <span className="text-[#a67c52]">/month</span>
                    </div>
                    {plan.yearlyPrice > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#a67c52] line-through">
                          ₹{Math.round(plan.yearlyPrice / (1 - plan.discount / 100))}/year
                        </span>
                        <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-700 rounded-full">
                          {plan.discount}% off
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Plan Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-[#e8f5ed] rounded-xl">
                      <p className="text-xs text-[#5c3d1f]">Subscribers</p>
                      <p className="text-lg font-bold text-[#2d5a42]">{planStats.subscribers}</p>
                    </div>
                    <div className="p-3 bg-[#f0e6d3] rounded-xl">
                      <p className="text-xs text-[#5c3d1f]">Revenue</p>
                      <p className="text-lg font-bold text-[#8b6914]">{formatCurrency(planStats.revenue)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[#1a3c28]">Features:</p>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                          <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", theme.text)} />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                      {plan.features.length > 4 && (
                        <li className="text-xs text-[#a67c52] pl-6">
                          +{plan.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#f0e6d3]">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        plan.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {!plan.popular && plan.id !== '1' && (
                        <button
                          onClick={() => handleSetPopular(plan)}
                          className="text-xs font-semibold text-[#a67c52] hover:text-[#8b6914]"
                        >
                          Set as Popular
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Other Tab Placeholders */}
      {activeTab !== 'plans' && (
        <div className="bg-white p-12 rounded-3xl border border-[#dbc4a4]/50 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
            <Layout className="w-10 h-10 text-[#a67c52]" />
          </div>
          <h3 className="text-lg font-bold text-[#1a3c28]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          <p className="text-[#5c3d1f] mt-2">This section is coming soon</p>
          <p className="text-sm text-[#a67c52] mt-1">Connected to Website and User App</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                      {editingPlan ? <Edit3 className="w-5 h-5 text-[#e8f5ed]" /> : <Plus className="w-5 h-5 text-[#e8f5ed]" />}
                    </div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">
                      {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      placeholder="e.g., Pro"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="Sparkles">Sparkles ✨</option>
                      <option value="Zap">Zap ⚡</option>
                      <option value="Crown">Crown 👑</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Brief description of the plan"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Monthly Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyPrice}
                      onChange={(e) => setFormData({ ...formData, monthlyPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Yearly Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.yearlyPrice}
                      onChange={(e) => setFormData({ ...formData, yearlyPrice: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Trial Days
                    </label>
                    <input
                      type="number"
                      value={formData.trialDays}
                      onChange={(e) => setFormData({ ...formData, trialDays: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Max Family Members
                    </label>
                    <input
                      type="number"
                      value={formData.maxFamilyMembers}
                      onChange={(e) => setFormData({ ...formData, maxFamilyMembers: Number(e.target.value) })}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                    Color Theme
                  </label>
                  <div className="flex gap-3">
                    {Object.keys(THEME_COLORS).map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, color })}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all",
                          THEME_COLORS[color].bg,
                          formData.color === color ? 'border-[#1a3c28] scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                        )}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-6 p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    />
                    <span className="text-sm font-semibold text-[#1a3c28]">Active Plan</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.popular}
                      onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                      className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    />
                    <span className="text-sm font-semibold text-[#1a3c28]">Most Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.prioritySupport}
                      onChange={(e) => setFormData({ ...formData, prioritySupport: e.target.checked })}
                      className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    />
                    <span className="text-sm font-semibold text-[#1a3c28]">Priority Support</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                    Features
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      placeholder="Add a feature"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addFeature}
                      className="px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features?.map((feature, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#e8f5ed] text-[#2d5a42] rounded-full text-sm font-semibold"
                      >
                        {feature}
                        <button
                          onClick={() => removeFeature(idx)}
                          className="text-[#2d5a42]/60 hover:text-red-500 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#f0e6d3] flex justify-end gap-3 bg-[#faf9f6]">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-[#5c3d1f] bg-[#f0e6d3] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Plan Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-lg border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {ICONS[selectedPlan.icon]}
                    <div>
                      <h2 className="text-xl font-bold text-[#e8f5ed]">{selectedPlan.name}</h2>
                      <p className="text-sm text-[#e8f5ed]/70">{selectedPlan.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-[#5c3d1f]">{selectedPlan.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Monthly Price</p>
                    <p className="font-bold text-[#1a3c28]">₹{selectedPlan.monthlyPrice}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Yearly Price</p>
                    <p className="font-bold text-[#1a3c28]">₹{selectedPlan.yearlyPrice}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <p className="text-xs text-[#a67c52] uppercase font-bold mb-2">Features</p>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#1a3c28]">
                        <CheckCircle2 className="w-4 h-4 text-[#2d5a42]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    selectedPlan.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {selectedPlan.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {selectedPlan.popular && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0e6d3] text-[#8b6914]">
                      <Star className="w-3 h-3 inline mr-1" />
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(selectedPlan);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Plan
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedPlan, null, 2));
                      alert('Plan details copied to clipboard!');
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

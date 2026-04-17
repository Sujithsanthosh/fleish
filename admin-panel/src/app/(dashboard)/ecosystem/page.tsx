"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Smartphone,
  Store,
  Truck,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Star,
  Download,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  ImageIcon,
  X,
  Upload,
  Globe,
  RefreshCcw,
  Wifi,
  WifiOff,
  LayoutGrid,
  Package,
  Zap,
  Crown,
  Layers,
  Palette,
  Monitor,
  Code,
  Rocket,
  Settings,
  Eye,
  EyeOff,
  Save,
  Copy,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface EcosystemApp {
  id: string;
  name: string;
  type: 'customer' | 'vendor' | 'delivery' | 'website';
  description: string;
  icon: string;
  logoUrl?: string;
  color: string;
  features: string[];
  screenshots: string[];
  playStoreUrl?: string;
  appStoreUrl?: string;
  webUrl?: string;
  version: string;
  status: 'active' | 'maintenance' | 'beta' | 'coming_soon' | 'deprecated';
  downloads: number;
  rating: number;
  reviews: number;
  isPublished: boolean;
  isFeatured: boolean;
  priority: number;
  supportedPlatforms: ('android' | 'ios' | 'web')[];
  minOSVersion?: string;
  size?: string;
  developerInfo?: {
    name: string;
    website?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastDeployedAt?: string;
}

interface AppStats {
  totalDownloads: number;
  activeUsers: number;
  avgRating: number;
  totalReviews: number;
  appsByType: {
    customer: number;
    vendor: number;
    delivery: number;
    website: number;
  };
  activeApps: number;
  betaApps: number;
  maintenanceApps: number;
}

const FALLBACK_APPS: EcosystemApp[] = [
  {
    id: '1',
    name: 'Fleish Customer',
    type: 'customer',
    description: 'Browse, order, and track fresh meat deliveries in real-time. The best way to get premium quality meat delivered to your doorstep.',
    icon: 'Smartphone',
    logoUrl: '/logos/customer-app.png',
    color: '#2d5a42',
    features: ['Real-time tracking', 'Multiple payment options', 'Subscription plans', '24/7 support', 'Push notifications', 'Order history'],
    screenshots: ['/screenshots/customer-1.jpg', '/screenshots/customer-2.jpg', '/screenshots/customer-3.jpg'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fleish.customer',
    appStoreUrl: 'https://apps.apple.com/app/fleish-customer',
    webUrl: 'https://fleish.com/app',
    version: '2.5.1',
    status: 'active',
    downloads: 50000,
    rating: 4.6,
    reviews: 1250,
    isPublished: true,
    isFeatured: true,
    priority: 1,
    supportedPlatforms: ['android', 'ios', 'web'],
    minOSVersion: 'Android 7.0 / iOS 13',
    size: '45MB',
    developerInfo: { name: 'Fleish Technologies', website: 'https://fleish.com', email: 'dev@fleish.com' },
    createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastDeployedAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: '2',
    name: 'Fleish Vendor',
    type: 'vendor',
    description: 'Manage inventory, accept orders, and track revenue performance. The complete vendor dashboard for your meat business.',
    icon: 'Store',
    logoUrl: '/logos/vendor-app.png',
    color: '#a67c52',
    features: ['Inventory management', 'Order tracking', 'Revenue analytics', 'Commission tracking', 'Stock alerts', 'Multi-location support'],
    screenshots: ['/screenshots/vendor-1.jpg', '/screenshots/vendor-2.jpg'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fleish.vendor',
    appStoreUrl: 'https://apps.apple.com/app/fleish-vendor',
    version: '2.3.0',
    status: 'active',
    downloads: 8500,
    rating: 4.4,
    reviews: 320,
    isPublished: true,
    isFeatured: true,
    priority: 2,
    supportedPlatforms: ['android', 'ios'],
    minOSVersion: 'Android 7.0 / iOS 13',
    size: '38MB',
    developerInfo: { name: 'Fleish Technologies', website: 'https://fleish.com', email: 'dev@fleish.com' },
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    lastDeployedAt: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: '3',
    name: 'Fleish Delivery',
    type: 'delivery',
    description: 'Optimized routes, earnings tracker, and live navigation for riders. The perfect companion for delivery partners.',
    icon: 'Truck',
    logoUrl: '/logos/delivery-app.png',
    color: '#3d7a58',
    features: ['Route optimization', 'Earnings tracker', 'Live navigation', 'Instant payouts', 'Offline mode', 'Multi-language support'],
    screenshots: ['/screenshots/delivery-1.jpg', '/screenshots/delivery-2.jpg'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fleish.delivery',
    version: '1.8.5',
    status: 'active',
    downloads: 12000,
    rating: 4.5,
    reviews: 480,
    isPublished: true,
    isFeatured: true,
    priority: 3,
    supportedPlatforms: ['android'],
    minOSVersion: 'Android 7.0',
    size: '32MB',
    developerInfo: { name: 'Fleish Technologies', website: 'https://fleish.com', email: 'dev@fleish.com' },
    createdAt: new Date(Date.now() - 86400000 * 250).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastDeployedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: '4',
    name: 'Fleish Website',
    type: 'website',
    description: 'Main website for Fleish - browse products, place orders, and manage your account from any device.',
    icon: 'Globe',
    logoUrl: '/logos/website-logo.png',
    color: '#1a3c28',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'Secure payments', 'Real-time chat support', 'Blog integration'],
    screenshots: ['/screenshots/website-1.jpg', '/screenshots/website-2.jpg'],
    webUrl: 'https://fleish.com',
    version: '3.2.0',
    status: 'active',
    downloads: 150000,
    rating: 4.7,
    reviews: 2100,
    isPublished: true,
    isFeatured: true,
    priority: 1,
    supportedPlatforms: ['web'],
    size: 'N/A',
    developerInfo: { name: 'Fleish Web Team', website: 'https://fleish.com', email: 'web@fleish.com' },
    createdAt: new Date(Date.now() - 86400000 * 400).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastDeployedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

const FALLBACK_STATS: AppStats = {
  totalDownloads: 228500,
  activeUsers: 125000,
  avgRating: 4.5,
  totalReviews: 5150,
  appsByType: {
    customer: 50000,
    vendor: 8500,
    delivery: 12000,
    website: 150000
  },
  activeApps: 4,
  betaApps: 0,
  maintenanceApps: 0
};

// Leather Green Theme
const THEME = {
  primary: '#2d5a42',
  secondary: '#3d7a58',
  accent: '#a67c52',
  light: '#e8f5ed',
  cream: '#f0e6d3',
  border: '#dbc4a4',
  text: '#1a3c28',
  muted: '#5c3d1f'
};

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; gradient: string }> = {
  customer: {
    label: 'Customer App',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <Smartphone className="w-6 h-6" />,
    gradient: 'from-emerald-500 to-emerald-600'
  },
  vendor: {
    label: 'Vendor App',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <Store className="w-6 h-6" />,
    gradient: 'from-amber-500 to-amber-600'
  },
  delivery: {
    label: 'Delivery App',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
    icon: <Truck className="w-6 h-6" />,
    gradient: 'from-cyan-500 to-cyan-600'
  },
  website: {
    label: 'Website',
    color: 'text-[#2d5a42]',
    bg: 'bg-[#e8f5ed]',
    border: 'border-[#2d5a42]/20',
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-[#2d5a42] to-[#3d7a58]'
  }
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', icon: <CheckCircle2 className="w-4 h-4" /> },
  maintenance: { label: 'Maintenance', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', icon: <Settings className="w-4 h-4" /> },
  beta: { label: 'Beta', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200', icon: <Rocket className="w-4 h-4" /> },
  coming_soon: { label: 'Coming Soon', color: 'text-violet-700', bg: 'bg-violet-100', border: 'border-violet-200', icon: <Eye className="w-4 h-4" /> },
  deprecated: { label: 'Deprecated', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', icon: <XCircle className="w-4 h-4" /> }
};

const PLATFORM_ICONS = {
  android: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521L17.148 8.97c-1.4395-.6592-3.0533-1.0274-4.768-1.0274-1.7147 0-3.3285.3682-4.768 1.0274L5.859 5.4467a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589.3432 18.6617h23.3136c0-4.0028-2.3457-7.475-5.7934-9.3403" /></svg>,
  ios: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.03 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.98 1.08-3.11-1.05.04-2.32.7-3.06 1.6-.67.81-1.26 2.11-1.1 3.09 1.18.09 2.38-.53 3.08-1.58z" /></svg>,
  web: <Globe className="w-5 h-5" />
};

export default function EcosystemPage() {
  const [apps, setApps] = useState<EcosystemApp[]>(FALLBACK_APPS);
  const [stats, setStats] = useState<AppStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<EcosystemApp | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [websiteConnected, setWebsiteConnected] = useState(true);
  const [useRealtimeData, setUseRealtimeData] = useState(false);

  const { data: realtimeData } = useRealtime({
    table: 'ecosystem_apps',
    enabled: useRealtimeData,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setApps(FALLBACK_APPS);
      setStats(FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load ecosystem apps');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveApp = (appData: Partial<EcosystemApp>) => {
    if (selectedApp) {
      setApps(prev => prev.map(app => app.id === selectedApp.id ? { ...app, ...appData, updatedAt: new Date().toISOString() } : app));
    } else {
      const newApp: EcosystemApp = {
        ...(appData as EcosystemApp),
        id: `new-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloads: 0,
        rating: 0,
        reviews: 0
      };
      setApps(prev => [...prev, newApp]);
    }
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleDeleteApp = (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    setApps(prev => prev.filter(app => app.id !== id));
  };

  const handleUpdateLogo = (appId: string, logoType: 'icon' | 'logo', newUrl: string) => {
    setApps(prev => prev.map(app => {
      if (app.id === appId) {
        return logoType === 'icon'
          ? { ...app, icon: newUrl, updatedAt: new Date().toISOString() }
          : { ...app, logoUrl: newUrl, updatedAt: new Date().toISOString() };
      }
      return app;
    }));
    setIsLogoModalOpen(false);
  };

  const handleBulkAction = (action: 'publish' | 'unpublish' | 'feature' | 'delete') => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} apps?`)) return;
    }
    setApps(prev => {
      if (action === 'delete') {
        return prev.filter(app => !selectedItems.includes(app.id));
      }
      return prev.map(app => {
        if (selectedItems.includes(app.id)) {
          return {
            ...app,
            isPublished: action === 'publish' ? true : action === 'unpublish' ? false : app.isPublished,
            isFeatured: action === 'feature' ? true : app.isFeatured
          };
        }
        return app;
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
    const data = filteredApps.map(app => ({
      ID: app.id,
      Name: app.name,
      Type: app.type,
      Version: app.version,
      Status: app.status,
      Downloads: app.downloads,
      Rating: app.rating,
      Reviews: app.reviews,
      Published: app.isPublished ? 'Yes' : 'No'
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecosystem-apps-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d5a42]"></div>
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
                <LayoutGrid className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Ecosystem Apps
            </h1>
            {websiteConnected && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                <Globe className="w-3 h-3" />
                Website Connected
              </span>
            )}
          </div>
          <p className="text-[#5c3d1f] mt-2">
            Manage mobile applications, website, and app store presence
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLogoModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
          >
            <Palette className="w-4 h-4" />
            Manage Logos
          </motion.button>
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
            onClick={() => { setSelectedApp(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add App
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

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-[#e8f5ed] rounded-xl border border-[#2d5a42]/30"
        >
          <span className="text-[#2d5a42] font-semibold">{selectedItems.length} selected</span>
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulkAction('publish')} className="px-4 py-2 bg-[#2d5a42] text-white rounded-lg text-sm font-semibold">
              Publish
            </button>
            <button onClick={() => handleBulkAction('unpublish')} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
              Unpublish
            </button>
            <button onClick={() => handleBulkAction('feature')} className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-semibold">
              Feature
            </button>
            <button onClick={() => handleBulkAction('delete')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold">
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Cards - Leather Green Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Download className="w-5 h-5 text-[#e8f5ed]" />
            <span className="text-xs text-[#e8f5ed]/70">All Time</span>
          </div>
          <p className="text-2xl font-black">{(stats.totalDownloads / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[#e8f5ed]/70 mt-1">Total Downloads</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Monthly</span>
          </div>
          <p className="text-2xl font-black">{(stats.activeUsers / 1000).toFixed(1)}K</p>
          <p className="text-xs text-white/70 mt-1">Active Users</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-[#8b6914]" />
            <span className="text-xs text-[#a67c52]">Average</span>
          </div>
          <p className="text-2xl font-black text-[#8b6914]">{stats.avgRating}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Out of 5</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            <span className="text-xs text-[#a67c52]">Reviews</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{(stats.totalReviews / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Total Reviews</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#e8f5ed] to-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]">
          <div className="flex items-center justify-between mb-2">
            <Smartphone className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Customer</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{(stats.appsByType.customer / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Downloads</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Store className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-[#a67c52]">Vendor</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{(stats.appsByType.vendor / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Downloads</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-5 h-5 text-cyan-500" />
            <span className="text-xs text-[#a67c52]">Delivery</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{(stats.appsByType.delivery / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Downloads</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#a67c52] to-[#c49c72] p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Website</span>
          </div>
          <p className="text-2xl font-black">{(stats.appsByType.website / 1000).toFixed(1)}K</p>
          <p className="text-xs text-white/70 mt-1">Visitors</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search apps by name, description..."
            className="w-full pl-12 pr-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Layers className="w-4 h-4 text-[#a67c52]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="customer">Customer App</option>
              <option value="vendor">Vendor App</option>
              <option value="delivery">Delivery App</option>
              <option value="website">Website</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Zap className="w-4 h-4 text-[#a67c52]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="beta">Beta</option>
              <option value="maintenance">Maintenance</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-[#f0e6d3] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? 'bg-white text-[#2d5a42] shadow-sm' : 'text-[#5c3d1f] hover:bg-white/50'
              )}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? 'bg-white text-[#2d5a42] shadow-sm' : 'text-[#5c3d1f] hover:bg-white/50'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
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

      {/* Apps Grid */}
      <div className={cn(
        "gap-6",
        viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col'
      )}>
        {filteredApps.map((app, index) => {
          const type = TYPE_CONFIG[app.type];
          const status = STATUS_CONFIG[app.status];
          const isSelected = selectedItems.includes(app.id);
          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(45, 90, 66, 0.2)' }}
              className={cn(
                "bg-white rounded-2xl border overflow-hidden shadow-sm",
                isSelected ? 'border-[#2d5a42] ring-2 ring-[#2d5a42]/20' : 'border-[#dbc4a4]',
                viewMode === 'list' && 'flex flex-row items-center p-4 gap-4'
              )}
            >
              <div className={cn("p-6", viewMode === 'list' && 'p-0 flex items-center gap-4 flex-1')}>
                {/* Header with checkbox and icon */}
                <div className={cn("flex items-start justify-between mb-4", viewMode === 'list' && 'mb-0 flex-row items-center gap-4')}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(app.id)}
                      className="w-4 h-4 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    />
                    <div className={cn("rounded-2xl flex items-center justify-center", type.bg, type.border, "border", viewMode === 'grid' ? "w-16 h-16" : "w-12 h-12")}>
                      <span className={type.color}>{type.icon}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border", status.bg, status.color, status.border)}>
                      {status.icon}
                      {status.label}
                    </span>
                    {app.isFeatured && (
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-bold">
                        <Crown className="w-3 h-3 inline mr-1" />
                        Featured
                      </span>
                    )}
                    {!app.isPublished && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold">
                        <EyeOff className="w-3 h-3 inline mr-1" />
                        Unpublished
                      </span>
                    )}
                  </div>
                </div>

                {/* App Info */}
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 className="font-bold text-lg text-[#1a3c28] mb-1">{app.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-[#a67c52]">v{app.version}</span>
                    <span className="text-[#dbc4a4]">•</span>
                    <span className="text-xs text-[#5c3d1f] px-2 py-0.5 bg-[#f0e6d3] rounded">{app.size}</span>
                  </div>

                  <p className="text-sm text-[#5c3d1f] line-clamp-2 mb-4">
                    {app.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#8b6914] fill-[#8b6914]" />
                      <span className="font-bold text-[#8b6914]">{app.rating}</span>
                    </div>
                    <span className="text-[#dbc4a4]">•</span>
                    <span className="text-sm text-[#5c3d1f]">{app.downloads.toLocaleString()} downloads</span>
                    <span className="text-[#dbc4a4]">•</span>
                    <span className="text-sm text-[#a67c52]">{app.reviews} reviews</span>
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-2 mb-4">
                    {app.supportedPlatforms.map(platform => (
                      <span key={platform} className="text-[#a67c52]" title={platform}>
                        {PLATFORM_ICONS[platform]}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.playStoreUrl && (
                      <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#e8f5ed] text-[#2d5a42] rounded-lg hover:bg-[#f0e6d3] font-medium">
                        {PLATFORM_ICONS.android}
                        Play Store
                      </a>
                    )}
                    {app.appStoreUrl && (
                      <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#e8f5ed] text-[#2d5a42] rounded-lg hover:bg-[#f0e6d3] font-medium">
                        {PLATFORM_ICONS.ios}
                        App Store
                      </a>
                    )}
                    {app.webUrl && (
                      <a href={app.webUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[#e8f5ed] text-[#2d5a42] rounded-lg hover:bg-[#f0e6d3] font-medium">
                        <Globe className="w-3 h-3" />
                        Web
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className={cn("flex gap-2", viewMode === 'grid' && "pt-4 border-t border-[#f0e6d3]")}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedApp(app); setIsDetailModalOpen(true); }}
                    className="flex-1 px-3 py-2 text-sm bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedApp(app); setIsModalOpen(true); }}
                    className="flex-1 px-3 py-2 text-sm bg-[#e8f5ed] text-[#2d5a42] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-all"
                  >
                    <Edit3 className="w-4 h-4 inline mr-1" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteApp(app.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* App Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedApp && (
          <AppDetailModal
            app={selectedApp}
            onClose={() => { setIsDetailModalOpen(false); setSelectedApp(null); }}
          />
        )}
      </AnimatePresence>

      {/* App Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <AppFormModal
            initialData={selectedApp}
            onSave={handleSaveApp}
            onCancel={() => { setIsModalOpen(false); setSelectedApp(null); }}
          />
        )}
      </AnimatePresence>

      {/* Logo Management Modal */}
      <AnimatePresence>
        {isLogoModalOpen && (
          <LogoManagementModal
            apps={apps}
            onUpdateLogo={handleUpdateLogo}
            onClose={() => setIsLogoModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Components
function AppDetailModal({ app, onClose }: { app: EcosystemApp; onClose: () => void }) {
  const type = TYPE_CONFIG[app.type];
  const status = STATUS_CONFIG[app.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center bg-white/20")}>
              <span className="text-white">{type.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#e8f5ed]">{app.name}</h2>
              <p className="text-[#e8f5ed]/80">{type.label} • v{app.version}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#e8f5ed] rounded-2xl text-center">
              <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold", status.bg, status.color, status.border)}>
                {status.icon}
                {status.label}
              </span>
              <p className="text-xs text-[#5c3d1f] mt-2">Status</p>
            </div>
            <div className="p-4 bg-[#f0e6d3] rounded-2xl text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-[#2d5a42] rounded-full text-sm font-bold">
                <Download className="w-4 h-4" />
                {app.downloads.toLocaleString()}
              </span>
              <p className="text-xs text-[#5c3d1f] mt-2">Downloads</p>
            </div>
            <div className="p-4 bg-white border border-[#dbc4a4] rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-[#8b6914] fill-[#8b6914]" />
                <span className="text-xl font-bold text-[#8b6914]">{app.rating}</span>
              </div>
              <p className="text-xs text-[#5c3d1f] mt-1">Rating ({app.reviews} reviews)</p>
            </div>
            <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-center">
              <span className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold",
                app.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
              )}>
                {app.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {app.isPublished ? 'Published' : 'Unpublished'}
              </span>
              <p className="text-xs text-[#5c3d1f] mt-2">Visibility</p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
            <h3 className="font-bold text-[#1a3c28] mb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#a67c52]" />
              Description
            </h3>
            <p className="text-[#5c3d1f] leading-relaxed">{app.description}</p>
          </div>

          {/* Features */}
          {app.features.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#a67c52]" />
                Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {app.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#5c3d1f]">
                    <CheckCircle2 className="w-4 h-4 text-[#2d5a42]" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Developer Info */}
          {app.developerInfo && (
            <div className="p-4 bg-[#e8f5ed] rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-2 flex items-center gap-2">
                <Code className="w-4 h-4 text-[#a67c52]" />
                Developer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-[#5c3d1f]"><span className="font-semibold">Name:</span> {app.developerInfo.name}</p>
                {app.developerInfo.website && (
                  <p className="text-[#5c3d1f]"><span className="font-semibold">Website:</span> <a href={app.developerInfo.website} target="_blank" rel="noopener noreferrer" className="text-[#2d5a42] underline">{app.developerInfo.website}</a></p>
                )}
                {app.developerInfo.email && (
                  <p className="text-[#5c3d1f]"><span className="font-semibold">Email:</span> <a href={`mailto:${app.developerInfo.email}`} className="text-[#2d5a42] underline">{app.developerInfo.email}</a></p>
                )}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
            <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-[#a67c52]" />
              Links
            </h3>
            <div className="flex flex-wrap gap-3">
              {app.playStoreUrl && (
                <a href={app.playStoreUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-xl">
                  {PLATFORM_ICONS.android}
                  Google Play Store
                </a>
              )}
              {app.appStoreUrl && (
                <a href={app.appStoreUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-xl">
                  {PLATFORM_ICONS.ios}
                  Apple App Store
                </a>
              )}
              {app.webUrl && (
                <a href={app.webUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#2d5a42] text-white rounded-xl">
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Technical Info */}
          <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
            <h3 className="font-bold text-[#1a3c28] mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#a67c52]" />
              Technical Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-[#5c3d1f]"><span className="font-semibold">Version:</span> {app.version}</div>
              <div className="text-[#5c3d1f]"><span className="font-semibold">Size:</span> {app.size}</div>
              {app.minOSVersion && (
                <div className="text-[#5c3d1f]"><span className="font-semibold">Min OS Version:</span> {app.minOSVersion}</div>
              )}
              <div className="text-[#5c3d1f]"><span className="font-semibold">Last Updated:</span> {new Date(app.updatedAt).toLocaleDateString()}</div>
              {app.lastDeployedAt && (
                <div className="text-[#5c3d1f]"><span className="font-semibold">Last Deployed:</span> {new Date(app.lastDeployedAt).toLocaleDateString()}</div>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AppFormModal({ initialData, onSave, onCancel }: {
  initialData: EcosystemApp | null;
  onSave: (data: Partial<EcosystemApp>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<EcosystemApp>>(initialData || {
    name: '',
    type: 'customer',
    description: '',
    icon: 'Smartphone',
    color: '#2d5a42',
    features: [],
    screenshots: [],
    version: '1.0.0',
    status: 'active',
    isPublished: false,
    isFeatured: false,
    priority: 1,
    supportedPlatforms: ['android'],
    size: '0MB'
  });

  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'links' | 'technical'>('basic');

  const addFeature = () => {
    if (tagInput.trim() && !formData.features?.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, features: [...(prev.features || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({ ...prev, features: prev.features?.filter(f => f !== feature) || [] }));
  };

  const togglePlatform = (platform: 'android' | 'ios' | 'web') => {
    setFormData(prev => ({
      ...prev,
      supportedPlatforms: prev.supportedPlatforms?.includes(platform)
        ? prev.supportedPlatforms.filter(p => p !== platform)
        : [...(prev.supportedPlatforms || []), platform]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
              {initialData ? <Edit3 className="w-5 h-5 text-[#e8f5ed]" /> : <Plus className="w-5 h-5 text-[#e8f5ed]" />}
            </div>
            <h2 className="text-xl font-bold text-[#e8f5ed]">
              {initialData ? 'Edit App' : 'Add New App'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-[#f0e6d3]">
          {(['basic', 'links', 'technical'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab
                  ? 'bg-[#2d5a42] text-[#e8f5ed]'
                  : 'bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          {activeTab === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">App Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as EcosystemApp['type'] })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  >
                    <option value="customer">Customer App</option>
                    <option value="vendor">Vendor App</option>
                    <option value="delivery">Delivery App</option>
                    <option value="website">Website</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] resize-none"
                  placeholder="Describe your app..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Version *</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="1.0.0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as EcosystemApp['status'] })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  >
                    <option value="active">Active</option>
                    <option value="beta">Beta</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="deprecated">Deprecated</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28]"
                    placeholder="Add a feature and press Enter"
                  />
                  <button type="button" onClick={addFeature} className="px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features?.map((feature) => (
                    <span key={feature} className="flex items-center gap-1 px-3 py-1 bg-[#e8f5ed] text-[#2d5a42] rounded-full text-sm">
                      {feature}
                      <button type="button" onClick={() => removeFeature(feature)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                  />
                  <span className="text-sm font-medium text-[#5c3d1f]">Published</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                  />
                  <span className="text-sm font-medium text-[#5c3d1f]">Featured</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'links' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Play Store URL</label>
                  <input
                    type="url"
                    value={formData.playStoreUrl || ''}
                    onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="https://play.google.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">App Store URL</label>
                  <input
                    type="url"
                    value={formData.appStoreUrl || ''}
                    onChange={(e) => setFormData({ ...formData, appStoreUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="https://apps.apple.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Web URL</label>
                <input
                  type="url"
                  value={formData.webUrl || ''}
                  onChange={(e) => setFormData({ ...formData, webUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  placeholder="https://..."
                />
              </div>

              {/* Supported Platforms */}
              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Supported Platforms</label>
                <div className="flex gap-3">
                  {(['android', 'ios', 'web'] as const).map(platform => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all",
                        formData.supportedPlatforms?.includes(platform)
                          ? 'bg-[#2d5a42] text-[#e8f5ed]'
                          : 'bg-[#f0e6d3] text-[#5c3d1f]'
                      )}
                    >
                      {PLATFORM_ICONS[platform]}
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'technical' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">App Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="45MB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Min OS Version</label>
                  <input
                    type="text"
                    value={formData.minOSVersion || ''}
                    onChange={(e) => setFormData({ ...formData, minOSVersion: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="Android 7.0 / iOS 13"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Priority (Display Order)</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  min={1}
                />
              </div>
            </>
          )}

          {/* Actions */}
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
              <Save className="w-4 h-4 inline mr-2" />
              {initialData ? 'Save Changes' : 'Add App'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function LogoManagementModal({ apps, onUpdateLogo, onClose }: {
  apps: EcosystemApp[];
  onUpdateLogo: (appId: string, logoType: 'icon' | 'logo', newUrl: string) => void;
  onClose: () => void;
}) {
  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id || '');
  const [logoType, setLogoType] = useState<'icon' | 'logo'>('logo');
  const [newUrl, setNewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const selectedApp = apps.find(app => app.id === selectedAppId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a mock URL for the uploaded file
    const mockUrl = `/logos/${selectedAppId}-${logoType}-${Date.now()}.${file.name.split('.').pop()}`;

    onUpdateLogo(selectedAppId, logoType, mockUrl);
    setIsUploading(false);
    setNewUrl('');
  };

  const handleUrlSubmit = () => {
    if (newUrl.trim()) {
      onUpdateLogo(selectedAppId, logoType, newUrl.trim());
      setNewUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#e8f5ed]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#e8f5ed]">Manage Logos & Icons</h2>
              <p className="text-sm text-[#e8f5ed]/70">Update app icons and logos for all platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* App Selection */}
          <div>
            <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Select App</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {apps.map(app => {
                const type = TYPE_CONFIG[app.type];
                return (
                  <button
                    key={app.id}
                    onClick={() => { setSelectedAppId(app.id); setNewUrl(''); }}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all",
                      selectedAppId === app.id
                        ? 'border-[#2d5a42] bg-[#e8f5ed] ring-2 ring-[#2d5a42]/20'
                        : 'border-[#dbc4a4] hover:bg-[#f0e6d3]'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={type.color}>{type.icon}</span>
                      <span className="font-semibold text-[#1a3c28] text-sm">{app.name}</span>
                    </div>
                    <p className="text-xs text-[#a67c52]">{type.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedApp && (
            <>
              {/* Current Logo Preview */}
              <div className="p-4 bg-[#e8f5ed] rounded-2xl border border-[#dbc4a4]/30">
                <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#a67c52]" />
                  Current Logo
                </h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center border border-[#dbc4a4] shadow-sm">
                    {selectedApp.logoUrl ? (
                      <img src={selectedApp.logoUrl} alt="Logo" className="w-16 h-16 object-contain" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#a67c52]" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3c28]">{selectedApp.name}</p>
                    <p className="text-sm text-[#5c3d1f]">{TYPE_CONFIG[selectedApp.type].label}</p>
                    <p className="text-xs text-[#a67c52] mt-1">{selectedApp.logoUrl || 'No logo set'}</p>
                  </div>
                </div>
              </div>

              {/* Logo Type Selection */}
              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Logo Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLogoType('logo')}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl font-semibold transition-all",
                      logoType === 'logo'
                        ? 'bg-[#2d5a42] text-[#e8f5ed]'
                        : 'bg-[#f0e6d3] text-[#5c3d1f]'
                    )}
                  >
                    <ImageIcon className="w-5 h-5 inline mr-2" />
                    Full Logo
                  </button>
                  <button
                    onClick={() => setLogoType('icon')}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-xl font-semibold transition-all",
                      logoType === 'icon'
                        ? 'bg-[#2d5a42] text-[#e8f5ed]'
                        : 'bg-[#f0e6d3] text-[#5c3d1f]'
                    )}
                  >
                    <LayoutGrid className="w-5 h-5 inline mr-2" />
                    App Icon
                  </button>
                </div>
              </div>

              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-4">
                {/* File Upload */}
                <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                  <h4 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#a67c52]" />
                    Upload File
                  </h4>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#dbc4a4] rounded-xl cursor-pointer hover:bg-[#f0e6d3] transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-[#a67c52] mb-2" />
                      <p className="text-sm text-[#5c3d1f]">Click to upload</p>
                      <p className="text-xs text-[#a67c52]">PNG, JPG, SVG (max 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                  {isUploading && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-[#2d5a42]">
                      <div className="w-4 h-4 border-2 border-[#2d5a42] border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                  <h4 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-[#a67c52]" />
                    Enter URL
                  </h4>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  />
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!newUrl.trim()}
                    className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold disabled:opacity-50"
                  >
                    Update URL
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const colors = ['#2d5a42', '#a67c52', '#3d7a58', '#1a3c28', '#8b6914'];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    onUpdateLogo(selectedAppId, 'icon', `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="${randomColor}" width="100" height="100" rx="20"/></svg>`);
                  }}
                  className="flex-1 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  <Palette className="w-4 h-4 inline mr-2" />
                  Generate Default Icon
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedApp.logoUrl || '');
                  }}
                  className="flex-1 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  <Copy className="w-4 h-4 inline mr-2" />
                  Copy Current URL
                </button>
              </div>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

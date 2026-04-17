'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ImageIcon,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  GripVertical,
  Star,
  AlertCircle,
  ExternalLink,
  Save,
  X,
  Upload,
  Link2,
  Type,
  AlignLeft,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  mobileImage?: string;
  ctaText: string;
  ctaLink: string;
  ctaColor: string;
  backgroundColor: string;
  textColor: string;
  position: 'hero' | 'mid_page' | 'bottom';
  status: 'active' | 'scheduled' | 'draft' | 'expired';
  priority: number; // 1-10, higher = more priority
  startDate?: string;
  endDate?: string;
  displayOn: ('desktop' | 'mobile' | 'tablet')[];
  createdAt: string;
  updatedAt: string;
  impressions: number;
  clicks: number;
  ctr: number; // click-through rate
}

// Mock data
const MOCK_BANNERS: PromoBanner[] = [
  {
    id: 'BN-001',
    title: 'Fresh Meat Delivered to Your Doorstep',
    subtitle: 'Premium Quality Assured',
    description: 'Get farm-fresh chicken, mutton, and seafood delivered within 2 hours. Order now and get 20% off on your first order!',
    image: '/banners/hero1.jpg',
    mobileImage: '/banners/hero1-mobile.jpg',
    ctaText: 'Order Now',
    ctaLink: '/store',
    ctaColor: '#2d5a42',
    backgroundColor: '#faf9f6',
    textColor: '#1a3c28',
    position: 'hero',
    status: 'active',
    priority: 10,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    displayOn: ['desktop', 'mobile', 'tablet'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    impressions: 45230,
    clicks: 3421,
    ctr: 7.56,
  },
  {
    id: 'BN-002',
    title: 'Become a Delivery Partner',
    subtitle: 'Earn up to ₹25,000/month',
    description: 'Join our growing fleet of delivery partners. Flexible hours, weekly payouts, and exciting incentives.',
    image: '/banners/partner.jpg',
    ctaText: 'Apply Now',
    ctaLink: '/partner',
    ctaColor: '#c49a6c',
    backgroundColor: '#2d5a42',
    textColor: '#ffffff',
    position: 'mid_page',
    status: 'active',
    priority: 8,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    displayOn: ['desktop', 'mobile', 'tablet'],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    impressions: 28450,
    clicks: 1823,
    ctr: 6.41,
  },
  {
    id: 'BN-003',
    title: 'Festival Special Offer',
    subtitle: '50% OFF on All Orders',
    description: 'Celebrate with fresh meat! Use code FEST50 at checkout. Limited time offer.',
    image: '/banners/festival.jpg',
    mobileImage: '/banners/festival-mobile.jpg',
    ctaText: 'Shop Now',
    ctaLink: '/store',
    ctaColor: '#dc2626',
    backgroundColor: '#fef3c7',
    textColor: '#92400e',
    position: 'hero',
    status: 'scheduled',
    priority: 9,
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    displayOn: ['desktop', 'mobile', 'tablet'],
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    impressions: 0,
    clicks: 0,
    ctr: 0,
  },
  {
    id: 'BN-004',
    title: 'Download Our App',
    subtitle: 'Get Extra 10% OFF',
    description: 'Download the Fleish app and enjoy exclusive app-only deals and faster checkout.',
    image: '/banners/app.jpg',
    mobileImage: '/banners/app-mobile.jpg',
    ctaText: 'Download App',
    ctaLink: '/download',
    ctaColor: '#000000',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    position: 'bottom',
    status: 'draft',
    priority: 5,
    displayOn: ['desktop'],
    createdAt: '2024-01-17T16:00:00Z',
    updatedAt: '2024-01-17T16:00:00Z',
    impressions: 0,
    clicks: 0,
    ctr: 0,
  },
  {
    id: 'BN-005',
    title: 'New Year Special',
    subtitle: 'Buy 1 Get 1 Free',
    description: 'Limited time offer on premium chicken cuts. Valid till Jan 10, 2024.',
    image: '/banners/newyear.jpg',
    ctaText: 'Claim Offer',
    ctaLink: '/offers/ny2024',
    ctaColor: '#ffffff',
    backgroundColor: '#dc2626',
    textColor: '#ffffff',
    position: 'hero',
    status: 'expired',
    priority: 7,
    startDate: '2024-01-01',
    endDate: '2024-01-10',
    displayOn: ['desktop', 'mobile', 'tablet'],
    createdAt: '2023-12-25T10:00:00Z',
    updatedAt: '2024-01-10T23:59:59Z',
    impressions: 89340,
    clicks: 5432,
    ctr: 6.08,
  },
];

const STATUS_CONFIG = {
  active: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Active' },
  scheduled: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock, label: 'Scheduled' },
  draft: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Edit3, label: 'Draft' },
  expired: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle, label: 'Expired' },
};

const POSITIONS = {
  hero: { label: 'Hero Banner', description: 'Main homepage banner' },
  mid_page: { label: 'Mid-Page Banner', description: 'Between sections' },
  bottom: { label: 'Bottom Banner', description: 'Page footer area' },
};

const PRESET_COLORS = [
  { name: 'Primary Green', bg: '#2d5a42', text: '#ffffff' },
  { name: 'Light Cream', bg: '#faf9f6', text: '#1a3c28' },
  { name: 'Warm Amber', bg: '#f0e6d3', text: '#5c3d1f' },
  { name: 'Dark Brown', bg: '#3d2914', text: '#ffffff' },
  { name: 'Alert Red', bg: '#dc2626', text: '#ffffff' },
  { name: 'Festival Gold', bg: '#fef3c7', text: '#92400e' },
  { name: 'Clean White', bg: '#ffffff', text: '#1a3c28' },
  { name: 'Deep Teal', bg: '#134e4a', text: '#ffffff' },
];

export default function PromoBannersPage() {
  const [banners, setBanners] = useState<PromoBanner[]>(MOCK_BANNERS);
  const [filteredBanners, setFilteredBanners] = useState<PromoBanner[]>(MOCK_BANNERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [selectedBanner, setSelectedBanner] = useState<PromoBanner | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'hero' | 'promotional'>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<PromoBanner>>({
    title: '',
    subtitle: '',
    description: '',
    ctaText: 'Learn More',
    ctaLink: '',
    ctaColor: '#2d5a42',
    backgroundColor: '#faf9f6',
    textColor: '#1a3c28',
    position: 'hero',
    status: 'draft',
    priority: 5,
    displayOn: ['desktop', 'mobile', 'tablet'],
  });

  // Filter banners
  useEffect(() => {
    let filtered = [...banners];
    
    if (searchQuery) {
      filtered = filtered.filter(banner => 
        banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(banner => banner.status === statusFilter);
    }
    
    if (positionFilter !== 'all') {
      filtered = filtered.filter(banner => banner.position === positionFilter);
    }

    if (activeTab !== 'all') {
      filtered = filtered.filter(banner => {
        if (activeTab === 'hero') return banner.position === 'hero';
        if (activeTab === 'promotional') return banner.position !== 'hero';
        return true;
      });
    }
    
    // Sort by priority (descending)
    filtered.sort((a, b) => b.priority - a.priority);
    
    setFilteredBanners(filtered);
  }, [searchQuery, statusFilter, positionFilter, banners, activeTab]);

  const handleAddBanner = async () => {
    setActionLoading('add');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newBanner: PromoBanner = {
      ...formData as PromoBanner,
      id: `BN-${String(banners.length + 1).padStart(3, '0')}`,
      image: '/banners/default.jpg',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setBanners(prev => [...prev, newBanner]);
    setActionLoading(null);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditBanner = async () => {
    if (!selectedBanner) return;
    
    setActionLoading('edit');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setBanners(prev => prev.map(banner => 
      banner.id === selectedBanner.id 
        ? { ...banner, ...formData, updatedAt: new Date().toISOString() } 
        : banner
    ));
    setActionLoading(null);
    setShowEditModal(false);
    setSelectedBanner(null);
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    setActionLoading(bannerId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setBanners(prev => prev.filter(banner => banner.id !== bannerId));
    setActionLoading(null);
  };

  const handleToggleStatus = async (bannerId: string, currentStatus: PromoBanner['status']) => {
    setActionLoading(bannerId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { ...banner, status: newStatus, updatedAt: new Date().toISOString() } 
        : banner
    ));
    setActionLoading(null);
  };

  const openEditModal = (banner: PromoBanner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      ctaColor: banner.ctaColor,
      backgroundColor: banner.backgroundColor,
      textColor: banner.textColor,
      position: banner.position,
      status: banner.status,
      priority: banner.priority,
      startDate: banner.startDate,
      endDate: banner.endDate,
      displayOn: banner.displayOn,
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      ctaText: 'Learn More',
      ctaLink: '',
      ctaColor: '#2d5a42',
      backgroundColor: '#faf9f6',
      textColor: '#1a3c28',
      position: 'hero',
      status: 'draft',
      priority: 5,
      displayOn: ['desktop', 'mobile', 'tablet'],
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isActive = (banner: PromoBanner) => {
    if (banner.status !== 'active') return false;
    if (banner.startDate && new Date(banner.startDate) > new Date()) return false;
    if (banner.endDate && new Date(banner.endDate) < new Date()) return false;
    return true;
  };

  const stats = {
    total: banners.length,
    active: banners.filter(b => isActive(b)).length,
    scheduled: banners.filter(b => b.status === 'scheduled').length,
    draft: banners.filter(b => b.status === 'draft').length,
    expired: banners.filter(b => b.status === 'expired').length,
    totalImpressions: banners.reduce((acc, b) => acc + b.impressions, 0),
    totalClicks: banners.reduce((acc, b) => acc + b.clicks, 0),
    avgCTR: banners.filter(b => b.ctr > 0).length > 0 
      ? (banners.reduce((acc, b) => acc + b.ctr, 0) / banners.filter(b => b.ctr > 0).length).toFixed(2)
      : '0.00',
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3c28]">Promo Banners</h1>
              <p className="text-[#5c3d1f]">Manage homepage hero content and promotional banners</p>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Banner
          </button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Banners', value: stats.total, icon: ImageIcon, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'Active Now', value: stats.active, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Scheduled', value: stats.scheduled, icon: Clock, color: 'from-blue-500 to-blue-600' },
          { label: 'Draft', value: stats.draft, icon: Edit3, color: 'from-gray-500 to-gray-600' },
          { label: 'Expired', value: stats.expired, icon: XCircle, color: 'from-rose-500 to-rose-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              if (stat.label === 'Total Banners') setStatusFilter('all');
              else if (stat.label === 'Active Now') setStatusFilter('active');
              else if (stat.label === 'Scheduled') setStatusFilter('scheduled');
              else if (stat.label === 'Draft') setStatusFilter('draft');
              else if (stat.label === 'Expired') setStatusFilter('expired');
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#5c3d1f]">{stat.label}</p>
              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a3c28]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Performance Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-xl p-4 mb-6 text-white"
      >
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-white/70 mb-1">Total Impressions</p>
            <p className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-1">Total Clicks</p>
            <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-1">Average CTR</p>
            <p className="text-2xl font-bold">{stats.avgCTR}%</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {[
          { id: 'all', label: 'All Banners', count: banners.length },
          { id: 'hero', label: 'Hero Banners', count: banners.filter(b => b.position === 'hero').length },
          { id: 'promotional', label: 'Promotional', count: banners.filter(b => b.position !== 'hero').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-[#2d5a42] text-white"
                : "bg-white text-[#5c3d1f] border border-[#dbc4a4]/50 hover:bg-[#f0e6d3]"
            )}
          >
            {tab.label}
            <span className={cn(
              "ml-2 px-2 py-0.5 rounded-full text-xs",
              activeTab === tab.id ? "bg-white/20" : "bg-[#f0e6d3]"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm mb-6"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6914]" />
            <input
              type="text"
              placeholder="Search banners by title, subtitle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="draft">Draft</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Positions</option>
            <option value="hero">Hero Banner</option>
            <option value="mid_page">Mid-Page</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </motion.div>

      {/* Banners Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence>
          {filteredBanners.map((banner, index) => {
            const StatusIcon = STATUS_CONFIG[banner.status].icon;
            const active = isActive(banner);
            
            return (
              <motion.div
                key={banner.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Banner Preview */}
                <div 
                  className="relative h-40 p-4 flex flex-col justify-between"
                  style={{ backgroundColor: banner.backgroundColor }}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                      STATUS_CONFIG[banner.status].color
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {STATUS_CONFIG[banner.status].label}
                    </span>
                    {active && (
                      <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Banner Content */}
                  <div>
                    <h3 
                      className="font-bold text-lg mb-1 line-clamp-1"
                      style={{ color: banner.textColor }}
                    >
                      {banner.title}
                    </h3>
                    {banner.subtitle && (
                      <p 
                        className="text-sm mb-2 line-clamp-1"
                        style={{ color: banner.textColor, opacity: 0.8 }}
                      >
                        {banner.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span 
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ 
                          backgroundColor: banner.ctaColor,
                          color: banner.ctaColor === '#ffffff' ? '#000000' : '#ffffff'
                        }}
                      >
                        {banner.ctaText}
                      </span>
                      <span className="text-xs opacity-60" style={{ color: banner.textColor }}>
                        → {banner.ctaLink}
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setSelectedBanner(banner); setShowPreviewModal(true); }}
                      className="p-3 bg-white text-[#1a3c28] rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-[#5c3d1f] mb-1">Position</p>
                      <p className="text-sm font-medium text-[#1a3c28]">{POSITIONS[banner.position].label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#5c3d1f] mb-1">Priority</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-[#1a3c28]">{banner.priority}/10</span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center gap-4 text-sm text-[#5c3d1f] mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(banner.startDate)}</span>
                    </div>
                    <span className="text-[#dbc4a4]">→</span>
                    <div className="flex items-center gap-1">
                      <span>{formatDate(banner.endDate)}</span>
                    </div>
                  </div>

                  {/* Display On */}
                  <div className="flex items-center gap-2 mb-3">
                    {banner.displayOn.includes('desktop') && <Monitor className="w-4 h-4 text-[#8b6914]" />}
                    {banner.displayOn.includes('tablet') && <Tablet className="w-4 h-4 text-[#8b6914]" />}
                    {banner.displayOn.includes('mobile') && <Smartphone className="w-4 h-4 text-[#8b6914]" />}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#dbc4a4]/20 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#1a3c28]">{banner.impressions.toLocaleString()}</p>
                      <p className="text-xs text-[#5c3d1f]">Impressions</p>
                    </div>
                    <div className="text-center border-l border-[#dbc4a4]/20">
                      <p className="text-lg font-bold text-[#1a3c28]">{banner.clicks.toLocaleString()}</p>
                      <p className="text-xs text-[#5c3d1f]">Clicks</p>
                    </div>
                    <div className="text-center border-l border-[#dbc4a4]/20">
                      <p className="text-lg font-bold text-emerald-600">{banner.ctr}%</p>
                      <p className="text-xs text-[#5c3d1f]">CTR</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(banner.id, banner.status)}
                      disabled={actionLoading === banner.id}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
                        active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {actionLoading === banner.id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : active ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Inactive
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(banner)}
                      className="p-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      disabled={actionLoading === banner.id}
                      className="p-2.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredBanners.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-[#c49a6c] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1a3c28] mb-2">No banners found</h3>
          <p className="text-[#5c3d1f] mb-4">Try adjusting your filters or create a new banner</p>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="px-5 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Create Banner
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
          >
            <div className="sticky top-0 bg-white p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-[#1a3c28]">
                {showAddModal ? 'Create New Banner' : 'Edit Banner'}
              </h3>
              <button
                onClick={() => { 
                  showAddModal ? setShowAddModal(false) : setShowEditModal(false); 
                  resetForm(); 
                }}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left: Form */}
                <div className="space-y-5">
                  {/* Basic Info */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-2">
                      <Type className="w-4 h-4" />
                      Banner Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      placeholder="Enter banner title"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-2">
                      <AlignLeft className="w-4 h-4" />
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      placeholder="Enter subtitle (optional)"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-2">
                      <AlignLeft className="w-4 h-4" />
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                      placeholder="Enter description (optional)"
                    />
                  </div>

                  {/* CTA Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-2">
                        <Link2 className="w-4 h-4" />
                        CTA Link *
                      </label>
                      <input
                        type="text"
                        value={formData.ctaLink}
                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                        placeholder="/store or https://..."
                      />
                    </div>
                  </div>

                  {/* Position & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                        Banner Position
                      </label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      >
                        <option value="hero">Hero Banner (Homepage Top)</option>
                        <option value="mid_page">Mid-Page Banner</option>
                        <option value="bottom">Bottom Banner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                        Priority (1-10)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-2">
                        <Calendar className="w-4 h-4" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-2">
                        <Calendar className="w-4 h-4" />
                        End Date
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                      Status
                    </label>
                    <div className="flex gap-2">
                      {['draft', 'scheduled', 'active'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFormData({ ...formData, status: status as any })}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                            formData.status === status
                              ? "bg-[#2d5a42] text-white"
                              : "bg-[#faf9f6] text-[#5c3d1f] border border-[#dbc4a4]/50 hover:bg-[#f0e6d3]"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display On */}
                  <div>
                    <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                      Display On
                    </label>
                    <div className="flex gap-3">
                      {[
                        { id: 'desktop', icon: Monitor, label: 'Desktop' },
                        { id: 'tablet', icon: Tablet, label: 'Tablet' },
                        { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                      ].map(({ id, icon: Icon, label }) => (
                        <label
                          key={id}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors",
                            formData.displayOn?.includes(id as any)
                              ? "bg-[#2d5a42] text-white border-[#2d5a42]"
                              : "bg-white text-[#5c3d1f] border-[#dbc4a4]/50 hover:bg-[#f0e6d3]"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{label}</span>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={formData.displayOn?.includes(id as any)}
                            onChange={(e) => {
                              const current = formData.displayOn || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, displayOn: [...current, id as any] });
                              } else {
                                setFormData({ ...formData, displayOn: current.filter(d => d !== id) });
                              }
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Colors & Preview */}
                <div className="space-y-5">
                  {/* Color Presets */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-[#5c3d1f] mb-3">
                      <Palette className="w-4 h-4" />
                      Color Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_COLORS.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setFormData({ 
                            ...formData, 
                            backgroundColor: preset.bg,
                            textColor: preset.text
                          })}
                          className={cn(
                            "p-3 rounded-lg border-2 text-left transition-all",
                            formData.backgroundColor === preset.bg
                              ? "border-[#2d5a42] ring-2 ring-[#2d5a42]/20"
                              : "border-transparent hover:border-[#dbc4a4]"
                          )}
                          style={{ backgroundColor: preset.bg }}
                        >
                          <p className="text-xs font-medium" style={{ color: preset.text }}>
                            {preset.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                        Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-[#dbc4a4]/50 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                          className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                        Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-[#dbc4a4]/50 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.textColor}
                          onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                          className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                        CTA Button
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.ctaColor}
                          onChange={(e) => setFormData({ ...formData, ctaColor: e.target.value })}
                          className="w-10 h-10 rounded-lg border border-[#dbc4a4]/50 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.ctaColor}
                          onChange={(e) => setFormData({ ...formData, ctaColor: e.target.value })}
                          className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <label className="block text-sm font-medium text-[#5c3d1f] mb-3">
                      Live Preview
                    </label>
                    <div 
                      className="rounded-xl p-6 min-h-[200px] flex flex-col justify-between transition-all"
                      style={{ 
                        backgroundColor: formData.backgroundColor,
                        color: formData.textColor
                      }}
                    >
                      <div>
                        <h4 className="text-xl font-bold mb-1">
                          {formData.title || 'Banner Title'}
                        </h4>
                        <p className="text-sm opacity-80 mb-3">
                          {formData.subtitle || 'Subtitle goes here'}
                        </p>
                        <p className="text-sm opacity-70 line-clamp-2">
                          {formData.description || 'Description text will appear here...'}
                        </p>
                      </div>
                      <div className="mt-4">
                        <span 
                          className="inline-block px-4 py-2 rounded-lg text-sm font-semibold"
                          style={{ 
                            backgroundColor: formData.ctaColor,
                            color: formData.ctaColor === '#ffffff' ? '#000000' : '#ffffff'
                          }}
                        >
                          {formData.ctaText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Placeholder */}
                  <div>
                    <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                      Banner Image
                    </label>
                    <div className="border-2 border-dashed border-[#dbc4a4] rounded-xl p-6 text-center hover:bg-[#faf9f6] transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-[#c49a6c] mx-auto mb-2" />
                      <p className="text-sm text-[#5c3d1f]">Click to upload banner image</p>
                      <p className="text-xs text-[#8b6914] mt-1">Recommended: 1920x600px</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                <button
                  onClick={() => { 
                    showAddModal ? setShowAddModal(false) : setShowEditModal(false); 
                    resetForm(); 
                  }}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={showAddModal ? handleAddBanner : handleEditBanner}
                  disabled={actionLoading === 'add' || actionLoading === 'edit' || !formData.title || !formData.ctaLink}
                  className="flex-1 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {actionLoading === 'add' || actionLoading === 'edit' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" />
                      {showAddModal ? 'Create Banner' : 'Save Changes'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedBanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden"
          >
            {/* Preview Header */}
            <div className="p-4 border-b border-[#dbc4a4]/30 flex items-center justify-between bg-[#faf9f6]">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#8b6914]" />
                <span className="text-sm font-medium text-[#5c3d1f]">Desktop Preview</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>

            {/* Banner Preview */}
            <div 
              className="relative p-12 min-h-[400px] flex items-center"
              style={{ backgroundColor: selectedBanner.backgroundColor }}
            >
              <div className="max-w-2xl">
                <h2 
                  className="text-4xl font-bold mb-3"
                  style={{ color: selectedBanner.textColor }}
                >
                  {selectedBanner.title}
                </h2>
                {selectedBanner.subtitle && (
                  <p 
                    className="text-xl mb-4"
                    style={{ color: selectedBanner.textColor, opacity: 0.9 }}
                  >
                    {selectedBanner.subtitle}
                  </p>
                )}
                {selectedBanner.description && (
                  <p 
                    className="text-base mb-6 max-w-lg"
                    style={{ color: selectedBanner.textColor, opacity: 0.8 }}
                  >
                    {selectedBanner.description}
                  </p>
                )}
                <button
                  className="px-6 py-3 rounded-xl font-semibold text-lg transition-transform hover:scale-105"
                  style={{ 
                    backgroundColor: selectedBanner.ctaColor,
                    color: selectedBanner.ctaColor === '#ffffff' ? '#000000' : '#ffffff'
                  }}
                >
                  {selectedBanner.ctaText}
                </button>
              </div>

              {/* Image placeholder area */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 w-80 h-64 bg-white/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/30">
                <ImageIcon className="w-16 h-16 text-white/40" />
              </div>
            </div>

            {/* Preview Footer */}
            <div className="p-4 bg-[#faf9f6] border-t border-[#dbc4a4]/30 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-[#5c3d1f]">
                <span>Position: <strong>{POSITIONS[selectedBanner.position].label}</strong></span>
                <span>Priority: <strong>{selectedBanner.priority}/10</strong></span>
              </div>
              <a
                href={selectedBanner.ctaLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#2d5a42] text-white rounded-lg hover:bg-[#1a3c28] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Link
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

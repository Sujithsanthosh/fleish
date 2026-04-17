"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Quote,
  Plus,
  Edit3,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  User,
  Calendar,
  ThumbsUp,
  AlertCircle,
  X,
  ImageIcon,
  Clock,
  RefreshCcw,
  Wifi,
  WifiOff,
  Globe,
  MessageSquare,
  Heart,
  Share2,
  Pin,
  PinOff,
  Send,
  FileText,
  TrendingUp,
  Users,
  Building2,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface TestimonialReply {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  avatar?: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected' | 'featured';
  category: 'customer' | 'vendor' | 'delivery_partner' | 'team';
  featured: boolean;
  likes: number;
  shares: number;
  views: number;
  replies: TestimonialReply[];
  tags: string[];
  source: 'website' | 'app' | 'email' | 'social';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  isPinned: boolean;
}

interface TestimonialStats {
  total: number;
  pending: number;
  approved: number;
  featured: number;
  rejected: number;
  avgRating: number;
  thisMonth: number;
  totalLikes: number;
  totalShares: number;
  categoryDistribution: {
    customer: number;
    vendor: number;
    delivery_partner: number;
    team: number;
  };
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'Home Chef',
    company: '',
    avatar: '',
    content: 'Fleish has completely transformed how I buy meat. The quality is exceptional, and the delivery is always on time. I love the freshness guarantee!',
    rating: 5,
    status: 'featured',
    category: 'customer',
    featured: true,
    likes: 245,
    shares: 42,
    views: 1250,
    replies: [
      { id: 'r1', content: 'Thank you for your wonderful feedback!', author: 'Fleish Team', createdAt: new Date(Date.now() - 86400000 * 27).toISOString() }
    ],
    tags: ['quality', 'delivery', 'freshness'],
    source: 'website',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    approvedAt: new Date(Date.now() - 86400000 * 28).toISOString(),
    approvedBy: 'Admin',
    isPinned: true
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh@freshmeat.com',
    role: 'Vendor',
    company: 'Fresh Meat Shop',
    avatar: '',
    content: 'Joining Fleish as a vendor has been a game-changer for my business. My sales have increased by 200% and the platform is so easy to use.',
    rating: 5,
    status: 'approved',
    category: 'vendor',
    featured: false,
    likes: 128,
    shares: 18,
    views: 680,
    replies: [],
    tags: ['vendor', 'business growth'],
    source: 'app',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    approvedAt: new Date(Date.now() - 86400000 * 43).toISOString(),
    approvedBy: 'Admin',
    isPinned: false
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@delivery.com',
    role: 'Delivery Partner',
    company: '',
    avatar: '',
    content: 'Great platform to work with! The app makes deliveries smooth and payments are always on time. Support team is very responsive.',
    rating: 4,
    status: 'approved',
    category: 'delivery_partner',
    featured: false,
    likes: 89,
    shares: 12,
    views: 450,
    replies: [],
    tags: ['delivery', 'support'],
    source: 'app',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    approvedAt: new Date(Date.now() - 86400000 * 18).toISOString(),
    approvedBy: 'Admin',
    isPinned: false
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha@example.com',
    role: 'Customer',
    company: '',
    avatar: '',
    content: 'Good service overall. Sometimes delivery takes longer than expected but the meat quality makes up for it.',
    rating: 4,
    status: 'pending',
    category: 'customer',
    featured: false,
    likes: 0,
    shares: 0,
    views: 12,
    replies: [],
    tags: ['delivery time'],
    source: 'website',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPinned: false
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    role: 'Customer',
    company: '',
    avatar: '',
    content: 'Not satisfied with the last order. The chicken didn\'t seem fresh. Customer service was helpful though.',
    rating: 2,
    status: 'rejected',
    category: 'customer',
    featured: false,
    likes: 0,
    shares: 0,
    views: 8,
    replies: [],
    tags: ['quality issue'],
    source: 'email',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    approvedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    approvedBy: 'Admin',
    isPinned: false
  }
];

const FALLBACK_STATS: TestimonialStats = {
  total: 156,
  pending: 12,
  approved: 134,
  featured: 10,
  rejected: 8,
  avgRating: 4.6,
  thisMonth: 28,
  totalLikes: 2450,
  totalShares: 380,
  categoryDistribution: {
    customer: 98,
    vendor: 32,
    delivery_partner: 18,
    team: 8
  }
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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200', icon: <Clock className="w-4 h-4" /> },
  approved: { label: 'Approved', color: 'text-[#2d5a42]', bg: 'bg-[#e8f5ed]', border: 'border-[#2d5a42]/30', icon: <CheckCircle2 className="w-4 h-4" /> },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', icon: <XCircle className="w-4 h-4" /> },
  featured: { label: 'Featured', color: 'text-violet-700', bg: 'bg-violet-100', border: 'border-violet-200', icon: <Star className="w-4 h-4" /> }
};

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  customer: { icon: <User className="w-4 h-4" />, bg: 'bg-[#e8f5ed]', color: 'text-[#2d5a42]' },
  vendor: { icon: <Building2 className="w-4 h-4" />, bg: 'bg-[#f0e6d3]', color: 'text-[#8b6914]' },
  delivery_partner: { icon: <TruckIcon />, bg: 'bg-blue-100', color: 'text-blue-700' },
  team: { icon: <Users className="w-4 h-4" />, bg: 'bg-violet-100', color: 'text-violet-700' }
};

function TruckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

const CATEGORIES: Record<string, string> = {
  customer: 'Customer',
  vendor: 'Vendor',
  delivery_partner: 'Delivery Partner',
  team: 'Team Member'
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [stats, setStats] = useState<TestimonialStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [websiteConnected, setWebsiteConnected] = useState(true);
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  const { data: realtimeData } = useRealtime({
    table: 'testimonials',
    enabled: useRealtimeData,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTestimonials(FALLBACK_TESTIMONIALS);
      setStats(FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = (id: string, status: Testimonial['status']) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        status, 
        approvedAt: status === 'approved' || status === 'featured' ? new Date().toISOString() : t.approvedAt,
        approvedBy: status === 'approved' || status === 'featured' ? 'Admin' : t.approvedBy
      } : t
    ));
  };

  const handleToggleFeatured = (id: string, featured: boolean) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        featured, 
        status: featured ? 'featured' : 'approved',
        isPinned: featured 
      } : t
    ));
  };

  const handleTogglePin = (id: string, isPinned: boolean) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, isPinned } : t
    ));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'feature' | 'delete') => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} testimonials?`)) return;
    }
    setTestimonials(prev => {
      if (action === 'delete') {
        return prev.filter(t => !selectedItems.includes(t.id));
      }
      return prev.map(t => {
        if (selectedItems.includes(t.id)) {
          return {
            ...t,
            status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : action === 'feature' ? 'featured' : t.status,
            featured: action === 'feature' ? true : t.featured,
            approvedAt: action === 'approve' || action === 'feature' ? new Date().toISOString() : t.approvedAt,
            approvedBy: action === 'approve' || action === 'feature' ? 'Admin' : t.approvedBy
          };
        }
        return t;
      });
    });
    setSelectedItems([]);
  };

  const handleAddReply = (testimonialId: string, content: string) => {
    setTestimonials(prev => prev.map(t => {
      if (t.id === testimonialId) {
        const newReply: TestimonialReply = {
          id: `reply-${Date.now()}`,
          content,
          author: 'Fleish Team',
          createdAt: new Date().toISOString()
        };
        return { ...t, replies: [...t.replies, newReply] };
      }
      return t;
    }));
    setReplyContent('');
    setIsReplyModalOpen(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const exportData = () => {
    const data = filteredTestimonials.map(t => ({
      ID: t.id,
      Name: t.name,
      Email: t.email,
      Role: t.role,
      Category: t.category,
      Rating: t.rating,
      Status: t.status,
      Likes: t.likes,
      Shares: t.shares,
      Views: t.views,
      Content: t.content,
      Created: new Date(t.createdAt).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testimonials-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                <Quote className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Testimonials
            </h1>
            {websiteConnected && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                <Globe className="w-3 h-3" />
                Website Connected
              </span>
            )}
          </div>
          <p className="text-[#5c3d1f] mt-2">
            Manage customer reviews, feedback, and featured testimonials
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
            onClick={() => { setEditingTestimonial(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
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
            <button onClick={() => handleBulkAction('approve')} className="px-4 py-2 bg-[#2d5a42] text-white rounded-lg text-sm font-semibold">
              Approve
            </button>
            <button onClick={() => handleBulkAction('feature')} className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-semibold">
              Feature
            </button>
            <button onClick={() => handleBulkAction('reject')} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
              Reject
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
            <Quote className="w-5 h-5 text-[#e8f5ed]" />
            <span className="text-xs text-[#e8f5ed]/70">All Time</span>
          </div>
          <p className="text-2xl font-black">{stats.total}</p>
          <p className="text-xs text-[#e8f5ed]/70 mt-1">Total Reviews</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#e8f5ed] to-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Pending</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{stats.pending}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">To Review</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Live</span>
          </div>
          <p className="text-2xl font-black">{stats.approved}</p>
          <p className="text-xs text-white/70 mt-1">Approved</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-violet-500 to-violet-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Homepage</span>
          </div>
          <p className="text-2xl font-black">{stats.featured}</p>
          <p className="text-xs text-white/70 mt-1">Featured</p>
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
            <Heart className="w-5 h-5 text-rose-500" />
            <span className="text-xs text-[#a67c52]">Engagement</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.totalLikes}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Total Likes</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Share2 className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-[#a67c52]">Reach</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.totalShares}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Shares</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#a67c52] to-[#c49c72] p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">This Month</span>
          </div>
          <p className="text-2xl font-black">{stats.thisMonth}</p>
          <p className="text-xs text-white/70 mt-1">New Reviews</p>
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
            placeholder="Search testimonials by name, content, email..."
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
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Users className="w-4 h-4 text-[#a67c52]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-[#f0e6d3] p-1 rounded-xl">
            <button
              onClick={() => setActiveView('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                activeView === 'grid' ? 'bg-white text-[#2d5a42] shadow-sm' : 'text-[#5c3d1f] hover:bg-white/50'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                activeView === 'list' ? 'bg-white text-[#2d5a42] shadow-sm' : 'text-[#5c3d1f] hover:bg-white/50'
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

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial, index) => {
          const status = STATUS_CONFIG[testimonial.status];
          const category = CATEGORY_CONFIG[testimonial.category];
          const isSelected = selectedItems.includes(testimonial.id);
          return (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(45, 90, 66, 0.2)' }}
              className={cn(
                "bg-white rounded-2xl border overflow-hidden shadow-sm",
                isSelected ? 'border-[#2d5a42] ring-2 ring-[#2d5a42]/20' : 
                testimonial.featured ? 'border-violet-500 border-2' : 'border-[#dbc4a4]'
              )}
            >
              {testimonial.featured && (
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-1.5 text-xs font-bold text-white text-center flex items-center justify-center gap-2">
                  <Award className="w-3 h-3" />
                  Featured on Homepage
                </div>
              )}
              
              <div className="p-6">
                {/* Header with checkbox */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelection(testimonial.id)}
                      className="w-4 h-4 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3c28]">{testimonial.name}</h3>
                      <p className="text-sm text-[#a67c52]">{testimonial.role}</p>
                      {testimonial.company && (
                        <p className="text-xs text-[#5c3d1f]">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border", status.bg, status.color, status.border)}>
                      {status.icon}
                      {status.label}
                    </span>
                    {testimonial.isPinned && (
                      <span className="px-2 py-0.5 bg-[#f0e6d3] text-[#8b6914] rounded text-xs font-bold">
                        <Pin className="w-3 h-3 inline mr-1" />
                        Pinned
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {testimonial.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {testimonial.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#f0e6d3] text-[#5c3d1f] rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                    {testimonial.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-[#a67c52] text-xs">+{testimonial.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < testimonial.rating ? "text-[#8b6914] fill-[#8b6914]" : "text-[#dbc4a4]"
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold text-[#8b6914]">{testimonial.rating}/5</span>
                </div>

                {/* Content */}
                <p className="text-[#5c3d1f] text-sm mb-4 line-clamp-3 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Meta Stats */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <span className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold", category.bg, category.color)}>
                    {category.icon}
                    {CATEGORIES[testimonial.category]}
                  </span>
                  <div className="flex items-center gap-1 text-[#a67c52]">
                    <Heart className="w-4 h-4" />
                    <span className="font-semibold">{testimonial.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#a67c52]">
                    <Share2 className="w-4 h-4" />
                    <span className="font-semibold">{testimonial.shares}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#a67c52]">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold">{testimonial.views}</span>
                  </div>
                </div>

                {/* Source & Date */}
                <div className="flex items-center justify-between text-xs text-[#a67c52] mb-4">
                  <span className="flex items-center gap-1 capitalize">
                    <Globe className="w-3 h-3" />
                    {testimonial.source}
                  </span>
                  <span>{new Date(testimonial.createdAt).toLocaleDateString('en-IN')}</span>
                </div>

                {/* Replies Count */}
                {testimonial.replies.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[#2d5a42] mb-4 bg-[#e8f5ed] px-2 py-1 rounded-lg w-fit">
                    <MessageSquare className="w-3 h-3" />
                    {testimonial.replies.length} reply{testimonial.replies.length > 1 ? 'ies' : ''}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-[#f0e6d3]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedTestimonial(testimonial); setIsDetailModalOpen(true); }}
                    className="flex-1 px-3 py-2 text-sm bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    View
                  </motion.button>
                  {testimonial.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusUpdate(testimonial.id, 'approved')}
                        className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusUpdate(testimonial.id, 'rejected')}
                        className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}
                  {(testimonial.status === 'approved' || testimonial.status === 'featured') && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggleFeatured(testimonial.id, !testimonial.featured)}
                        className={cn(
                          "p-2 rounded-xl",
                          testimonial.featured 
                            ? "bg-violet-100 text-violet-600" 
                            : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]"
                        )}
                        title="Toggle Featured"
                      >
                        <Star className={cn("w-4 h-4", testimonial.featured && "fill-violet-600")} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTogglePin(testimonial.id, !testimonial.isPinned)}
                        className={cn(
                          "p-2 rounded-xl",
                          testimonial.isPinned 
                            ? "bg-[#2d5a42] text-white" 
                            : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]"
                        )}
                        title="Toggle Pin"
                      >
                        {testimonial.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </motion.button>
                    </>
                  )}
                  {true && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Quote className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Testimonial Details</h2>
                    <p className="text-sm text-[#e8f5ed]/70">{selectedTestimonial.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-xl">
                    {selectedTestimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1a3c28]">{selectedTestimonial.name}</h3>
                    <p className="text-[#a67c52]">{selectedTestimonial.role}</p>
                    <p className="text-sm text-[#5c3d1f]">{selectedTestimonial.email}</p>
                    {selectedTestimonial.company && (
                      <p className="text-sm text-[#5c3d1f] mt-1">{selectedTestimonial.company}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border", STATUS_CONFIG[selectedTestimonial.status].bg, STATUS_CONFIG[selectedTestimonial.status].color, STATUS_CONFIG[selectedTestimonial.status].border)}>
                        {STATUS_CONFIG[selectedTestimonial.status].icon}
                        {STATUS_CONFIG[selectedTestimonial.status].label}
                      </span>
                      <span className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold", CATEGORY_CONFIG[selectedTestimonial.category].bg, CATEGORY_CONFIG[selectedTestimonial.category].color)}>
                        {CATEGORY_CONFIG[selectedTestimonial.category].icon}
                        {CATEGORIES[selectedTestimonial.category]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rating & Content */}
                <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < selectedTestimonial.rating ? "text-[#8b6914] fill-[#8b6914]" : "text-[#dbc4a4]"
                        )}
                      />
                    ))}
                    <span className="ml-2 font-bold text-[#8b6914]">{selectedTestimonial.rating}/5</span>
                  </div>
                  <p className="text-[#5c3d1f] leading-relaxed text-lg italic">
                    "{selectedTestimonial.content}"
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-[#e8f5ed] rounded-2xl text-center">
                    <Heart className="w-6 h-6 text-[#2d5a42] mx-auto mb-2" />
                    <p className="text-2xl font-black text-[#1a3c28]">{selectedTestimonial.likes}</p>
                    <p className="text-xs text-[#5c3d1f]">Likes</p>
                  </div>
                  <div className="p-4 bg-[#f0e6d3] rounded-2xl text-center">
                    <Share2 className="w-6 h-6 text-[#8b6914] mx-auto mb-2" />
                    <p className="text-2xl font-black text-[#1a3c28]">{selectedTestimonial.shares}</p>
                    <p className="text-xs text-[#5c3d1f]">Shares</p>
                  </div>
                  <div className="p-4 bg-white border border-[#dbc4a4] rounded-2xl text-center">
                    <Eye className="w-6 h-6 text-[#a67c52] mx-auto mb-2" />
                    <p className="text-2xl font-black text-[#1a3c28]">{selectedTestimonial.views}</p>
                    <p className="text-xs text-[#5c3d1f]">Views</p>
                  </div>
                </div>

                {/* Tags */}
                {selectedTestimonial.tags.length > 0 && (
                  <div>
                    <h4 className="font-bold text-[#1a3c28] mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#a67c52]" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTestimonial.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-[#f0e6d3] text-[#5c3d1f] rounded-full text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Replies */}
                {selectedTestimonial.replies.length > 0 && (
                  <div>
                    <h4 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#a67c52]" />
                      Replies ({selectedTestimonial.replies.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedTestimonial.replies.map((reply) => (
                        <div key={reply.id} className="p-4 bg-[#e8f5ed] rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-[#2d5a42]">{reply.author}</span>
                            <span className="text-xs text-[#a67c52]">{new Date(reply.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[#5c3d1f]">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Reply */}
                <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                  <h4 className="font-bold text-[#1a3c28] mb-3">Add Reply</h4>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] resize-none"
                    placeholder="Write a response to this testimonial..."
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddReply(selectedTestimonial.id, replyContent)}
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Send Reply
                    </button>
                    <button
                      onClick={() => setIsReplyModalOpen(true)}
                      className="px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold"
                    >
                      Manage Replies
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-[#f0e6d3]">
                  {selectedTestimonial.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedTestimonial.id, 'approved');
                          setIsDetailModalOpen(false);
                        }}
                        className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600"
                      >
                        Approve Testimonial
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedTestimonial.id, 'rejected');
                          setIsDetailModalOpen(false);
                        }}
                        className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                      >
                        Reject Testimonial
                      </button>
                    </>
                  )}
                  {(selectedTestimonial.status === 'approved' || selectedTestimonial.status === 'featured') && (
                    <button
                      onClick={() => {
                        handleToggleFeatured(selectedTestimonial.id, !selectedTestimonial.featured);
                      }}
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl font-semibold",
                        selectedTestimonial.featured
                          ? "bg-violet-100 text-violet-700"
                          : "bg-violet-500 text-white hover:bg-violet-600"
                      )}
                    >
                      {selectedTestimonial.featured ? 'Unfeature' : 'Feature on Homepage'}
                    </button>
                  )}
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    {editingTestimonial ? <Edit3 className="w-5 h-5 text-[#e8f5ed]" /> : <Plus className="w-5 h-5 text-[#e8f5ed]" />}
                  </div>
                  <h2 className="text-xl font-bold text-[#e8f5ed]">
                    {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h2>
                </div>
                <button
                  onClick={() => { setIsModalOpen(false); setEditingTestimonial(null); }}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <TestimonialForm
                  initialData={editingTestimonial}
                  onSave={(data) => {
                    if (editingTestimonial) {
                      setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t));
                    } else {
                      const newTestimonial: Testimonial = {
                        id: `new-${Date.now()}`,
                        ...data,
                        likes: 0,
                        shares: 0,
                        views: 0,
                        replies: [],
                        createdAt: new Date().toISOString(),
                        isPinned: false
                      } as Testimonial;
                      setTestimonials(prev => [newTestimonial, ...prev]);
                    }
                    setIsModalOpen(false);
                    setEditingTestimonial(null);
                  }}
                  onCancel={() => { setIsModalOpen(false); setEditingTestimonial(null); }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestimonialForm({ initialData, onSave, onCancel }: {
  initialData: Testimonial | null;
  onSave: (data: Partial<Testimonial>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Testimonial>>(initialData || {
    name: '',
    email: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    status: 'pending',
    category: 'customer',
    featured: false,
    tags: [],
    source: 'website'
  });

  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) || [] }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Role *</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Testimonial['category'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="delivery_partner">Delivery Partner</option>
            <option value="team">Team Member</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Testimonial['status'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="featured">Featured</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Rating *</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="p-1"
            >
              <Star
                className={cn(
                  "w-8 h-8",
                  star <= (formData.rating || 0) ? "text-[#8b6914] fill-[#8b6914]" : "text-[#dbc4a4]"
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-lg font-bold text-[#8b6914]">{formData.rating}/5</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Content *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] resize-none"
          placeholder="Write the testimonial content..."
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed]"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags?.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#e8f5ed] text-[#2d5a42] rounded-full text-sm">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-[#2d5a42] hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
        />
        <label htmlFor="featured" className="text-sm font-medium text-[#5c3d1f]">Feature on Homepage</label>
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
          {initialData ? 'Save Changes' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    violet: 'bg-violet-100 text-violet-600',
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600'
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", colors[color])}>
        {icon}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

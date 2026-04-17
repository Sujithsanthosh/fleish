'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  MapPin,
  Phone,
  Clock,
  Star,
  ShoppingBag,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ChevronDown,
  ImageIcon,
  Upload,
  ArrowUpDown,
  BadgeCheck,
  AlertCircle,
  TrendingUp,
  Users,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Store {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  image: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: string;
  categories: string[];
  status: 'active' | 'inactive' | 'pending_review' | 'suspended';
  vendorId: string;
  vendorName: string;
  productsCount: number;
  ordersCount: number;
  revenue: number;
  createdAt: string;
  featured: boolean;
}

// Mock data
const MOCK_STORES: Store[] = [
  {
    id: 'ST-001',
    name: 'Premium Meats',
    description: 'High-quality fresh meat and poultry products',
    address: '123, 1st Main Road, Koramangala',
    city: 'Bangalore',
    phone: '+91 98765 43210',
    email: 'premium@meats.com',
    image: '/stores/store1.jpg',
    rating: 4.8,
    reviewCount: 324,
    isOpen: true,
    openingHours: '6:00 AM - 10:00 PM',
    categories: ['Chicken', 'Mutton', 'Seafood'],
    status: 'active',
    vendorId: 'VN-001',
    vendorName: 'Rahul Meats Pvt Ltd',
    productsCount: 45,
    ordersCount: 1234,
    revenue: 245000,
    createdAt: '2024-01-10T08:00:00Z',
    featured: true,
  },
  {
    id: 'ST-002',
    name: 'Fresh Fish Corner',
    description: 'Daily fresh catch from local fishermen',
    address: '456, Fish Market Road, Whitefield',
    city: 'Bangalore',
    phone: '+91 98765 12345',
    email: 'fresh@fish.com',
    image: '/stores/store2.jpg',
    rating: 4.5,
    reviewCount: 189,
    isOpen: true,
    openingHours: '5:00 AM - 9:00 PM',
    categories: ['Seafood', 'Prawns', 'Crabs'],
    status: 'active',
    vendorId: 'VN-002',
    vendorName: 'Sea Fresh Enterprises',
    productsCount: 32,
    ordersCount: 856,
    revenue: 178000,
    createdAt: '2024-01-15T10:00:00Z',
    featured: false,
  },
  {
    id: 'ST-003',
    name: 'Royal Chicken Center',
    description: 'Premium chicken cuts and marinades',
    address: '789, Brigade Road, Jayanagar',
    city: 'Bangalore',
    phone: '+91 87654 32109',
    email: 'royal@chicken.com',
    image: '/stores/store3.jpg',
    rating: 0,
    reviewCount: 0,
    isOpen: false,
    openingHours: '7:00 AM - 9:00 PM',
    categories: ['Chicken', 'Marinades'],
    status: 'pending_review',
    vendorId: 'VN-003',
    vendorName: 'Royal Foods Ltd',
    productsCount: 0,
    ordersCount: 0,
    revenue: 0,
    createdAt: '2024-01-20T14:00:00Z',
    featured: false,
  },
  {
    id: 'ST-004',
    name: 'Mutton House',
    description: 'Authentic mutton and lamb products',
    address: '321, Residency Road, Indiranagar',
    city: 'Bangalore',
    phone: '+91 76543 21098',
    email: 'mutton@house.com',
    image: '/stores/store4.jpg',
    rating: 4.2,
    reviewCount: 156,
    isOpen: false,
    openingHours: '8:00 AM - 8:00 PM',
    categories: ['Mutton', 'Lamb'],
    status: 'suspended',
    vendorId: 'VN-004',
    vendorName: 'Mutton House Traders',
    productsCount: 28,
    ordersCount: 567,
    revenue: 89000,
    createdAt: '2023-12-01T09:00:00Z',
    featured: false,
  },
];

const STATUS_CONFIG = {
  active: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Active' },
  inactive: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle, label: 'Inactive' },
  pending_review: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle, label: 'Pending Review' },
  suspended: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle, label: 'Suspended' },
};

const CATEGORIES = ['Chicken', 'Mutton', 'Seafood', 'Prawns', 'Crabs', 'Lamb', 'Marinades', 'Eggs'];

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [filteredStores, setFilteredStores] = useState<Store[]>(MOCK_STORES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'orders' | 'revenue'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    categories: [],
    openingHours: '',
    featured: false,
  });

  // Filter and sort stores
  useEffect(() => {
    let filtered = [...stores];
    
    if (searchQuery) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(store => store.status === statusFilter);
    }
    
    if (cityFilter !== 'all') {
      filtered = filtered.filter(store => store.city === cityFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(store => store.categories.includes(categoryFilter));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'orders':
          comparison = a.ordersCount - b.ordersCount;
          break;
        case 'revenue':
          comparison = a.revenue - b.revenue;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredStores(filtered);
  }, [searchQuery, statusFilter, cityFilter, categoryFilter, stores, sortBy, sortOrder]);

  const handleStatusChange = async (storeId: string, newStatus: Store['status']) => {
    setActionLoading(storeId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, status: newStatus } : store
    ));
    setActionLoading(null);
  };

  const handleDelete = async (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    
    setActionLoading(storeId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStores(prev => prev.filter(store => store.id !== storeId));
    setActionLoading(null);
  };

  const handleAddStore = async () => {
    setActionLoading('add');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStore: Store = {
      ...formData as Store,
      id: `ST-${String(stores.length + 1).padStart(3, '0')}`,
      image: '/stores/default.jpg',
      rating: 0,
      reviewCount: 0,
      isOpen: true,
      status: 'pending_review',
      vendorId: 'VN-NEW',
      vendorName: 'New Vendor',
      productsCount: 0,
      ordersCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString(),
    };
    
    setStores(prev => [...prev, newStore]);
    setActionLoading(null);
    setShowAddModal(false);
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      categories: [],
      openingHours: '',
      featured: false,
    });
  };

  const handleEditStore = async () => {
    if (!selectedStore) return;
    
    setActionLoading('edit');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStores(prev => prev.map(store => 
      store.id === selectedStore.id ? { ...store, ...formData } : store
    ));
    setActionLoading(null);
    setShowEditModal(false);
    setSelectedStore(null);
  };

  const handleToggleFeatured = async (storeId: string) => {
    setStores(prev => prev.map(store => 
      store.id === storeId ? { ...store, featured: !store.featured } : store
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const cities = [...new Set(stores.map(s => s.city))];

  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    pending: stores.filter(s => s.status === 'pending_review').length,
    featured: stores.filter(s => s.featured).length,
    totalRevenue: stores.reduce((acc, s) => acc + s.revenue, 0),
    totalOrders: stores.reduce((acc, s) => acc + s.ordersCount, 0),
  };

  const openEditModal = (store: Store) => {
    setSelectedStore(store);
    setFormData({
      name: store.name,
      description: store.description,
      address: store.address,
      city: store.city,
      phone: store.phone,
      email: store.email,
      categories: store.categories,
      openingHours: store.openingHours,
      featured: store.featured,
    });
    setShowEditModal(true);
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
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3c28]">Store Management</h1>
              <p className="text-[#5c3d1f]">Manage all stores, vendors, and store performance</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Store
          </button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Total Stores', value: stats.total, icon: Store, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'Active', value: stats.active, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'from-amber-500 to-amber-600' },
          { label: 'Featured', value: stats.featured, icon: Star, color: 'from-violet-500 to-violet-600' },
          { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
          { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'from-rose-500 to-rose-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#5c3d1f]">{stat.label}</p>
              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-[#1a3c28]">{stat.value}</p>
          </motion.div>
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
              placeholder="Search stores, vendors, addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8b6914]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending_review">Pending Review</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 border-l border-[#dbc4a4]/30 pl-4">
            <ArrowUpDown className="w-4 h-4 text-[#8b6914]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="orders">Sort by Orders</option>
              <option value="revenue">Sort by Revenue</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg hover:bg-[#f0e6d3] transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stores Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredStores.map((store, index) => {
          const StatusIcon = STATUS_CONFIG[store.status].icon;
          
          return (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Store Image */}
              <div className="relative h-40 bg-gradient-to-br from-[#f0ebe3] to-[#e8dcc8]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[#c49a6c]" />
                </div>
                
                {/* Featured Badge */}
                {store.featured && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                    STATUS_CONFIG[store.status].color
                  )}>
                    <StatusIcon className="w-3 h-3" />
                    {STATUS_CONFIG[store.status].label}
                  </span>
                </div>

                {/* Open/Closed Badge */}
                <div className="absolute bottom-3 left-3">
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    store.isOpen ? "bg-emerald-500 text-white" : "bg-gray-500 text-white"
                  )}>
                    {store.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Store Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-[#1a3c28] text-lg">{store.name}</h3>
                  {store.rating > 0 && (
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-semibold text-amber-700">{store.rating}</span>
                      <span className="text-xs text-amber-600">({store.reviewCount})</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#5c3d1f] mb-3 line-clamp-2">{store.description}</p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {store.categories.map(cat => (
                    <span key={cat} className="px-2 py-0.5 bg-[#f0e6d3] text-[#5c3d1f] text-xs rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                    <MapPin className="w-3.5 h-3.5 text-[#8b6914]" />
                    <span className="truncate">{store.address}, {store.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                    <Phone className="w-3.5 h-3.5 text-[#8b6914]" />
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                    <Clock className="w-3.5 h-3.5 text-[#8b6914]" />
                    <span>{store.openingHours}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[#dbc4a4]/20 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-[#1a3c28]">{store.productsCount}</p>
                    <p className="text-xs text-[#5c3d1f]">Products</p>
                  </div>
                  <div className="text-center border-l border-[#dbc4a4]/20">
                    <p className="text-lg font-bold text-[#1a3c28]">{store.ordersCount}</p>
                    <p className="text-xs text-[#5c3d1f]">Orders</p>
                  </div>
                  <div className="text-center border-l border-[#dbc4a4]/20">
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(store.revenue)}</p>
                    <p className="text-xs text-[#5c3d1f]">Revenue</p>
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="flex items-center gap-2 mb-4 p-2 bg-[#faf9f6] rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {store.vendorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1a3c28] truncate">{store.vendorName}</p>
                    <p className="text-xs text-[#5c3d1f]">Vendor ID: {store.vendorId}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedStore(store); setShowDetailModal(true); }}
                    className="flex-1 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg font-medium hover:bg-[#e8dcc8] transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(store)}
                    className="p-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(store.id)}
                    className={cn(
                      "p-2.5 rounded-lg transition-colors",
                      store.featured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                    title={store.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star className={cn("w-4 h-4", store.featured && "fill-current")} />
                  </button>
                  <button
                    onClick={() => handleDelete(store.id)}
                    disabled={actionLoading === store.id}
                    className="p-2.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                  >
                    {actionLoading === store.id ? (
                      <div className="w-4 h-4 border-2 border-rose-700/30 border-t-rose-700 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredStores.length === 0 && (
        <div className="text-center py-16">
          <Store className="w-16 h-16 text-[#c49a6c] mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#1a3c28] mb-2">No stores found</h3>
          <p className="text-[#5c3d1f]">Try adjusting your filters or add a new store</p>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1a3c28]">Add New Store</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Store Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    placeholder="Enter store name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    placeholder="store@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                  placeholder="Brief description of the store..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    placeholder="Bangalore"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Full store address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        const cats = formData.categories || [];
                        if (cats.includes(cat)) {
                          setFormData({ ...formData, categories: cats.filter(c => c !== cat) });
                        } else {
                          setFormData({ ...formData, categories: [...cats, cat] });
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-colors",
                        (formData.categories || []).includes(cat)
                          ? "bg-[#2d5a42] text-white"
                          : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8dcc8]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Opening Hours</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                    placeholder="6:00 AM - 10:00 PM"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]/20"
                    />
                    <span className="text-sm font-medium text-[#5c3d1f]">Featured Store</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStore}
                  disabled={actionLoading === 'add' || !formData.name || !formData.email || !formData.phone || !formData.city || !formData.address}
                  className="flex-1 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'add' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Store
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1a3c28]">Edit Store</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Same form fields as Add Modal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Store Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Status</label>
                  <select
                    value={selectedStore.status}
                    onChange={(e) => handleStatusChange(selectedStore.id, e.target.value as Store['status'])}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Opening Hours</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        const cats = formData.categories || [];
                        if (cats.includes(cat)) {
                          setFormData({ ...formData, categories: cats.filter(c => c !== cat) });
                        } else {
                          setFormData({ ...formData, categories: [...cats, cat] });
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm transition-colors",
                        (formData.categories || []).includes(cat)
                          ? "bg-[#2d5a42] text-white"
                          : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8dcc8]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditStore}
                  disabled={actionLoading === 'edit'}
                  className="flex-1 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {actionLoading === 'edit' ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Save Changes
                    </span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header with Image */}
            <div className="relative h-48 bg-gradient-to-br from-[#f0ebe3] to-[#e8dcc8]">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="w-20 h-20 text-[#c49a6c]" />
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                <XCircle className="w-5 h-5 text-[#5c3d1f]" />
              </button>
              {selectedStore.featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Featured Store
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Store Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1a3c28] mb-2">{selectedStore.name}</h2>
                  <p className="text-[#5c3d1f]">{selectedStore.description}</p>
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border",
                  STATUS_CONFIG[selectedStore.status].color
                )}>
                  {React.createElement(STATUS_CONFIG[selectedStore.status].icon, { className: "w-4 h-4" })}
                  {STATUS_CONFIG[selectedStore.status].label}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#faf9f6] rounded-xl p-4 text-center">
                  <Package className="w-6 h-6 text-[#8b6914] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#1a3c28]">{selectedStore.productsCount}</p>
                  <p className="text-sm text-[#5c3d1f]">Products</p>
                </div>
                <div className="bg-[#faf9f6] rounded-xl p-4 text-center">
                  <ShoppingBag className="w-6 h-6 text-[#8b6914] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#1a3c28]">{selectedStore.ordersCount}</p>
                  <p className="text-sm text-[#5c3d1f]">Orders</p>
                </div>
                <div className="bg-[#faf9f6] rounded-xl p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-[#8b6914] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(selectedStore.revenue)}</p>
                  <p className="text-sm text-[#5c3d1f]">Revenue</p>
                </div>
                <div className="bg-[#faf9f6] rounded-xl p-4 text-center">
                  <Star className="w-6 h-6 text-[#8b6914] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#1a3c28]">{selectedStore.rating || 'N/A'}</p>
                  <p className="text-sm text-[#5c3d1f]">Rating ({selectedStore.reviewCount})</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#8b6914]" />
                    Store Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#8b6914] mt-0.5" />
                      <div>
                        <p className="text-sm text-[#3d2914]">{selectedStore.address}</p>
                        <p className="text-sm text-[#5c3d1f]">{selectedStore.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedStore.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedStore.openingHours}</span>
                    </div>
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#8b6914]" />
                    Vendor Details
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-[#faf9f6] rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center text-white font-bold">
                      {selectedStore.vendorName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a3c28]">{selectedStore.vendorName}</p>
                      <p className="text-sm text-[#5c3d1f]">Vendor ID: {selectedStore.vendorId}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#5c3d1f]">
                    Store created on {formatDate(selectedStore.createdAt)}
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-[#1a3c28] mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStore.categories.map(cat => (
                    <span key={cat} className="px-3 py-1.5 bg-[#f0e6d3] text-[#5c3d1f] text-sm rounded-full font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                <button
                  onClick={() => { setShowDetailModal(false); openEditModal(selectedStore); }}
                  className="flex-1 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-5 h-5" />
                  Edit Store
                </button>
                <button
                  onClick={() => handleToggleFeatured(selectedStore.id)}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2",
                    selectedStore.featured 
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                      : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8dcc8]"
                  )}
                >
                  <Star className={cn("w-5 h-5", selectedStore.featured && "fill-current")} />
                  {selectedStore.featured ? 'Remove Featured' : 'Mark Featured'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

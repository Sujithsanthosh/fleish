"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Search, 
  Users, 
  Phone, 
  Plus, 
  Trash2, 
  AlertCircle, 
  RefreshCcw, 
  Eye, 
  Edit3, 
  X,
  MapPin,
  Navigation,
  Package,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Wallet,
  Calendar,
  Award,
  Target,
  Zap,
  Bike,
  Car,
  ChevronDown,
  Download,
  Mail,
  Shield,
  Activity,
  Timer,
  Route,
  Flag,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types
interface Delivery {
  id: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  items: number;
  amount: number;
  status: 'delivered' | 'cancelled' | 'in_transit' | 'picked_up';
  distance: number;
  time: string;
  rating?: number;
  feedback?: string;
  completedAt?: string;
}

interface Rider {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  vehicleType: 'bike' | 'scooter' | 'bicycle' | 'car';
  vehicleNumber: string;
  city: string;
  joinedAt: string;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  cancelledOrders: number;
  avgDeliveryTime: number;
  latitude?: number;
  longitude?: number;
  deliveries?: Delivery[];
}

// Mock Data
const MOCK_RIDERS: Rider[] = [
  {
    id: 'RDR-001',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul@delivery.com',
    isActive: true,
    vehicleType: 'bike',
    vehicleNumber: 'MH-01-AB-1234',
    city: 'Mumbai',
    joinedAt: '2023-08-15',
    rating: 4.8,
    totalDeliveries: 1247,
    earnings: 84500,
    cancelledOrders: 12,
    avgDeliveryTime: 28,
    latitude: 19.0760,
    longitude: 72.8777,
    deliveries: [
      { id: 'DEL-001', orderId: 'ORD-7829', customerName: 'Anita Desai', customerAddress: '456, Sea View, Bandra', items: 4, amount: 1240, status: 'delivered', distance: 2.3, time: '25 min', rating: 5, feedback: 'Excellent service!', completedAt: '2024-04-12 14:30' },
      { id: 'DEL-002', orderId: 'ORD-7830', customerName: 'Vikram Patel', customerAddress: '789, Palm Grove, Juhu', items: 2, amount: 680, status: 'delivered', distance: 4.1, time: '32 min', rating: 4, completedAt: '2024-04-12 13:45' },
      { id: 'DEL-003', orderId: 'ORD-7831', customerName: 'Sneha Gupta', customerAddress: '321, Hill View, Andheri', items: 3, amount: 920, status: 'in_transit', distance: 3.5, time: '18 min' },
    ]
  },
  {
    id: 'RDR-002',
    fullName: 'Priya Patel',
    phone: '+91 98765 43211',
    email: 'priya@delivery.com',
    isActive: true,
    vehicleType: 'scooter',
    vehicleNumber: 'DL-01-CD-5678',
    city: 'Delhi',
    joinedAt: '2023-09-20',
    rating: 4.6,
    totalDeliveries: 892,
    earnings: 62300,
    cancelledOrders: 8,
    avgDeliveryTime: 32,
    latitude: 28.6139,
    longitude: 77.2090,
    deliveries: [
      { id: 'DEL-004', orderId: 'ORD-7832', customerName: 'Rajesh Kumar', customerAddress: '654, Garden Heights, Dwarka', items: 5, amount: 1580, status: 'delivered', distance: 5.2, time: '38 min', rating: 5, feedback: 'Very polite and fast', completedAt: '2024-04-12 12:15' },
      { id: 'DEL-005', orderId: 'ORD-7833', customerName: 'Meera Shah', customerAddress: '987, Lake View, Rohini', items: 1, amount: 340, status: 'cancelled', distance: 6.8, time: 'N/A' },
    ]
  },
  {
    id: 'RDR-003',
    fullName: 'Amit Kumar',
    phone: '+91 98765 43212',
    email: 'amit@delivery.com',
    isActive: false,
    vehicleType: 'bike',
    vehicleNumber: 'KA-01-EF-9012',
    city: 'Bangalore',
    joinedAt: '2024-01-10',
    rating: 4.2,
    totalDeliveries: 456,
    earnings: 31200,
    cancelledOrders: 5,
    avgDeliveryTime: 35,
    deliveries: [
      { id: 'DEL-006', orderId: 'ORD-7834', customerName: 'Deepak Verma', customerAddress: '123, Tech Park, Whitefield', items: 3, amount: 890, status: 'delivered', distance: 4.5, time: '42 min', rating: 4, completedAt: '2024-04-11 18:30' },
    ]
  },
  {
    id: 'RDR-004',
    fullName: 'Suresh Yadav',
    phone: '+91 98765 43213',
    email: 'suresh@delivery.com',
    isActive: true,
    vehicleType: 'car',
    vehicleNumber: 'TN-01-GH-3456',
    city: 'Chennai',
    joinedAt: '2023-06-05',
    rating: 4.9,
    totalDeliveries: 2156,
    earnings: 156800,
    cancelledOrders: 3,
    avgDeliveryTime: 22,
    latitude: 13.0827,
    longitude: 80.2707,
    deliveries: [
      { id: 'DEL-007', orderId: 'ORD-7835', customerName: 'Lakshmi Narayan', customerAddress: '789, Beach Road, Marina', items: 8, amount: 2450, status: 'delivered', distance: 3.2, time: '18 min', rating: 5, feedback: 'Outstanding service! Very professional.', completedAt: '2024-04-12 15:00' },
      { id: 'DEL-008', orderId: 'ORD-7836', customerName: 'Karthik Raja', customerAddress: '456, IT Corridor, OMR', items: 4, amount: 1200, status: 'picked_up', distance: 8.5, time: '45 min' },
    ]
  },
  {
    id: 'RDR-005',
    fullName: 'Neha Gupta',
    phone: '+91 98765 43214',
    email: 'neha@delivery.com',
    isActive: false,
    vehicleType: 'bicycle',
    vehicleNumber: 'N/A',
    city: 'Pune',
    joinedAt: '2024-02-15',
    rating: 3.8,
    totalDeliveries: 156,
    earnings: 12400,
    cancelledOrders: 18,
    avgDeliveryTime: 48,
    deliveries: []
  }
];

const VEHICLE_TYPES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  bike: { label: 'Motorcycle', icon: <Bike className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  scooter: { label: 'Scooter', icon: <Zap className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
  bicycle: { label: 'Bicycle', icon: <Activity className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' },
  car: { label: 'Car', icon: <Car className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' }
};

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>(MOCK_RIDERS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newRider, setNewRider] = useState({ fullName: '', phone: '', email: '', vehicleType: 'bike', vehicleNumber: '', city: '' });
  
  // Modal states
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Rider>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'deliveries' | 'performance'>('overview');

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError('');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setRiders(MOCK_RIDERS);
    } catch (e: any) {
      setError(`Failed to load riders: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rider: Rider = {
      id: `RDR-${String(riders.length + 1).padStart(3, '0')}`,
      fullName: newRider.fullName,
      phone: newRider.phone,
      email: newRider.email,
      vehicleType: newRider.vehicleType as any,
      vehicleNumber: newRider.vehicleNumber,
      city: newRider.city,
      isActive: true,
      joinedAt: new Date().toISOString().split('T')[0],
      rating: 0,
      totalDeliveries: 0,
      earnings: 0,
      cancelledOrders: 0,
      avgDeliveryTime: 0,
      deliveries: []
    };
    setRiders(prev => [rider, ...prev]);
    setNewRider({ fullName: '', phone: '', email: '', vehicleType: 'bike', vehicleNumber: '', city: '' });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this rider?')) return;
    setRiders(prev => prev.filter(r => r.id !== id));
  };

  const handleEdit = (rider: Rider) => {
    setSelectedRider(rider);
    setEditForm({ ...rider });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedRider) return;
    setRiders(prev => prev.map(r => r.id === selectedRider.id ? { ...r, ...editForm } as Rider : r));
    setIsEditModalOpen(false);
    setSelectedRider(null);
  };

  const handleView = (rider: Rider) => {
    setSelectedRider(rider);
    setIsViewModalOpen(true);
    setActiveTab('overview');
  };

  const filtered = riders.filter(r => 
    !search || 
    r.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    r.phone?.includes(search) ||
    r.email?.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: riders.length,
    online: riders.filter(r => r.isActive).length,
    offline: riders.filter(r => !r.isActive).length,
    topRated: riders.filter(r => r.rating >= 4.5).length
  };

  const getPerformanceBadge = (rating: number, deliveries: number) => {
    if (rating >= 4.8 && deliveries > 1000) return { label: 'Elite', color: 'from-amber-500 to-yellow-600', icon: Award };
    if (rating >= 4.5 && deliveries > 500) return { label: 'Pro', color: 'from-[#2d5a42] to-[#3d7a58]', icon: Star };
    if (rating >= 4.0) return { label: 'Rising', color: 'from-blue-500 to-blue-600', icon: Target };
    return { label: 'New', color: 'from-slate-500 to-slate-600', icon: Activity };
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'picked_up': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center">
              <Users className="w-5 h-5 text-[#e8f5ed]" />
            </div>
            Rider Management
          </h1>
          <p className="text-[#5c3d1f] mt-2">Manage delivery riders, track performance, and view delivery history</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={loadRiders} 
            disabled={loading} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4] disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? 'Loading...' : 'Refresh'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" /> 
            Add Rider
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Riders</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.total}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-600 to-emerald-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Online</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats.online}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500">
              <Activity className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-slate-500 to-slate-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Offline</p>
              <p className="text-2xl font-black text-slate-600 mt-1">{stats.offline}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-slate-500 to-slate-400">
              <X className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-600" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Top Rated</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats.topRated}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>
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

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input 
            type="text" 
            placeholder="Search riders by name, phone, email, city..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all" 
          />
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} 
            className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm space-y-4 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#2d5a42]" />
              Add New Rider
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Full Name *" 
                value={newRider.fullName} 
                onChange={e => setNewRider(p => ({ ...p, fullName: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                required 
              />
              <input 
                type="text" 
                placeholder="Phone *" 
                value={newRider.phone} 
                onChange={e => setNewRider(p => ({ ...p, phone: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={newRider.email} 
                onChange={e => setNewRider(p => ({ ...p, email: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
              />
              <select
                value={newRider.vehicleType}
                onChange={e => setNewRider(p => ({ ...p, vehicleType: e.target.value }))}
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
              >
                <option value="bike">Motorcycle</option>
                <option value="scooter">Scooter</option>
                <option value="bicycle">Bicycle</option>
                <option value="car">Car</option>
              </select>
              <input 
                type="text" 
                placeholder="Vehicle Number" 
                value={newRider.vehicleNumber} 
                onChange={e => setNewRider(p => ({ ...p, vehicleNumber: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
              />
              <input 
                type="text" 
                placeholder="City" 
                value={newRider.city} 
                onChange={e => setNewRider(p => ({ ...p, city: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
              />
            </div>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Create Rider
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-6 py-3 bg-[#f0e6d3] text-[#5c3d1f] font-bold rounded-xl hover:bg-[#e8f5ed] transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Riders Table */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-[#f0e6d3]/50 to-[#faf9f6]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Rider</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Vehicle</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Performance</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0e6d3]/50">
            {filtered.map(rider => {
              const vehicleInfo = VEHICLE_TYPES[rider.vehicleType];
              const badge = getPerformanceBadge(rider.rating, rider.totalDeliveries);
              const BadgeIcon = badge.icon;
              
              return (
                <motion.tr 
                  key={rider.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(240, 230, 211, 0.3)' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold shadow-sm">
                        {rider.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#1a3c28]">{rider.fullName}</p>
                          {rider.totalDeliveries > 0 && (
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r", badge.color)}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#a67c52]">
                          <Phone className="w-3 h-3" />
                          {rider.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1.5 rounded-lg", vehicleInfo?.color)}>
                        {vehicleInfo?.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a3c28]">{vehicleInfo?.label}</p>
                        <p className="text-xs text-[#a67c52]">{rider.vehicleNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                      <MapPin className="w-4 h-4 text-[#2d5a42]" />
                      {rider.city}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                      rider.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                    )}>
                      {rider.isActive ? (
                        <><span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" /> Online</>
                      ) : (
                        <><span className="w-1.5 h-1.5 bg-slate-500 rounded-full" /> Offline</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {rider.totalDeliveries > 0 ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-bold text-[#1a3c28]">{rider.rating}</span>
                          </div>
                          <span className="text-xs text-[#a67c52]">• {rider.totalDeliveries} deliveries</span>
                        </div>
                        <p className="text-xs font-bold text-[#2d5a42]">
                          ₹{rider.earnings.toLocaleString()} earned
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-[#a67c52] italic">New rider</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleView(rider)}
                        className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                        title="View Complete History"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(rider)}
                        className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                        title="Edit Rider"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(rider.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Rider"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
              <Users className="w-10 h-10 text-[#a67c52]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a3c28]">No riders found</h3>
            <p className="text-[#5c3d1f] mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* View Rider History Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedRider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">{selectedRider.fullName}</h2>
                    <p className="text-sm text-[#e8f5ed]/70">Rider ID: {selectedRider.id} • Joined {selectedRider.joinedAt}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-2 bg-[#f0e6d3]/30 border-b border-[#dbc4a4]">
                {['overview', 'deliveries', 'performance'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                      activeTab === tab 
                        ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-md"
                        : "text-[#5c3d1f] hover:bg-[#e8f5ed]/50"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-[#1a3c28]">{selectedRider.rating}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Rating</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <Package className="w-6 h-6 text-[#2d5a42] mx-auto mb-2" />
                        <p className="text-2xl font-black text-[#1a3c28]">{selectedRider.totalDeliveries}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Deliveries</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <Wallet className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-emerald-600">₹{selectedRider.earnings.toLocaleString()}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Earnings</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <Timer className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-blue-600">{selectedRider.avgDeliveryTime}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Avg Time (min)</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 space-y-3">
                        <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                          <Phone className="w-5 h-5 text-[#2d5a42]" />
                          Contact Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Phone</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedRider.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Email</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedRider.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 space-y-3">
                        <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                          <Navigation className="w-5 h-5 text-[#2d5a42]" />
                          Vehicle Details
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Type</span>
                            <span className="font-semibold text-[#1a3c28]">{VEHICLE_TYPES[selectedRider.vehicleType]?.label}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Number</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedRider.vehicleNumber || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Deliveries */}
                    <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40">
                      <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-[#2d5a42]" />
                        Recent Deliveries
                      </h3>
                      <div className="space-y-3">
                        {selectedRider.deliveries?.slice(0, 3).map((delivery) => (
                          <div key={delivery.id} className="flex items-center justify-between p-3 bg-[#faf9f6] rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={cn("p-2 rounded-lg", getDeliveryStatusColor(delivery.status).split(' ')[0])}>
                                {delivery.status === 'delivered' ? <CheckCircle2 className="w-4 h-4" /> : 
                                 delivery.status === 'in_transit' ? <Navigation className="w-4 h-4" /> :
                                 delivery.status === 'picked_up' ? <Package className="w-4 h-4" /> :
                                 <XCircle className="w-4 h-4" />}
                              </div>
                              <div>
                                <p className="font-semibold text-[#1a3c28] text-sm">{delivery.orderId}</p>
                                <p className="text-xs text-[#a67c52]">{delivery.customerName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#1a3c28]">₹{delivery.amount}</p>
                              <span className={cn("text-[10px] px-2 py-0.5 rounded-full", getDeliveryStatusColor(delivery.status))}>
                                {delivery.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        ))}
                        {(!selectedRider.deliveries || selectedRider.deliveries.length === 0) && (
                          <p className="text-sm text-[#a67c52] italic text-center py-4">No deliveries yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'deliveries' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-[#1a3c28] text-lg">Complete Delivery History</h3>
                    <div className="space-y-3">
                      {selectedRider.deliveries?.map((delivery) => (
                        <motion.div 
                          key={delivery.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className={cn("p-3 rounded-xl", getDeliveryStatusColor(delivery.status).split(' ')[0])}>
                                {delivery.status === 'delivered' ? <CheckCircle2 className="w-6 h-6" /> : 
                                 delivery.status === 'in_transit' ? <Navigation className="w-6 h-6" /> :
                                 delivery.status === 'picked_up' ? <Package className="w-6 h-6" /> :
                                 <XCircle className="w-6 h-6" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-[#1a3c28]">{delivery.orderId}</p>
                                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getDeliveryStatusColor(delivery.status))}>
                                    {delivery.status.replace('_', ' ')}
                                  </span>
                                </div>
                                <p className="text-sm text-[#5c3d1f] mt-1">{delivery.customerName}</p>
                                <p className="text-xs text-[#a67c52] mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {delivery.customerAddress}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-[#a67c52]">
                                  <span className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    {delivery.items} items
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Route className="w-3 h-3" />
                                    {delivery.distance} km
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {delivery.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-[#2d5a42]">₹{delivery.amount}</p>
                              {delivery.rating && (
                                <div className="flex items-center gap-1 mt-1 justify-end">
                                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                  <span className="text-xs font-semibold text-[#1a3c28]">{delivery.rating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {delivery.feedback && (
                            <div className="mt-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                              <p className="text-xs text-[#a67c52] flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                Customer Feedback:
                              </p>
                              <p className="text-sm text-[#1a3c28] mt-1 italic">"{delivery.feedback}"</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {(!selectedRider.deliveries || selectedRider.deliveries.length === 0) && (
                        <div className="text-center py-12">
                          <Package className="w-16 h-16 text-[#a67c52]/30 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-[#1a3c28]">No deliveries yet</h3>
                          <p className="text-[#5c3d1f] mt-2">This rider hasn't completed any deliveries</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-gradient-to-br from-[#e8f5ed] to-[#f0e6d3] rounded-2xl border border-[#dbc4a4]/40">
                        <h3 className="font-bold text-[#1a3c28] mb-4">Success Rate</h3>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full border-4 border-[#2d5a42] flex items-center justify-center">
                            <span className="text-xl font-black text-[#2d5a42]">
                              {((selectedRider.totalDeliveries / (selectedRider.totalDeliveries + selectedRider.cancelledOrders)) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-[#5c3d1f]">{selectedRider.totalDeliveries} completed</p>
                            <p className="text-sm text-red-600">{selectedRider.cancelledOrders} cancelled</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                        <h3 className="font-bold text-[#1a3c28] mb-4">Customer Rating</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "w-6 h-6",
                                  star <= Math.round(selectedRider.rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"
                                )} 
                              />
                            ))}
                          </div>
                          <span className="text-2xl font-black text-[#1a3c28] ml-2">{selectedRider.rating}</span>
                        </div>
                        <p className="text-xs text-[#a67c52] mt-2">Based on customer feedback</p>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                      <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#2d5a42]" />
                        Performance Metrics
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-[#faf9f6] rounded-xl">
                          <p className="text-2xl font-black text-[#1a3c28]">{selectedRider.totalDeliveries}</p>
                          <p className="text-xs text-[#a67c52] uppercase font-bold">Total Orders</p>
                        </div>
                        <div className="text-center p-4 bg-[#faf9f6] rounded-xl">
                          <p className="text-2xl font-black text-[#2d5a42]">₹{(selectedRider.earnings / selectedRider.totalDeliveries).toFixed(0)}</p>
                          <p className="text-xs text-[#a67c52] uppercase font-bold">Avg Per Order</p>
                        </div>
                        <div className="text-center p-4 bg-[#faf9f6] rounded-xl">
                          <p className="text-2xl font-black text-blue-600">{selectedRider.avgDeliveryTime}</p>
                          <p className="text-xs text-[#a67c52] uppercase font-bold">Avg Minutes</p>
                        </div>
                        <div className="text-center p-4 bg-[#faf9f6] rounded-xl">
                          <p className="text-2xl font-black text-emerald-600">{selectedRider.cancelledOrders}</p>
                          <p className="text-xs text-[#a67c52] uppercase font-bold">Cancelled</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Rider Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedRider && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-lg border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Edit Rider</h2>
                    <p className="text-sm text-[#e8f5ed]/70">Update rider information</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.fullName || ''}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Vehicle Type</label>
                    <select
                      value={editForm.vehicleType || 'bike'}
                      onChange={(e) => setEditForm({ ...editForm, vehicleType: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all appearance-none"
                    >
                      <option value="bike">Motorcycle</option>
                      <option value="scooter">Scooter</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="car">Car</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Vehicle Number</label>
                    <input
                      type="text"
                      value={editForm.vehicleNumber || ''}
                      onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editForm.isActive || false}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#2d5a42] border-[#dbc4a4] rounded focus:ring-[#2d5a42]"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-[#1a3c28]">Rider is active (online)</label>
                </div>
              </div>

              <div className="p-6 border-t border-[#f0e6d3] flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

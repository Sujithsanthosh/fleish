"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Truck,
  Plus,
  Edit3,
  CheckCircle2,
  XCircle,
  UserPlus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
  Filter,
  Search,
  Download,
  MoreHorizontal,
  BadgeCheck,
  Clock3,
  X,
  Star,
  Navigation,
  IndianRupee,
  TrendingUp,
  Eye,
  ArrowLeft,
  Save,
  Wallet,
  Battery,
  Signal,
  Gauge,
  Award,
  Crown,
  Target,
  Zap,
  Flame,
  Shield,
  CreditCard,
  Building2,
  Users,
  Package,
  CheckIcon,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

interface DeliveryPartner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  vehicleType: 'bike' | 'scooter' | 'bicycle' | 'car';
  vehicleNumber: string;
  drivingLicense: string;
  licenseExpiry: string;
  aadhaarNumber: string;
  panNumber: string;
  bankAccountNumber: string;
  bankIfsc: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  documents: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold' | 'suspended';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes: string;
  isActive: boolean;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  commissionPerDelivery: number;
}

interface PartnerStats {
  totalPartners: number;
  pending: number;
  approved: number;
  rejected: number;
  activeNow: number;
  totalDeliveries: number;
  totalEarnings: number;
}

const FALLBACK_PARTNERS: DeliveryPartner[] = [
  {
    id: '1',
    fullName: 'Rahul Sharma',
    email: 'rahul@delivery.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1995-06-15',
    gender: 'Male',
    address: '123, Main Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    vehicleType: 'bike',
    vehicleNumber: 'MH-01-AB-1234',
    drivingLicense: 'MH0123456789',
    licenseExpiry: '2027-06-15',
    aadhaarNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    bankAccountNumber: '1234567890',
    bankIfsc: 'HDFC0001234',
    emergencyContactName: 'Priya Sharma',
    emergencyContactPhone: '+91 98765 43211',
    documents: ['driving_license.pdf', 'aadhaar.pdf', 'pan.pdf', 'vehicle_rc.pdf'],
    status: 'approved',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 43200000).toISOString(),
    reviewedBy: 'Admin User',
    notes: 'Good driving record, approved',
    isActive: true,
    rating: 4.8,
    totalDeliveries: 156,
    earnings: 45000,
    commissionPerDelivery: 35
  },
  {
    id: '2',
    fullName: 'Priya Patel',
    email: 'priya@delivery.com',
    phone: '+91 98765 43212',
    dateOfBirth: '1998-03-20',
    gender: 'Female',
    address: '456, Link Road',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    vehicleType: 'scooter',
    vehicleNumber: 'DL-01-CD-5678',
    drivingLicense: 'DL9876543210',
    licenseExpiry: '2028-03-20',
    aadhaarNumber: '9876-5432-1098',
    panNumber: 'FGHIJ5678K',
    bankAccountNumber: '0987654321',
    bankIfsc: 'ICIC0001234',
    emergencyContactName: 'Amit Patel',
    emergencyContactPhone: '+91 98765 43213',
    documents: ['driving_license.pdf', 'aadhaar.pdf', 'pan.pdf'],
    status: 'under_review',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    notes: '',
    isActive: false,
    rating: 0,
    totalDeliveries: 0,
    earnings: 0,
    commissionPerDelivery: 30
  },
  {
    id: '3',
    fullName: 'Amit Kumar',
    email: 'amit@delivery.com',
    phone: '+91 98765 43214',
    dateOfBirth: '1990-12-10',
    gender: 'Male',
    address: '789, Park Street',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    vehicleType: 'bike',
    vehicleNumber: 'KA-01-EF-9012',
    drivingLicense: '',
    licenseExpiry: '',
    aadhaarNumber: '5678-9012-3456',
    panNumber: 'LMNOP9012Q',
    bankAccountNumber: '1122334455',
    bankIfsc: 'SBIN0001234',
    emergencyContactName: 'Sunita Kumar',
    emergencyContactPhone: '+91 98765 43215',
    documents: ['aadhaar.pdf', 'pan.pdf'],
    status: 'rejected',
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    reviewedAt: new Date(Date.now() - 172800000).toISOString(),
    reviewedBy: 'Admin User',
    rejectionReason: 'Driving license missing',
    notes: 'Please provide valid driving license',
    isActive: false,
    rating: 0,
    totalDeliveries: 0,
    earnings: 0,
    commissionPerDelivery: 0
  }
];

const FALLBACK_STATS: PartnerStats = {
  totalPartners: 85,
  pending: 12,
  approved: 68,
  rejected: 5,
  activeNow: 42,
  totalDeliveries: 12500,
  totalEarnings: 450000
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: <Clock3 className="w-4 h-4" /> },
  under_review: { label: 'Under Review', color: 'text-blue-600', bg: 'bg-blue-100', icon: <FileText className="w-4 h-4" /> },
  approved: { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: <BadgeCheck className="w-4 h-4" /> },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-100', icon: <XCircle className="w-4 h-4" /> },
  on_hold: { label: 'On Hold', color: 'text-orange-600', bg: 'bg-orange-100', icon: <Clock className="w-4 h-4" /> },
  suspended: { label: 'Suspended', color: 'text-slate-600', bg: 'bg-slate-100', icon: <AlertCircle className="w-4 h-4" /> }
};

const VEHICLE_TYPES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  bike: { label: 'Motorcycle', icon: <Navigation className="w-4 h-4" />, color: 'bg-blue-100 text-blue-600' },
  scooter: { label: 'Scooter', icon: <Zap className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-600' },
  bicycle: { label: 'Bicycle', icon: <Target className="w-4 h-4" />, color: 'bg-amber-100 text-amber-600' },
  car: { label: 'Car', icon: <Truck className="w-4 h-4" />, color: 'bg-purple-100 text-purple-600' }
};

export default function DeliveryPartnersPage() {
  const { hasPermission } = useAuthStore();
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [stats, setStats] = useState<PartnerStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<DeliveryPartner | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [commissionRate, setCommissionRate] = useState(30);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'active'>('all');
  
  // Add partner form state
  const [newPartner, setNewPartner] = useState<Partial<DeliveryPartner>>({
    fullName: '',
    email: '',
    phone: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    city: '',
    status: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [partnersRes, statsRes] = await Promise.all([
        api.get('/admin/delivery-partners').catch(() => ({ data: FALLBACK_PARTNERS })),
        api.get('/admin/delivery-stats').catch(() => ({ data: FALLBACK_STATS }))
      ]);
      setPartners(partnersRes.data || FALLBACK_PARTNERS);
      setStats(statsRes.data || FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load delivery partners');
      setPartners(FALLBACK_PARTNERS);
      setStats(FALLBACK_STATS);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: DeliveryPartner['status'], reason?: string) => {
    try {
      await api.put(`/admin/delivery-partners/${id}/status`, {
        status,
        notes: reviewNotes,
        commissionPerDelivery: status === 'approved' ? commissionRate : undefined,
        rejectionReason: reason
      });
      setIsDetailModalOpen(false);
      setReviewNotes('');
      loadData();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Vehicle', 'City', 'Status', 'Rating', 'Deliveries', 'Earnings'];
    const rows = filteredPartners.map(p => [
      p.fullName,
      p.email,
      p.phone,
      VEHICLE_TYPES[p.vehicleType]?.label || p.vehicleType,
      p.city,
      p.status,
      p.rating || 'N/A',
      p.totalDeliveries || 0,
      p.earnings || 0
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-partners-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle add partner
  const handleAddPartner = () => {
    if (!newPartner.fullName || !newPartner.email || !newPartner.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    const partner: DeliveryPartner = {
      ...newPartner,
      id: Math.random().toString(36).substr(2, 9),
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      state: '',
      pincode: '',
      drivingLicense: '',
      licenseExpiry: '',
      aadhaarNumber: '',
      panNumber: '',
      bankAccountNumber: '',
      bankIfsc: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      documents: [],
      submittedAt: new Date().toISOString(),
      notes: '',
      isActive: true,
      rating: 0,
      totalDeliveries: 0,
      earnings: 0,
      commissionPerDelivery: 30
    } as DeliveryPartner;
    
    setPartners([partner, ...partners]);
    setStats({ ...stats, totalPartners: stats.totalPartners + 1, pending: stats.pending + 1 });
    setIsAddModalOpen(false);
    setNewPartner({ fullName: '', email: '', phone: '', vehicleType: 'bike', vehicleNumber: '', city: '', status: 'pending' });
    setError('');
  };

  // Get performance badge
  const getPerformanceBadge = (rating: number, deliveries: number) => {
    if (rating >= 4.8 && deliveries > 500) return { label: 'Elite', icon: Crown, color: 'from-amber-500 to-yellow-600' };
    if (rating >= 4.5 && deliveries > 200) return { label: 'Pro', icon: Award, color: 'from-[#2d5a42] to-[#3d7a58]' };
    if (rating >= 4.0) return { label: 'Rising Star', icon: Star, color: 'from-blue-500 to-blue-600' };
    return { label: 'New', icon: Target, color: 'from-slate-500 to-slate-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2d5a42] to-[#1a3c28] animate-pulse shadow-lg shadow-[#2d5a42]/30 flex items-center justify-center">
            <Truck className="w-8 h-8 text-[#e8f5ed]" />
          </div>
          <p className="text-[#5c3d1f] font-semibold">Loading delivery partners...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28]">Delivery Partners</h1>
          <p className="text-[#5c3d1f] mt-1">
            Manage delivery partner applications and performance
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Partner
          </motion.button>
        </div>
      </div>

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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard title="Total" value={stats.totalPartners} color="blue" icon={Users} />
        <StatCard title="Pending" value={stats.pending} color="yellow" icon={Clock3} />
        <StatCard title="Approved" value={stats.approved} color="emerald" icon={BadgeCheck} />
        <StatCard title="Active Now" value={stats.activeNow} color="green" icon={Signal} />
        <StatCard title="Rejected" value={stats.rejected} color="red" icon={XCircle} />
        <StatCard title="Deliveries" value={stats.totalDeliveries} color="violet" icon={Package} />
        <StatCard title="Earnings" value={`₹${(stats.totalEarnings / 1000).toFixed(0)}k`} color="orange" icon={Wallet} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, city..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="on_hold">On Hold</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
          
          {/* Quick Filter Tabs */}
          <div className="hidden md:flex gap-1 p-1 bg-white border border-[#dbc4a4] rounded-xl">
            {[
              { id: 'all', label: 'All', count: stats.totalPartners },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'approved', label: 'Approved', count: stats.approved },
              { id: 'active', label: 'Active', count: stats.activeNow }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setStatusFilter(tab.id === 'all' ? 'all' : tab.id === 'active' ? 'approved' : tab.id);
                }}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed]"
                    : "text-[#5c3d1f] hover:bg-[#f0e6d3]"
                )}
              >
                {tab.label}
                <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#f0e6d3]/50 to-[#faf9f6]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Partner</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Performance</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e6d3]/50">
              {filteredPartners.map((partner) => {
                const status = STATUS_CONFIG[partner.status];
                const vehicleInfo = VEHICLE_TYPES[partner.vehicleType];
                const badge = partner.status === 'approved' ? getPerformanceBadge(partner.rating, partner.totalDeliveries) : null;
                const BadgeIcon = badge?.icon;
                
                return (
                  <motion.tr
                    key={partner.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(240, 230, 211, 0.3)' }}
                    className="cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPartner(partner);
                      setReviewNotes(partner.notes || '');
                      setCommissionRate(partner.commissionPerDelivery || 30);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold shadow-sm">
                          {partner.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#1a3c28]">{partner.fullName}</p>
                            {badge && (
                              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r", badge.color)}>
                                {badge.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#a67c52]">{partner.phone}</p>
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
                          <p className="text-xs text-[#a67c52]">{partner.vehicleNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                        <MapPin className="w-4 h-4 text-[#2d5a42]" />
                        {partner.city}, {partner.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border", status.bg, status.color, "border-opacity-20")}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {partner.status === 'approved' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="font-bold text-[#1a3c28]">{partner.rating}</span>
                            </div>
                            <span className="text-xs text-[#a67c52]">• {partner.totalDeliveries} deliveries</span>
                          </div>
                          <p className="text-xs font-bold text-[#2d5a42]">
                            ₹{partner.earnings.toLocaleString()} earned
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-[#a67c52] italic">Awaiting approval</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/delivery-partners/${partner.id}`;
                          }}
                          className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                          title="View Full Profile"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPartner(partner);
                            setReviewNotes(partner.notes || '');
                            setCommissionRate(partner.commissionPerDelivery || 30);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                          title="Quick Review"
                        >
                          <Edit3 className="w-5 h-5" />
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

      {/* Empty State */}
      {filteredPartners.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-3xl border border-[#dbc4a4]/50"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
            <Truck className="w-10 h-10 text-[#a67c52]" />
          </div>
          <h3 className="text-lg font-bold text-[#1a3c28]">No partners found</h3>
          <p className="text-[#5c3d1f] mt-2">Try adjusting your search or filters</p>
        </motion.div>
      )}

      {/* Add Partner Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Add New Partner</h2>
                    <p className="text-sm text-[#e8f5ed]/70">Create a new delivery partner account</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={newPartner.fullName}
                    onChange={(e) => setNewPartner({ ...newPartner, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Email *</label>
                    <input
                      type="email"
                      value={newPartner.email}
                      onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={newPartner.phone}
                      onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Vehicle Type</label>
                    <select
                      value={newPartner.vehicleType}
                      onChange={(e) => setNewPartner({ ...newPartner, vehicleType: e.target.value as any })}
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
                      value={newPartner.vehicleNumber}
                      onChange={(e) => setNewPartner({ ...newPartner, vehicleNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      placeholder="MH-01-AB-1234"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    value={newPartner.city}
                    onChange={(e) => setNewPartner({ ...newPartner, city: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#f0e6d3] flex gap-3">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPartner}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  Add Partner
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedPartner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">
                      {selectedPartner.fullName}
                    </h2>
                    <p className="text-sm text-[#e8f5ed]/70">Partner ID: {selectedPartner.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#faf9f6]">
                {/* Status Badge */}
                <div className="md:col-span-2 flex items-center justify-between p-4 bg-white rounded-2xl border border-[#dbc4a4]/40">
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border", STATUS_CONFIG[selectedPartner.status].bg, STATUS_CONFIG[selectedPartner.status].color)}>
                      {STATUS_CONFIG[selectedPartner.status].icon}
                      {STATUS_CONFIG[selectedPartner.status].label}
                    </span>
                    {selectedPartner.isActive && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#2d5a42]">
                        <span className="w-2 h-2 bg-[#2d5a42] rounded-full animate-pulse" />
                        Currently Online
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a67c52]">Joined {new Date(selectedPartner.submittedAt).toLocaleDateString()}</p>
                </div>

                {/* Personal Info */}
                <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#2d5a42]" />
                    Personal Information
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Full Name" value={selectedPartner.fullName} />
                    <InfoRow label="Date of Birth" value={new Date(selectedPartner.dateOfBirth).toLocaleDateString()} />
                    <InfoRow label="Gender" value={selectedPartner.gender} />
                    <InfoRow label="Aadhaar" value={selectedPartner.aadhaarNumber} />
                    <InfoRow label="PAN" value={selectedPartner.panNumber} />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#2d5a42]" />
                    Contact Details
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Email" value={selectedPartner.email} icon={<Mail className="w-4 h-4" />} />
                    <InfoRow label="Phone" value={selectedPartner.phone} icon={<Phone className="w-4 h-4" />} />
                    <InfoRow label="Address" value={`${selectedPartner.address}, ${selectedPartner.city}, ${selectedPartner.state} - ${selectedPartner.pincode}`} icon={<MapPin className="w-4 h-4" />} />
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-[#2d5a42]" />
                    Vehicle Information
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Vehicle Type" value={VEHICLE_TYPES[selectedPartner.vehicleType]?.label || selectedPartner.vehicleType} />
                    <InfoRow label="Vehicle Number" value={selectedPartner.vehicleNumber} />
                    <InfoRow label="License Number" value={selectedPartner.drivingLicense || 'Not provided'} />
                    <InfoRow label="License Expiry" value={selectedPartner.licenseExpiry ? new Date(selectedPartner.licenseExpiry).toLocaleDateString() : 'N/A'} />
                  </div>
                </div>

                {/* Bank & Emergency */}
                <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#2d5a42]" />
                    Bank & Emergency
                  </h3>
                  <div className="space-y-2">
                    <InfoRow label="Account Number" value={selectedPartner.bankAccountNumber} />
                    <InfoRow label="IFSC Code" value={selectedPartner.bankIfsc} />
                    <InfoRow label="Emergency Contact" value={`${selectedPartner.emergencyContactName} (${selectedPartner.emergencyContactPhone})`} />
                  </div>
                </div>

                {/* Performance Stats */}
                {selectedPartner.status === 'approved' && (
                  <div className="md:col-span-2 p-6 bg-gradient-to-r from-[#e8f5ed] to-[#f0e6d3] rounded-2xl border border-[#dbc4a4]/40">
                    <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#2d5a42]" />
                      Performance Statistics
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          <p className="text-2xl font-black text-[#1a3c28]">{selectedPartner.rating}</p>
                        </div>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Rating</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-2xl font-black text-[#1a3c28]">{selectedPartner.totalDeliveries}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Deliveries</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <p className="text-2xl font-black text-[#2d5a42]">₹{selectedPartner.earnings.toLocaleString()}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Earnings</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div className="md:col-span-2">
                  <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2d5a42]" />
                    Documents
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.documents?.map((doc, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbc4a4] rounded-xl text-sm text-[#2d5a42] font-semibold hover:bg-[#f0e6d3] hover:shadow-sm transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        {doc}
                      </a>
                    ))}
                    {(!selectedPartner.documents || selectedPartner.documents.length === 0) && (
                      <p className="text-sm text-[#a67c52] italic">No documents uploaded</p>
                    )}
                  </div>
                </div>

                {/* Review Section */}
                <div className="md:col-span-2 space-y-4 p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#2d5a42]" />
                    Review Application
                  </h3>
                  
                  {selectedPartner.status === 'rejected' && selectedPartner.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                      <strong className="font-bold">Rejection Reason:</strong> {selectedPartner.rejectionReason}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                      Review Notes
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      placeholder="Add notes about this partner..."
                    />
                  </div>

                  {selectedPartner.status !== 'approved' && (
                    <div>
                      <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                        Commission Per Delivery (₹)
                      </label>
                      <input
                        type="number"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {selectedPartner.status !== 'approved' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedPartner.id, 'approved')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Approve Partner
                      </motion.button>
                    )}
                    {selectedPartner.status !== 'rejected' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          const reason = prompt('Enter rejection reason:');
                          if (reason) {
                            handleStatusUpdate(selectedPartner.id, 'rejected', reason);
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusUpdate(selectedPartner.id, 'under_review')}
                      className="px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                    >
                      Mark Under Review
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, color, icon: Icon }: { title: string; value: string | number; color: string; icon?: React.ElementType }) {
  const gradients: Record<string, string> = {
    blue: 'from-[#2d5a42] to-[#3d7a58]',
    yellow: 'from-[#8b6914] to-[#c49a6c]',
    emerald: 'from-emerald-600 to-emerald-500',
    green: 'from-green-600 to-green-500',
    red: 'from-red-500 to-red-400',
    violet: 'from-violet-600 to-violet-500',
    orange: 'from-orange-500 to-orange-400'
  };

  const textColors: Record<string, string> = {
    blue: 'text-[#2d5a42]',
    yellow: 'text-[#8b6914]',
    emerald: 'text-emerald-600',
    green: 'text-green-600',
    red: 'text-red-500',
    violet: 'text-violet-600',
    orange: 'text-orange-500'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
    >
      <div className={cn("absolute top-0 left-0 w-1 h-full bg-gradient-to-b", gradients[color])} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">{title}</p>
          <p className={cn("text-2xl font-black mt-1", textColors[color])}>{value}</p>
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-xl bg-gradient-to-br", gradients[color], "bg-opacity-10")}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#faf9f6] rounded-xl">
      {icon && <span className="text-[#2d5a42] mt-0.5">{icon}</span>}
      <div>
        <span className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">{label}</span>
        <p className="text-sm font-semibold text-[#1a3c28] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

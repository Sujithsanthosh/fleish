"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Star,
  Package,
  Clock,
  DollarSign,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Bike,
  User,
  CreditCard,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  MoreVertical,
  Edit2,
  Save,
  X,
  Battery,
  Signal,
  LocateFixed,
  Route,
  Timer,
  Zap,
  Award,
  Target,
  BarChart3,
  Download,
  Printer,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Pause,
  Play,
  Ban,
  Gauge,
  Thermometer,
  Compass,
  Radio,
  ScanLine,
  Sparkles,
  Crown,
  Trophy,
  Flame,
  History,
  FileCheck,
  IdCard,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
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
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold' | 'suspended';
  isActive: boolean;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  commissionPerDelivery: number;
  joinedAt: string;
  lastActive: string;
  avatar?: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  networkStatus: 'excellent' | 'good' | 'poor';
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: number;
  total: number;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  estimatedTime: string;
  distance: number;
  createdAt: string;
  deliveryTime?: string;
  rating?: number;
  feedback?: string;
}

interface Earning {
  id: string;
  date: string;
  deliveries: number;
  amount: number;
  tips: number;
  bonus: number;
  penalty: number;
  total: number;
}

// Mock Data
const MOCK_PARTNER: DeliveryPartner = {
  id: '1',
  fullName: 'Rahul Sharma',
  email: 'rahul@delivery.com',
  phone: '+91 98765 43210',
  dateOfBirth: '1995-06-15',
  gender: 'Male',
  address: '123, Main Road, Andheri West',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400058',
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
  status: 'approved',
  isActive: true,
  rating: 4.8,
  totalDeliveries: 1247,
  earnings: 84500,
  commissionPerDelivery: 40,
  joinedAt: '2023-08-15',
  lastActive: '2 mins ago',
  latitude: 19.0760,
  longitude: 72.8777,
  batteryLevel: 78,
  networkStatus: 'excellent',
};

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7829',
    customerName: 'Anita Desai',
    customerPhone: '+91 98765 12345',
    customerAddress: '456, Sea View Apartments, Bandra West, Mumbai - 400050',
    items: 4,
    total: 1240,
    status: 'in_transit',
    estimatedTime: '8 mins',
    distance: 2.3,
    createdAt: '2024-04-12 14:30',
  },
  {
    id: 'ORD-7830',
    customerName: 'Vikram Patel',
    customerPhone: '+91 98765 67890',
    customerAddress: '789, Palm Grove, Juhu, Mumbai - 400049',
    items: 2,
    total: 680,
    status: 'picked_up',
    estimatedTime: '15 mins',
    distance: 4.1,
    createdAt: '2024-04-12 14:45',
  },
  {
    id: 'ORD-7825',
    customerName: 'Sneha Gupta',
    customerPhone: '+91 98765 11111',
    customerAddress: '321, Hill View, Andheri East, Mumbai - 400069',
    items: 3,
    total: 920,
    status: 'delivered',
    estimatedTime: 'Delivered',
    distance: 3.5,
    createdAt: '2024-04-12 13:15',
    deliveryTime: '13:42',
    rating: 5,
    feedback: 'Great service! Very polite.',
  },
  {
    id: 'ORD-7823',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 22222',
    customerAddress: '654, Garden Heights, Powai, Mumbai - 400076',
    items: 5,
    total: 1580,
    status: 'delivered',
    estimatedTime: 'Delivered',
    distance: 5.2,
    createdAt: '2024-04-12 12:30',
    deliveryTime: '13:05',
    rating: 4,
  },
  {
    id: 'ORD-7819',
    customerName: 'Meera Shah',
    customerPhone: '+91 98765 33333',
    customerAddress: '987, Lake View, Goregaon West, Mumbai - 400062',
    items: 1,
    total: 340,
    status: 'cancelled',
    estimatedTime: 'Cancelled',
    distance: 6.8,
    createdAt: '2024-04-12 11:45',
  },
];

const MOCK_EARNINGS: Earning[] = [
  { id: 'e1', date: '2024-04-12', deliveries: 12, amount: 480, tips: 120, bonus: 50, penalty: 0, total: 650 },
  { id: 'e2', date: '2024-04-11', deliveries: 18, amount: 720, tips: 200, bonus: 100, penalty: 0, total: 1020 },
  { id: 'e3', date: '2024-04-10', deliveries: 15, amount: 600, tips: 80, bonus: 0, penalty: 20, total: 660 },
  { id: 'e4', date: '2024-04-09', deliveries: 20, amount: 800, tips: 150, bonus: 200, penalty: 0, total: 1150 },
  { id: 'e5', date: '2024-04-08', deliveries: 14, amount: 560, tips: 100, bonus: 0, penalty: 0, total: 660 },
];

const VEHICLE_TYPES: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  bike: { label: 'Motorcycle', icon: <Bike className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
  scooter: { label: 'Scooter', icon: <Zap className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
  bicycle: { label: 'Bicycle', icon: <Activity className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
  car: { label: 'Car', icon: <Truck className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
};

export default function DeliveryPartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [partner, setPartner] = useState<DeliveryPartner | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'earnings' | 'location' | 'performance'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DeliveryPartner>>({});

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPartner(MOCK_PARTNER);
      setFormData(MOCK_PARTNER);
      setLoading(false);
    }, 800);
  }, [partnerId]);

  const handleSave = () => {
    if (partner) {
      setPartner({ ...partner, ...formData });
      setIsEditing(false);
    }
  };

  const openInMaps = () => {
    if (partner) {
      const url = `https://www.google.com/maps?q=${partner.latitude},${partner.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getPerformanceBadge = (rating: number) => {
    if (rating >= 4.8) return { label: 'Elite', color: 'from-amber-500 to-yellow-600', icon: Crown };
    if (rating >= 4.5) return { label: 'Pro', color: 'from-[#2d5a42] to-[#3d7a58]', icon: Trophy };
    if (rating >= 4.0) return { label: 'Advanced', color: 'from-blue-500 to-blue-600', icon: Award };
    return { label: 'Standard', color: 'from-slate-500 to-slate-600', icon: Star };
  };

  const getSpeedStatus = (speed: number) => {
    if (speed > 40) return { label: 'Fast', color: 'text-[#2d5a42]', bg: 'bg-[#e8f5ed]' };
    if (speed > 20) return { label: 'Moderate', color: 'text-[#8b6914]', bg: 'bg-[#f0e6d3]' };
    return { label: 'Slow', color: 'text-[#9b2335]', bg: 'bg-[#fff5f5]' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'suspended': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700';
      case 'in_transit': return 'bg-blue-100 text-blue-700';
      case 'picked_up': return 'bg-amber-100 text-amber-700';
      case 'assigned': return 'bg-slate-100 text-slate-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_transit': return <Navigation className="w-4 h-4" />;
      case 'picked_up': return <Package className="w-4 h-4" />;
      case 'assigned': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <Ban className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#1a3c28] animate-pulse shadow-lg shadow-[#2d5a42]/30" />
          <p className="text-[#5c3d1f] font-semibold">Loading partner profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <AlertCircle className="w-16 h-16 text-[#9b2335] mx-auto mb-4" />
          <p className="text-[#1a3c28] font-bold text-lg">Partner not found</p>
          <button 
            onClick={() => router.push('/delivery-partners')}
            className="mt-4 px-6 py-2 bg-[#2d5a42] text-[#e8f5ed] rounded-xl font-semibold"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/delivery-partners')}
          className="p-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl hover:bg-[#e8f5ed] transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-[#1a3c28]">Delivery Partner Profile</h1>
          <p className="text-sm text-[#5c3d1f]">ID: {partner.id} • Joined {partner.joinedAt}</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold flex items-center gap-2"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </motion.button>
        </div>
      </div>

      {/* Partner Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#faf9f6] to-[#f0e6d3]/30 rounded-3xl border border-[#dbc4a4]/50 p-6 shadow-xl shadow-[#2d5a42]/5"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Avatar & Basic Info */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="flex flex-col items-center text-center p-6 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/30">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-[#e8f5ed] text-3xl font-bold shadow-lg mb-4">
                {partner.fullName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-[#1a3c28]">{partner.fullName}</h2>
              <p className="text-sm text-[#5c3d1f] mb-3">{VEHICLE_TYPES[partner.vehicleType]?.label}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className={cn("px-3 py-1 rounded-full text-sm font-bold border", getStatusColor(partner.status))}>
                  {partner.status.replace('_', ' ').toUpperCase()}
                </div>
                {partner.isActive && (
                  <span className="px-2 py-1 bg-[#e8f5ed] text-[#2d5a42] text-xs font-bold rounded-full flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#2d5a42] rounded-full animate-pulse" />
                    Online
                  </span>
                )}
              </div>
              
              {/* Performance Badge */}
              {(() => {
                const badge = getPerformanceBadge(partner.rating);
                const BadgeIcon = badge.icon;
                return (
                  <div className={cn("mb-4 px-4 py-2 rounded-full flex items-center gap-2 bg-gradient-to-r", badge.color, "text-white shadow-lg")}>
                    <BadgeIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{badge.label} Partner</span>
                  </div>
                );
              })()}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <motion.div whileHover={{ scale: 1.05 }} className="p-3 bg-[#faf9f6] rounded-xl shadow-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-[#8b6914] fill-[#8b6914]" />
                    <p className="text-lg font-black text-[#1a3c28]">{partner.rating}</p>
                  </div>
                  <p className="text-xs text-[#a67c52]">Rating</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="p-3 bg-[#faf9f6] rounded-xl shadow-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Package className="w-3 h-3 text-[#2d5a42]" />
                    <p className="text-lg font-black text-[#1a3c28]">{partner.totalDeliveries}</p>
                  </div>
                  <p className="text-xs text-[#a67c52]">Deliveries</p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="p-3 bg-[#faf9f6] rounded-xl shadow-sm">
                  <div className="flex items-center gap-1 mb-1">
                    <Wallet className="w-3 h-3 text-[#8b6914]" />
                    <p className="text-lg font-black text-[#1a3c28]">₹{(partner.earnings / 1000).toFixed(1)}k</p>
                  </div>
                  <p className="text-xs text-[#a67c52]">Earned</p>
                </motion.div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-4 space-y-3">
              <a href={`tel:${partner.phone}`} className="flex items-center gap-3 p-3 bg-[#e8f5ed]/50 rounded-xl hover:bg-[#e8f5ed] transition-all group">
                <div className="p-2 bg-[#2d5a42] text-[#e8f5ed] rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a3c28]">{partner.phone}</p>
                  <p className="text-xs text-[#a67c52]">Tap to call</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                <div className="p-2 bg-[#8b6914] text-[#faf6f0] rounded-lg">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1a3c28]">{partner.email}</p>
                  <p className="text-xs text-[#a67c52]">Email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details & Live Status */}
          <div className="flex-1 space-y-6">
            {/* Live Location Card */}
            <div className="p-5 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-2xl text-[#e8f5ed] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LocateFixed className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-bold uppercase tracking-wider">Live Location</span>
                    <span className="px-2 py-0.5 bg-[#e8f5ed]/20 text-[#e8f5ed] text-xs rounded-full">
                      Real-time
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{partner.latitude.toFixed(4)}, {partner.longitude.toFixed(4)}</p>
                  <p className="text-sm text-[#e8f5ed]/70 mt-1">{partner.city}, {partner.state}</p>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm mb-1">
                      <Battery className="w-4 h-4" />
                      <span>{partner.batteryLevel}%</span>
                    </div>
                    <div className="w-16 h-2 bg-[#e8f5ed]/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#e8f5ed] rounded-full"
                        style={{ width: `${partner.batteryLevel}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm mb-1">
                      <Signal className="w-4 h-4" />
                      <span className="capitalize">{partner.networkStatus}</span>
                    </div>
                    <div className="flex gap-0.5 justify-center">
                      {[1,2,3,4].map(i => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1.5 rounded-full",
                            i <= (partner.networkStatus === 'excellent' ? 4 : partner.networkStatus === 'good' ? 3 : 2) 
                              ? "bg-[#e8f5ed]" 
                              : "bg-[#e8f5ed]/30"
                          )}
                          style={{ height: `${i * 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative mt-4 flex gap-2">
                <button 
                  onClick={openInMaps}
                  className="px-4 py-2 bg-[#e8f5ed]/10 hover:bg-[#e8f5ed]/20 text-[#e8f5ed] rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border border-[#e8f5ed]/20"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </button>
                <button className="px-4 py-2 bg-[#e8f5ed]/10 hover:bg-[#e8f5ed]/20 text-[#e8f5ed] rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border border-[#e8f5ed]/20">
                  <Route className="w-4 h-4" />
                  View Route History
                </button>
              </div>
            </div>

            {/* Current Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2d5a42]" />
                  Current Orders
                </h3>
                <button className="text-sm text-[#2d5a42] font-semibold hover:underline">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_ORDERS.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').map(order => (
                  <motion.div 
                    key={order.id}
                    whileHover={{ y: -2 }}
                    onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                    className="p-4 bg-[#faf9f6] rounded-2xl border border-[#dbc4a4]/40 cursor-pointer hover:shadow-lg hover:border-[#2d5a42]/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-[#1a3c28]">#{order.id}</p>
                        <p className="text-sm text-[#5c3d1f]">{order.customerName}</p>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1", getOrderStatusColor(order.status))}>
                        {getOrderStatusIcon(order.status)}
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[#a67c52]">
                        <Package className="w-4 h-4" />
                        {order.items} items
                      </div>
                      <div className="flex items-center gap-1 text-[#a67c52]">
                        <DollarSign className="w-4 h-4" />
                        ₹{order.total}
                      </div>
                      <div className="flex items-center gap-1 text-[#2d5a42] font-semibold">
                        <Timer className="w-4 h-4" />
                        {order.estimatedTime}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {MOCK_ORDERS.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length === 0 && (
                  <div className="col-span-2 p-8 text-center bg-[#f0e6d3]/30 rounded-2xl border border-dashed border-[#c49a6c]/50">
                    <Clock className="w-12 h-12 text-[#a67c52]/50 mx-auto mb-3" />
                    <p className="text-[#5c3d1f] font-semibold">No active orders</p>
                    <p className="text-sm text-[#a67c52]">Partner is waiting for assignments</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#f0e6d3]/50 rounded-2xl overflow-x-auto">
        {(['overview', 'orders', 'earnings', 'performance', 'location'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              activeTab === tab 
                ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-md"
                : "text-[#5c3d1f] hover:bg-[#e8f5ed]/50"
            )}
          >
            {tab === 'overview' && <User className="w-4 h-4 inline mr-1.5" />}
            {tab === 'orders' && <Package className="w-4 h-4 inline mr-1.5" />}
            {tab === 'earnings' && <DollarSign className="w-4 h-4 inline mr-1.5" />}
            {tab === 'performance' && <BarChart3 className="w-4 h-4 inline mr-1.5" />}
            {tab === 'location' && <MapPin className="w-4 h-4 inline mr-1.5" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Personal Information */}
            <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
              <h3 className="text-lg font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#2d5a42]" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <InfoRow label="Full Name" value={partner.fullName} />
                <InfoRow label="Date of Birth" value={partner.dateOfBirth} />
                <InfoRow label="Gender" value={partner.gender} />
                <InfoRow label="Aadhaar Number" value={partner.aadhaarNumber} mask />
                <InfoRow label="PAN Number" value={partner.panNumber} mask />
              </div>
            </div>

            {/* Address */}
            <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
              <h3 className="text-lg font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2d5a42]" />
                Address Details
              </h3>
              <div className="space-y-4">
                <InfoRow label="Address" value={partner.address} />
                <InfoRow label="City" value={partner.city} />
                <InfoRow label="State" value={partner.state} />
                <InfoRow label="Pincode" value={partner.pincode} />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
              <h3 className="text-lg font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2d5a42]" />
                Vehicle Information
              </h3>
              <div className="space-y-4">
                <InfoRow label="Vehicle Type" value={VEHICLE_TYPES[partner.vehicleType]?.label} />
                <InfoRow label="Vehicle Number" value={partner.vehicleNumber} />
                <InfoRow label="License Number" value={partner.drivingLicense} />
                <InfoRow label="License Expiry" value={partner.licenseExpiry} />
              </div>
            </div>

            {/* Bank & Emergency */}
            <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
              <h3 className="text-lg font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2d5a42]" />
                Bank & Emergency Contact
              </h3>
              <div className="space-y-4">
                <InfoRow label="Account Number" value={partner.bankAccountNumber} mask />
                <InfoRow label="IFSC Code" value={partner.bankIfsc} />
                <InfoRow label="Emergency Contact" value={partner.emergencyContactName} />
                <InfoRow label="Emergency Phone" value={partner.emergencyContactPhone} />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Order Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/30">
                <p className="text-xs text-[#2d5a42] uppercase font-bold">Delivered</p>
                <p className="text-2xl font-black text-[#1a3c28]">
                  {MOCK_ORDERS.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="p-4 bg-[#f0e6d3]/50 rounded-2xl border border-[#c49a6c]/30">
                <p className="text-xs text-[#8b6914] uppercase font-bold">In Transit</p>
                <p className="text-2xl font-black text-[#1a3c28]">
                  {MOCK_ORDERS.filter(o => o.status === 'in_transit').length}
                </p>
              </div>
              <div className="p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#c49a6c]/20">
                <p className="text-xs text-[#5c3d1f] uppercase font-bold">Pending</p>
                <p className="text-2xl font-black text-[#1a3c28]">
                  {MOCK_ORDERS.filter(o => o.status === 'picked_up' || o.status === 'assigned').length}
                </p>
              </div>
              <div className="p-4 bg-[#fff5f5]/50 rounded-2xl border border-[#fecaca]/30">
                <p className="text-xs text-[#9b2335] uppercase font-bold">Cancelled</p>
                <p className="text-2xl font-black text-[#9b2335]">
                  {MOCK_ORDERS.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40 overflow-hidden">
              <div className="p-6 border-b border-[#dbc4a4]/40 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1a3c28]">Order History</h3>
                <div className="flex gap-2">
                  <button className="p-2 text-[#5c3d1f] hover:bg-[#f0e6d3] rounded-xl">
                    <Printer className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-[#5c3d1f] hover:bg-[#f0e6d3] rounded-xl">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-[#dbc4a4]/30">
                {MOCK_ORDERS.map(order => (
                  <div 
                    key={order.id}
                    onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                    className="p-6 flex items-center justify-between hover:bg-[#f0e6d3]/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", getOrderStatusColor(order.status))}>
                        {getOrderStatusIcon(order.status)}
                      </div>
                      <div>
                        <p className="font-bold text-[#1a3c28]">#{order.id}</p>
                        <p className="text-sm text-[#5c3d1f]">{order.customerName}</p>
                        <p className="text-xs text-[#a67c52]">{order.customerAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#2d5a42]">₹{order.total}</p>
                      <p className="text-sm text-[#a67c52]">{order.items} items</p>
                      <p className="text-xs text-[#5c3d1f]">{order.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'earnings' && (
          <motion.div
            key="earnings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-gradient-to-br from-[#2d5a42]/10 to-[#3d7a58]/5 rounded-2xl border border-[#2d5a42]/20">
                <p className="text-xs text-[#5c3d1f] uppercase font-bold">Total Earnings</p>
                <p className="text-3xl font-black text-[#1a3c28]">₹{partner.earnings.toLocaleString()}</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-[#e8f5ed] to-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/30">
                <p className="text-xs text-[#2d5a42] uppercase font-bold">This Week</p>
                <p className="text-3xl font-black text-[#1a3c28]">₹4,160</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-[#f0e6d3] to-[#f0e6d3]/50 rounded-2xl border border-[#c49a6c]/30">
                <p className="text-xs text-[#8b6914] uppercase font-bold">Tips Received</p>
                <p className="text-3xl font-black text-[#1a3c28]">₹650</p>
              </div>
              <div className="p-5 bg-gradient-to-br from-[#fff5f5] to-[#fff5f5]/50 rounded-2xl border border-[#fecaca]/30">
                <p className="text-xs text-[#9b2335] uppercase font-bold">Penalties</p>
                <p className="text-3xl font-black text-[#9b2335]">₹20</p>
              </div>
            </div>

            {/* Daily Earnings */}
            <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40 overflow-hidden">
              <div className="p-6 border-b border-[#dbc4a4]/40">
                <h3 className="text-lg font-bold text-[#1a3c28]">Daily Earnings</h3>
              </div>
              <div className="divide-y divide-[#dbc4a4]/30">
                {MOCK_EARNINGS.map(earning => (
                  <div key={earning.id} className="p-6 flex items-center justify-between hover:bg-[#f0e6d3]/20 transition-colors">
                    <div>
                      <p className="font-bold text-[#1a3c28]">{earning.date}</p>
                      <p className="text-sm text-[#5c3d1f]">{earning.deliveries} deliveries</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-[#a67c52]">Base</p>
                        <p className="font-semibold text-[#1a3c28]">₹{earning.amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#a67c52]">Tips</p>
                        <p className="font-semibold text-[#2d5a42]">+₹{earning.tips}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#a67c52]">Bonus</p>
                        <p className="font-semibold text-[#2d5a42]">+₹{earning.bonus}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#a67c52]">Penalty</p>
                        <p className="font-semibold text-[#9b2335]">-₹{earning.penalty}</p>
                      </div>
                      <div className="text-right px-4 py-2 bg-[#e8f5ed] rounded-xl">
                        <p className="text-xs text-[#2d5a42] font-bold">Total</p>
                        <p className="font-bold text-[#1a3c28]">₹{earning.total}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'performance' && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#e8f5ed] rounded-xl">
                    <Star className="w-6 h-6 text-[#2d5a42]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5c3d1f]">Customer Rating</p>
                    <p className="text-2xl font-black text-[#1a3c28]">{partner.rating}/5.0</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-xs text-[#a67c52] w-8">{stars}★</span>
                      <div className="flex-1 h-2 bg-[#f0e6d3] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#2d5a42] rounded-full"
                          style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#a67c52] w-8 text-right">
                        {stars === 5 ? 847 : stars === 4 ? 280 : stars === 3 ? 98 : stars === 2 ? 15 : 7}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#f0e6d3] rounded-xl">
                    <Target className="w-6 h-6 text-[#8b6914]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5c3d1f]">On-Time Delivery</p>
                    <p className="text-2xl font-black text-[#1a3c28]">94.5%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c3d1f]">On-time</span>
                    <span className="font-bold text-[#2d5a42]">1,178</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c3d1f]">Late</span>
                    <span className="font-bold text-[#9b2335]">69</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-[#e8f5ed] rounded-xl">
                    <TrendingUp className="w-6 h-6 text-[#2d5a42]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#5c3d1f]">Acceptance Rate</p>
                    <p className="text-2xl font-black text-[#1a3c28]">87.2%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c3d1f]">Accepted</span>
                    <span className="font-bold text-[#2d5a42]">1,430</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c3d1f]">Rejected</span>
                    <span className="font-bold text-[#9b2335]">210</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40 p-6">
              <h3 className="text-lg font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2d5a42]" />
                Recent Customer Feedback
              </h3>
              <div className="space-y-4">
                {MOCK_ORDERS.filter(o => o.feedback).map(order => (
                  <div key={order.id} className="p-4 bg-[#f0e6d3]/30 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-4 h-4",
                                i < (order.rating || 0) ? "text-[#8b6914] fill-[#8b6914]" : "text-[#c49a6c]"
                              )} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-[#1a3c28]">{order.customerName}</span>
                      </div>
                      <span className="text-xs text-[#a67c52]">{order.deliveryTime}</span>
                    </div>
                    <p className="text-[#5c3d1f]">{order.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'location' && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Tracking Stats */}
              <div className="lg:col-span-1 space-y-4">
                <div className="p-6 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-2xl text-[#e8f5ed]">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <LocateFixed className="w-5 h-5" />
                    Live Tracking
                    <span className="ml-auto flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[#e8f5ed] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e8f5ed]"></span>
                    </span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-[#e8f5ed]/70">Current Location</p>
                      <p className="font-mono text-sm">{partner.latitude.toFixed(6)}, {partner.longitude.toFixed(6)}</p>
                      <p className="text-xs text-[#e8f5ed]/50 mt-1">{partner.city}, {partner.state}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#e8f5ed]/10 rounded-xl">
                        <p className="text-xs text-[#e8f5ed]/70">Speed</p>
                        <p className="font-bold text-lg">32 <span className="text-xs font-normal">km/h</span></p>
                      </div>
                      <div className="p-3 bg-[#e8f5ed]/10 rounded-xl">
                        <p className="text-xs text-[#e8f5ed]/70">Heading</p>
                        <p className="font-bold text-lg flex items-center gap-1">
                          <Compass className="w-4 h-4" />
                          NE
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-[#e8f5ed]/70">Last Updated</p>
                      <p className="font-semibold">{partner.lastActive}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#e8f5ed]/10 rounded-xl">
                        <p className="text-xs text-[#e8f5ed]/70 flex items-center gap-1">
                          <Battery className="w-3 h-3" />
                          Battery
                        </p>
                        <p className="font-bold">{partner.batteryLevel}%</p>
                        <div className="mt-1 h-1.5 bg-[#e8f5ed]/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#e8f5ed] rounded-full transition-all"
                            style={{ width: `${partner.batteryLevel}%` }}
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-[#e8f5ed]/10 rounded-xl">
                        <p className="text-xs text-[#e8f5ed]/70 flex items-center gap-1">
                          <Signal className="w-3 h-3" />
                          Network
                        </p>
                        <p className="font-bold capitalize">{partner.networkStatus}</p>
                        <div className="mt-1 flex gap-0.5">
                          {[1, 2, 3, 4].map((bar) => (
                            <div 
                              key={bar}
                              className={cn(
                                "w-1.5 h-3 rounded-sm",
                                (partner.networkStatus === 'excellent' && bar <= 4) ||
                                (partner.networkStatus === 'good' && bar <= 3) ||
                                (partner.networkStatus === 'poor' && bar <= 2)
                                  ? "bg-[#e8f5ed]"
                                  : "bg-[#e8f5ed]/20"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="p-6 bg-[#faf9f6]/90 rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#2d5a42]" />
                    Activity Feed
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Location updated', time: '2 min ago', icon: LocateFixed, color: 'text-[#2d5a42]', bg: 'bg-[#e8f5ed]' },
                      { action: 'Order delivered', time: '15 min ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { action: 'Picked up order', time: '32 min ago', icon: Package, color: 'text-[#8b6914]', bg: 'bg-[#f0e6d3]' },
                      { action: 'Started shift', time: '2 hrs ago', icon: Play, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 hover:bg-[#f0e6d3]/30 rounded-lg transition-all">
                        <div className={cn("p-2 rounded-lg", item.bg)}>
                          <item.icon className={cn("w-3 h-3", item.color)} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a3c28]">{item.action}</p>
                          <p className="text-xs text-[#a67c52]">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-[#faf9f6]/90 rounded-2xl border border-[#dbc4a4]/40">
                  <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-[#2d5a42]" />
                    Route History
                  </h3>
                  <div className="space-y-3">
                    {MOCK_ORDERS.slice(0, 3).map((order, idx) => (
                      <div key={order.id} className="flex items-center gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-[#2d5a42]/10 flex items-center justify-center text-xs font-bold text-[#2d5a42]">
                          {idx + 1}
                        </div>
                        <Route className="w-4 h-4 text-[#2d5a42]" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#1a3c28]">{order.distance} km</p>
                          <p className="text-xs text-[#a67c52]">Order #{order.id}</p>
                        </div>
                        <span className={cn("text-xs px-2 py-1 rounded-full", getOrderStatusColor(order.status))}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="lg:col-span-2 p-8 bg-[#f0e6d3]/20 rounded-2xl border border-[#dbc4a4]/40 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 rounded-full bg-[#2d5a42]/10 flex items-center justify-center mb-4">
                  <MapPin className="w-12 h-12 text-[#2d5a42]" />
                </div>
                <h3 className="text-xl font-bold text-[#1a3c28] mb-2">Live Location Map</h3>
                <p className="text-[#5c3d1f] text-center max-w-md mb-4">
                  Real-time tracking integration with Google Maps would display here showing the partner's current location and delivery route.
                </p>
                <button 
                  onClick={openInMaps}
                  className="px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3c28]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#e8f5ed]">Order #{selectedOrder.id}</h3>
                  <p className="text-sm text-[#e8f5ed]/70">{selectedOrder.createdAt}</p>
                </div>
                <button 
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 bg-[#e8f5ed]/10 hover:bg-[#9b2335] text-[#e8f5ed] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className={cn("p-4 rounded-xl flex items-center gap-3", getOrderStatusColor(selectedOrder.status))}>
                  {getOrderStatusIcon(selectedOrder.status)}
                  <span className="font-bold capitalize">{selectedOrder.status.replace('_', ' ')}</span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-bold text-[#1a3c28] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2d5a42]" />
                    Customer Details
                  </h4>
                  <p className="text-[#1a3c28] font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-sm text-[#5c3d1f]">{selectedOrder.customerPhone}</p>
                  <p className="text-sm text-[#5c3d1f]">{selectedOrder.customerAddress}</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <div>
                    <p className="text-sm text-[#a67c52]">Total Amount</p>
                    <p className="text-2xl font-bold text-[#1a3c28]">₹{selectedOrder.total}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#a67c52]">Items</p>
                    <p className="text-xl font-bold text-[#1a3c28]">{selectedOrder.items}</p>
                  </div>
                </div>

                {selectedOrder.rating && (
                  <div className="p-4 bg-[#e8f5ed]/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#1a3c28]">Customer Rating:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-4 h-4",
                              i < selectedOrder.rating! ? "text-[#8b6914] fill-[#8b6914]" : "text-[#c49a6c]"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                    {selectedOrder.feedback && (
                      <p className="text-sm text-[#5c3d1f] italic">"{selectedOrder.feedback}"</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Component for Info Rows
function InfoRow({ label, value, mask }: { label: string; value: string; mask?: boolean }) {
  const displayValue = mask && value ? value.slice(0, 4) + '****' + value.slice(-4) : value;
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#dbc4a4]/30 last:border-0">
      <span className="text-sm text-[#5c3d1f]">{label}</span>
      <span className="font-semibold text-[#1a3c28]">{displayValue || 'N/A'}</span>
    </div>
  );
}


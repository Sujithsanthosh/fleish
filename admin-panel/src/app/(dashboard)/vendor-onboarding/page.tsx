"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Store,
  Plus,
  Edit3,
  Trash2,
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
  RefreshCcw,
  Wifi,
  WifiOff,
  Eye,
  CheckSquare,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Building2,
  TrendingUp,
  Users,
  Briefcase,
  CreditCard,
  Upload,
  ExternalLink,
  MessageSquare,
  History,
  ChevronDown,
  Shield,
  Award,
  Package,
  Globe,
  HardHat,
  Send,
  RotateCcw,
  AlertTriangle,
  MapPinned,
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface VendorDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}

interface VendorActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

interface VendorApplication {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessType: string;
  gstNumber: string;
  fssaiLicense: string;
  panNumber: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  accountHolderName: string;
  documents: VendorDocument[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes: string;
  commissionRate: number;
  deliveryRadius: number;
  isActive: boolean;
  rating: number;
  totalOrders: number;
  monthlyRevenue: number;
  categories: string[];
  activityLog: VendorActivity[];
}

interface VendorStats {
  totalApplications: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
  onHold: number;
  thisMonth: number;
  totalVendors: number;
  activeVendors: number;
  avgCommission: number;
  totalRevenue: number;
}

const FALLBACK_APPLICATIONS: VendorApplication[] = [
  {
    id: 'VEN-001',
    businessName: 'Fresh Meat Shop',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@freshmeat.com',
    phone: '+91 98765 43210',
    address: '123, Main Street, Near Railway Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    businessType: 'Retail Shop',
    gstNumber: '27AABCU9603R1ZX',
    fssaiLicense: '12345678901234',
    panNumber: 'ABCDE1234F',
    bankAccountNumber: '123456789012',
    bankIfsc: 'HDFC0001234',
    bankName: 'HDFC Bank',
    accountHolderName: 'Rajesh Kumar',
    documents: [
      { id: 'doc-1', name: 'GST Certificate', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 86400000).toISOString(), verified: true },
      { id: 'doc-2', name: 'FSSAI License', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 86400000).toISOString(), verified: true },
      { id: 'doc-3', name: 'Shop License', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 86400000).toISOString(), verified: false }
    ],
    status: 'under_review',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Documents look good, need to verify shop license',
    commissionRate: 15,
    deliveryRadius: 5,
    isActive: false,
    rating: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    categories: ['Chicken', 'Mutton', 'Fish'],
    activityLog: [
      { id: 'act-1', action: 'Application Submitted', timestamp: new Date(Date.now() - 86400000).toISOString(), user: 'System' },
      { id: 'act-2', action: 'Documents Uploaded', timestamp: new Date(Date.now() - 86000000).toISOString(), user: 'Rajesh Kumar' }
    ]
  },
  {
    id: 'VEN-002',
    businessName: 'Premium Meats & Seafood',
    ownerName: 'Priya Sharma',
    email: 'priya@premiummeats.com',
    phone: '+91 98765 43211',
    address: '456, Market Road, Sector 18',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    businessType: 'Wholesale & Retail',
    gstNumber: '07AABCU9603R1ZX',
    fssaiLicense: '12345678901235',
    panNumber: 'ABCDE1235G',
    bankAccountNumber: '098765432109',
    bankIfsc: 'ICIC0001234',
    bankName: 'ICICI Bank',
    accountHolderName: 'Priya Sharma',
    documents: [
      { id: 'doc-4', name: 'GST Certificate', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 172800000).toISOString(), verified: true },
      { id: 'doc-5', name: 'FSSAI License', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 172800000).toISOString(), verified: true }
    ],
    status: 'approved',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedBy: 'Admin User',
    notes: 'Excellent profile, all documents verified',
    commissionRate: 12,
    deliveryRadius: 10,
    isActive: true,
    rating: 4.8,
    totalOrders: 1250,
    monthlyRevenue: 450000,
    categories: ['Chicken', 'Mutton', 'Fish', 'Seafood', 'Marinated'],
    activityLog: [
      { id: 'act-3', action: 'Application Submitted', timestamp: new Date(Date.now() - 172800000).toISOString(), user: 'System' },
      { id: 'act-4', action: 'Approved', timestamp: new Date(Date.now() - 86400000).toISOString(), user: 'Admin User', details: 'Commission: 12%' }
    ]
  },
  {
    id: 'VEN-003',
    businessName: 'Meat Masters',
    ownerName: 'Amit Patel',
    email: 'amit@meatmasters.com',
    phone: '+91 98765 43212',
    address: '789, Business Hub, Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    businessType: 'Retail Shop',
    gstNumber: '29AABCU9603R1ZX',
    fssaiLicense: '',
    panNumber: 'ABCDE1236H',
    bankAccountNumber: '112233445566',
    bankIfsc: 'SBIN0001234',
    bankName: 'State Bank of India',
    accountHolderName: 'Amit Patel',
    documents: [
      { id: 'doc-6', name: 'Shop License', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 259200000).toISOString(), verified: false }
    ],
    status: 'rejected',
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    reviewedAt: new Date(Date.now() - 172800000).toISOString(),
    reviewedBy: 'Admin User',
    rejectionReason: 'FSSAI license is mandatory for food business. Please upload FSSAI license and reapply.',
    notes: 'Missing FSSAI license - critical requirement',
    commissionRate: 0,
    deliveryRadius: 0,
    isActive: false,
    rating: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    categories: ['Chicken', 'Mutton'],
    activityLog: [
      { id: 'act-5', action: 'Application Submitted', timestamp: new Date(Date.now() - 259200000).toISOString(), user: 'System' },
      { id: 'act-6', action: 'Rejected', timestamp: new Date(Date.now() - 172800000).toISOString(), user: 'Admin User', details: 'Missing FSSAI license' }
    ]
  },
  {
    id: 'VEN-004',
    businessName: 'Royal Chicken Corner',
    ownerName: 'Mohammed Ali',
    email: 'ali@royalchicken.com',
    phone: '+91 98765 43213',
    address: '321, Food Street, Old City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    businessType: 'Retail Shop',
    gstNumber: '36AABCU9603R1ZX',
    fssaiLicense: '12345678901236',
    panNumber: 'ABCDE1237I',
    bankAccountNumber: '223344556677',
    bankIfsc: 'UTIB0001234',
    bankName: 'Axis Bank',
    accountHolderName: 'Mohammed Ali',
    documents: [
      { id: 'doc-7', name: 'GST Certificate', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 432000000).toISOString(), verified: true }
    ],
    status: 'pending',
    submittedAt: new Date(Date.now() - 432000000).toISOString(),
    notes: 'Waiting for FSSAI license upload',
    commissionRate: 15,
    deliveryRadius: 5,
    isActive: false,
    rating: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    categories: ['Chicken'],
    activityLog: [
      { id: 'act-7', action: 'Application Submitted', timestamp: new Date(Date.now() - 432000000).toISOString(), user: 'System' }
    ]
  },
  {
    id: 'VEN-005',
    businessName: 'Seafood Express',
    ownerName: 'Kavita Reddy',
    email: 'kavita@seafoodexpress.com',
    phone: '+91 98765 43214',
    address: '567, Coastal Road, Marina Beach',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001',
    businessType: 'Retail Shop',
    gstNumber: '33AABCU9603R1ZX',
    fssaiLicense: '12345678901237',
    panNumber: 'ABCDE1238J',
    bankAccountNumber: '334455667788',
    bankIfsc: 'KKBK0001234',
    bankName: 'Kotak Mahindra Bank',
    accountHolderName: 'Kavita Reddy',
    documents: [
      { id: 'doc-8', name: 'GST Certificate', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 345600000).toISOString(), verified: true },
      { id: 'doc-9', name: 'FSSAI License', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 345600000).toISOString(), verified: true },
      { id: 'doc-10', name: 'Trade License', type: 'pdf', url: '#', uploadedAt: new Date(Date.now() - 345600000).toISOString(), verified: true }
    ],
    status: 'on_hold',
    submittedAt: new Date(Date.now() - 345600000).toISOString(),
    reviewedAt: new Date(Date.now() - 172800000).toISOString(),
    reviewedBy: 'Admin User',
    notes: 'Background verification in progress',
    commissionRate: 14,
    deliveryRadius: 8,
    isActive: false,
    rating: 0,
    totalOrders: 0,
    monthlyRevenue: 0,
    categories: ['Fish', 'Seafood'],
    activityLog: [
      { id: 'act-8', action: 'Application Submitted', timestamp: new Date(Date.now() - 345600000).toISOString(), user: 'System' },
      { id: 'act-9', action: 'Put On Hold', timestamp: new Date(Date.now() - 172800000).toISOString(), user: 'Admin User', details: 'Background check pending' }
    ]
  }
];

const FALLBACK_STATS: VendorStats = {
  totalApplications: 156,
  pending: 18,
  approved: 98,
  rejected: 12,
  underReview: 15,
  onHold: 8,
  thisMonth: 32,
  totalVendors: 98,
  activeVendors: 87,
  avgCommission: 13.5,
  totalRevenue: 2850000
};

// Leather Green Theme Status Config
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pending: { 
    label: 'Pending', 
    color: 'text-[#8b6914]', 
    bg: 'bg-[#f0e6d3]', 
    border: 'border-[#dbc4a4]',
    icon: <Clock3 className="w-4 h-4" /> 
  },
  under_review: { 
    label: 'Under Review', 
    color: 'text-blue-700', 
    bg: 'bg-blue-100', 
    border: 'border-blue-200',
    icon: <FileText className="w-4 h-4" /> 
  },
  approved: { 
    label: 'Approved', 
    color: 'text-[#2d5a42]', 
    bg: 'bg-[#e8f5ed]', 
    border: 'border-[#2d5a42]/30',
    icon: <BadgeCheck className="w-4 h-4" /> 
  },
  rejected: { 
    label: 'Rejected', 
    color: 'text-red-700', 
    bg: 'bg-red-100', 
    border: 'border-red-200',
    icon: <XCircle className="w-4 h-4" /> 
  },
  on_hold: { 
    label: 'On Hold', 
    color: 'text-amber-700', 
    bg: 'bg-amber-100', 
    border: 'border-amber-200',
    icon: <Clock className="w-4 h-4" /> 
  }
};

export default function VendorOnboardingPage() {
  const [applications, setApplications] = useState<VendorApplication[]>(FALLBACK_APPLICATIONS);
  const [stats, setStats] = useState<VendorStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [commissionRate, setCommissionRate] = useState(15);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalTab, setModalTab] = useState('details');
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [reuploadType, setReuploadType] = useState<'documents' | 'location' | 'bank' | 'gst'>('documents');
  const [reuploadMessage, setReuploadMessage] = useState('');
  const [websiteConnected, setWebsiteConnected] = useState(true);
  const [hrPanelConnected, setHrPanelConnected] = useState(true);

  const { data: realtimeApplications } = useRealtime({
    table: 'vendor_applications',
    enabled: useRealtimeData,
  });

  const [editFormData, setEditFormData] = useState<Partial<VendorApplication>>({});

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setApplications(FALLBACK_APPLICATIONS);
      setStats(FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load vendor applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusUpdate = (id: string, status: VendorApplication['status'], reason?: string) => {
    try {
      setApplications(prev => prev.map(app => {
        if (app.id === id) {
          const newActivity: VendorActivity = {
            id: `act-${Date.now()}`,
            action: status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : status === 'under_review' ? 'Under Review' : 'On Hold',
            timestamp: new Date().toISOString(),
            user: 'Admin User',
            details: status === 'approved' ? `Commission: ${commissionRate}%` : reason
          };
          return {
            ...app,
            status,
            notes: reviewNotes,
            commissionRate: status === 'approved' ? commissionRate : app.commissionRate,
            rejectionReason: reason,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin User',
            isActive: status === 'approved',
            activityLog: [newActivity, ...app.activityLog]
          };
        }
        return app;
      }));
      
      // Update stats
      setStats(prev => {
        const newStats = { ...prev };
        if (status === 'approved') {
          newStats.approved += 1;
          newStats.pending = Math.max(0, prev.pending - 1);
          newStats.activeVendors += 1;
        } else if (status === 'rejected') {
          newStats.rejected += 1;
          newStats.pending = Math.max(0, prev.pending - 1);
        } else if (status === 'under_review') {
          newStats.underReview += 1;
          newStats.pending = Math.max(0, prev.pending - 1);
        }
        return newStats;
      });
      
      setIsDetailModalOpen(false);
      setReviewNotes('');
      setRejectionReason('');
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleEditVendor = (app: VendorApplication) => {
    setSelectedApplication(app);
    setEditFormData({ ...app });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedApplication || !editFormData) return;
    
    setApplications(prev => prev.map(app => {
      if (app.id === selectedApplication.id) {
        const newActivity: VendorActivity = {
          id: `act-${Date.now()}`,
          action: 'Application Updated',
          timestamp: new Date().toISOString(),
          user: 'Admin User',
          details: 'Vendor details modified by admin'
        };
        return {
          ...app,
          ...editFormData,
          activityLog: [newActivity, ...app.activityLog]
        };
      }
      return app;
    }));
    
    setIsEditModalOpen(false);
    setSelectedApplication(null);
    setEditFormData({});
  };

  const handleRequestReupload = () => {
    if (!selectedApplication || !reuploadMessage.trim()) return;
    
    const typeLabels: Record<string, string> = {
      documents: 'Documents Reupload Requested',
      location: 'Location Verification Requested',
      bank: 'Bank Details Reupload Requested',
      gst: 'GST Certificate Reupload Requested'
    };
    
    setApplications(prev => prev.map(app => {
      if (app.id === selectedApplication.id) {
        const newActivity: VendorActivity = {
          id: `act-${Date.now()}`,
          action: typeLabels[reuploadType],
          timestamp: new Date().toISOString(),
          user: 'Admin User',
          details: reuploadMessage
        };
        return {
          ...app,
          status: 'on_hold',
          activityLog: [newActivity, ...app.activityLog]
        };
      }
      return app;
    }));
    
    setIsReuploadModalOpen(false);
    setReuploadMessage('');
    setReuploadType('documents');
    alert(`Reupload request sent to ${selectedApplication.businessName}`);
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} applications?`)) return;
    }
    
    setApplications(prev => {
      if (action === 'delete') {
        return prev.filter(app => !selectedItems.includes(app.id));
      }
      return prev.map(app => {
        if (selectedItems.includes(app.id)) {
          return {
            ...app,
            status: action === 'approve' ? 'approved' : 'rejected',
            isActive: action === 'approve',
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Admin User'
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.gstNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportData = () => {
    const data = filteredApplications.map(app => ({
      ID: app.id,
      'Business Name': app.businessName,
      'Owner Name': app.ownerName,
      Email: app.email,
      Phone: app.phone,
      City: app.city,
      State: app.state,
      Status: app.status,
      'GST Number': app.gstNumber,
      'Commission Rate': app.commissionRate,
      'Submitted At': new Date(app.submittedAt).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
                <Store className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Vendor Onboarding
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
            </div>
          </div>
          <p className="text-[#5c3d1f] mt-2">
            Manage vendor applications, approvals, and onboarding process
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Vendor
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
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Applications</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.totalApplications}</p>
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

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8b6914] to-[#a67c52]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#8b6914] uppercase tracking-wider">Active Vendors</p>
              <p className="text-2xl font-black text-[#8b6914] mt-1">{stats.activeVendors}</p>
              <div className="flex items-center gap-1 mt-1 text-emerald-600">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-xs font-bold">+8%</span>
              </div>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#8b6914] to-[#a67c52]">
              <Store className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#3d7a58] to-[#5a9a78]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#3d7a58] uppercase tracking-wider">Pending Review</p>
              <p className="text-2xl font-black text-[#3d7a58] mt-1">{stats.pending + stats.underReview}</p>
              <p className="text-xs text-[#a67c52] mt-1">Needs attention</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#3d7a58] to-[#5a9a78]">
              <Clock3 className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#a67c52] to-[#c49c72]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Avg Commission</p>
              <p className="text-2xl font-black text-[#a67c52] mt-1">{stats.avgCommission}%</p>
              <p className="text-xs text-[#a67c52] mt-1">Revenue share</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#a67c52] to-[#c49c72]">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Applications', count: stats.totalApplications },
          { key: 'pending', label: 'Pending', count: stats.pending },
          { key: 'under_review', label: 'Under Review', count: stats.underReview },
          { key: 'on_hold', label: 'On Hold', count: stats.onHold },
          { key: 'approved', label: 'Approved', count: stats.approved },
          { key: 'rejected', label: 'Rejected', count: stats.rejected },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
              statusFilter === item.key
                ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-lg'
                : 'bg-white text-[#5c3d1f] hover:bg-[#f0e6d3] border border-[#dbc4a4]'
            )}
          >
            {item.label}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              statusFilter === item.key ? 'bg-white/20' : 'bg-[#f0e6d3]'
            )}>
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by business name, owner, email, city, or GST number..."
            className="w-full pl-12 pr-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex gap-3">
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] rounded-xl border border-[#dbc4a4]">
              <span className="text-sm font-semibold text-[#5c3d1f]">{selectedItems.length} selected</span>
              <button
                onClick={() => handleBulkAction('approve')}
                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                title="Approve Selected"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkAction('reject')}
                className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
                title="Reject Selected"
              >
                <XCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-all border border-[#dbc4a4]"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#faf9f6]">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredApplications.length && filteredApplications.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredApplications.map(app => app.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#a67c52] uppercase tracking-wider">Vendor Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#a67c52] uppercase tracking-wider">Location & Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#a67c52] uppercase tracking-wider">Documents</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#a67c52] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#a67c52] uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-[#a67c52] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e6d3]/50">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
                      <Store className="w-10 h-10 text-[#a67c52]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1a3c28]">No applications found</h3>
                    <p className="text-[#5c3d1f] mt-2">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app, index) => {
                  const status = STATUS_CONFIG[app.status];
                  const isSelected = selectedItems.includes(app.id);
                  return (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "hover:bg-[#faf9f6] transition-colors",
                        isSelected && "bg-[#e8f5ed]"
                      )}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(app.id)}
                          className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-lg">
                            {app.businessName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#1a3c28]">{app.businessName}</p>
                            <p className="text-sm text-[#5c3d1f]">{app.ownerName}</p>
                            <p className="text-xs text-[#a67c52]">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-[#5c3d1f]">
                            <MapPin className="w-4 h-4 text-[#a67c52]" />
                            {app.city}, {app.state}
                          </div>
                          <p className="text-xs text-[#a67c52]">{app.businessType}</p>
                          <p className="text-xs font-mono text-[#8b6914]">{app.gstNumber}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {app.documents.map((doc) => (
                            <span
                              key={doc.id}
                              className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                                doc.verified 
                                  ? "bg-emerald-100 text-emerald-700" 
                                  : "bg-amber-100 text-amber-700"
                              )}
                            >
                              <FileText className="w-3 h-3" />
                              {doc.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                          status.bg, status.color, status.border
                        )}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#5c3d1f]">
                          {new Date(app.submittedAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                        <p className="text-xs text-[#a67c52]">
                          {Math.ceil((Date.now() - new Date(app.submittedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedApplication(app);
                              setReviewNotes(app.notes || '');
                              setCommissionRate(app.commissionRate || 15);
                              setModalTab('details');
                              setIsDetailModalOpen(true);
                            }}
                            className="p-2 text-[#a67c52] hover:bg-[#f0e6d3] rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditVendor(app)}
                            className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                            title="Edit Vendor"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedApplication(app);
                              setReviewNotes(app.notes || '');
                              setCommissionRate(app.commissionRate || 15);
                              setModalTab('review');
                              setIsDetailModalOpen(true);
                            }}
                            className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                            title="Review Application"
                          >
                            <BadgeCheck className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail/Review Modal with Tabs */}
      <AnimatePresence>
        {isDetailModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#dbc4a4]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#e8f5ed]/20 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedApplication.businessName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#e8f5ed]">
                        {selectedApplication.businessName}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-[#e8f5ed]/70">{selectedApplication.id}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold",
                          STATUS_CONFIG[selectedApplication.status].bg,
                          STATUS_CONFIG[selectedApplication.status].color
                        )}>
                          {STATUS_CONFIG[selectedApplication.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-[#f0e6d3] bg-white">
                {[
                  { key: 'details', label: 'Business Details', icon: Store },
                  { key: 'documents', label: 'Documents', icon: FileText },
                  { key: 'activity', label: 'Activity Log', icon: History },
                  { key: 'review', label: 'Review', icon: BadgeCheck },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setModalTab(tab.key)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2",
                      modalTab === tab.key
                        ? 'border-[#2d5a42] text-[#2d5a42]'
                        : 'border-transparent text-[#5c3d1f] hover:text-[#2d5a42]'
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {modalTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Information */}
                    <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                      <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                        <Building2 className="w-5 h-5 text-[#2d5a42]" />
                        Business Information
                      </h3>
                      <div className="space-y-3">
                        <InfoRow label="Business Name" value={selectedApplication.businessName} />
                        <InfoRow label="Owner Name" value={selectedApplication.ownerName} />
                        <InfoRow label="Business Type" value={selectedApplication.businessType} />
                        <InfoRow label="GST Number" value={selectedApplication.gstNumber} />
                        <InfoRow label="FSSAI License" value={selectedApplication.fssaiLicense || 'Not provided'} />
                        <InfoRow label="PAN Number" value={selectedApplication.panNumber} />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                      <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                        <Phone className="w-5 h-5 text-[#2d5a42]" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <InfoRow label="Email" value={selectedApplication.email} icon={<Mail className="w-4 h-4" />} />
                        <InfoRow label="Phone" value={selectedApplication.phone} icon={<Phone className="w-4 h-4" />} />
                        <InfoRow label="Address" value={selectedApplication.address} />
                        <InfoRow label="City" value={selectedApplication.city} />
                        <InfoRow label="State" value={selectedApplication.state} />
                        <InfoRow label="Pincode" value={selectedApplication.pincode} />
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                      <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-[#2d5a42]" />
                        Bank Details
                      </h3>
                      <div className="space-y-3">
                        <InfoRow label="Bank Name" value={selectedApplication.bankName} />
                        <InfoRow label="Account Holder" value={selectedApplication.accountHolderName} />
                        <InfoRow label="Account Number" value={selectedApplication.bankAccountNumber} />
                        <InfoRow label="IFSC Code" value={selectedApplication.bankIfsc} />
                      </div>
                    </div>

                    {/* Vendor Stats */}
                    <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                      <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-[#2d5a42]" />
                        Performance Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[#e8f5ed] rounded-xl">
                          <p className="text-xs text-[#5c3d1f]">Commission Rate</p>
                          <p className="text-lg font-bold text-[#2d5a42]">{selectedApplication.commissionRate}%</p>
                        </div>
                        <div className="p-3 bg-[#e8f5ed] rounded-xl">
                          <p className="text-xs text-[#5c3d1f]">Delivery Radius</p>
                          <p className="text-lg font-bold text-[#2d5a42]">{selectedApplication.deliveryRadius} km</p>
                        </div>
                        <div className="p-3 bg-[#f0e6d3] rounded-xl">
                          <p className="text-xs text-[#5c3d1f]">Total Orders</p>
                          <p className="text-lg font-bold text-[#8b6914]">{selectedApplication.totalOrders}</p>
                        </div>
                        <div className="p-3 bg-[#f0e6d3] rounded-xl">
                          <p className="text-xs text-[#5c3d1f]">Rating</p>
                          <p className="text-lg font-bold text-[#8b6914]">{selectedApplication.rating > 0 ? `${selectedApplication.rating}/5` : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#2d5a42]" />
                      Uploaded Documents
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedApplication.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#dbc4a4]/30">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              doc.verified ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                            )}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1a3c28]">{doc.name}</p>
                              <p className="text-xs text-[#a67c52]">
                                Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-bold",
                              doc.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {doc.verified ? 'Verified' : 'Pending'}
                            </span>
                            <button className="p-2 text-[#a67c52] hover:bg-[#f0e6d3] rounded-lg">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-[#f0e6d3]/30 rounded-xl border border-dashed border-[#dbc4a4]">
                      <div className="flex items-center justify-center gap-2 text-[#5c3d1f]">
                        <Upload className="w-5 h-5" />
                        <span className="font-semibold">Drop files here or click to upload</span>
                      </div>
                    </div>
                  </div>
                )}

                {modalTab === 'activity' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                      <History className="w-5 h-5 text-[#2d5a42]" />
                      Activity Timeline
                    </h3>
                    <div className="space-y-3">
                      {selectedApplication.activityLog.map((activity, idx) => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white text-xs font-bold">
                              {activity.user.charAt(0)}
                            </div>
                            {idx < selectedApplication.activityLog.length - 1 && (
                              <div className="w-0.5 h-full bg-[#dbc4a4]/50 mt-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="p-4 bg-white rounded-xl border border-[#dbc4a4]/30">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-[#1a3c28]">{activity.action}</p>
                                <span className="text-xs text-[#a67c52]">
                                  {new Date(activity.timestamp).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <p className="text-sm text-[#5c3d1f] mt-1">by {activity.user}</p>
                              {activity.details && (
                                <p className="text-sm text-[#a67c52] mt-1">{activity.details}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {modalTab === 'review' && (
                  <div className="space-y-6">
                    {/* Rejection Reason Display */}
                    {selectedApplication.status === 'rejected' && selectedApplication.rejectionReason && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="font-bold text-red-700 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          Rejection Reason
                        </p>
                        <p className="text-red-600 mt-2">{selectedApplication.rejectionReason}</p>
                      </div>
                    )}

                    {/* Review Notes */}
                    <div>
                      <label className="block text-sm font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                        Review Notes
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all resize-none"
                        placeholder="Add your review notes about this vendor..."
                      />
                    </div>

                    {/* Commission Rate */}
                    {selectedApplication.status !== 'approved' && (
                      <div>
                        <label className="block text-sm font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                          Commission Rate (%)
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="5"
                            max="25"
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(Number(e.target.value))}
                            className="flex-1 h-2 bg-[#f0e6d3] rounded-lg appearance-none cursor-pointer accent-[#2d5a42]"
                          />
                          <span className="px-4 py-2 bg-[#e8f5ed] text-[#2d5a42] rounded-xl font-bold min-w-[60px] text-center">
                            {commissionRate}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-[#f0e6d3]">
                      {selectedApplication.status !== 'approved' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Approve Vendor
                        </motion.button>
                      )}
                      {selectedApplication.status !== 'rejected' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsRejectionModalOpen(true)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject Application
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'under_review')}
                        className="px-6 py-3 bg-white text-[#5c3d1f] rounded-xl font-bold border border-[#dbc4a4] hover:bg-[#f0e6d3] transition-all"
                      >
                        Mark Under Review
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'on_hold')}
                        className="px-6 py-3 bg-[#f0e6d3] text-[#8b6914] rounded-xl font-bold hover:bg-[#e8f5ed] transition-all"
                      >
                        Put On Hold
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsReuploadModalOpen(true)}
                        className="px-6 py-3 bg-amber-100 text-amber-700 rounded-xl font-bold hover:bg-amber-200 transition-all"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Request Reupload
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rejection Reason Modal */}
      <AnimatePresence>
        {isRejectionModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-lg border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-red-500 to-red-600">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <XCircle className="w-6 h-6" />
                  Reject Application
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[#5c3d1f]">
                  Please provide a reason for rejecting <strong>{selectedApplication.businessName}</strong>. This will be shared with the vendor.
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                  placeholder="Enter rejection reason..."
                />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsRejectionModalOpen(false)}
                    className="flex-1 px-4 py-3 text-[#5c3d1f] bg-[#f0e6d3] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (rejectionReason.trim()) {
                        handleStatusUpdate(selectedApplication.id, 'rejected', rejectionReason);
                        setIsRejectionModalOpen(false);
                      }
                    }}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Vendor Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                      <UserPlus className="w-5 h-5 text-[#e8f5ed]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Add New Vendor</h2>
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Business Name *</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="Enter business name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Owner Name *</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="Enter owner name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Email *</label>
                    <input type="email" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Phone *</label>
                    <input type="tel" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Address</label>
                  <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="Full address" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">City</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="City" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">State</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="State" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Pincode</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="Pincode" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">GST Number</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="GST Number" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">FSSAI License</label>
                    <input type="text" className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" placeholder="FSSAI License" />
                  </div>
                </div>
                <div className="p-4 bg-[#f0e6d3]/30 rounded-xl border border-dashed border-[#dbc4a4]">
                  <div className="flex items-center justify-center gap-2 text-[#5c3d1f]">
                    <Upload className="w-5 h-5" />
                    <span className="font-semibold">Upload Documents (GST, FSSAI, PAN)</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-6 py-3 text-[#5c3d1f] bg-[#f0e6d3] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      alert('Vendor added successfully!');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Add Vendor
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Vendor Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#8b6914] to-[#a67c52]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Edit className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Edit Vendor</h2>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Business Name</label>
                    <input 
                      type="text" 
                      value={editFormData.businessName || ''}
                      onChange={(e) => setEditFormData({...editFormData, businessName: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Owner Name</label>
                    <input 
                      type="text" 
                      value={editFormData.ownerName || ''}
                      onChange={(e) => setEditFormData({...editFormData, ownerName: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Email</label>
                    <input 
                      type="email" 
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Address</label>
                  <input 
                    type="text" 
                    value={editFormData.address || ''}
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">City</label>
                    <input 
                      type="text" 
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">State</label>
                    <input 
                      type="text" 
                      value={editFormData.state || ''}
                      onChange={(e) => setEditFormData({...editFormData, state: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Pincode</label>
                    <input 
                      type="text" 
                      value={editFormData.pincode || ''}
                      onChange={(e) => setEditFormData({...editFormData, pincode: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">GST Number</label>
                    <input 
                      type="text" 
                      value={editFormData.gstNumber || ''}
                      onChange={(e) => setEditFormData({...editFormData, gstNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">FSSAI License</label>
                    <input 
                      type="text" 
                      value={editFormData.fssaiLicense || ''}
                      onChange={(e) => setEditFormData({...editFormData, fssaiLicense: e.target.value})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Commission Rate (%)</label>
                    <input 
                      type="number" 
                      value={editFormData.commissionRate || 0}
                      onChange={(e) => setEditFormData({...editFormData, commissionRate: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Delivery Radius (km)</label>
                    <input 
                      type="number" 
                      value={editFormData.deliveryRadius || 0}
                      onChange={(e) => setEditFormData({...editFormData, deliveryRadius: Number(e.target.value)})}
                      className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 px-6 py-3 text-[#5c3d1f] bg-[#f0e6d3] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8b6914] to-[#a67c52] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Reupload Modal */}
      <AnimatePresence>
        {isReuploadModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-lg border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-amber-500 to-amber-600">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-6 h-6" />
                  Request Reupload
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[#5c3d1f]">
                  Request <strong>{selectedApplication.businessName}</strong> to reupload or verify information.
                </p>
                
                <div>
                  <label className="block text-sm font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                    Reupload Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'documents', label: 'Documents', icon: FileText },
                      { key: 'location', label: 'Location', icon: MapPinned },
                      { key: 'bank', label: 'Bank Details', icon: CreditCard },
                      { key: 'gst', label: 'GST Certificate', icon: Shield },
                    ].map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setReuploadType(type.key as any)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all",
                          reuploadType === type.key
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                            : 'bg-white text-[#5c3d1f] border border-[#dbc4a4] hover:bg-[#f0e6d3]'
                        )}
                      >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">
                    Message to Vendor
                  </label>
                  <textarea
                    value={reuploadMessage}
                    onChange={(e) => setReuploadMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"
                    placeholder={`Please explain what needs to be reuploaded or corrected...`}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsReuploadModalOpen(false)}
                    className="flex-1 px-4 py-3 text-[#5c3d1f] bg-[#f0e6d3] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestReupload}
                    disabled={!reuploadMessage.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Send Request
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

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      {icon && <span className="text-[#a67c52] mt-0.5">{icon}</span>}
      <div className="flex-1">
        <span className="text-xs text-[#a67c52] uppercase font-bold">{label}</span>
        <p className="text-sm text-[#1a3c28] font-medium">{value}</p>
      </div>
    </div>
  );
}

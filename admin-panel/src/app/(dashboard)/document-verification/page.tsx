'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Shield,
  AlertCircle,
  Clock,
  MoreHorizontal,
  ImageIcon,
  User,
  Store,
  Bike,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ArrowUpDown,
  Star,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FileX,
  FileWarning,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Document {
  id: string;
  type: 'fssai' | 'driving_license_front' | 'driving_license_back' | 'business_license' | 'food_license';
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  documentNumber: string;
  issueDate?: string;
  expiryDate?: string;
  frontImage?: string;
  backImage?: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  rejectionReason?: string;
  
  // Applicant/Vendor Info
  applicantType: 'vendor' | 'delivery_partner';
  applicantId: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  businessName?: string;
}

// Mock data
const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'DOC-001',
    type: 'fssai',
    status: 'pending',
    documentNumber: 'FSSAI-12345678901234',
    issueDate: '2023-01-15',
    expiryDate: '2028-01-14',
    frontImage: '/documents/fssai1.jpg',
    uploadedAt: '2024-01-15T10:30:00Z',
    applicantType: 'vendor',
    applicantId: 'VN-001',
    applicantName: 'Rahul Meats Pvt Ltd',
    email: 'rahul@meats.com',
    phone: '+91 98765 43210',
    location: 'Koramangala, Bangalore',
    businessName: 'Premium Meats',
  },
  {
    id: 'DOC-002',
    type: 'driving_license_front',
    status: 'verified',
    documentNumber: 'DL-KA-0120234567890',
    issueDate: '2020-06-10',
    expiryDate: '2030-06-09',
    frontImage: '/documents/dl1-front.jpg',
    backImage: '/documents/dl1-back.jpg',
    uploadedAt: '2024-01-14T14:20:00Z',
    verifiedAt: '2024-01-15T09:00:00Z',
    verifiedBy: 'Admin User',
    notes: 'Valid license. All details match.',
    applicantType: 'delivery_partner',
    applicantId: 'DP-001',
    applicantName: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    phone: '+91 98765 43210',
    location: 'HSR Layout, Bangalore',
  },
  {
    id: 'DOC-003',
    type: 'driving_license_front',
    status: 'rejected',
    documentNumber: 'DL-KA-0120198765432',
    issueDate: '2019-03-20',
    expiryDate: '2024-03-19',
    frontImage: '/documents/dl2-front.jpg',
    backImage: '/documents/dl2-back.jpg',
    uploadedAt: '2024-01-13T11:45:00Z',
    verifiedAt: '2024-01-14T16:30:00Z',
    verifiedBy: 'Manager',
    rejectionReason: 'License expired. Please upload renewed license.',
    applicantType: 'delivery_partner',
    applicantId: 'DP-002',
    applicantName: 'Amit Patel',
    email: 'amit.p@email.com',
    phone: '+91 87654 32109',
    location: 'Whitefield, Bangalore',
  },
  {
    id: 'DOC-004',
    type: 'fssai',
    status: 'verified',
    documentNumber: 'FSSAI-98765432109876',
    issueDate: '2022-08-01',
    expiryDate: '2027-07-31',
    frontImage: '/documents/fssai2.jpg',
    uploadedAt: '2024-01-10T09:15:00Z',
    verifiedAt: '2024-01-11T10:30:00Z',
    verifiedBy: 'Admin User',
    notes: 'FSSAI license verified. Valid for 3 more years.',
    applicantType: 'vendor',
    applicantId: 'VN-002',
    applicantName: 'Sea Fresh Enterprises',
    email: 'contact@seafresh.com',
    phone: '+91 98765 12345',
    location: 'Marathahalli, Bangalore',
    businessName: 'Fresh Fish Corner',
  },
  {
    id: 'DOC-005',
    type: 'business_license',
    status: 'pending',
    documentNumber: 'BL-BNG-2024-001234',
    issueDate: '2024-01-01',
    expiryDate: '2025-12-31',
    frontImage: '/documents/bl1.jpg',
    uploadedAt: '2024-01-16T16:00:00Z',
    applicantType: 'vendor',
    applicantId: 'VN-003',
    applicantName: 'Royal Foods Ltd',
    email: 'royal@foods.com',
    phone: '+91 76543 21098',
    location: 'Jayanagar, Bangalore',
    businessName: 'Royal Chicken Center',
  },
  {
    id: 'DOC-006',
    type: 'driving_license_front',
    status: 'expired',
    documentNumber: 'DL-KA-0120151122334',
    issueDate: '2015-12-01',
    expiryDate: '2025-11-30',
    frontImage: '/documents/dl3-front.jpg',
    backImage: '/documents/dl3-back.jpg',
    uploadedAt: '2024-01-12T08:30:00Z',
    applicantType: 'delivery_partner',
    applicantId: 'DP-003',
    applicantName: 'Suresh Yadav',
    email: 'suresh.y@email.com',
    phone: '+91 76543 21099',
    location: 'Indiranagar, Bangalore',
  },
];

const STATUS_CONFIG = {
  pending: { 
    color: 'bg-amber-100 text-amber-700 border-amber-200', 
    icon: Clock, 
    label: 'Pending Verification',
    bgColor: 'bg-amber-50'
  },
  verified: { 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
    icon: CheckCircle, 
    label: 'Verified',
    bgColor: 'bg-emerald-50'
  },
  rejected: { 
    color: 'bg-rose-100 text-rose-700 border-rose-200', 
    icon: XCircle, 
    label: 'Rejected',
    bgColor: 'bg-rose-50'
  },
  expired: { 
    color: 'bg-gray-100 text-gray-700 border-gray-200', 
    icon: AlertTriangle, 
    label: 'Expired',
    bgColor: 'bg-gray-50'
  },
};

const DOCUMENT_TYPES = {
  fssai: { label: 'FSSAI License', icon: Store, category: 'Food License' },
  driving_license_front: { label: 'Driving License (Front)', icon: Bike, category: 'Driver License' },
  driving_license_back: { label: 'Driving License (Back)', icon: Bike, category: 'Driver License' },
  business_license: { label: 'Business License', icon: FileText, category: 'Business' },
  food_license: { label: 'Food License', icon: Store, category: 'Food License' },
};

export default function DocumentVerificationPage() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [filteredDocs, setFilteredDocs] = useState<Document[]>(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [applicantFilter, setApplicantFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter documents
  useEffect(() => {
    let filtered = [...documents];
    
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }
    
    if (applicantFilter !== 'all') {
      filtered = filtered.filter(doc => doc.applicantType === applicantFilter);
    }
    
    setFilteredDocs(filtered);
  }, [searchQuery, statusFilter, typeFilter, applicantFilter, documents]);

  const handleVerify = async (docId: string) => {
    setActionLoading(docId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { 
            ...doc, 
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'Current Admin',
            notes: notes || doc.notes
          }
        : doc
    ));
    
    setActionLoading(null);
    setShowVerifyModal(false);
    setNotes('');
    
    if (selectedDoc?.id === docId) {
      setSelectedDoc(prev => prev ? { ...prev, status: 'verified' } : null);
    }
  };

  const handleReject = async (docId: string) => {
    setActionLoading(docId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { 
            ...doc, 
            status: 'rejected',
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'Current Admin',
            rejectionReason: rejectionReason || doc.rejectionReason,
            notes: notes || doc.notes
          }
        : doc
    ));
    
    setActionLoading(null);
    setShowRejectModal(false);
    setRejectionReason('');
    setNotes('');
    
    if (selectedDoc?.id === docId) {
      setSelectedDoc(prev => prev ? { ...prev, status: 'rejected' } : null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    verified: documents.filter(d => d.status === 'verified').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    expired: documents.filter(d => d.status === 'expired' || isExpired(d.expiryDate)).length,
    expiringSoon: documents.filter(d => isExpiringSoon(d.expiryDate)).length,
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3c28]">Document Verification</h1>
            <p className="text-[#5c3d1f]">Review and verify FSSAI, driving licenses, and business documents</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Total Documents', value: stats.total, icon: FileText, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-500 to-amber-600' },
          { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-rose-500 to-rose-600' },
          { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: 'from-gray-500 to-gray-600' },
          { label: 'Expiring Soon', value: stats.expiringSoon, icon: FileWarning, color: 'from-orange-500 to-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              if (stat.label === 'Expiring Soon') {
                // Special filter for expiring soon
                setStatusFilter('all');
              } else {
                setStatusFilter(stat.label.toLowerCase() === 'total documents' ? 'all' : stat.label.toLowerCase());
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#5c3d1f] mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-[#1a3c28]">{stat.value}</p>
              </div>
              <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
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
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6914]" />
            <input
              type="text"
              placeholder="Search by name, document number, email, business..."
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
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Document Types</option>
            {Object.entries(DOCUMENT_TYPES).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          <select
            value={applicantFilter}
            onChange={(e) => setApplicantFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Applicants</option>
            <option value="vendor">Vendors</option>
            <option value="delivery_partner">Delivery Partners</option>
          </select>
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0ebe3] border-b border-[#dbc4a4]/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Applicant</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Document Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Document Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Validity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Uploaded</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbc4a4]/20">
              {filteredDocs.map((doc, index) => {
                const StatusIcon = STATUS_CONFIG[doc.status].icon;
                const TypeConfig = DOCUMENT_TYPES[doc.type];
                const TypeIcon = TypeConfig.icon;
                const expired = isExpired(doc.expiryDate);
                const expiringSoon = isExpiringSoon(doc.expiryDate);
                
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "hover:bg-[#faf9f6] transition-colors",
                      (expired || expiringSoon) && "bg-amber-50/50"
                    )}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold",
                          doc.applicantType === 'vendor' 
                            ? "bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]" 
                            : "bg-gradient-to-br from-blue-500 to-blue-600"
                        )}>
                          {doc.applicantType === 'vendor' ? <Store className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a3c28]">{doc.applicantName}</p>
                          <p className="text-xs text-[#5c3d1f]">{doc.applicantType === 'vendor' ? 'Vendor' : 'Delivery Partner'}</p>
                          {doc.businessName && (
                            <p className="text-xs text-[#8b6914]">{doc.businessName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <TypeIcon className="w-4 h-4 text-[#8b6914]" />
                        <div>
                          <p className="text-sm font-medium text-[#1a3c28]">{TypeConfig.label}</p>
                          <p className="text-xs text-[#5c3d1f]">{TypeConfig.category}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="font-mono text-sm text-[#3d2914] bg-[#f0e6d3] px-2 py-1 rounded inline-block">
                        {doc.documentNumber}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-3.5 h-3.5 text-[#8b6914]" />
                          <span className={cn(
                            "text-[#3d2914]",
                            expired && "text-rose-600 font-semibold",
                            expiringSoon && "text-amber-600 font-semibold"
                          )}>
                            Exp: {formatDate(doc.expiryDate)}
                          </span>
                        </div>
                        {expired && (
                          <span className="text-xs text-rose-600 font-medium">Expired</span>
                        )}
                        {expiringSoon && (
                          <span className="text-xs text-amber-600 font-medium">Expires soon</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        STATUS_CONFIG[doc.status].color
                      )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {STATUS_CONFIG[doc.status].label}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="text-sm text-[#5c3d1f]">
                        <p>{formatDate(doc.uploadedAt)}</p>
                        {doc.verifiedAt && (
                          <p className="text-xs text-[#8b6914]">Verified: {formatDate(doc.verifiedAt)}</p>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {doc.status === 'pending' && (
                          <>
                            <button
                              onClick={() => { setSelectedDoc(doc); setShowVerifyModal(true); }}
                              disabled={actionLoading === doc.id}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                              title="Verify Document"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setSelectedDoc(doc); setShowRejectModal(true); }}
                              disabled={actionLoading === doc.id}
                              className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                              title="Reject Document"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { setSelectedDoc(doc); setShowDetailModal(true); setZoomLevel(1); }}
                          className="p-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {doc.frontImage && (
                          <a
                            href={doc.frontImage}
                            download
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-[#c49a6c] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1a3c28] mb-2">No documents found</h3>
            <p className="text-[#5c3d1f]">Try adjusting your filters</p>
          </div>
        )}
      </motion.div>

      {/* Document Detail & Verification Modal */}
      {showDetailModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-white",
                  selectedDoc.applicantType === 'vendor' 
                    ? "bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]" 
                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                )}>
                  {selectedDoc.applicantType === 'vendor' ? <Store className="w-7 h-7" /> : <Bike className="w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3c28]">{selectedDoc.applicantName}</h3>
                  <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                    <span>{DOCUMENT_TYPES[selectedDoc.type].label}</span>
                    <span className="text-[#dbc4a4]">|</span>
                    <span className="font-mono">{selectedDoc.documentNumber}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border",
                  STATUS_CONFIG[selectedDoc.status].color
                )}>
                  {React.createElement(STATUS_CONFIG[selectedDoc.status].icon, { className: "w-4 h-4" })}
                  {STATUS_CONFIG[selectedDoc.status].label}
                </span>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#5c3d1f]" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Document Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#8b6914]" />
                    Document Images
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                      className="p-2 bg-[#f0e6d3] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-[#5c3d1f]">{Math.round(zoomLevel * 100)}%</span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.25))}
                      className="p-2 bg-[#f0e6d3] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-2 bg-[#f0e6d3] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Front Image */}
                {selectedDoc.frontImage && (
                  <div className="border border-[#dbc4a4]/50 rounded-xl overflow-hidden">
                    <div className="bg-[#f0ebe3] px-4 py-2 border-b border-[#dbc4a4]/30">
                      <p className="text-sm font-medium text-[#5c3d1f]">Front Side</p>
                    </div>
                    <div className="p-4 bg-[#faf9f6] flex items-center justify-center min-h-[200px]">
                      <div 
                        className="bg-white rounded-lg shadow-md p-4 transition-transform"
                        style={{ transform: `scale(${zoomLevel})` }}
                      >
                        <ImageIcon className="w-32 h-32 text-[#c49a6c] mx-auto" />
                        <p className="text-center text-sm text-[#5c3d1f] mt-2">Document Preview</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Back Image */}
                {selectedDoc.backImage && (
                  <div className="border border-[#dbc4a4]/50 rounded-xl overflow-hidden">
                    <div className="bg-[#f0ebe3] px-4 py-2 border-b border-[#dbc4a4]/30">
                      <p className="text-sm font-medium text-[#5c3d1f]">Back Side</p>
                    </div>
                    <div className="p-4 bg-[#faf9f6] flex items-center justify-center min-h-[200px]">
                      <div 
                        className="bg-white rounded-lg shadow-md p-4 transition-transform"
                        style={{ transform: `scale(${zoomLevel})` }}
                      >
                        <ImageIcon className="w-32 h-32 text-[#c49a6c] mx-auto" />
                        <p className="text-center text-sm text-[#5c3d1f] mt-2">Document Preview</p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedDoc.frontImage && !selectedDoc.backImage && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                    <p className="text-amber-800 font-medium">No document images uploaded</p>
                  </div>
                )}
              </div>

              {/* Document Info */}
              <div className="space-y-6">
                {/* Document Details */}
                <div className="bg-[#faf9f6] rounded-xl p-4">
                  <h4 className="font-semibold text-[#1a3c28] mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8b6914]" />
                    Document Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Document Number</span>
                      <span className="font-mono text-sm font-medium text-[#1a3c28] bg-[#f0e6d3] px-2 py-1 rounded">{selectedDoc.documentNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Issue Date</span>
                      <span className="text-sm text-[#3d2914]">{formatDate(selectedDoc.issueDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Expiry Date</span>
                      <span className={cn(
                        "text-sm font-medium",
                        isExpired(selectedDoc.expiryDate) ? "text-rose-600" : isExpiringSoon(selectedDoc.expiryDate) ? "text-amber-600" : "text-[#3d2914]"
                      )}>
                        {formatDate(selectedDoc.expiryDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Uploaded</span>
                      <span className="text-sm text-[#3d2914]">{formatDate(selectedDoc.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Applicant Info */}
                <div className="bg-[#faf9f6] rounded-xl p-4">
                  <h4 className="font-semibold text-[#1a3c28] mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8b6914]" />
                    Applicant Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedDoc.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedDoc.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedDoc.location}</span>
                    </div>
                    {selectedDoc.businessName && (
                      <div className="flex items-center gap-3">
                        <Store className="w-4 h-4 text-[#8b6914]" />
                        <span className="text-sm text-[#3d2914]">{selectedDoc.businessName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification History */}
                {(selectedDoc.verifiedAt || selectedDoc.notes || selectedDoc.rejectionReason) && (
                  <div className={cn(
                    "rounded-xl p-4 border",
                    selectedDoc.status === 'rejected' 
                      ? "bg-rose-50 border-rose-200" 
                      : "bg-emerald-50 border-emerald-200"
                  )}>
                    <h4 className={cn(
                      "font-semibold mb-3 flex items-center gap-2",
                      selectedDoc.status === 'rejected' ? "text-rose-800" : "text-emerald-800"
                    )}>
                      {selectedDoc.status === 'rejected' ? <FileX className="w-4 h-4" /> : <FileCheck className="w-4 h-4" />}
                      Verification Details
                    </h4>
                    {selectedDoc.verifiedAt && (
                      <p className={cn(
                        "text-sm mb-2",
                        selectedDoc.status === 'rejected' ? "text-rose-700" : "text-emerald-700"
                      )}>
                        Verified on {formatDate(selectedDoc.verifiedAt)} by {selectedDoc.verifiedBy}
                      </p>
                    )}
                    {selectedDoc.rejectionReason && (
                      <p className="text-sm text-rose-700 mb-2">
                        <span className="font-medium">Rejection Reason:</span> {selectedDoc.rejectionReason}
                      </p>
                    )}
                    {selectedDoc.notes && (
                      <p className={cn(
                        "text-sm",
                        selectedDoc.status === 'rejected' ? "text-rose-700" : "text-emerald-700"
                      )}>
                        <span className="font-medium">Notes:</span> {selectedDoc.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                {selectedDoc.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowDetailModal(false); setShowVerifyModal(true); }}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Verify Document
                    </button>
                    <button
                      onClick={() => { setShowDetailModal(false); setShowRejectModal(true); }}
                      className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3c28]">Verify Document</h3>
                  <p className="text-sm text-[#5c3d1f]">{selectedDoc.documentNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm text-emerald-700">
                  You are about to verify this {DOCUMENT_TYPES[selectedDoc.type].label} for {selectedDoc.applicantName}.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                  Verification Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowVerifyModal(false); setNotes(''); }}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerify(selectedDoc.id)}
                  disabled={actionLoading === selectedDoc.id}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading === selectedDoc.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3c28]">Reject Document</h3>
                  <p className="text-sm text-[#5c3d1f]">{selectedDoc.documentNumber}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <p className="text-sm text-rose-700">
                  Please provide a reason for rejecting this document. This will be shared with the applicant.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                  Rejection Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 mb-3"
                >
                  <option value="">Select a reason...</option>
                  <option value="Document expired">Document expired</option>
                  <option value="Document unclear/blurry">Document unclear/blurry</option>
                  <option value="Invalid document number">Invalid document number</option>
                  <option value="Name mismatch">Name mismatch</option>
                  <option value="Incomplete document">Incomplete document</option>
                  <option value="Wrong document type">Wrong document type</option>
                  <option value="Other">Other (specify in notes)</option>
                </select>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes (optional)..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowRejectModal(false); setRejectionReason(''); setNotes(''); }}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedDoc.id)}
                  disabled={actionLoading === selectedDoc.id || !rejectionReason}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading === selectedDoc.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Rejecting...
                    </span>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Confirm Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

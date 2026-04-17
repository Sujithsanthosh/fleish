'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  AlertCircle,
  ChevronDown,
  MoreHorizontal,
  UserCheck,
  Bike,
  Shield,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface PartnerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  vehicleType: 'bike' | 'scooter' | 'bicycle';
  hasLicense: boolean;
  licenseFront: string | null;
  licenseBack: string | null;
  experience: string;
  preferredZone: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

// Mock data
const MOCK_APPLICATIONS: PartnerApplication[] = [
  {
    id: 'PA-001',
    fullName: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    phone: '+91 98765 43210',
    city: 'Bangalore',
    vehicleType: 'bike',
    hasLicense: true,
    licenseFront: '/licenses/license1-front.jpg',
    licenseBack: '/licenses/license1-back.jpg',
    experience: '2 years',
    preferredZone: 'Koramangala, HSR Layout',
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'PA-002',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 12345',
    city: 'Bangalore',
    vehicleType: 'scooter',
    hasLicense: true,
    licenseFront: '/licenses/license2-front.jpg',
    licenseBack: '/licenses/license2-back.jpg',
    experience: '1 year',
    preferredZone: 'Whitefield, Marathahalli',
    status: 'approved',
    submittedAt: '2024-01-14T14:20:00Z',
    reviewedAt: '2024-01-15T09:00:00Z',
    reviewedBy: 'Admin',
  },
  {
    id: 'PA-003',
    fullName: 'Amit Patel',
    email: 'amit.p@email.com',
    phone: '+91 87654 32109',
    city: 'Hyderabad',
    vehicleType: 'bike',
    hasLicense: false,
    licenseFront: null,
    licenseBack: null,
    experience: 'Fresh',
    preferredZone: 'Madhapur, Gachibowli',
    status: 'rejected',
    submittedAt: '2024-01-13T11:45:00Z',
    reviewedAt: '2024-01-14T16:30:00Z',
    reviewedBy: 'Manager',
    notes: 'License not provided',
  },
];

const STATUS_CONFIG = {
  pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' },
  approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Approved' },
  rejected: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle, label: 'Rejected' },
  under_review: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye, label: 'Under Review' },
};

const VEHICLE_ICONS = {
  bike: Bike,
  scooter: Bike,
  bicycle: Bike,
};

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>(MOCK_APPLICATIONS);
  const [filteredApps, setFilteredApps] = useState<PartnerApplication[]>(MOCK_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter applications
  useEffect(() => {
    let filtered = applications;
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.includes(searchQuery) ||
        app.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    setFilteredApps(filtered);
  }, [searchQuery, statusFilter, applications]);

  const handleStatusChange = async (appId: string, newStatus: 'approved' | 'rejected' | 'under_review') => {
    setActionLoading(appId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { 
            ...app, 
            status: newStatus, 
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Current Admin',
            notes: notes || app.notes
          }
        : app
    ));
    
    setActionLoading(null);
    setShowNotesModal(false);
    setNotes('');
    
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3c28]">Partner Applications</h1>
            <p className="text-[#5c3d1f]">Manage delivery partner applications and onboarding</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applications', value: stats.total, icon: Users, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'from-amber-500 to-amber-600' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-rose-500 to-rose-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 border border-[#dbc4a4]/30 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5c3d1f] mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-[#1a3c28]">{stat.value}</p>
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
              placeholder="Search by name, email, phone, or city..."
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
              className="px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Applications Table */}
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Vehicle & Experience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Documents</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Submitted</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbc4a4]/20">
              {filteredApps.map((app, index) => {
                const StatusIcon = STATUS_CONFIG[app.status].icon;
                const VehicleIcon = VEHICLE_ICONS[app.vehicleType];
                
                return (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#faf9f6] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-lg flex items-center justify-center text-white font-semibold">
                          {app.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a3c28]">{app.fullName}</p>
                          <p className="text-xs text-[#5c3d1f]">{app.city}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3.5 h-3.5 text-[#8b6914]" />
                          <span className="text-[#3d2914]">{app.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3.5 h-3.5 text-[#8b6914]" />
                          <span className="text-[#3d2914]">{app.phone}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <VehicleIcon className="w-4 h-4 text-[#8b6914]" />
                          <span className="text-sm text-[#3d2914] capitalize">{app.vehicleType}</span>
                        </div>
                        <p className="text-xs text-[#5c3d1f]">{app.experience} experience</p>
                        <p className="text-xs text-[#8b6914]">{app.preferredZone}</p>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {app.hasLicense && app.licenseFront ? (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm text-[#3d2914]">License Uploaded</span>
                            <button
                              onClick={() => { setSelectedApp(app); setShowDetailModal(true); }}
                              className="text-[#8b6914] hover:text-[#5c3d1f] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">No License</span>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        STATUS_CONFIG[app.status].color
                      )}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {STATUS_CONFIG[app.status].label}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(app.submittedAt)}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => { setSelectedApp(app); setShowNotesModal(true); }}
                              disabled={actionLoading === app.id}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'rejected')}
                              disabled={actionLoading === app.id}
                              className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { setSelectedApp(app); setShowDetailModal(true); }}
                          className="p-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#c49a6c] mx-auto mb-3" />
            <p className="text-[#5c3d1f] font-medium">No applications found</p>
            <p className="text-sm text-[#8b6914]">Try adjusting your filters</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {selectedApp.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3c28]">{selectedApp.fullName}</h3>
                  <p className="text-sm text-[#5c3d1f]">Application #{selectedApp.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={cn(
                "p-4 rounded-xl border",
                STATUS_CONFIG[selectedApp.status].color
              )}>
                <div className="flex items-center gap-3">
                  {React.createElement(STATUS_CONFIG[selectedApp.status].icon, { className: "w-5 h-5" })}
                  <div>
                    <p className="font-semibold">Status: {STATUS_CONFIG[selectedApp.status].label}</p>
                    {selectedApp.reviewedAt && (
                      <p className="text-sm opacity-80">
                        Reviewed on {formatDate(selectedApp.reviewedAt)} by {selectedApp.reviewedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#8b6914]" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-[#3d2914]">{selectedApp.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-[#3d2914]">{selectedApp.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-[#3d2914]">{selectedApp.city}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <Bike className="w-4 h-4 text-[#8b6914]" />
                    Vehicle & Work
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#5c3d1f]">Vehicle:</span>
                      <span className="text-[#3d2914] capitalize font-medium">{selectedApp.vehicleType}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#5c3d1f]">Experience:</span>
                      <span className="text-[#3d2914] font-medium">{selectedApp.experience}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#5c3d1f]">Preferred Zone:</span>
                      <span className="text-[#3d2914] font-medium">{selectedApp.preferredZone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* License Documents */}
              {selectedApp.hasLicense && selectedApp.licenseFront && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8b6914]" />
                    License Documents
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-[#dbc4a4]/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-[#5c3d1f] mb-2">Front Side</p>
                      <div className="aspect-video bg-[#f0ebe3] rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-[#c49a6c] mx-auto mb-2" />
                          <button className="text-sm text-[#8b6914] hover:text-[#5c3d1f] flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View Document
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="border border-[#dbc4a4]/50 rounded-xl p-4">
                      <p className="text-sm font-medium text-[#5c3d1f] mb-2">Back Side</p>
                      <div className="aspect-video bg-[#f0ebe3] rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-[#c49a6c] mx-auto mb-2" />
                          <button className="text-sm text-[#8b6914] hover:text-[#5c3d1f] flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            View Document
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedApp.notes && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">Review Notes</h4>
                  <p className="text-amber-700">{selectedApp.notes}</p>
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                  <button
                    onClick={() => { setShowDetailModal(false); setShowNotesModal(true); }}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    disabled={actionLoading === selectedApp.id}
                    className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30">
              <h3 className="text-xl font-bold text-[#1a3c28]">Approve Application</h3>
              <p className="text-sm text-[#5c3d1f]">Add optional notes before approving {selectedApp.fullName}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowNotesModal(false); setNotes(''); }}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                  disabled={actionLoading === selectedApp.id}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading === selectedApp.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Approve
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

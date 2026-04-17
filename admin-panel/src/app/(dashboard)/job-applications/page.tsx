'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Star,
  Trash2,
  User,
  GraduationCap,
  Award,
  Building2,
  ChevronDown,
  ArrowUpDown,
  AlertCircle,
  Users,
  TrendingUp,
  Clock3,
  CheckCircle2,
  X,
  Globe,
  Link
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface JobApplication {
  id: string;
  jobTitle: string;
  jobId: string;
  department: string;
  applicantName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  currentCompany?: string;
  currentSalary?: string;
  expectedSalary?: string;
  education: string;
  skills: string[];
  resumeUrl: string | null;
  coverLetter?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  rating?: number; // 1-5 stars
}

// Mock data
const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: 'JA-001',
    jobTitle: 'Senior React Developer',
    jobId: 'JOB-001',
    department: 'Engineering',
    applicantName: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bangalore',
    experience: '5 years',
    currentCompany: 'Tech Solutions Pvt Ltd',
    currentSalary: '12 LPA',
    expectedSalary: '18-20 LPA',
    education: 'B.Tech in Computer Science',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS'],
    resumeUrl: '/resumes/resume1.pdf',
    coverLetter: 'I am excited to apply for this position...',
    portfolioUrl: 'https://rahul.dev',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma',
    status: 'shortlisted',
    appliedAt: '2024-01-15T10:30:00Z',
    reviewedAt: '2024-01-16T14:20:00Z',
    reviewedBy: 'HR Manager',
    notes: 'Strong technical background. Good communication skills.',
    rating: 4,
  },
  {
    id: 'JA-002',
    jobTitle: 'Product Manager',
    jobId: 'JOB-002',
    department: 'Product',
    applicantName: 'Priya Patel',
    email: 'priya.patel@email.com',
    phone: '+91 98765 12345',
    location: 'Mumbai',
    experience: '3 years',
    currentCompany: 'StartupX',
    currentSalary: '10 LPA',
    expectedSalary: '15 LPA',
    education: 'MBA in Product Management',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
    resumeUrl: '/resumes/resume2.pdf',
    status: 'interview',
    appliedAt: '2024-01-14T09:15:00Z',
    reviewedAt: '2024-01-15T11:00:00Z',
    reviewedBy: 'Product Lead',
    notes: 'Scheduled for technical interview on Jan 20.',
    rating: 5,
  },
  {
    id: 'JA-003',
    jobTitle: 'UI/UX Designer',
    jobId: 'JOB-003',
    department: 'Design',
    applicantName: 'Amit Kumar',
    email: 'amit.kumar@email.com',
    phone: '+91 87654 32109',
    location: 'Delhi',
    experience: '2 years',
    education: 'BFA in Graphic Design',
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
    resumeUrl: '/resumes/resume3.pdf',
    portfolioUrl: 'https://amitdesigns.com',
    status: 'new',
    appliedAt: '2024-01-17T16:45:00Z',
  },
  {
    id: 'JA-004',
    jobTitle: 'Delivery Partner',
    jobId: 'JOB-004',
    department: 'Operations',
    applicantName: 'Suresh Yadav',
    email: 'suresh.y@email.com',
    phone: '+91 76543 21098',
    location: 'Bangalore',
    experience: '3 years',
    education: '12th Pass',
    skills: ['Two-wheeler driving', 'Local area knowledge', 'Hindi/English/Kannada'],
    resumeUrl: null,
    status: 'rejected',
    appliedAt: '2024-01-10T08:30:00Z',
    reviewedAt: '2024-01-12T10:00:00Z',
    reviewedBy: 'Operations Manager',
    notes: 'Location not suitable for current requirements.',
  },
  {
    id: 'JA-005',
    jobTitle: 'Marketing Executive',
    jobId: 'JOB-005',
    department: 'Marketing',
    applicantName: 'Neha Gupta',
    email: 'neha.gupta@email.com',
    phone: '+91 98765 67890',
    location: 'Bangalore',
    experience: '1 year',
    currentCompany: 'Digital Agency',
    education: 'MBA in Marketing',
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Content Writing'],
    resumeUrl: '/resumes/resume5.pdf',
    status: 'reviewed',
    appliedAt: '2024-01-16T13:20:00Z',
    reviewedAt: '2024-01-17T09:30:00Z',
    reviewedBy: 'Marketing Head',
    rating: 3,
  },
];

const STATUS_CONFIG = {
  new: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock3, label: 'New' },
  reviewed: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Eye, label: 'Reviewed' },
  shortlisted: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Star, label: 'Shortlisted' },
  interview: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Users, label: 'Interview' },
  offer: { color: 'bg-violet-100 text-violet-700 border-violet-200', icon: Award, label: 'Offer' },
  hired: { color: 'bg-teal-100 text-teal-700 border-teal-200', icon: CheckCircle2, label: 'Hired' },
  rejected: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle, label: 'Rejected' },
};

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Operations', 'Marketing', 'Sales', 'HR', 'Finance'];

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>(MOCK_APPLICATIONS);
  const [filteredApps, setFilteredApps] = useState<JobApplication[]>(MOCK_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [experienceFilter, setExperienceFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState<'applied' | 'name' | 'rating'>('applied');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter and sort applications
  useEffect(() => {
    let filtered = [...applications];
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(app => app.department === departmentFilter);
    }
    
    if (experienceFilter !== 'all') {
      filtered = filtered.filter(app => {
        const years = parseInt(app.experience);
        switch (experienceFilter) {
          case 'fresher': return years === 0;
          case '1-3': return years >= 1 && years <= 3;
          case '3-5': return years >= 3 && years <= 5;
          case '5+': return years > 5;
          default: return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'applied':
          comparison = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
          break;
        case 'name':
          comparison = a.applicantName.localeCompare(b.applicantName);
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredApps(filtered);
  }, [searchQuery, statusFilter, departmentFilter, experienceFilter, applications, sortBy, sortOrder]);

  const handleStatusChange = async (appId: string, newStatus: JobApplication['status']) => {
    setActionLoading(appId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? { 
            ...app, 
            status: newStatus,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'Current Admin',
            notes: notes || app.notes,
            rating: rating || app.rating
          }
        : app
    ));
    
    setActionLoading(null);
    setShowStatusModal(false);
    setShowNotesModal(false);
    setNotes('');
    setRating(0);
    
    if (selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    setActionLoading(appId);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setApplications(prev => prev.filter(app => app.id !== appId));
    setActionLoading(null);
  };

  const openStatusModal = (app: JobApplication, status: JobApplication['status']) => {
    setSelectedApp(app);
    setNotes(app.notes || '');
    setRating(app.rating || 0);
    setShowStatusModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysSinceApplied = (dateString: string) => {
    const applied = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
    return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${diff} days ago`;
  };

  const stats = {
    total: applications.length,
    new: applications.filter(a => a.status === 'new').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview: applications.filter(a => a.status === 'interview').length,
    hired: applications.filter(a => a.status === 'hired').length,
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
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a3c28]">Job Applications</h1>
            <p className="text-[#5c3d1f]">Manage career applications and hiring pipeline</p>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Users, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'New', value: stats.new, icon: Clock3, color: 'from-blue-500 to-blue-600' },
          { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Interview', value: stats.interview, icon: Users, color: 'from-amber-500 to-amber-600' },
          { label: 'Hired', value: stats.hired, icon: CheckCircle, color: 'from-teal-500 to-teal-600' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'from-rose-500 to-rose-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStatusFilter(stat.label.toLowerCase() === 'total' ? 'all' : stat.label.toLowerCase())}
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
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b6914]" />
            <input
              type="text"
              placeholder="Search applicants, jobs, skills..."
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
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Experience</option>
            <option value="fresher">Fresher</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
            <option value="5+">5+ Years</option>
          </select>

          <div className="flex items-center gap-2 border-l border-[#dbc4a4]/30 pl-4">
            <ArrowUpDown className="w-4 h-4 text-[#8b6914]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            >
              <option value="applied">Applied Date</option>
              <option value="name">Applicant Name</option>
              <option value="rating">Rating</option>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Job Position</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Experience & Skills</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Applied</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#5c3d1f] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbc4a4]/20">
              {filteredApps.map((app, index) => {
                const StatusIcon = STATUS_CONFIG[app.status].icon;
                
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
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center text-white font-semibold">
                          {app.applicantName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a3c28]">{app.applicantName}</p>
                          <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{app.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-[#1a3c28]">{app.jobTitle}</p>
                        <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                          <Building2 className="w-3 h-3" />
                          <span>{app.department}</span>
                          <span className="text-[#dbc4a4]">|</span>
                          <span className="text-xs">{app.jobId}</span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-[#8b6914]" />
                          <span className="text-sm text-[#3d2914]">{app.experience}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {app.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#f0e6d3] text-[#5c3d1f] text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                          {app.skills.length > 3 && (
                            <span className="px-2 py-0.5 text-[#8b6914] text-xs">
                              +{app.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                        <MapPin className="w-3.5 h-3.5 text-[#8b6914]" />
                        {app.location}
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      {app.rating ? (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < app.rating! ? "text-amber-500 fill-amber-500" : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-[#8b6914]">Not rated</span>
                      )}
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
                      <div className="text-sm text-[#5c3d1f]">
                        <p>{formatDate(app.appliedAt)}</p>
                        <p className="text-xs text-[#8b6914]">{getDaysSinceApplied(app.appliedAt)}</p>
                      </div>
                    </td>
                    
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {app.status === 'new' && (
                          <>
                            <button
                              onClick={() => openStatusModal(app, 'shortlisted')}
                              disabled={actionLoading === app.id}
                              className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                              title="Shortlist"
                            >
                              <Star className="w-4 h-4" />
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
                        {app.status === 'shortlisted' && (
                          <button
                            onClick={() => openStatusModal(app, 'interview')}
                            disabled={actionLoading === app.id}
                            className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                            title="Move to Interview"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                        )}
                        {app.status === 'interview' && (
                          <>
                            <button
                              onClick={() => openStatusModal(app, 'offer')}
                              disabled={actionLoading === app.id}
                              className="p-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                              title="Send Offer"
                            >
                              <Award className="w-4 h-4" />
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
                        {app.status === 'offer' && (
                          <button
                            onClick={() => openStatusModal(app, 'hired')}
                            disabled={actionLoading === app.id}
                            className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                            title="Hire"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedApp(app); setShowDetailModal(true); }}
                          className="p-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={actionLoading === app.id}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-[#c49a6c] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1a3c28] mb-2">No applications found</h3>
            <p className="text-[#5c3d1f]">Try adjusting your filters</p>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      {showDetailModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {selectedApp.applicantName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1a3c28]">{selectedApp.applicantName}</h3>
                  <p className="text-sm text-[#5c3d1f]">Application #{selectedApp.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border",
                  STATUS_CONFIG[selectedApp.status].color
                )}>
                  {React.createElement(STATUS_CONFIG[selectedApp.status].icon, { className: "w-4 h-4" })}
                  {STATUS_CONFIG[selectedApp.status].label}
                </span>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5 text-[#5c3d1f]" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="bg-[#faf9f6] rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-[#5c3d1f] mb-2">
                  <Briefcase className="w-4 h-4 text-[#8b6914]" />
                  Applied for
                </div>
                <h4 className="text-lg font-bold text-[#1a3c28]">{selectedApp.jobTitle}</h4>
                <div className="flex items-center gap-3 text-sm text-[#5c3d1f] mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {selectedApp.department}
                  </span>
                  <span className="text-[#dbc4a4]">|</span>
                  <span>{selectedApp.jobId}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#8b6914]" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedApp.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedApp.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedApp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#1a3c28] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#8b6914]" />
                    Professional Background
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedApp.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-[#8b6914]" />
                      <span className="text-sm text-[#3d2914]">{selectedApp.education}</span>
                    </div>
                    {selectedApp.currentCompany && (
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-[#8b6914]" />
                        <span className="text-sm text-[#3d2914]">Currently at {selectedApp.currentCompany}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Salary Info */}
              {(selectedApp.currentSalary || selectedApp.expectedSalary) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedApp.currentSalary && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-[#5c3d1f] mb-1">Current Salary</p>
                      <p className="text-lg font-bold text-[#1a3c28]">{selectedApp.currentSalary}</p>
                    </div>
                  )}
                  {selectedApp.expectedSalary && (
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-emerald-700 mb-1">Expected Salary</p>
                      <p className="text-lg font-bold text-emerald-800">{selectedApp.expectedSalary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              <div>
                <h4 className="font-semibold text-[#1a3c28] mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#f0e6d3] text-[#5c3d1f] text-sm rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <h4 className="font-semibold text-[#1a3c28] mb-3">Cover Letter</h4>
                  <div className="bg-[#faf9f6] rounded-xl p-4 text-sm text-[#3d2914]">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {selectedApp.resumeUrl && (
                  <a
                    href={selectedApp.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Resume
                  </a>
                )}
                {selectedApp.portfolioUrl && (
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
                {selectedApp.linkedinUrl && (
                  <a
                    href={selectedApp.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg hover:bg-[#e8dcc8] transition-colors"
                  >
                    <Link className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>

              {/* Rating & Notes */}
              {(selectedApp.rating || selectedApp.notes) && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-800 mb-2">Review Notes</h4>
                  {selectedApp.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5",
                            i < selectedApp.rating! ? "text-amber-500 fill-amber-500" : "text-amber-300"
                          )}
                        />
                      ))}
                      <span className="ml-2 text-sm text-amber-700">({selectedApp.rating}/5)</span>
                    </div>
                  )}
                  {selectedApp.notes && (
                    <p className="text-amber-700 text-sm">{selectedApp.notes}</p>
                  )}
                  {selectedApp.reviewedAt && (
                    <p className="text-xs text-amber-600 mt-2">
                      Reviewed on {formatDateTime(selectedApp.reviewedAt)} by {selectedApp.reviewedBy}
                    </p>
                  )}
                </div>
              )}

              {/* Application Timeline */}
              <div className="border-t border-[#dbc4a4]/30 pt-4">
                <h4 className="font-semibold text-[#1a3c28] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8b6914]" />
                  Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[#5c3d1f]">Applied on {formatDateTime(selectedApp.appliedAt)}</span>
                  </div>
                  {selectedApp.reviewedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-[#5c3d1f]">Reviewed on {formatDateTime(selectedApp.reviewedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                {selectedApp.status !== 'hired' && selectedApp.status !== 'rejected' && (
                  <>
                    {selectedApp.status === 'new' && (
                      <>
                        <button
                          onClick={() => { setShowDetailModal(false); openStatusModal(selectedApp, 'shortlisted'); }}
                          className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Star className="w-5 h-5" />
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                          className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </>
                    )}
                    {selectedApp.status === 'shortlisted' && (
                      <button
                        onClick={() => { setShowDetailModal(false); openStatusModal(selectedApp, 'interview'); }}
                        className="flex-1 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Users className="w-5 h-5" />
                        Schedule Interview
                      </button>
                    )}
                    {selectedApp.status === 'interview' && (
                      <>
                        <button
                          onClick={() => { setShowDetailModal(false); openStatusModal(selectedApp, 'offer'); }}
                          className="flex-1 py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Award className="w-5 h-5" />
                          Send Offer
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                          className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </>
                    )}
                    {selectedApp.status === 'offer' && (
                      <button
                        onClick={() => { setShowDetailModal(false); openStatusModal(selectedApp, 'hired'); }}
                        className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Hire Candidate
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Status Update Modal with Rating & Notes */}
      {showStatusModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30">
              <h3 className="text-xl font-bold text-[#1a3c28]">Update Application Status</h3>
              <p className="text-sm text-[#5c3d1f]">Moving {selectedApp.applicantName} to next stage</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                  Rate Candidate (Optional)
                </label>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8",
                          i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300 hover:text-amber-300"
                        )}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-[#5c3d1f]">({rating}/5)</span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowStatusModal(false); setNotes(''); setRating(0); }}
                  className="flex-1 py-3 border border-[#dbc4a4] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Determine next status based on current
                    let nextStatus: JobApplication['status'] = 'reviewed';
                    if (selectedApp.status === 'new') nextStatus = 'shortlisted';
                    else if (selectedApp.status === 'shortlisted') nextStatus = 'interview';
                    else if (selectedApp.status === 'interview') nextStatus = 'offer';
                    else if (selectedApp.status === 'offer') nextStatus = 'hired';
                    handleStatusChange(selectedApp.id, nextStatus);
                  }}
                  disabled={actionLoading === selectedApp.id}
                  className="flex-1 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  {actionLoading === selectedApp.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Confirm Update
                    </span>
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


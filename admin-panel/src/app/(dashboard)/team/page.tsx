"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Star,
  Shield,
  User,
  X,
  Award,
  GraduationCap,
  Globe,
  RefreshCcw,
  Wifi,
  WifiOff,
  Link2,
  Target,
  TrendingUp,
  Zap,
  Crown,
  Clock,
  Building2,
  AtSign,
  Palette,
  Layers,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  designation: string;
  bio: string;
  avatar?: string;
  location: string;
  joinedAt: string;
  isActive: boolean;
  isPublic: boolean;
  employeeId: string;
  joiningDate: string;
  reportsTo?: string;
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  skills: string[];
  achievements: string[];
  projects: string[];
  certifications: string[];
  displayOrder: number;
  lastActive?: string;
  performanceRating?: number;
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  departments: number;
  publicProfiles: number;
  newThisMonth: number;
  avgTenure: number;
  leadershipCount: number;
  engineeringCount: number;
  operationsCount: number;
  topPerformers: number;
}

const FALLBACK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@fleish.com',
    phone: '+91 98765 43210',
    role: 'CEO & Founder',
    department: 'Leadership',
    designation: 'Chief Executive Officer',
    bio: 'Passionate about building the future of fresh meat delivery in India.',
    location: 'Mumbai, India',
    joinedAt: new Date(Date.now() - 86400000 * 365).toISOString(),
    joiningDate: '2022-01-15',
    isActive: true,
    isPublic: true,
    employeeId: 'FL001',
    employmentType: 'full_time',
    level: 'executive',
    reportsTo: 'Board',
    social: { linkedin: 'https://linkedin.com/in/rajesh', twitter: 'https://twitter.com/rajesh', website: 'https://rajesh.co' },
    skills: ['Leadership', 'Strategy', 'Operations', 'Fundraising'],
    achievements: ['Founded Fleish in 2022', 'Ex-Amazon', 'IIT Bombay Alumnus'],
    projects: ['Company Foundation', 'Series A Funding', 'Expansion Strategy'],
    certifications: ['PMP', 'Six Sigma Black Belt'],
    displayOrder: 1,
    lastActive: new Date().toISOString(),
    performanceRating: 5
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@fleish.com',
    phone: '+91 98765 43211',
    role: 'CTO',
    department: 'Engineering',
    designation: 'Chief Technology Officer',
    bio: 'Building scalable tech solutions for the meat industry.',
    location: 'Bangalore, India',
    joinedAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    joiningDate: '2023-03-20',
    isActive: true,
    isPublic: true,
    employeeId: 'FL002',
    employmentType: 'full_time',
    level: 'executive',
    reportsTo: 'Rajesh Kumar',
    social: { linkedin: 'https://linkedin.com/in/priya', github: 'https://github.com/priya' },
    skills: ['React', 'Node.js', 'System Design', 'AI/ML', 'Cloud Architecture'],
    achievements: ['Ex-Google', 'Patent holder', 'Built tech team from 2 to 50'],
    projects: ['Platform Migration', 'AI Recommendation Engine', 'Mobile App'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    displayOrder: 2,
    lastActive: new Date().toISOString(),
    performanceRating: 5
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@fleish.com',
    phone: '+91 98765 43212',
    role: 'Head of Operations',
    department: 'Operations',
    designation: 'VP Operations',
    bio: 'Ensuring smooth delivery operations across all cities.',
    location: 'Delhi, India',
    joinedAt: new Date(Date.now() - 86400000 * 250).toISOString(),
    joiningDate: '2023-06-10',
    isActive: true,
    isPublic: true,
    employeeId: 'FL003',
    employmentType: 'full_time',
    level: 'executive',
    reportsTo: 'Rajesh Kumar',
    social: { linkedin: 'https://linkedin.com/in/amit' },
    skills: ['Supply Chain', 'Logistics', 'Team Management', 'Process Optimization'],
    achievements: ['Reduced delivery time by 40%', 'Scaled to 10 cities'],
    projects: ['Delhi Launch', 'Cold Chain Setup', 'Vendor Onboarding'],
    certifications: ['Supply Chain Management', 'Lean Six Sigma'],
    displayOrder: 3,
    lastActive: new Date().toISOString(),
    performanceRating: 4.8
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    email: 'sneha@fleish.com',
    phone: '+91 98765 43213',
    role: 'Product Manager',
    department: 'Product',
    designation: 'Senior Product Manager',
    bio: 'Creating delightful experiences for our customers.',
    location: 'Mumbai, India',
    joinedAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    joiningDate: '2023-09-01',
    isActive: true,
    isPublic: false,
    employeeId: 'FL004',
    employmentType: 'full_time',
    level: 'senior',
    reportsTo: 'Rajesh Kumar',
    social: {},
    skills: ['Product Strategy', 'UX Research', 'Analytics', 'Agile'],
    achievements: ['Launched mobile app', 'Increased conversion by 25%'],
    projects: ['Mobile App Launch', 'Checkout Redesign', 'Customer Dashboard'],
    certifications: ['Product Management', 'Google Analytics'],
    displayOrder: 4,
    lastActive: new Date().toISOString(),
    performanceRating: 4.5
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram@fleish.com',
    phone: '+91 98765 43214',
    role: 'Senior Developer',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    bio: 'Full-stack developer passionate about clean code.',
    location: 'Bangalore, India',
    joinedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    joiningDate: '2024-01-15',
    isActive: true,
    isPublic: false,
    employeeId: 'FL005',
    employmentType: 'full_time',
    level: 'senior',
    reportsTo: 'Priya Sharma',
    social: { github: 'https://github.com/vikram' },
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    achievements: ['Top performer Q1 2024'],
    projects: ['API Development', 'Database Optimization'],
    certifications: ['MongoDB Certified'],
    displayOrder: 5,
    lastActive: new Date().toISOString(),
    performanceRating: 4.7
  }
];

const FALLBACK_STATS: TeamStats = {
  totalMembers: 24,
  activeMembers: 22,
  departments: 6,
  publicProfiles: 15,
  newThisMonth: 3,
  avgTenure: 1.5,
  leadershipCount: 4,
  engineeringCount: 8,
  operationsCount: 6,
  topPerformers: 5
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

const DEPARTMENTS = ['Leadership', 'Engineering', 'Product', 'Design', 'Operations', 'Marketing', 'Sales', 'HR', 'Finance'];

const ROLES = ['CEO', 'CTO', 'COO', 'VP', 'Head', 'Manager', 'Lead', 'Senior', 'Junior'];

const LEVELS = [
  { value: 'entry', label: 'Entry Level', color: 'bg-blue-100 text-blue-700' },
  { value: 'mid', label: 'Mid Level', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'senior', label: 'Senior Level', color: 'bg-violet-100 text-violet-700' },
  { value: 'lead', label: 'Lead', color: 'bg-amber-100 text-amber-700' },
  { value: 'executive', label: 'Executive', color: 'bg-[#2d5a42] text-white' }
];

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full Time', icon: <Clock className="w-4 h-4" /> },
  { value: 'part_time', label: 'Part Time', icon: <Clock className="w-4 h-4" /> },
  { value: 'contract', label: 'Contract', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'intern', label: 'Intern', icon: <GraduationCap className="w-4 h-4" /> }
];

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(FALLBACK_TEAM);
  const [stats, setStats] = useState<TeamStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [websiteConnected, setWebsiteConnected] = useState(true);
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: realtimeData } = useRealtime({
    table: 'team_members',
    enabled: useRealtimeData,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setTeam(FALLBACK_TEAM);
      setStats(FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveMember = (memberData: Partial<TeamMember>) => {
    if (editingMember) {
      setTeam(prev => prev.map(m => m.id === editingMember.id ? { ...m, ...memberData, updatedAt: new Date().toISOString() } : m));
    } else {
      const newMember: TeamMember = {
        ...(memberData as TeamMember),
        id: `new-${Date.now()}`,
        joinedAt: new Date().toISOString(),
        displayOrder: team.length + 1,
        lastActive: new Date().toISOString()
      };
      setTeam(prev => [...prev, newMember]);
    }
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    setTeam(prev => prev.filter(m => m.id !== id));
  };

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'makePublic' | 'makePrivate' | 'delete') => {
    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedItems.length} team members?`)) return;
    }
    setTeam(prev => {
      if (action === 'delete') {
        return prev.filter(m => !selectedItems.includes(m.id));
      }
      return prev.map(m => {
        if (selectedItems.includes(m.id)) {
          return {
            ...m,
            isActive: action === 'activate' ? true : action === 'deactivate' ? false : m.isActive,
            isPublic: action === 'makePublic' ? true : action === 'makePrivate' ? false : m.isPublic
          };
        }
        return m;
      });
    });
    setSelectedItems([]);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const exportData = () => {
    const data = filteredTeam.map(m => ({
      ID: m.id,
      Name: m.name,
      Email: m.email,
      Phone: m.phone,
      Role: m.role,
      Department: m.department,
      Level: m.level,
      EmployeeID: m.employeeId,
      Status: m.isActive ? 'Active' : 'Inactive',
      Public: m.isPublic ? 'Yes' : 'No',
      JoiningDate: m.joiningDate,
      Location: m.location
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredTeam = team.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d5a42]"></div>
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
                <Users className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Team Management
            </h1>
            {websiteConnected && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                <Globe className="w-3 h-3" />
                Website Connected
              </span>
            )}
          </div>
          <p className="text-[#5c3d1f] mt-2">
            Manage team members, profiles, and organizational structure
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
            onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Member
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
            <button onClick={() => handleBulkAction('activate')} className="px-4 py-2 bg-[#2d5a42] text-white rounded-lg text-sm font-semibold">
              Activate
            </button>
            <button onClick={() => handleBulkAction('deactivate')} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
              Deactivate
            </button>
            <button onClick={() => handleBulkAction('makePublic')} className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-semibold">
              Make Public
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
            <Users className="w-5 h-5 text-[#e8f5ed]" />
            <span className="text-xs text-[#e8f5ed]/70">Total</span>
          </div>
          <p className="text-2xl font-black">{stats.totalMembers}</p>
          <p className="text-xs text-[#e8f5ed]/70 mt-1">Team Members</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Working</span>
          </div>
          <p className="text-2xl font-black">{stats.activeMembers}</p>
          <p className="text-xs text-white/70 mt-1">Active</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#e8f5ed] to-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Depts</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{stats.departments}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Departments</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-violet-500 to-violet-600 p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Visible</span>
          </div>
          <p className="text-2xl font-black">{stats.publicProfiles}</p>
          <p className="text-xs text-white/70 mt-1">Public</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-[#8b6914]" />
            <span className="text-xs text-[#a67c52]">Avg</span>
          </div>
          <p className="text-2xl font-black text-[#8b6914]">{stats.avgTenure}y</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Tenure</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Crown className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Leaders</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.leadershipCount}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Executives</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-[#a67c52]">Stars</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.topPerformers}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Top Rated</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-[#a67c52] to-[#c49c72] p-4 rounded-2xl text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">New</span>
          </div>
          <p className="text-2xl font-black">{stats.newThisMonth}</p>
          <p className="text-xs text-white/70 mt-1">This Month</p>
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
            placeholder="Search team members by name, email, role..."
            className="w-full pl-12 pr-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Building2 className="w-4 h-4 text-[#a67c52]" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Layers className="w-4 h-4 text-[#a67c52]" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Levels</option>
              {LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
            <Shield className="w-4 h-4 text-[#a67c52]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-[#f0e6d3] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? 'bg-white text-[#2d5a42] shadow-sm' : 'text-[#5c3d1f] hover:bg-white/50'
              )}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? 'bg-white text-[#2d5a42] shadow-sm' : 'text-[#5c3d1f] hover:bg-white/50'
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

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTeam.map((member, index) => {
          const levelConfig = LEVELS.find(l => l.value === member.level) || LEVELS[0];
          const isSelected = selectedItems.includes(member.id);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(45, 90, 66, 0.2)' }}
              className={cn(
                "bg-white rounded-2xl border overflow-hidden shadow-sm",
                isSelected ? 'border-[#2d5a42] ring-2 ring-[#2d5a42]/20' : 'border-[#dbc4a4]'
              )}
            >
              <div className="p-6">
                {/* Header with checkbox and avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelection(member.id)}
                      className="w-4 h-4 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                    />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-xl">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn("px-2 py-1 rounded-full text-xs font-bold", levelConfig.color)}>
                      {levelConfig.label}
                    </span>
                    <div className="flex gap-1">
                      {member.isPublic && (
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-xs font-bold">
                          <Star className="w-3 h-3 inline mr-1" />
                          Public
                        </span>
                      )}
                      {!member.isActive && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="font-bold text-[#1a3c28] text-lg">{member.name}</h3>
                <p className="text-sm text-[#2d5a42] font-semibold mb-1">{member.role}</p>
                <p className="text-xs text-[#a67c52] mb-3">{member.designation}</p>
                
                {/* Department Badge */}
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg text-xs font-bold mb-3">
                  <Briefcase className="w-3 h-3" />
                  {member.department}
                </span>

                {/* Bio */}
                <p className="text-sm text-[#5c3d1f] line-clamp-2 mb-4 leading-relaxed">
                  {member.bio}
                </p>

                {/* Employee ID & Join Date */}
                <div className="flex items-center gap-3 text-xs text-[#a67c52] mb-4">
                  <span className="px-2 py-1 bg-[#e8f5ed] rounded">ID: {member.employeeId}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(member.joiningDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-[#5c3d1f] mb-4">
                  <MapPin className="w-4 h-4 text-[#a67c52]" />
                  {member.location}
                </div>

                {/* Skills */}
                {member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#e8f5ed] text-[#2d5a42] rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {member.skills.length > 3 && (
                      <span className="px-2 py-0.5 text-[#a67c52] text-xs">+{member.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Performance Rating */}
                {member.performanceRating && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-[#f0e6d3] rounded-lg">
                    <Award className="w-4 h-4 text-[#8b6914]" />
                    <span className="text-sm font-bold text-[#8b6914]">{member.performanceRating}/5</span>
                    <span className="text-xs text-[#5c3d1f]">Performance</span>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex gap-1 mb-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" 
                      className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                      title="LinkedIn"
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" 
                      className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                      title="Twitter"
                    >
                      <TwitterIcon />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" 
                      className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                      title="GitHub"
                    >
                      <GithubIcon />
                    </a>
                  )}
                  {member.social.website && (
                    <a href={member.social.website} target="_blank" rel="noopener noreferrer" 
                      className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                      title="Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-1 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-[#5c3d1f]">
                    <Mail className="w-4 h-4 text-[#a67c52]" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5c3d1f]">
                    <Phone className="w-4 h-4 text-[#a67c52]" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                {/* Employment Type */}
                <div className="mb-4">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold",
                    member.employmentType === 'full_time' ? 'bg-emerald-100 text-emerald-700' :
                    member.employmentType === 'part_time' ? 'bg-blue-100 text-blue-700' :
                    member.employmentType === 'contract' ? 'bg-amber-100 text-amber-700' :
                    'bg-violet-100 text-violet-700'
                  )}>
                    {EMPLOYMENT_TYPES.find(t => t.value === member.employmentType)?.icon}
                    {EMPLOYMENT_TYPES.find(t => t.value === member.employmentType)?.label}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-[#f0e6d3]">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedMember(member); setIsDetailModalOpen(true); }}
                    className="flex-1 px-3 py-2 text-sm bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditingMember(member); setIsModalOpen(true); }}
                    className="flex-1 px-3 py-2 text-sm bg-[#e8f5ed] text-[#2d5a42] rounded-xl font-semibold hover:bg-[#f0e6d3] transition-all"
                  >
                    <Edit3 className="w-4 h-4 inline mr-1" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedMember && (
          <TeamMemberDetailModal 
            member={selectedMember} 
            onClose={() => { setIsDetailModalOpen(false); setSelectedMember(null); }}
          />
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TeamMemberFormModal
            initialData={editingMember}
            onSave={handleSaveMember}
            onCancel={() => { setIsModalOpen(false); setEditingMember(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon components
function LinkedinIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

// Modal Components
function TeamMemberDetailModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const levelConfig = LEVELS.find(l => l.value === member.level) || LEVELS[0];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl">
              {member.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#e8f5ed]">{member.name}</h2>
              <p className="text-[#e8f5ed]/80">{member.employeeId} • {member.designation}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#e8f5ed] rounded-2xl text-center">
              <span className={cn("inline-block px-3 py-1 rounded-full text-sm font-bold mb-2", levelConfig.color)}>
                {levelConfig.label}
              </span>
              <p className="text-xs text-[#5c3d1f]">Level</p>
            </div>
            <div className="p-4 bg-[#f0e6d3] rounded-2xl text-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f5ed] text-[#2d5a42] rounded-full text-sm font-bold">
                <Briefcase className="w-3 h-3" />
                {member.department}
              </span>
              <p className="text-xs text-[#5c3d1f] mt-1">Department</p>
            </div>
            <div className="p-4 bg-white border border-[#dbc4a4] rounded-2xl text-center">
              <span className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold",
                member.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              )}>
                {member.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {member.isActive ? 'Active' : 'Inactive'}
              </span>
              <p className="text-xs text-[#5c3d1f] mt-1">Status</p>
            </div>
            <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-center">
              <span className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold",
                member.isPublic ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-700'
              )}>
                <Star className="w-3 h-3" />
                {member.isPublic ? 'Public' : 'Private'}
              </span>
              <p className="text-xs text-[#5c3d1f] mt-1">Profile</p>
            </div>
          </div>

          {/* Bio */}
          <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
            <h3 className="font-bold text-[#1a3c28] mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#a67c52]" />
              Bio
            </h3>
            <p className="text-[#5c3d1f] leading-relaxed">{member.bio}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#a67c52]" />
                Contact
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <Mail className="w-4 h-4 text-[#a67c52]" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <Phone className="w-4 h-4 text-[#a67c52]" />
                  {member.phone}
                </div>
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <MapPin className="w-4 h-4 text-[#a67c52]" />
                  {member.location}
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#a67c52]" />
                Employment
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <span className="font-semibold">Employee ID:</span>
                  {member.employeeId}
                </div>
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <span className="font-semibold">Joined:</span>
                  {new Date(member.joiningDate).toLocaleDateString('en-IN')}
                </div>
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <span className="font-semibold">Reports to:</span>
                  {member.reportsTo}
                </div>
                <div className="flex items-center gap-2 text-[#5c3d1f]">
                  <span className="font-semibold">Type:</span>
                  {EMPLOYMENT_TYPES.find(t => t.value === member.employmentType)?.label}
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {member.skills.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#a67c52]" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#e8f5ed] text-[#2d5a42] rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {member.achievements.length > 0 && (
            <div className="p-4 bg-[#f0e6d3] rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#8b6914]" />
                Achievements
              </h3>
              <ul className="space-y-2">
                {member.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-center gap-2 text-[#5c3d1f]">
                    <Award className="w-4 h-4 text-[#8b6914]" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {member.certifications.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#a67c52]" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.certifications.map((cert, i) => (
                  <span key={i} className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {member.projects.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#a67c52]" />
                Projects
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.projects.map((project, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                    {project}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Performance */}
          {member.performanceRating && (
            <div className="p-4 bg-gradient-to-r from-[#f0e6d3] to-[#e8f5ed] rounded-2xl border border-[#dbc4a4]/30">
              <h3 className="font-bold text-[#1a3c28] mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#8b6914]" />
                Performance Rating
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-[#8b6914]">{member.performanceRating}</span>
                <span className="text-lg text-[#5c3d1f]">/ 5</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-6 h-6",
                        star <= member.performanceRating! ? "text-[#8b6914] fill-[#8b6914]" : "text-[#dbc4a4]"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
            <h3 className="font-bold text-[#1a3c28] mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#a67c52]" />
              Social Profiles
            </h3>
            <div className="flex gap-3">
              {member.social.linkedin && (
                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-xl"
                >
                  <LinkedinIcon />
                  LinkedIn
                </a>
              )}
              {member.social.twitter && (
                <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-xl"
                >
                  <TwitterIcon />
                  Twitter
                </a>
              )}
              {member.social.github && (
                <a href={member.social.github} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-[#333] text-white rounded-xl"
                >
                  <GithubIcon />
                  GitHub
                </a>
              )}
              {member.social.website && (
                <a href={member.social.website} target="_blank" rel="noopener noreferrer" 
                  className="flex items-center gap-2 px-4 py-2 bg-[#2d5a42] text-white rounded-xl"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TeamMemberFormModal({ initialData, onSave, onCancel }: {
  initialData: TeamMember | null;
  onSave: (data: Partial<TeamMember>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<TeamMember>>(initialData || {
    name: '',
    email: '',
    phone: '',
    role: '',
    department: 'Engineering',
    designation: '',
    bio: '',
    location: '',
    employeeId: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'full_time',
    level: 'mid',
    reportsTo: '',
    isActive: true,
    isPublic: false,
    social: {},
    skills: [],
    achievements: [],
    projects: [],
    certifications: []
  });

  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'social'>('basic');

  const addTag = (field: 'skills' | 'achievements' | 'projects' | 'certifications') => {
    if (tagInput.trim() && !formData[field]?.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (field: 'skills' | 'achievements' | 'projects' | 'certifications', tag: string) => {
    setFormData(prev => ({ ...prev, [field]: prev[field]?.filter(t => t !== tag) || [] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
              {initialData ? <Edit3 className="w-5 h-5 text-[#e8f5ed]" /> : <Plus className="w-5 h-5 text-[#e8f5ed]" />}
            </div>
            <h2 className="text-xl font-bold text-[#e8f5ed]">
              {initialData ? 'Edit Team Member' : 'Add New Team Member'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-[#f0e6d3]">
          {(['basic', 'professional', 'social'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab 
                  ? 'bg-[#2d5a42] text-[#e8f5ed]' 
                  : 'bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]'
              )}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          {activeTab === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Full Name *</label>
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
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] resize-none"
                  placeholder="Brief bio about the team member..."
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                  />
                  <span className="text-sm font-medium text-[#5c3d1f]">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="w-5 h-5 rounded border-[#dbc4a4] text-[#2d5a42] focus:ring-[#2d5a42]"
                  />
                  <span className="text-sm font-medium text-[#5c3d1f]">Public Profile</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'professional' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Joining Date *</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  >
                    {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as TeamMember['level'] })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  >
                    {LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                  </select>
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
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as TeamMember['employmentType'] })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                  >
                    {EMPLOYMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Reports To</label>
                  <input
                    type="text"
                    value={formData.reportsTo}
                    onChange={(e) => setFormData({ ...formData, reportsTo: e.target.value })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="Manager's name"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('skills'))}
                    className="flex-1 px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28]"
                    placeholder="Add a skill and press Enter"
                  />
                  <button type="button" onClick={() => addTag('skills')} className="px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill) => (
                    <span key={skill} className="flex items-center gap-1 px-3 py-1 bg-[#e8f5ed] text-[#2d5a42] rounded-full text-sm">
                      {skill}
                      <button type="button" onClick={() => removeTag('skills', skill)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'social' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.social?.linkedin || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, linkedin: e.target.value } })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Twitter URL</label>
                  <input
                    type="url"
                    value={formData.social?.twitter || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, twitter: e.target.value } })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.social?.github || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, github: e.target.value } })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Personal Website</label>
                  <input
                    type="url"
                    value={formData.social?.website || ''}
                    onChange={(e) => setFormData({ ...formData, social: { ...formData.social, website: e.target.value } })}
                    className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
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
              {initialData ? 'Save Changes' : 'Add Member'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

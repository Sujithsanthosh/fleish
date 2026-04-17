"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import {
  Briefcase,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  IndianRupee,
  Users,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  Building2,
  GraduationCap,
  X,
  RefreshCcw,
  Wifi,
  WifiOff,
  FileText,
  Phone,
  Mail,
  ExternalLink,
  Star,
  Award,
  Send,
  MessageSquare,
  History,
  Globe,
  HardHat,
  Laptop,
  Smartphone,
  ChevronDown,
  FilterX,
  Archive,
  Play,
  Pause,
  Ban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'internship';
  experience: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'draft' | 'published' | 'closed' | 'paused';
  applications: number;
  views: number;
  publishedAt?: string;
  closesAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface ApplicantActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  notes?: string;
}

interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter?: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  experience: string;
  currentCompany?: string;
  currentRole?: string;
  education: string;
  skills: string[];
  expectedSalary: number;
  noticePeriod: string;
  appliedAt: string;
  notes: string;
  rating: number;
  activityLog: ApplicantActivity[];
  source: string;
}

interface CareerStats {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  draftJobs: number;
  totalApplications: number;
  newApplications: number;
  inReview: number;
  interviewed: number;
  offered: number;
  hiredThisMonth: number;
  rejected: number;
  avgTimeToHire: number;
  conversionRate: number;
}

const FALLBACK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Mumbai, India',
    type: 'full_time',
    experience: '3-5 years',
    salary: { min: 800000, max: 1500000, currency: 'INR', period: 'yearly' },
    description: 'We are looking for an experienced React developer to join our growing engineering team.',
    requirements: ['3+ years React experience', 'TypeScript proficiency', 'Next.js experience', 'Node.js knowledge'],
    responsibilities: ['Build scalable web applications', 'Code reviews', 'Mentor junior developers', 'Architecture decisions'],
    benefits: ['Health insurance', 'Flexible working hours', 'Remote work options', 'Learning budget'],
    status: 'published',
    applications: 45,
    views: 1250,
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    closesAt: new Date(Date.now() + 86400000 * 23).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdBy: 'HR Manager'
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Bangalore, India',
    type: 'full_time',
    experience: '5-8 years',
    salary: { min: 1500000, max: 2500000, currency: 'INR', period: 'yearly' },
    description: 'Lead product strategy and execution for our core marketplace platform.',
    requirements: ['5+ years PM experience', 'B2C marketplace experience', 'Data-driven decision making', 'Agile methodologies'],
    responsibilities: ['Product roadmap', 'User research', 'Stakeholder management', 'Feature prioritization'],
    benefits: ['Health insurance', 'Stock options', 'Annual bonus', 'Conference budget'],
    status: 'published',
    applications: 28,
    views: 890,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    closesAt: new Date(Date.now() + 86400000 * 25).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdBy: 'HR Manager'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'full_time',
    experience: '2-4 years',
    salary: { min: 600000, max: 1200000, currency: 'INR', period: 'yearly' },
    description: 'Create beautiful, intuitive user experiences for our web and mobile applications.',
    requirements: ['Portfolio of work', 'Figma expertise', 'Mobile design experience', 'Design systems knowledge'],
    responsibilities: ['UI design', 'UX research', 'Prototyping', 'Design system maintenance'],
    benefits: ['Health insurance', 'Remote work', 'Design tools subscription', 'Creative budget'],
    status: 'published',
    applications: 52,
    views: 2100,
    publishedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    closesAt: new Date(Date.now() + 86400000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'HR Manager'
  }
];

const FALLBACK_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    applicantName: 'Rohit Kumar',
    email: 'rohit@example.com',
    phone: '+91 98765 43210',
    resume: 'rohit_kumar_resume.pdf',
    coverLetter: 'I am excited about this opportunity and believe my experience in React and TypeScript makes me a strong fit for this role.',
    status: 'interview',
    experience: '4 years',
    currentCompany: 'TechCorp',
    currentRole: 'Frontend Developer',
    education: 'B.Tech in Computer Science',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'GraphQL'],
    expectedSalary: 1200000,
    noticePeriod: '30 days',
    appliedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    notes: 'Strong technical skills, good communication',
    rating: 4,
    source: 'Website',
    activityLog: [
      { id: 'act1', action: 'Application Received', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'System' },
      { id: 'act2', action: 'Resume Screened', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'HR Manager', notes: 'Good fit for role' },
      { id: 'act3', action: 'Interview Scheduled', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), user: 'HR Manager', notes: 'Technical round on Friday' }
    ]
  },
  {
    id: 'app_2',
    jobId: '1',
    jobTitle: 'Senior React Developer',
    applicantName: 'Anita Sharma',
    email: 'anita@example.com',
    phone: '+91 98765 43211',
    resume: 'anita_sharma_resume.pdf',
    coverLetter: 'Looking forward to contributing to your team with my expertise in frontend development.',
    status: 'new',
    experience: '3 years',
    currentCompany: 'StartupXYZ',
    currentRole: 'Junior Developer',
    education: 'B.E. in Information Technology',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
    expectedSalary: 1100000,
    noticePeriod: '60 days',
    appliedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: '',
    rating: 0,
    source: 'LinkedIn',
    activityLog: [
      { id: 'act4', action: 'Application Received', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), user: 'System' }
    ]
  },
  {
    id: 'app_3',
    jobId: '2',
    jobTitle: 'Product Manager',
    applicantName: 'Vikram Patel',
    email: 'vikram@example.com',
    phone: '+91 98765 43212',
    resume: 'vikram_patel_resume.pdf',
    coverLetter: 'With 6 years of PM experience in marketplace products, I can drive significant value for your platform.',
    status: 'screening',
    experience: '6 years',
    currentCompany: 'Ecommerce Giant',
    currentRole: 'Associate PM',
    education: 'MBA, IIT Bombay',
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Roadmapping'],
    expectedSalary: 2000000,
    noticePeriod: '90 days',
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    notes: 'Impressive background',
    rating: 5,
    source: 'Website',
    activityLog: [
      { id: 'act5', action: 'Application Received', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user: 'System' },
      { id: 'act6', action: 'Resume Screened', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'HR Manager', notes: 'Excellent profile' }
    ]
  },
  {
    id: 'app_4',
    jobId: '3',
    jobTitle: 'UI/UX Designer',
    applicantName: 'Priya Gupta',
    email: 'priya@example.com',
    phone: '+91 98765 43213',
    resume: 'priya_gupta_resume.pdf',
    coverLetter: 'Passionate about creating user-centric designs. My portfolio showcases various successful projects.',
    status: 'offer',
    experience: '3 years',
    currentCompany: 'Design Studio',
    currentRole: 'UI Designer',
    education: 'B.Des in Visual Communication',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
    expectedSalary: 900000,
    noticePeriod: '30 days',
    appliedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    notes: 'Great portfolio, strong design sense',
    rating: 5,
    source: 'Referral',
    activityLog: [
      { id: 'act7', action: 'Application Received', timestamp: new Date(Date.now() - 86400000 * 10).toISOString(), user: 'System' },
      { id: 'act8', action: 'Resume Screened', timestamp: new Date(Date.now() - 86400000 * 8).toISOString(), user: 'HR Manager' },
      { id: 'act9', action: 'Interview Completed', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user: 'Design Lead', notes: 'Excellent candidate' },
      { id: 'act10', action: 'Offer Sent', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'HR Manager', notes: 'Awaiting response' }
    ]
  }
];

const FALLBACK_STATS: CareerStats = {
  totalJobs: 12,
  activeJobs: 8,
  closedJobs: 3,
  draftJobs: 1,
  totalApplications: 156,
  newApplications: 12,
  inReview: 45,
  interviewed: 38,
  offered: 15,
  hiredThisMonth: 4,
  rejected: 42,
  avgTimeToHire: 21,
  conversionRate: 18.5
};

// Leather Green Theme Config
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

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  internship: 'Internship'
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft: { label: 'Draft', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200' },
  published: { label: 'Published', color: 'text-[#2d5a42]', bg: 'bg-[#e8f5ed]', border: 'border-[#2d5a42]/30' },
  closed: { label: 'Closed', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
  paused: { label: 'Paused', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-200' }
};

const APPLICATION_STATUS: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  new: { label: 'New', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200', icon: <Star className="w-3 h-3" /> },
  screening: { label: 'Screening', color: 'text-[#8b6914]', bg: 'bg-[#f0e6d3]', border: 'border-[#dbc4a4]', icon: <Eye className="w-3 h-3" /> },
  interview: { label: 'Interview', color: 'text-violet-700', bg: 'bg-violet-100', border: 'border-violet-200', icon: <Users className="w-3 h-3" /> },
  offer: { label: 'Offer', color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200', icon: <Award className="w-3 h-3" /> },
  hired: { label: 'Hired', color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200', icon: <XCircle className="w-3 h-3" /> }
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>(FALLBACK_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(FALLBACK_APPLICATIONS);
  const [stats, setStats] = useState<CareerStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isApplicantDetailOpen, setIsApplicantDetailOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplication | null>(null);
  const [applicantNotes, setApplicantNotes] = useState('');
  const [websiteConnected, setWebsiteConnected] = useState(true);
  const [hrPanelConnected, setHrPanelConnected] = useState(true);
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data: realtimeData } = useRealtime({
    table: 'job_applications',
    enabled: useRealtimeData,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setJobs(FALLBACK_JOBS);
      setApplications(FALLBACK_APPLICATIONS);
      setStats(FALLBACK_STATS);
    } catch (err) {
      setError('Failed to load career data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesDept = departmentFilter === 'all' || job.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const departments = [...new Set(jobs.map(j => j.department))];

  const handleUpdateApplicationStatus = (appId: string, newStatus: JobApplication['status']) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newActivity: ApplicantActivity = {
          id: `act-${Date.now()}`,
          action: `Status updated to ${APPLICATION_STATUS[newStatus].label}`,
          timestamp: new Date().toISOString(),
          user: 'HR Manager',
          notes: applicantNotes
        };
        return {
          ...app,
          status: newStatus,
          activityLog: [newActivity, ...app.activityLog]
        };
      }
      return app;
    }));
    setApplicantNotes('');
  };

  const handleViewApplicantDetails = (applicant: JobApplication) => {
    setSelectedApplicant(applicant);
    setApplicantNotes(applicant.notes);
    setIsApplicantDetailOpen(true);
  };

  const handleRateApplicant = (appId: string, rating: number) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, rating } : app
    ));
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'shortlist' | 'reject' | 'archive') => {
    setApplications(prev => prev.map(app => {
      if (selectedItems.includes(app.id)) {
        const newStatus = action === 'shortlist' ? 'screening' : action === 'reject' ? 'rejected' : app.status;
        return { ...app, status: newStatus };
      }
      return app;
    }));
    setSelectedItems([]);
  };

  const handleDeleteJob = (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) return;
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = (jobData: Partial<Job>) => {
    if (editingJob) {
      // Update existing job
      setJobs(prev => prev.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...jobData, updatedAt: new Date().toISOString() } 
          : job
      ));
    } else {
      // Create new job
      const newJob: Job = {
        ...jobData,
        id: `job_${Date.now()}`,
        applications: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'HR Manager'
      } as Job;
      setJobs(prev => [newJob, ...prev]);
    }
    setIsJobModalOpen(false);
    setEditingJob(null);
  };

  const handleDeleteApplication = (appId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    setApplications(prev => prev.filter(app => app.id !== appId));
  };

  const handleAddNote = (appId: string, note: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const newActivity: ApplicantActivity = {
          id: `act-${Date.now()}`,
          action: 'Note Added',
          timestamp: new Date().toISOString(),
          user: 'HR Manager',
          notes: note
        };
        return {
          ...app,
          notes: note,
          activityLog: [newActivity, ...app.activityLog]
        };
      }
      return app;
    }));
  };

  const exportData = () => {
    const data = activeTab === 'jobs' 
      ? filteredJobs.map(job => ({
          ID: job.id,
          Title: job.title,
          Department: job.department,
          Location: job.location,
          Status: job.status,
          Applications: job.applications,
          Views: job.views
        }))
      : applications.map(app => ({
          ID: app.id,
          Name: app.applicantName,
          Email: app.email,
          Job: app.jobTitle,
          Status: app.status,
          Experience: app.experience,
          Source: app.source
        }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().split('T')[0]}.csv`;
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
                <Briefcase className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Careers & Jobs
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
            Manage job postings, applications, and hiring pipeline
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
            onClick={() => { setEditingJob(null); setIsJobModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-sm underline">Dismiss</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] p-4 rounded-2xl text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-5 h-5 text-[#e8f5ed]" />
            <span className="text-xs text-[#e8f5ed]/70">Total</span>
          </div>
          <p className="text-2xl font-black">{stats.totalJobs}</p>
          <p className="text-xs text-[#e8f5ed]/70 mt-1">Job Postings</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-[#e8f5ed] to-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]"
        >
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Live</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{stats.activeJobs}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Active Jobs</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-[#a67c52] to-[#c49c72] p-4 rounded-2xl text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Total</span>
          </div>
          <p className="text-2xl font-black">{stats.totalApplications}</p>
          <p className="text-xs text-white/70 mt-1">Applications</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-[#a67c52]">New</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.newApplications}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Today</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-[#8b6914]" />
            <span className="text-xs text-[#a67c52]">Review</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.inReview}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">In Screening</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-violet-500" />
            <span className="text-xs text-[#a67c52]">Active</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.interviewed}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Interviewed</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Success</span>
          </div>
          <p className="text-2xl font-black">{stats.hiredThisMonth}</p>
          <p className="text-xs text-white/70 mt-1">Hired This Month</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4]"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-[#8b6914]" />
            <span className="text-xs text-[#a67c52]">Speed</span>
          </div>
          <p className="text-2xl font-black text-[#8b6914]">{stats.avgTimeToHire}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Days to Hire</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#f0e6d3] rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('jobs')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'jobs'
              ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-lg'
              : 'text-[#5c3d1f] hover:bg-[#e8f5ed]'
          )}
        >
          <Briefcase className="w-4 h-4" />
          Job Postings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
            activeTab === 'applications'
              ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-lg'
              : 'text-[#5c3d1f] hover:bg-[#e8f5ed]'
          )}
        >
          <Users className="w-4 h-4" />
          Applications ({applications.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'jobs' ? "Search jobs by title, department..." : "Search applicants by name, email, job..."}
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
              {activeTab === 'jobs' ? (
                Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))
              ) : (
                Object.entries(APPLICATION_STATUS).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))
              )}
            </select>
          </div>
          {activeTab === 'jobs' && (
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[#dbc4a4]">
              <Building2 className="w-4 h-4 text-[#a67c52]" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-transparent text-[#5c3d1f] font-medium focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}
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

      {/* Content */}
      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => {
            const status = STATUS_CONFIG[job.status];
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 10px 40px -10px rgba(45, 90, 66, 0.2)' }}
                className="bg-white rounded-2xl border border-[#dbc4a4] p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#1a3c28]">{job.title}</h3>
                    <p className="text-sm text-[#a67c52] font-medium">{job.department}</p>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", status.bg, status.color, status.border)}>
                    {status.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mb-4 text-sm text-[#5c3d1f]">
                  <span className="flex items-center gap-1.5 bg-[#f0e6d3] px-3 py-1.5 rounded-lg">
                    <MapPin className="w-4 h-4 text-[#a67c52]" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#e8f5ed] px-3 py-1.5 rounded-lg">
                    <Clock className="w-4 h-4 text-[#2d5a42]" />
                    {JOB_TYPE_LABELS[job.type]}
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#f0e6d3] px-3 py-1.5 rounded-lg">
                    <IndianRupee className="w-4 h-4 text-[#a67c52]" />
                    ₹{job.salary.min / 100000}L - ₹{job.salary.max / 100000}L
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#e8f5ed] px-3 py-1.5 rounded-lg">
                    <GraduationCap className="w-4 h-4 text-[#2d5a42]" />
                    {job.experience}
                  </span>
                </div>

                <p className="text-sm text-[#5c3d1f] mb-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center gap-6 text-sm mb-5">
                  <div className="flex items-center gap-2 text-[#2d5a42] font-semibold">
                    <div className="w-8 h-8 rounded-lg bg-[#e8f5ed] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    {job.applications} applications
                  </div>
                  <div className="flex items-center gap-2 text-[#a67c52] font-semibold">
                    <div className="w-8 h-8 rounded-lg bg-[#f0e6d3] flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                    {job.views} views
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEditJob(job)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200"
                    title="Delete Job"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#dbc4a4] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#f0e6d3] to-[#e8f5ed]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Job</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e6d3]">
                {applications.map((app, index) => {
                  const status = APPLICATION_STATUS[app.status];
                  return (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-[#faf9f6] transition-colors cursor-pointer group"
                      onClick={() => handleViewApplicantDetails(app)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-sm">
                            {app.applicantName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a3c28]">{app.applicantName}</p>
                            <p className="text-xs text-[#a67c52]">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-[#5c3d1f] bg-[#f0e6d3] px-3 py-1 rounded-lg">
                          {app.jobTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5c3d1f]">
                        {app.experience}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border", status.bg, status.color, status.border)}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#a67c52]">
                        {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewApplicantDetails(app);
                            }}
                            className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteApplication(app.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
                            title="Delete Application"
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
          </div>
        </div>
      )}

      {/* Applicant Detail Modal */}
      <AnimatePresence>
        {isApplicantDetailOpen && selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#e8f5ed]/20 flex items-center justify-center text-white font-bold text-2xl">
                      {selectedApplicant.applicantName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#e8f5ed]">{selectedApplicant.applicantName}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-[#e8f5ed]/70">{selectedApplicant.id}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-bold", APPLICATION_STATUS[selectedApplicant.status].bg, APPLICATION_STATUS[selectedApplicant.status].color)}>
                          {APPLICATION_STATUS[selectedApplicant.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsApplicantDetailOpen(false)}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Contact & Skills */}
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                      <Phone className="w-5 h-5 text-[#2d5a42]" />
                      Contact Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#a67c52]" />
                        <span className="text-[#5c3d1f]">{selectedApplicant.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#a67c52]" />
                        <span className="text-[#5c3d1f]">{selectedApplicant.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-[#2d5a42]" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#e8f5ed] text-[#2d5a42] rounded-lg text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-[#2d5a42]" />
                      Documents
                    </h3>
                    <button className="w-full flex items-center gap-2 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all">
                      <FileText className="w-5 h-5" />
                      {selectedApplicant.resume}
                    </button>
                  </div>
                </div>

                {/* Middle Column - Professional Info */}
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-[#2d5a42]" />
                      Professional Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <InfoRow label="Current Company" value={selectedApplicant.currentCompany || 'Not specified'} />
                      <InfoRow label="Current Role" value={selectedApplicant.currentRole || 'Not specified'} />
                      <InfoRow label="Experience" value={selectedApplicant.experience} />
                      <InfoRow label="Education" value={selectedApplicant.education} />
                      <InfoRow label="Notice Period" value={selectedApplicant.noticePeriod} />
                      <InfoRow label="Expected Salary" value={`₹${(selectedApplicant.expectedSalary / 100000).toFixed(1)}L PA`} />
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-[#2d5a42]" />
                      Cover Letter
                    </h3>
                    <p className="text-sm text-[#5c3d1f] leading-relaxed">
                      {selectedApplicant.coverLetter || 'No cover letter provided'}
                    </p>
                  </div>
                </div>

                {/* Right Column - Activity & Actions */}
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-[#2d5a42]" />
                      Activity Timeline
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedApplicant.activityLog.map((activity, idx) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-[#2d5a42]" />
                            {idx < selectedApplicant.activityLog.length - 1 && (
                              <div className="w-0.5 h-full bg-[#dbc4a4]/50 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <p className="text-sm font-semibold text-[#1a3c28]">{activity.action}</p>
                            <p className="text-xs text-[#a67c52]">{new Date(activity.timestamp).toLocaleString('en-IN')}</p>
                            {activity.notes && (
                              <p className="text-xs text-[#5c3d1f] mt-1">{activity.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] mb-3">Update Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(APPLICATION_STATUS).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => handleUpdateApplicationStatus(selectedApplicant.id, key as JobApplication['status'])}
                          disabled={selectedApplicant.status === key}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                            selectedApplicant.status === key
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:opacity-80',
                            config.bg, config.color
                          )}
                        >
                          {config.icon}
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Note */}
                  <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/30">
                    <h3 className="font-bold text-[#1a3c28] mb-3">Add Note</h3>
                    <textarea
                      value={applicantNotes}
                      onChange={(e) => setApplicantNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all resize-none"
                      placeholder="Add a note about this candidate..."
                    />
                    <button
                      onClick={() => {
                        handleAddNote(selectedApplicant.id, applicantNotes);
                        setApplicantNotes('');
                      }}
                      className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      <Send className="w-4 h-4 inline mr-2" />
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Job Modal - Create/Edit */}
      <AnimatePresence>
        {isJobModalOpen && (
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
                      {editingJob ? <Edit3 className="w-5 h-5 text-[#e8f5ed]" /> : <Plus className="w-5 h-5 text-[#e8f5ed]" />}
                    </div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">
                      {editingJob ? 'Edit Job Posting' : 'Create New Job'}
                    </h2>
                  </div>
                  <button
                    onClick={() => { setIsJobModalOpen(false); setEditingJob(null); }}
                    className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <JobForm 
                  initialData={editingJob} 
                  onSave={handleSaveJob}
                  onCancel={() => { setIsJobModalOpen(false); setEditingJob(null); }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-[#a67c52] text-xs uppercase font-bold">{label}</span>
      <span className="text-[#1a3c28] font-medium text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function JobForm({ initialData, onSave, onCancel }: { initialData: Job | null; onSave: (data: Partial<Job>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Job>>(initialData || {
    title: '',
    department: '',
    location: '',
    type: 'full_time',
    experience: '',
    salary: { min: 0, max: 0, currency: 'INR', period: 'yearly' },
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    status: 'draft'
  });

  const addArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const updateArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'responsibilities' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formData);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Job Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="e.g., Senior React Developer"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Department *</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="e.g., Engineering"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="e.g., Mumbai, India or Remote"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Job Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Job['type'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Experience Required</label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="e.g., 3-5 years"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Job['status'] })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Min Salary (INR)</label>
          <input
            type="number"
            value={formData.salary?.min}
            onChange={(e) => setFormData({ 
              ...formData, 
              salary: { ...formData.salary!, min: Number(e.target.value) }
            })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="e.g., 800000"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Max Salary (INR)</label>
          <input
            type="number"
            value={formData.salary?.max}
            onChange={(e) => setFormData({ 
              ...formData, 
              salary: { ...formData.salary!, max: Number(e.target.value) }
            })}
            className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
            placeholder="e.g., 1500000"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Job Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] resize-none"
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          required
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Requirements</label>
        {formData.requirements?.map((req, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={req}
              onChange={(e) => updateArrayItem('requirements', idx, e.target.value)}
              className="flex-1 px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
              placeholder={`Requirement ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => removeArrayItem('requirements', idx)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('requirements')}
          className="flex items-center gap-2 text-sm text-[#2d5a42] font-semibold hover:underline"
        >
          <Plus className="w-4 h-4" />
          Add Requirement
        </button>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Responsibilities</label>
        {formData.responsibilities?.map((resp, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={resp}
              onChange={(e) => updateArrayItem('responsibilities', idx, e.target.value)}
              className="flex-1 px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
              placeholder={`Responsibility ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => removeArrayItem('responsibilities', idx)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('responsibilities')}
          className="flex items-center gap-2 text-sm text-[#2d5a42] font-semibold hover:underline"
        >
          <Plus className="w-4 h-4" />
          Add Responsibility
        </button>
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Benefits</label>
        {formData.benefits?.map((benefit, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={benefit}
              onChange={(e) => updateArrayItem('benefits', idx, e.target.value)}
              className="flex-1 px-4 py-2 border border-[#dbc4a4] rounded-xl bg-white text-[#1a3c28] text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
              placeholder={`Benefit ${idx + 1}`}
            />
            <button
              type="button"
              onClick={() => removeArrayItem('benefits', idx)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('benefits')}
          className="flex items-center gap-2 text-sm text-[#2d5a42] font-semibold hover:underline"
        >
          <Plus className="w-4 h-4" />
          Add Benefit
        </button>
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
          {initialData ? 'Save Changes' : 'Create Job'}
        </button>
      </div>
    </form>
  );
}

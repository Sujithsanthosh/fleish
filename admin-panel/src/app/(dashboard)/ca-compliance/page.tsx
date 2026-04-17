"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCcw, 
  Loader2, 
  Wifi, 
  WifiOff, 
  X,
  Calendar,
  FileText,
  User,
  Tag,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  Shield,
  Award,
  AlertTriangle,
  Save,
  Building2,
  AlignLeft,
  CheckSquare,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComplianceItem { 
  id: string; 
  title: string; 
  type: string; 
  dueDate: string; 
  status: 'Pending' | 'Overdue' | 'Completed' | 'In Progress';
  client: string;
  clientId?: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  assignedTo: string;
  assignedToId?: string;
  notes?: string;
  createdAt?: string;
  completedAt?: string;
  reminderDate?: string;
  penaltyAmount?: number;
  filingFrequency?: 'Monthly' | 'Quarterly' | 'Annual' | 'One-time';
}

// Mock Data
const MOCK_ITEMS: ComplianceItem[] = [
  { id: 'COMP-001', title: 'GSTR-1 Filing - March 2024', type: 'GST', dueDate: '2024-04-11', status: 'Pending', client: 'ABC Pvt Ltd', priority: 'High', description: 'Monthly GST return filing for March 2024', assignedTo: 'Rahul Sharma' },
  { id: 'COMP-002', title: 'Income Tax Return FY 2023-24', type: 'Income Tax', dueDate: '2024-04-15', status: 'In Progress', client: 'XYZ Enterprises', priority: 'High', description: 'Annual ITR filing for Assessment Year 2024-25', assignedTo: 'Priya Patel' },
  { id: 'COMP-003', title: 'TDS Return Q4 2023-24', type: 'TDS', dueDate: '2024-04-10', status: 'Overdue', client: 'Global Tech Solutions', priority: 'High', description: 'Quarterly TDS return for Jan-Mar 2024', assignedTo: 'Amit Kumar' },
  { id: 'COMP-004', title: 'PF Annual Return', type: 'PF/ESI', dueDate: '2024-04-25', status: 'Pending', client: 'Sunrise Industries', priority: 'Medium', description: 'Provident Fund annual return filing', assignedTo: 'Sneha Gupta' },
  { id: 'COMP-005', title: 'ROC Annual Filing', type: 'ROC', dueDate: '2024-04-30', status: 'Completed', client: 'Innovate Startup', priority: 'Medium', description: 'Annual return and financial statements with ROC', assignedTo: 'Rahul Sharma' },
  { id: 'COMP-006', title: 'GST Audit - FY 2022-23', type: 'GST', dueDate: '2024-04-20', status: 'Pending', client: 'Retail Masters', priority: 'Low', description: 'GST reconciliation statement (GSTR-9C)', assignedTo: 'Priya Patel' },
  { id: 'COMP-007', title: 'Professional Tax Payment', type: 'Professional Tax', dueDate: '2024-04-12', status: 'Overdue', client: 'Service First', priority: 'Medium', description: 'Monthly PT payment for employees', assignedTo: 'Amit Kumar' },
  { id: 'COMP-008', title: 'ESI Contribution', type: 'PF/ESI', dueDate: '2024-04-15', status: 'Pending', client: 'Health Plus', priority: 'High', description: 'Monthly ESI contribution filing', assignedTo: 'Sneha Gupta' },
];

const TYPE_COLORS: Record<string, string> = {
  'GST': 'bg-blue-100 text-blue-700 border-blue-200',
  'Income Tax': 'bg-purple-100 text-purple-700 border-purple-200',
  'TDS': 'bg-orange-100 text-orange-700 border-orange-200',
  'ROC': 'bg-pink-100 text-pink-700 border-pink-200',
  'PF/ESI': 'bg-teal-100 text-teal-700 border-teal-200',
  'Professional Tax': 'bg-cyan-100 text-cyan-700 border-cyan-200'
};

const PRIORITY_COLORS: Record<string, string> = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-amber-100 text-amber-700 border-amber-200',
  'Low': 'bg-emerald-100 text-emerald-700 border-emerald-200'
};

const FILING_FREQUENCIES = ['Monthly', 'Quarterly', 'Annual', 'One-time'];

const TEAM_MEMBERS = [
  { id: 'TM-001', name: 'Rahul Sharma', role: 'Senior Accountant' },
  { id: 'TM-002', name: 'Priya Patel', role: 'Tax Consultant' },
  { id: 'TM-003', name: 'Amit Kumar', role: 'Compliance Officer' },
  { id: 'TM-004', name: 'Sneha Gupta', role: 'Accountant' },
];

const CLIENTS = [
  { id: 'CL-001', name: 'ABC Pvt Ltd' },
  { id: 'CL-002', name: 'XYZ Enterprises' },
  { id: 'CL-003', name: 'Global Tech Solutions' },
  { id: 'CL-004', name: 'Sunrise Industries' },
  { id: 'CL-005', name: 'Innovate Startup' },
  { id: 'CL-006', name: 'Retail Masters' },
  { id: 'CL-007', name: 'Service First' },
  { id: 'CL-008', name: 'Health Plus' },
];

export default function ComplianceTracker() {
  const [items, setItems] = useState<ComplianceItem[]>(MOCK_ITEMS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ComplianceItem>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<ComplianceItem>>({
    status: 'Pending',
    priority: 'Medium',
    type: 'GST',
    description: '',
    assignedTo: '',
    client: ''
  });

  const { data: realtimeData, loading: rtLoading } = useRealtime({
    table: 'ca_compliance',
    enabled: useRealtimeData,
    onInsert: (payload) => console.log('New item added'),
    onUpdate: (payload) => console.log('Item updated'),
  });

  useEffect(() => {
    if (useRealtimeData && realtimeData) {
      setItems(realtimeData.map((row: any) => ({
        id: row.id || `COMP-${Math.random().toString(36).slice(2, 5)}`,
        title: row.title || '',
        type: row.type || 'GST',
        dueDate: row.due_date || row.dueDate || '',
        status: row.status || 'Pending',
        client: row.client || '',
        priority: row.priority || 'Medium',
        description: row.description || '',
        assignedTo: row.assignedTo || ''
      })));
    }
  }, [useRealtimeData, realtimeData]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setItems(MOCK_ITEMS);
    } catch (e: any) {
      setError(e.message || 'Failed to load compliance data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadItems(); }, [loadItems]);

  const handleComplete = async (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'Completed' } : i));
  };

  const handleViewDetails = (item: ComplianceItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: ComplianceItem) => {
    setSelectedItem(item);
    setEditForm({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedItem || !editForm.title) return;
    setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, ...editForm } as ComplianceItem : i));
    setIsEditModalOpen(false);
    setSelectedItem(null);
    setEditForm({});
  };

  const handleDelete = (item: ComplianceItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedItem) return;
    setItems(prev => prev.filter(i => i.id !== selectedItem.id));
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleCreate = () => {
    if (!createForm.title || !createForm.client) return;
    const newItem: ComplianceItem = {
      id: `COMP-${String(items.length + 1).padStart(3, '0')}`,
      title: createForm.title,
      type: createForm.type || 'GST',
      dueDate: createForm.dueDate || new Date().toISOString().split('T')[0],
      status: (createForm.status as any) || 'Pending',
      client: createForm.client,
      priority: (createForm.priority as any) || 'Medium',
      description: createForm.description || '',
      assignedTo: createForm.assignedTo || 'Unassigned',
      createdAt: new Date().toISOString(),
      notes: '',
      filingFrequency: createForm.filingFrequency || 'Monthly'
    };
    setItems(prev => [newItem, ...prev]);
    setIsCreateModalOpen(false);
    setCreateForm({
      status: 'Pending',
      priority: 'Medium',
      type: 'GST',
      description: '',
      assignedTo: '',
      client: ''
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = !search || 
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.client?.toLowerCase().includes(search.toLowerCase()) ||
      item.type?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: items.length,
    pending: items.filter(i => i.status === 'Pending').length,
    overdue: items.filter(i => i.status === 'Overdue').length,
    inProgress: items.filter(i => i.status === 'In Progress').length,
    completed: items.filter(i => i.status === 'Completed').length,
    highPriority: items.filter(i => i.priority === 'High' && i.status !== 'Completed').length
  };

  const statusIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    if (status === 'Overdue') return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (status === 'In Progress') return <Clock className="w-5 h-5 text-blue-600" />;
    return <Clock className="w-5 h-5 text-amber-600" />;
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#e8f5ed]" />
            </div>
            Compliance Tracker
          </h1>
          <p className="text-[#5c3d1f] mt-2">Track filing deadlines, compliance status, and manage tasks across all clients</p>
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
            {useRealtimeData ? 'Live Mode' : 'Offline'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadItems} 
            disabled={loading} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4] disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Task
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
            <button onClick={loadItems} className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200">Retry</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total</p>
          <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.total}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-600" />
          <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats.pending}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
          <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats.inProgress}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-400" />
          <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Overdue</p>
          <p className="text-2xl font-black text-red-500 mt-1">{stats.overdue}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-600 to-emerald-500" />
          <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.completed}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-red-200 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-red-500" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">High Priority</p>
          </div>
          <p className="text-2xl font-black text-red-600 mt-1">{stats.highPriority}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input 
            type="text" 
            placeholder="Search by title, client, type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Overdue">Overdue</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="GST">GST</option>
              <option value="Income Tax">Income Tax</option>
              <option value="TDS">TDS</option>
              <option value="ROC">ROC</option>
              <option value="PF/ESI">PF/ESI</option>
              <option value="Professional Tax">Professional Tax</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Compliance List */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#2d5a42] mb-4" />
            <p className="text-[#5c3d1f] font-semibold">Loading compliance items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-[#a67c52]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a3c28]">No compliance items</h3>
            <p className="text-[#5c3d1f] mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0e6d3]/50">
            {filteredItems.map((item, index) => {
              const daysRemaining = getDaysRemaining(item.dueDate);
              const isUrgent = daysRemaining <= 2 && item.status !== 'Completed';
              
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-5 flex items-center justify-between hover:bg-[#faf9f6] transition-colors",
                    isUrgent && "bg-red-50/50 border-l-4 border-l-red-500"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      item.status === 'Completed' ? 'bg-emerald-100' : 
                      item.status === 'Overdue' ? 'bg-red-100' :
                      item.status === 'In Progress' ? 'bg-blue-100' :
                      'bg-amber-100'
                    )}>
                      {statusIcon(item.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#1a3c28]">{item.title}</p>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold border", TYPE_COLORS[item.type] || 'bg-slate-100 text-slate-700')}>
                          {item.type}
                        </span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold border", PRIORITY_COLORS[item.priority])}>
                          {item.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-[#5c3d1f]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {item.dueDate}
                        </span>
                        {daysRemaining > 0 && item.status !== 'Completed' && (
                          <span className={cn(
                            "text-xs font-semibold",
                            daysRemaining <= 2 ? "text-red-600" : daysRemaining <= 5 ? "text-amber-600" : "text-[#2d5a42]"
                          )}>
                            {daysRemaining} days left
                          </span>
                        )}
                        {daysRemaining < 0 && item.status !== 'Completed' && (
                          <span className="text-xs font-bold text-red-600">
                            {Math.abs(daysRemaining)} days overdue
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewDetails(item)}
                      className="px-3 py-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl text-sm font-semibold transition-all"
                    >
                      View Details
                    </motion.button>
                    {item.status !== 'Completed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleComplete(item.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Complete
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(item)}
                      className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedItem && (
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
                    <FileText className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#e8f5ed]">Compliance Details</h2>
                    <p className="text-sm text-[#e8f5ed]/70">{selectedItem.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", TYPE_COLORS[selectedItem.type])}>
                    {selectedItem.type}
                  </span>
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", PRIORITY_COLORS[selectedItem.priority])}>
                    {selectedItem.priority} Priority
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1a3c28] mb-2">{selectedItem.title}</h3>
                  <p className="text-[#5c3d1f]">{selectedItem.description || 'No description available'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Client</p>
                    <p className="font-semibold text-[#1a3c28]">{selectedItem.client}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Due Date</p>
                    <p className="font-semibold text-[#1a3c28]">{selectedItem.dueDate}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Status</p>
                    <div className="flex items-center gap-1">
                      {statusIcon(selectedItem.status)}
                      <span className="font-semibold text-[#1a3c28]">{selectedItem.status}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Assigned To</p>
                    <p className="font-semibold text-[#1a3c28]">{selectedItem.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>

                {selectedItem.status !== 'Completed' && (
                  <div className="flex gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleComplete(selectedItem.id);
                        setIsDetailModalOpen(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark Complete
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Edit Compliance Task</h2>
                    <p className="text-sm text-[#e8f5ed]/70">{selectedItem.id}</p>
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
                {/* Task Title */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Task Title *</label>
                  <input
                    type="text"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter task title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter detailed description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Compliance Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Compliance Type</label>
                    <select
                      value={editForm.type || ''}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      {Object.keys(TYPE_COLORS).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filing Frequency */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Filing Frequency</label>
                    <select
                      value={editForm.filingFrequency || 'Monthly'}
                      onChange={(e) => setEditForm({ ...editForm, filingFrequency: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      {FILING_FREQUENCIES.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editForm.dueDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>

                  {/* Reminder Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Reminder Date</label>
                    <input
                      type="date"
                      value={editForm.reminderDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, reminderDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Status</label>
                    <select
                      value={editForm.status || ''}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Priority</label>
                    <select
                      value={editForm.priority || ''}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Client */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Client</label>
                    <select
                      value={editForm.client || ''}
                      onChange={(e) => setEditForm({ ...editForm, client: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      {CLIENTS.map(client => (
                        <option key={client.id} value={client.name}>{client.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Assigned To</label>
                    <select
                      value={editForm.assignedTo || ''}
                      onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="Unassigned">Unassigned</option>
                      {TEAM_MEMBERS.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Penalty Amount */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Penalty Amount (if late)</label>
                  <input
                    type="number"
                    value={editForm.penaltyAmount || ''}
                    onChange={(e) => setEditForm({ ...editForm, penaltyAmount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter penalty amount"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Internal Notes</label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Add internal notes..."
                  />
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-md border border-red-200"
            >
              <div className="p-6 border-b border-red-100 flex items-center justify-between bg-gradient-to-r from-red-500 to-red-400">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Delete Task</h2>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <p className="text-sm text-red-700">
                    This action cannot be undone. The task will be permanently removed.
                  </p>
                </div>
                
                <div className="p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <p className="text-xs text-[#a67c52] uppercase font-bold mb-1">Task to Delete</p>
                  <p className="font-bold text-[#1a3c28]">{selectedItem.title}</p>
                  <p className="text-sm text-[#5c3d1f]">{selectedItem.id} • {selectedItem.client}</p>
                </div>
              </div>

              <div className="p-6 border-t border-[#f0e6d3] flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Create New Compliance Task</h2>
                    <p className="text-sm text-[#e8f5ed]/70">Add a new compliance tracking item</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Task Title */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Task Title *</label>
                  <input
                    type="text"
                    value={createForm.title || ''}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter task title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={createForm.description || ''}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter detailed description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Compliance Type */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Compliance Type</label>
                    <select
                      value={createForm.type || 'GST'}
                      onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      {Object.keys(TYPE_COLORS).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Filing Frequency */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Filing Frequency</label>
                    <select
                      value={createForm.filingFrequency || 'Monthly'}
                      onChange={(e) => setCreateForm({ ...createForm, filingFrequency: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      {FILING_FREQUENCIES.map(freq => (
                        <option key={freq} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Due Date *</label>
                    <input
                      type="date"
                      value={createForm.dueDate || ''}
                      onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>

                  {/* Reminder Date */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Reminder Date</label>
                    <input
                      type="date"
                      value={createForm.reminderDate || ''}
                      onChange={(e) => setCreateForm({ ...createForm, reminderDate: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Status</label>
                    <select
                      value={createForm.status || 'Pending'}
                      onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Priority</label>
                    <select
                      value={createForm.priority || 'Medium'}
                      onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as any })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Client */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Client *</label>
                    <select
                      value={createForm.client || ''}
                      onChange={(e) => setCreateForm({ ...createForm, client: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="">Select Client</option>
                      {CLIENTS.map(client => (
                        <option key={client.id} value={client.name}>{client.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned To */}
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Assigned To</label>
                    <select
                      value={createForm.assignedTo || ''}
                      onChange={(e) => setCreateForm({ ...createForm, assignedTo: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 transition-all"
                    >
                      <option value="Unassigned">Unassigned</option>
                      {TEAM_MEMBERS.map(member => (
                        <option key={member.id} value={member.name}>{member.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Penalty Amount */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Penalty Amount (if late)</label>
                  <input
                    type="number"
                    value={createForm.penaltyAmount || ''}
                    onChange={(e) => setCreateForm({ ...createForm, penaltyAmount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Enter penalty amount"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Internal Notes</label>
                  <textarea
                    value={createForm.notes || ''}
                    onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    placeholder="Add internal notes..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#f0e6d3] flex gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Task
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

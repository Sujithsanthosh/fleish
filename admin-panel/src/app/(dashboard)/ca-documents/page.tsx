"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FolderOpen, 
  Upload, 
  Download, 
  Lock, 
  FileText, 
  Eye,
  Share2,
  RefreshCcw,
  Loader2,
  AlertCircle,
  Wifi,
  WifiOff,
  X,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Trash2,
  Edit3,
  MoreVertical,
  Shield,
  CheckCircle2,
  FileIcon,
  ImageIcon,
  FileSpreadsheet,
  FileCode,
  Archive,
  Tag,
  User,
  Building2,
  Calendar,
  Clock,
  HardDrive,
  Star
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Doc { 
  id: string; 
  name: string; 
  type: string; 
  size: string; 
  date: string; 
  client: string;
  clientId?: string;
  tag: string;
  uploadedBy: string;
  uploadedAt: string;
  isEncrypted: boolean;
  isStarred: boolean;
  lastAccessed?: string;
  downloadCount: number;
  description?: string;
}

const FILE_TYPE_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'pdf': { icon: <FileText className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-100' },
  'xls': { icon: <FileSpreadsheet className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'xlsx': { icon: <FileSpreadsheet className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'doc': { icon: <FileIcon className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100' },
  'docx': { icon: <FileIcon className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-100' },
  'zip': { icon: <Archive className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-100' },
  'jpg': { icon: <ImageIcon className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-100' },
  'png': { icon: <ImageIcon className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-100' },
  'default': { icon: <FileText className="w-5 h-5" />, color: 'text-slate-600', bg: 'bg-slate-100' }
};

const TAG_COLORS: Record<string, string> = {
  'General': 'bg-[#f0e6d3] text-[#5c3d1f]',
  'Confidential': 'bg-red-100 text-red-700',
  'Financial': 'bg-emerald-100 text-emerald-700',
  'Legal': 'bg-blue-100 text-blue-700',
  'Tax': 'bg-amber-100 text-amber-700',
  'Audit': 'bg-purple-100 text-purple-700'
};

// Mock Data
const MOCK_DOCS: Doc[] = [
  { id: 'DOC-001', name: 'Annual Financial Report 2023-24', type: 'pdf', size: '2.4 MB', date: '15 Apr 2024', client: 'ABC Pvt Ltd', tag: 'Financial', uploadedBy: 'Rahul Sharma', uploadedAt: '2024-04-15T10:30:00Z', isEncrypted: true, isStarred: true, downloadCount: 12, description: 'Complete annual financial report including balance sheet and P&L' },
  { id: 'DOC-002', name: 'GST Return Filing - March 2024', type: 'xlsx', size: '856 KB', date: '12 Apr 2024', client: 'XYZ Enterprises', tag: 'Tax', uploadedBy: 'Priya Patel', uploadedAt: '2024-04-12T14:20:00Z', isEncrypted: false, isStarred: false, downloadCount: 8, description: 'Monthly GST return filing data' },
  { id: 'DOC-003', name: 'Client KYC Documents', type: 'zip', size: '5.2 MB', date: '10 Apr 2024', client: 'Global Tech Solutions', tag: 'Confidential', uploadedBy: 'Amit Kumar', uploadedAt: '2024-04-10T09:15:00Z', isEncrypted: true, isStarred: true, downloadCount: 3, description: 'KYC documents and verification forms' },
  { id: 'DOC-004', name: 'Audit Report FY 2023', type: 'pdf', size: '3.1 MB', date: '08 Apr 2024', client: 'Sunrise Industries', tag: 'Audit', uploadedBy: 'Sneha Gupta', uploadedAt: '2024-04-08T16:45:00Z', isEncrypted: true, isStarred: false, downloadCount: 15, description: 'Statutory audit report for FY 2023' },
  { id: 'DOC-005', name: 'Employment Contract Template', type: 'docx', size: '245 KB', date: '05 Apr 2024', client: 'Unassigned', tag: 'Legal', uploadedBy: 'Rahul Sharma', uploadedAt: '2024-04-05T11:00:00Z', isEncrypted: false, isStarred: true, downloadCount: 42, description: 'Standard employment contract template' },
  { id: 'DOC-006', name: 'TDS Return Q4 2023-24', type: 'xls', size: '1.2 MB', date: '02 Apr 2024', client: 'Innovate Startup', tag: 'Tax', uploadedBy: 'Priya Patel', uploadedAt: '2024-04-02T13:30:00Z', isEncrypted: false, isStarred: false, downloadCount: 6, description: 'Quarterly TDS return filing' },
  { id: 'DOC-007', name: 'Board Meeting Minutes - March', type: 'pdf', size: '890 KB', date: '01 Apr 2024', client: 'Retail Masters', tag: 'Legal', uploadedBy: 'Amit Kumar', uploadedAt: '2024-04-01T15:00:00Z', isEncrypted: true, isStarred: false, downloadCount: 4, description: 'Minutes from board meeting held on March 28' },
  { id: 'DOC-008', name: 'Company Logo Assets', type: 'zip', size: '12.5 MB', date: '28 Mar 2024', client: 'Unassigned', tag: 'General', uploadedBy: 'Sneha Gupta', uploadedAt: '2024-03-28T10:00:00Z', isEncrypted: false, isStarred: true, downloadCount: 28, description: 'High resolution logo files in various formats' },
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

export default function DocumentVault() {
  const [docs, setDocs] = useState<Doc[]>(MOCK_DOCS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterClient, setFilterClient] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: realtimeData } = useRealtime({
    table: 'ca_documents',
    enabled: useRealtimeData,
    onInsert: (payload) => console.log('New item added'),
    onUpdate: (payload) => console.log('Item updated'),
  });

  useEffect(() => {
    if (useRealtimeData && realtimeData) {
      setDocs(realtimeData.map((row: any) => ({
        id: row.id || `DOC-${Math.random().toString(36).slice(2, 5)}`,
        name: row.name || '',
        type: row.type || 'pdf',
        size: row.size || '0 MB',
        date: row.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        client: row.client || 'Unassigned',
        tag: row.tag || 'General',
        uploadedBy: row.uploadedBy || 'System',
        uploadedAt: row.uploadedAt || new Date().toISOString(),
        isEncrypted: row.isEncrypted || false,
        isStarred: row.isStarred || false,
        downloadCount: row.downloadCount || 0,
        description: row.description || ''
      })));
    }
  }, [useRealtimeData, realtimeData]);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDocs(MOCK_DOCS);
    } catch (e: any) {
      setError(e.message || 'Failed to load document data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadDocs(); }, [loadDocs]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newDocs = Array.from(files).map((f, i) => ({
      id: `DOC-${Date.now()}-${i}`, 
      name: f.name.replace(/\.[^/.]+$/, ''), 
      type: f.name.split('.').pop() || 'file',
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, 
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      client: 'Unassigned', 
      tag: 'General',
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      isEncrypted: false,
      isStarred: false,
      downloadCount: 0,
      description: ''
    }));
    setDocs(prev => [...newDocs, ...prev]);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleStar = (id: string) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, isStarred: !d.isStarred } : d));
  };

  const handleDelete = (doc: Doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedDoc) return;
    setDocs(prev => prev.filter(d => d.id !== selectedDoc.id));
    setIsDeleteModalOpen(false);
    setSelectedDoc(null);
  };

  const viewDocument = (doc: Doc) => {
    setSelectedDoc(doc);
    setIsDetailModalOpen(true);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = !search || 
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.client.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesClient = filterClient === 'all' || doc.client === filterClient;
    const matchesTag = filterTag === 'all' || doc.tag === filterTag;
    return matchesSearch && matchesType && matchesClient && matchesTag;
  });

  const stats = {
    total: docs.length,
    totalSize: (docs.reduce((acc, d) => acc + parseFloat(d.size.split(' ')[0]), 0)).toFixed(1) + ' MB',
    encrypted: docs.filter(d => d.isEncrypted).length,
    starred: docs.filter(d => d.isStarred).length,
    pdfs: docs.filter(d => d.type === 'pdf').length,
    clientBound: docs.filter(d => d.client !== 'Unassigned').length
  };

  const getFileIcon = (type: string) => {
    const config = FILE_TYPE_ICONS[type.toLowerCase()] || FILE_TYPE_ICONS.default;
    return (
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
        {React.cloneElement(config.icon as React.ReactElement, { className: cn("w-5 h-5", config.color) })}
      </div>
    );
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
            Document Vault
          </h1>
          <p className="text-[#5c3d1f] mt-2">Secure document storage with client binding and encryption</p>
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
            onClick={loadDocs} 
            disabled={loading} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4] disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </motion.button>
          <div>
            <input ref={fileInputRef} type="file" multiple onChange={handleUpload} className="hidden" accept=".pdf,.xls,.xlsx,.doc,.docx,.zip,.jpg,.png" />
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()} 
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
            >
              <Upload className="w-4 h-4" /> 
              Upload
            </motion.button>
          </div>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Files</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.total}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Size</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{stats.totalSize.split(' ')[0]}</p>
              <p className="text-xs text-[#a67c52]">{stats.totalSize.split(' ')[1]}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <HardDrive className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-600" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">PDF Files</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{stats.pdfs}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
              <FileText className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-600 to-emerald-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Client Bound</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats.clientBound}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-purple-200 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Encrypted</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{stats.encrypted}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-400">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8b6914] to-[#a67c52]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#8b6914] uppercase tracking-wider">Starred</p>
              <p className="text-2xl font-black text-[#8b6914] mt-1">{stats.starred}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#8b6914] to-[#a67c52]">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input 
            type="text" 
            placeholder="Search documents by name, client, or description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="pdf">PDF</option>
              <option value="xlsx">Excel</option>
              <option value="docx">Word</option>
              <option value="zip">ZIP</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[160px]"
            >
              <option value="all">All Clients</option>
              {CLIENTS.map(client => (
                <option key={client.id} value={client.name}>{client.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[140px]"
            >
              <option value="all">All Tags</option>
              {Object.keys(TAG_COLORS).map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#2d5a42] mb-4" />
            <p className="text-[#5c3d1f] font-semibold">Loading documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-[#a67c52]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a3c28]">No documents found</h3>
            <p className="text-[#5c3d1f] mt-2">Try adjusting your search or upload new documents</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0e6d3]/50">
            {filteredDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 flex items-center justify-between hover:bg-[#faf9f6] transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getFileIcon(doc.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#1a3c28]">{doc.name}</p>
                      {doc.isEncrypted && <Lock className="w-3 h-3 text-purple-600" />}
                      {doc.isStarred && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#a67c52]">
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {doc.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {doc.client}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {doc.uploadedBy}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] px-2 py-1 rounded-full font-semibold", TAG_COLORS[doc.tag] || 'bg-slate-100 text-slate-700')}>
                    {doc.tag}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleStar(doc.id)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      doc.isStarred ? "text-amber-500 bg-amber-50" : "text-[#a67c52] hover:bg-[#f0e6d3]"
                    )}
                    title={doc.isStarred ? "Unstar" : "Star"}
                  >
                    <Star className={cn("w-4 h-4", doc.isStarred && "fill-amber-500")} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => viewDocument(doc)}
                    className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Document Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-lg border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedDoc.type)}
                  <div>
                    <h2 className="text-lg font-bold text-[#e8f5ed]">Document Details</h2>
                    <p className="text-sm text-[#e8f5ed]/70">{selectedDoc.id}</p>
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
                <div>
                  <h3 className="font-bold text-[#1a3c28] text-lg">{selectedDoc.name}</h3>
                  <p className="text-[#5c3d1f] mt-1">{selectedDoc.description || 'No description available'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">File Type</p>
                    <p className="font-semibold text-[#1a3c28] uppercase">{selectedDoc.type}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Size</p>
                    <p className="font-semibold text-[#1a3c28]">{selectedDoc.size}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Uploaded</p>
                    <p className="font-semibold text-[#1a3c28]">{selectedDoc.date}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#dbc4a4]/40">
                    <p className="text-xs text-[#a67c52] uppercase font-bold">Downloads</p>
                    <p className="font-semibold text-[#1a3c28]">{selectedDoc.downloadCount}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-[#a67c52]" />
                    <span className="text-sm font-semibold text-[#1a3c28]">{selectedDoc.client}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#a67c52]" />
                    <span className="text-sm text-[#5c3d1f]">Uploaded by {selectedDoc.uploadedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn("px-3 py-1.5 rounded-full text-xs font-bold", TAG_COLORS[selectedDoc.tag])}>
                    {selectedDoc.tag}
                  </span>
                  {selectedDoc.isEncrypted && (
                    <span className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedDoc && (
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
                  <h2 className="text-xl font-bold text-white">Delete Document</h2>
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
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <p className="text-sm text-red-700">
                    This action cannot be undone. The document will be permanently deleted.
                  </p>
                </div>
                
                <div className="p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <p className="text-xs text-[#a67c52] uppercase font-bold mb-1">Document to Delete</p>
                  <p className="font-bold text-[#1a3c28]">{selectedDoc.name}</p>
                  <p className="text-sm text-[#5c3d1f]">{selectedDoc.id} • {selectedDoc.size}</p>
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
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

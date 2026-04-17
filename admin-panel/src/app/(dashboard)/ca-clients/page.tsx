"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Search, Plus, ExternalLink, AlertCircle, Info, RefreshCcw, Loader2, Wifi, WifiOff,
  Building2, User, FileText, Download, Filter, MoreVertical, Edit2, Trash2, Eye, X, CheckCircle2,
  TrendingUp, Calendar, Phone, Mail, MapPin, CreditCard, Shield, Award, ChevronDown, BarChart3, Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';
import { cn } from '@/lib/utils';

// Types
interface Client { 
  id: string; 
  name: string; 
  type: string; 
  pan: string; 
  gstin: string; 
  cin: string; 
  status: 'Active' | 'Inactive' | 'Pending';
  email?: string;
  phone?: string;
  address?: string;
  registrationDate?: string;
  lastFiling?: string;
  documents?: number;
}

const CLIENT_TYPES = [
  { value: 'Individual', label: 'Individual', icon: User },
  { value: 'Partnership', label: 'Partnership', icon: Building2 },
  { value: 'Corporate', label: 'Corporate', icon: Building2 },
  { value: 'LLP', label: 'LLP', icon: Shield },
];

// Mock initial data
const MOCK_CLIENTS: Client[] = [
  { id: 'CA-001', name: 'Acme Corporation', type: 'Corporate', pan: 'AAACL1234C', gstin: '27AAACL1234C1Z1', cin: 'L27100MH2020PLC123456', status: 'Active', email: 'finance@acme.com', phone: '+91 98765 43210', address: '123 Business Park, Mumbai', registrationDate: '2020-01-15', lastFiling: '2024-03-15', documents: 24 },
  { id: 'CA-002', name: 'Rahul Sharma', type: 'Individual', pan: 'ABCPR1234D', gstin: '27ABCPR1234D1Z2', cin: 'N/A', status: 'Active', email: 'rahul.sharma@email.com', phone: '+91 98765 12345', address: '456 Residency, Mumbai', registrationDate: '2021-06-20', lastFiling: '2024-03-10', documents: 12 },
  { id: 'CA-003', name: 'TechStart LLP', type: 'LLP', pan: 'AAQFT5678E', gstin: '27AAQFT5678E1Z3', cin: 'N/A', status: 'Active', email: 'contact@techstart.in', phone: '+91 98765 67890', address: '789 Tech Hub, Bangalore', registrationDate: '2022-03-10', lastFiling: '2024-03-12', documents: 18 },
  { id: 'CA-004', name: 'Global Traders', type: 'Partnership', pan: 'AABCG9876F', gstin: '27AABCG9876F1Z4', cin: 'N/A', status: 'Pending', email: 'info@globaltraders.com', phone: '+91 98765 11111', address: '321 Market Road, Delhi', registrationDate: '2024-01-05', lastFiling: 'N/A', documents: 5 },
  { id: 'CA-005', name: 'Priya Enterprises', type: 'Corporate', pan: 'AACCP2345G', gstin: '27AACCP2345G1Z5', cin: 'U27100MH2021PLC987654', status: 'Inactive', email: 'admin@priyaent.com', phone: '+91 98765 22222', address: '654 Industrial Area, Pune', registrationDate: '2021-09-12', lastFiling: '2023-09-15', documents: 32 },
  { id: 'CA-006', name: 'Singh & Associates', type: 'Partnership', pan: 'AABSJ8765H', gstin: '27AABSJ8765H1Z6', cin: 'N/A', status: 'Active', email: 'singh@associates.co', phone: '+91 98765 33333', address: '987 Legal Street, Delhi', registrationDate: '2019-11-25', lastFiling: '2024-03-14', documents: 45 },
];

export default function CAClientManagement() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('name');
  const [useRealtimeData, setUseRealtimeData] = useState(false);

  const [newClient, setNewClient] = useState({ 
    name: '', 
    type: 'Individual', 
    pan: '', 
    gstin: '', 
    cin: '',
    email: '',
    phone: '',
    address: ''
  });

  const { data: realtimeData } = useRealtime({
    table: 'ca_clients',
    enabled: useRealtimeData,
    onInsert: (payload) => console.log('New client added:', payload),
    onUpdate: (payload) => console.log('Client updated:', payload),
  });

  // Filter and sort clients
  const filtered = clients
    .filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                           c.gstin.toLowerCase().includes(search.toLowerCase()) || 
                           c.pan.toLowerCase().includes(search.toLowerCase()) ||
                           c.id.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || c.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return (b.registrationDate || '').localeCompare(a.registrationDate || '');
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'Active').length,
    inactive: clients.filter(c => c.status === 'Inactive').length,
    pending: clients.filter(c => c.status === 'Pending').length,
    individuals: clients.filter(c => c.type === 'Individual').length,
    corporates: clients.filter(c => c.type === 'Corporate').length,
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: `CA-${String(clients.length + 1).padStart(3, '0')}`,
      ...newClient,
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      documents: 0,
    };
    setClients([client, ...clients]);
    setNewClient({ name: '', type: 'Individual', pan: '', gstin: '', cin: '', email: '', phone: '', address: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    setClients(clients.filter(c => c.id !== id));
    if (selectedClient?.id === id) {
      setShowDetailModal(false);
      setSelectedClient(null);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
    setEditingClient(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#e8f5ed] text-[#2d5a42] border-[#9dd4b3]';
      case 'Inactive': return 'bg-[#f0e6d3] text-[#8b6914] border-[#c49a6c]';
      case 'Pending': return 'bg-[#fff5f5] text-[#9b2335] border-[#fecaca]';
      default: return 'bg-[#f0e6d3] text-[#5c3d1f] border-[#c49a6c]';
    }
  };

  const getTypeIcon = (type: string) => {
    const found = CLIENT_TYPES.find(t => t.value === type);
    return found ? found.icon : Building2;
  };

  return (
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28]">Client Management</h1>
          <p className="text-[#5c3d1f] mt-1">Manage CA firm clients and their compliance details</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setUseRealtimeData(!useRealtimeData)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
              useRealtimeData 
                ? 'bg-[#e8f5ed] text-[#2d5a42] border border-[#9dd4b3] hover:bg-[#c9ebd6]' 
                : 'bg-[#f0e6d3] text-[#5c3d1f] border border-[#c49a6c] hover:bg-[#e8f5ed]'
            )}
          >
            {useRealtimeData ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {useRealtimeData ? 'Live Updates' : 'Offline Mode'}
          </button>
          <button 
            onClick={() => {}} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl text-sm font-bold hover:bg-[#e8f5ed] border border-[#c49a6c] transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl text-sm font-bold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" /> 
            Register Client
          </motion.button>
        </div>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#fff5f5] border border-[#fecaca] p-4 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3 text-[#9b2335]">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">{error}</span>
            </div>
            <button 
              onClick={() => setError('')} 
              className="p-2 hover:bg-[#fecaca] rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-gradient-to-br from-[#faf9f6] to-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#2d5a42]/10 rounded-xl">
              <Briefcase className="w-5 h-5 text-[#2d5a42]" />
            </div>
            <span className="text-xs text-[#5c3d1f] uppercase font-bold">Total</span>
          </div>
          <p className="text-3xl font-black text-[#1a3c28]">{stats.total}</p>
          <p className="text-xs text-[#a67c52] mt-1">All clients</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-gradient-to-br from-[#e8f5ed] to-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/50 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#2d5a42]/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-[#2d5a42]" />
            </div>
            <span className="text-xs text-[#2d5a42] uppercase font-bold">Active</span>
          </div>
          <p className="text-3xl font-black text-[#1a3c28]">{stats.active}</p>
          <p className="text-xs text-[#2d5a42]/70 mt-1">Compliant</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-gradient-to-br from-[#fff5f5] to-[#fff5f5]/50 rounded-2xl border border-[#fecaca]/50 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#9b2335]/10 rounded-xl">
              <AlertCircle className="w-5 h-5 text-[#9b2335]" />
            </div>
            <span className="text-xs text-[#9b2335] uppercase font-bold">Pending</span>
          </div>
          <p className="text-3xl font-black text-[#9b2335]">{stats.pending}</p>
          <p className="text-xs text-[#9b2335]/70 mt-1">Needs action</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-gradient-to-br from-[#f0e6d3] to-[#f0e6d3]/50 rounded-2xl border border-[#c49a6c]/50 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#8b6914]/20 rounded-xl">
              <User className="w-5 h-5 text-[#8b6914]" />
            </div>
            <span className="text-xs text-[#8b6914] uppercase font-bold">Individuals</span>
          </div>
          <p className="text-3xl font-black text-[#1a3c28]">{stats.individuals}</p>
          <p className="text-xs text-[#8b6914]/70 mt-1">Tax payers</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 bg-gradient-to-br from-[#e8f5ed]/50 to-[#c9ebd6]/30 rounded-2xl border border-[#9dd4b3]/30 shadow-sm md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#2d5a42]/10 rounded-xl">
              <BarChart3 className="w-5 h-5 text-[#2d5a42]" />
            </div>
            <span className="text-xs text-[#5c3d1f] uppercase font-bold">Compliance Rate</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-black text-[#1a3c28]">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
            </p>
            <div className="flex-1 h-3 bg-[#f0e6d3] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.active / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#a67c52]" />
          <input 
            type="text" 
            placeholder="Search by name, PAN, GSTIN, or ID..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 bg-[#faf9f6] border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
          >
            <option value="all">All Types</option>
            {CLIENT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/50 shadow-xl shadow-[#2d5a42]/5 overflow-hidden">
        {/* List Header */}
        <div className="p-4 border-b border-[#dbc4a4]/30 bg-[#f0e6d3]/30">
          <div className="grid grid-cols-12 gap-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">
            <div className="col-span-4">Client</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Registration</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>

        {/* List Items */}
        <div className="divide-y divide-[#dbc4a4]/20">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-[#2d5a42] mb-4" />
              <p className="text-[#5c3d1f] font-semibold">Loading clients...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#f0e6d3]/50 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-[#a67c52]/50" />
              </div>
              <h3 className="text-lg font-bold text-[#1a3c28] mb-2">No clients found</h3>
              <p className="text-[#5c3d1f] max-w-md mx-auto mb-4">
                {search ? 'Try adjusting your search or filters' : 'Get started by registering your first client'}
              </p>
              {!search && (
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Register Client
                </button>
              )}
            </div>
          ) : (
            filtered.map((client, idx) => {
              const TypeIcon = getTypeIcon(client.type);
              return (
                <motion.div 
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 hover:bg-[#f0e6d3]/20 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Client Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-[#e8f5ed] font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#1a3c28]">{client.name}</p>
                          <p className="text-xs text-[#a67c52] font-mono">{client.id} • PAN: {client.pan}</p>
                        </div>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#f0e6d3] rounded-lg">
                          <TypeIcon className="w-4 h-4 text-[#8b6914]" />
                        </div>
                        <span className="text-sm text-[#5c3d1f]">{client.type}</span>
                      </div>
                    </div>

                    {/* Registration */}
                    <div className="col-span-2">
                      <p className="text-sm text-[#5c3d1f]">{client.registrationDate || 'N/A'}</p>
                      <p className="text-xs text-[#a67c52]">{client.documents} documents</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getStatusColor(client.status))}>
                        {client.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <button 
                        onClick={() => { setSelectedClient(client); setShowDetailModal(true); }}
                        className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingClient(client)}
                        className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-[#9b2335] hover:bg-[#fff5f5] rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3c28]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 p-6 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#e8f5ed]">Register New Client</h3>
                  <p className="text-sm text-[#e8f5ed]/70">Add a new client to your CA firm</p>
                </div>
                <button 
                  onClick={() => setShowForm(false)}
                  className="p-2 bg-[#e8f5ed]/10 hover:bg-[#9b2335] text-[#e8f5ed] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Client Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter client name"
                      value={newClient.name} 
                      onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} 
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Client Type</label>
                    <select 
                      value={newClient.type} 
                      onChange={e => setNewClient(p => ({ ...p, type: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    >
                      {CLIENT_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">PAN Number</label>
                    <input 
                      type="text" 
                      placeholder="ABCDE1234F"
                      value={newClient.pan} 
                      onChange={e => setNewClient(p => ({ ...p, pan: e.target.value.toUpperCase() }))} 
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">GSTIN</label>
                    <input 
                      type="text" 
                      placeholder="27ABCDE1234F1Z5"
                      value={newClient.gstin} 
                      onChange={e => setNewClient(p => ({ ...p, gstin: e.target.value.toUpperCase() }))} 
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">CIN (for Companies)</label>
                    <input 
                      type="text" 
                      placeholder="L27100MH2020PLC123456"
                      value={newClient.cin} 
                      onChange={e => setNewClient(p => ({ ...p, cin: e.target.value.toUpperCase() }))} 
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Email</label>
                    <input 
                      type="email" 
                      placeholder="client@email.com"
                      value={newClient.email} 
                      onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))} 
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      value={newClient.phone} 
                      onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} 
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Address</label>
                    <textarea 
                      placeholder="Full address"
                      value={newClient.address} 
                      onChange={e => setNewClient(p => ({ ...p, address: e.target.value }))} 
                      rows={2}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30 resize-none"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-3 pt-4 border-t border-[#dbc4a4]/30 bg-[#faf9f6]">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)} 
                    className="px-6 py-2.5 text-[#5c3d1f] font-semibold hover:bg-[#f0e6d3] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Register Client
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3c28]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5ed]/20 flex items-center justify-center text-[#e8f5ed] text-xl font-bold">
                    {selectedClient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#e8f5ed]">{selectedClient.name}</h3>
                    <p className="text-sm text-[#e8f5ed]/70">{selectedClient.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 bg-[#e8f5ed]/10 hover:bg-[#9b2335] text-[#e8f5ed] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className={cn("p-3 rounded-xl flex items-center gap-2", getStatusColor(selectedClient.status))}>
                  <Shield className="w-4 h-4" />
                  <span className="font-bold">{selectedClient.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Type" value={selectedClient.type} icon={Building2} />
                  <InfoItem label="PAN" value={selectedClient.pan} icon={CreditCard} />
                  <InfoItem label="GSTIN" value={selectedClient.gstin} icon={FileText} />
                  <InfoItem label="CIN" value={selectedClient.cin} icon={Award} />
                  <InfoItem label="Email" value={selectedClient.email || 'N/A'} icon={Mail} />
                  <InfoItem label="Phone" value={selectedClient.phone || 'N/A'} icon={Phone} />
                </div>

                <div className="p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#8b6914]" />
                    <span className="text-sm font-bold text-[#5c3d1f]">Address</span>
                  </div>
                  <p className="text-[#1a3c28]">{selectedClient.address || 'No address on file'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#e8f5ed]/50 rounded-xl text-center">
                    <p className="text-xs text-[#5c3d1f] uppercase font-bold">Registered</p>
                    <p className="text-lg font-bold text-[#1a3c28]">{selectedClient.registrationDate}</p>
                  </div>
                  <div className="p-4 bg-[#e8f5ed]/50 rounded-xl text-center">
                    <p className="text-xs text-[#5c3d1f] uppercase font-bold">Documents</p>
                    <p className="text-lg font-bold text-[#1a3c28]">{selectedClient.documents}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#dbc4a4]/30">
                  <button 
                    onClick={() => { setShowDetailModal(false); setEditingClient(selectedClient); }}
                    className="flex-1 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] font-semibold rounded-xl hover:bg-[#e8f5ed] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => { handleDelete(selectedClient.id); setShowDetailModal(false); }}
                    className="flex-1 py-2.5 bg-[#fff5f5] text-[#9b2335] font-semibold rounded-xl hover:bg-[#fee2e2] transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {editingClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a3c28]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#faf9f6] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 p-6 bg-gradient-to-r from-[#8b6914] to-[#a67c52] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#faf6f0]">Edit Client</h3>
                  <p className="text-sm text-[#faf6f0]/70">Update client information</p>
                </div>
                <button 
                  onClick={() => setEditingClient(null)}
                  className="p-2 bg-[#faf6f0]/10 hover:bg-[#9b2335] text-[#faf6f0] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Client Name</label>
                    <input 
                      type="text" 
                      value={editingClient.name}
                      onChange={e => setEditingClient(p => p ? ({ ...p, name: e.target.value }) : null)}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Status</label>
                    <select 
                      value={editingClient.status}
                      onChange={e => setEditingClient(p => p ? ({ ...p, status: e.target.value as any }) : null)}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">PAN</label>
                    <input 
                      type="text" 
                      value={editingClient.pan}
                      onChange={e => setEditingClient(p => p ? ({ ...p, pan: e.target.value.toUpperCase() }) : null)}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">GSTIN</label>
                    <input 
                      type="text" 
                      value={editingClient.gstin}
                      onChange={e => setEditingClient(p => p ? ({ ...p, gstin: e.target.value.toUpperCase() }) : null)}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-3 pt-4 border-t border-[#dbc4a4]/30 bg-[#faf9f6]">
                  <button 
                    type="button" 
                    onClick={() => setEditingClient(null)} 
                    className="px-6 py-2.5 text-[#5c3d1f] font-semibold hover:bg-[#f0e6d3] rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8b6914] to-[#a67c52] text-[#faf6f0] font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function InfoItem({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="p-3 bg-[#f0e6d3]/30 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-[#8b6914]" />
        <span className="text-xs font-bold text-[#5c3d1f] uppercase">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[#1a3c28] font-mono">{value}</p>
    </div>
  );
}

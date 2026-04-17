"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Ticket, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  Search, 
  ExternalLink, 
  Flag, 
  Send, 
  Paperclip, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  X,
  MessageSquare,
  User,
  Phone,
  Mail,
  Calendar,
  Hash,
  Tag,
  Filter,
  ChevronDown,
  Plus,
  RefreshCcw,
  Headphones,
  MoreVertical,
  Reply,
  Forward,
  Star,
  Archive,
  Trash2,
  Edit3,
  History,
  Bot,
  Users,
  Loader2
} from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types
interface Message {
  id: string;
  sender: 'customer' | 'agent' | 'system' | 'bot';
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface Ticket {
  id: string;
  subject: string;
  description: string;
  entity: string;
  entityType: 'customer' | 'vendor' | 'rider' | 'delivery_partner';
  status: 'open' | 'in_progress' | 'escalated' | 'resolved' | 'closed' | 'pending';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  agent: string;
  agentId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  tags: string[];
  source: 'web' | 'app' | 'email' | 'phone' | 'chat';
  orderId?: string;
}

// Mock Data - Enhanced Tickets
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-9011',
    subject: 'Missing Payout for Order #819',
    description: 'Vendor reports not receiving payment for delivered order #819 completed 3 days ago.',
    entity: 'Royal Chicken Shop',
    entityType: 'vendor',
    status: 'escalated',
    priority: 'CRITICAL',
    category: 'Payment',
    agent: 'Teja R.',
    agentId: 'AGT-001',
    customerName: 'Rajesh Kumar',
    customerEmail: 'rajesh@royalchicken.com',
    customerPhone: '+91 98765 43210',
    createdAt: '2024-04-13T08:30:00Z',
    updatedAt: '2024-04-13T08:30:00Z',
    source: 'app',
    orderId: 'ORD-819',
    tags: ['payment', 'urgent', 'vendor'],
    messages: [
      { id: 'MSG-001', sender: 'customer', content: 'I have not received payment for order #819 which was delivered 3 days ago. Please help.', timestamp: '2024-04-13T08:30:00Z' },
      { id: 'MSG-002', sender: 'agent', content: 'I am looking into this issue right away. Let me check the payment status.', timestamp: '2024-04-13T08:35:00Z' },
      { id: 'MSG-003', sender: 'system', content: 'Ticket escalated to Finance Team', timestamp: '2024-04-13T08:45:00Z' }
    ]
  },
  {
    id: 'TKT-9012',
    subject: 'Rider GPS tracking broken mid-delivery',
    description: 'Customer cannot track delivery. Rider location not updating in app.',
    entity: 'Order #820',
    entityType: 'customer',
    status: 'open',
    priority: 'HIGH',
    category: 'Technical',
    agent: 'Unassigned',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@email.com',
    customerPhone: '+91 98765 12345',
    createdAt: '2024-04-13T07:15:00Z',
    updatedAt: '2024-04-13T07:15:00Z',
    source: 'web',
    orderId: 'ORD-820',
    tags: ['technical', 'tracking', 'rider'],
    messages: [
      { id: 'MSG-004', sender: 'customer', content: 'I cannot see where my order is. The tracking stopped updating 20 minutes ago.', timestamp: '2024-04-13T07:15:00Z' }
    ]
  },
  {
    id: 'TKT-9013',
    subject: 'Payment Gateway Timeout refund',
    description: 'Customer was charged but order failed. Refund not processed yet.',
    entity: 'Rahul Verma',
    entityType: 'customer',
    status: 'in_progress',
    priority: 'HIGH',
    category: 'Refund',
    agent: 'Simran K.',
    agentId: 'AGT-002',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.v@email.com',
    customerPhone: '+91 98765 67890',
    createdAt: '2024-04-13T06:00:00Z',
    updatedAt: '2024-04-13T06:30:00Z',
    source: 'email',
    orderId: 'ORD-818',
    tags: ['refund', 'payment', 'failed-order'],
    messages: [
      { id: 'MSG-005', sender: 'customer', content: 'My payment was deducted but order failed. I need my refund urgently.', timestamp: '2024-04-13T06:00:00Z' },
      { id: 'MSG-006', sender: 'agent', content: 'I have initiated the refund process. You should receive it within 3-5 business days.', timestamp: '2024-04-13T06:30:00Z' }
    ]
  },
  {
    id: 'TKT-9014',
    subject: 'Wrong items delivered in order',
    description: 'Customer received different items than ordered.',
    entity: 'Amit Patel',
    entityType: 'customer',
    status: 'open',
    priority: 'MEDIUM',
    category: 'Delivery',
    agent: 'Unassigned',
    customerName: 'Amit Patel',
    customerEmail: 'amit.p@email.com',
    customerPhone: '+91 98765 11111',
    createdAt: '2024-04-13T05:45:00Z',
    updatedAt: '2024-04-13T05:45:00Z',
    source: 'chat',
    orderId: 'ORD-817',
    tags: ['delivery', 'wrong-items', 'replacement'],
    messages: [
      { id: 'MSG-007', sender: 'customer', content: 'I ordered 2kg chicken but received 1kg fish instead. Please arrange replacement.', timestamp: '2024-04-13T05:45:00Z' }
    ]
  },
  {
    id: 'TKT-9015',
    subject: 'Vendor app login issue',
    description: 'Vendor cannot login to vendor app since morning.',
    entity: 'Fresh Fish Corner',
    entityType: 'vendor',
    status: 'resolved',
    priority: 'HIGH',
    category: 'Technical',
    agent: 'Rahul M.',
    agentId: 'AGT-003',
    customerName: 'Suresh Nair',
    customerEmail: 'suresh@freshfish.com',
    customerPhone: '+91 98765 22222',
    createdAt: '2024-04-12T09:00:00Z',
    updatedAt: '2024-04-12T11:30:00Z',
    source: 'phone',
    tags: ['technical', 'login', 'vendor-app'],
    messages: [
      { id: 'MSG-008', sender: 'customer', content: 'I cannot login to the app since morning. Shows error "Session expired".', timestamp: '2024-04-12T09:00:00Z' },
      { id: 'MSG-009', sender: 'agent', content: 'We have reset your session. Please try logging in again.', timestamp: '2024-04-12T11:00:00Z' },
      { id: 'MSG-010', sender: 'customer', content: 'Working now. Thank you!', timestamp: '2024-04-12T11:30:00Z' }
    ]
  },
  {
    id: 'TKT-9016',
    subject: 'Delivery partner KYC verification pending',
    description: 'New delivery partner waiting for KYC approval for 5 days.',
    entity: 'Rider - Karthik S.',
    entityType: 'delivery_partner',
    status: 'pending',
    priority: 'MEDIUM',
    category: 'KYC',
    agent: 'Priya D.',
    agentId: 'AGT-004',
    customerName: 'Karthik Subramanian',
    customerEmail: 'karthik.rider@email.com',
    customerPhone: '+91 98765 33333',
    createdAt: '2024-04-08T10:00:00Z',
    updatedAt: '2024-04-13T09:00:00Z',
    source: 'email',
    tags: ['kyc', 'verification', 'onboarding'],
    messages: [
      { id: 'MSG-011', sender: 'customer', content: 'I uploaded my documents 5 days ago but still waiting for approval.', timestamp: '2024-04-08T10:00:00Z' },
      { id: 'MSG-012', sender: 'agent', content: 'Your documents are under review. We will update you within 24 hours.', timestamp: '2024-04-13T09:00:00Z' }
    ]
  },
  {
    id: 'TKT-9017',
    subject: 'Order cancellation request',
    description: 'Customer wants to cancel order placed by mistake.',
    entity: 'Meera Joshi',
    entityType: 'customer',
    status: 'closed',
    priority: 'LOW',
    category: 'Cancellation',
    agent: 'Teja R.',
    agentId: 'AGT-001',
    customerName: 'Meera Joshi',
    customerEmail: 'meera.j@email.com',
    customerPhone: '+91 98765 44444',
    createdAt: '2024-04-12T14:00:00Z',
    updatedAt: '2024-04-12T14:15:00Z',
    source: 'app',
    orderId: 'ORD-816',
    tags: ['cancellation', 'refund'],
    messages: [
      { id: 'MSG-013', sender: 'customer', content: 'Please cancel my order. I placed it by mistake.', timestamp: '2024-04-12T14:00:00Z' },
      { id: 'MSG-014', sender: 'agent', content: 'Your order has been cancelled and refund initiated.', timestamp: '2024-04-12T14:15:00Z' },
      { id: 'MSG-015', sender: 'system', content: 'Ticket closed - Order cancelled', timestamp: '2024-04-12T14:15:00Z' }
    ]
  },
  {
    id: 'TKT-9018',
    subject: 'Rider accident during delivery',
    description: 'Rider met with accident, order delayed. Needs immediate attention.',
    entity: 'Rider - Vikram R.',
    entityType: 'rider',
    status: 'escalated',
    priority: 'CRITICAL',
    category: 'Emergency',
    agent: 'Rahul M.',
    agentId: 'AGT-003',
    customerName: 'Vikram Reddy',
    customerEmail: 'vikram.rider@email.com',
    customerPhone: '+91 98765 55555',
    createdAt: '2024-04-13T09:30:00Z',
    updatedAt: '2024-04-13T09:35:00Z',
    source: 'phone',
    orderId: 'ORD-821',
    tags: ['emergency', 'accident', 'rider-safety'],
    messages: [
      { id: 'MSG-016', sender: 'customer', content: 'I had an accident near MG Road. My bike is damaged. Please help.', timestamp: '2024-04-13T09:30:00Z' },
      { id: 'MSG-017', sender: 'system', content: 'EMERGENCY: Accident reported. Escalated to Operations Manager.', timestamp: '2024-04-13T09:35:00Z' }
    ]
  }
];

const AGENTS = [
  { id: 'AGT-001', name: 'Teja R.', role: 'Senior Agent', status: 'online', tickets: 12 },
  { id: 'AGT-002', name: 'Simran K.', role: 'Support Agent', status: 'online', tickets: 8 },
  { id: 'AGT-003', name: 'Rahul M.', role: 'Team Lead', status: 'busy', tickets: 5 },
  { id: 'AGT-004', name: 'Priya D.', role: 'Support Agent', status: 'offline', tickets: 0 },
];

const CATEGORIES = ['All', 'Payment', 'Technical', 'Refund', 'Delivery', 'KYC', 'Emergency', 'Cancellation'];
const PRIORITIES = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const STATUSES = ['ALL', 'OPEN', 'IN_PROGRESS', 'ESCALATED', 'PENDING', 'RESOLVED', 'CLOSED'];

const STATUS_COLORS: Record<string, string> = {
  'open': 'bg-amber-100 text-amber-700 border-amber-200',
  'in_progress': 'bg-blue-100 text-blue-700 border-blue-200',
  'escalated': 'bg-red-100 text-red-700 border-red-200',
  'pending': 'bg-purple-100 text-purple-700 border-purple-200',
  'resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'closed': 'bg-slate-100 text-slate-600 border-slate-200'
};

const PRIORITY_COLORS: Record<string, string> = {
  'CRITICAL': 'bg-red-600 text-white',
  'HIGH': 'bg-orange-500 text-white',
  'MEDIUM': 'bg-amber-400 text-amber-900',
  'LOW': 'bg-emerald-400 text-emerald-900'
};

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  'web': <Globe className="w-3 h-3" />,
  'app': <Smartphone className="w-3 h-3" />,
  'email': <Mail className="w-3 h-3" />,
  'phone': <Phone className="w-3 h-3" />,
  'chat': <MessageSquare className="w-3 h-3" />
};

// Import additional icons
import { Globe, Smartphone } from 'lucide-react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useRealtimeData, setUseRealtimeData] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [replyText, setReplyText] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [supportPanelConnected, setSupportPanelConnected] = useState(false);

  const { data: realtimeTickets } = useRealtime({
    table: 'support_tickets',
    enabled: useRealtimeData,
    onInsert: (payload) => console.log('[Support] New ticket inserted:', payload),
    onUpdate: (payload) => console.log('[Support] Ticket updated:', payload),
  });

  useEffect(() => {
    if (realtimeTickets && realtimeTickets.length > 0) {
      setTickets(realtimeTickets);
    }
  }, [realtimeTickets]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 800));
      setTickets(MOCK_TICKETS);
    } catch (e: any) {
      setError(`Failed to load tickets: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // Simulate support panel connection check
    setTimeout(() => setSupportPanelConnected(true), 2000);
  }, []);

  const resolveTicket = async () => {
    if (!activeTicket) return;
    setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, status: 'resolved' } as Ticket : t));
    setActiveTicket(null);
  };

  const assignTicket = (agentId: string, agentName: string) => {
    if (!activeTicket) return;
    setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, agent: agentName, agentId, status: 'in_progress' } as Ticket : t));
    setActiveTicket(prev => prev ? { ...prev, agent: agentName, agentId, status: 'in_progress' } : null);
    setShowAssignModal(false);
  };

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      sender: 'agent',
      content: replyText,
      timestamp: new Date().toISOString()
    };

    setTickets(prev => prev.map(t => t.id === activeTicket.id ? {
      ...t,
      messages: [...t.messages, newMessage],
      updatedAt: new Date().toISOString()
    } : t));

    setActiveTicket(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      updatedAt: new Date().toISOString()
    } : null);

    setReplyText('');
  };

  const escalateTicket = () => {
    if (!activeTicket) return;
    setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, status: 'escalated', priority: 'CRITICAL' } as Ticket : t));
    setActiveTicket(prev => prev ? { ...prev, status: 'escalated', priority: 'CRITICAL' } : null);
  };

  const filtered = tickets.filter(t => {
    const matchesSearch = !searchTerm ||
      t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.entity?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' || t.status?.toUpperCase() === activeTab;
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    return matchesSearch && matchesTab && matchesCategory && matchesPriority;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    escalated: tickets.filter(t => t.status === 'escalated').length,
    critical: tickets.filter(t => t.priority === 'CRITICAL').length,
    unassigned: tickets.filter(t => t.agent === 'Unassigned').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    avgResponse: '4.2 min'
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center">
              <Headphones className="w-5 h-5 text-[#e8f5ed]" />
            </div>
            Support Tickets
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-[#5c3d1f]">Manage customer support, escalations, and team assignments</p>
            {supportPanelConnected && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                <Wifi className="w-3 h-3" />
                Support Panel Connected
              </span>
            )}
          </div>
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
            onClick={loadTickets}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4] disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            New Ticket
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <p className="text-xs font-bold text-[#a67c52] uppercase">Total</p>
          <p className="text-xl font-black text-[#1a3c28]">{stats.total}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-600" />
          <p className="text-xs font-bold text-[#a67c52] uppercase">Open</p>
          <p className="text-xl font-black text-amber-600">{stats.open}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
          <p className="text-xs font-bold text-[#a67c52] uppercase">In Progress</p>
          <p className="text-xl font-black text-blue-600">{stats.inProgress}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-red-200 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-400" />
          <p className="text-xs font-bold text-red-600 uppercase">Escalated</p>
          <p className="text-xl font-black text-red-600">{stats.escalated}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-red-300 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-700 to-red-600" />
          <p className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Critical
          </p>
          <p className="text-xl font-black text-red-700">{stats.critical}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-purple-200 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-400" />
          <p className="text-xs font-bold text-purple-600 uppercase">Unassigned</p>
          <p className="text-xl font-black text-purple-600">{stats.unassigned}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-600 to-emerald-500" />
          <p className="text-xs font-bold text-emerald-600 uppercase">Resolved</p>
          <p className="text-xl font-black text-emerald-600">{stats.resolved}</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8b6914] to-[#a67c52]" />
          <p className="text-xs font-bold text-[#8b6914] uppercase">Avg Response</p>
          <p className="text-xl font-black text-[#8b6914]">{stats.avgResponse}</p>
        </motion.div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, customer, or entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[140px]"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
          <div className="relative">
            <AlertOctagon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52]" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="pl-10 pr-10 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none min-w-[140px]"
            >
              <option value="all">All Priorities</option>
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(tab => {
          const count = tab === 'ALL' ? tickets.length : tickets.filter(t => t.status?.toUpperCase() === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-lg'
                  : 'bg-white text-[#5c3d1f] hover:bg-[#f0e6d3] border border-[#dbc4a4]'
              )}
            >
              {tab.replace('_', ' ')} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#2d5a42] mb-4" />
            <p className="text-[#5c3d1f] font-semibold">Loading tickets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
              <Ticket className="w-10 h-10 text-[#a67c52]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a3c28]">No tickets found</h3>
            <p className="text-[#5c3d1f] mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0e6d3]/50">
            {filtered.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-5 hover:bg-[#faf9f6] transition-colors cursor-pointer",
                  ticket.priority === 'CRITICAL' && ticket.status !== 'resolved' && ticket.status !== 'closed' && "bg-red-50/30 border-l-4 border-l-red-500"
                )}
                onClick={() => setActiveTicket(ticket)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-emerald-100' :
                        ticket.status === 'escalated' ? 'bg-red-100' :
                          ticket.status === 'in_progress' ? 'bg-blue-100' :
                            'bg-amber-100'
                    )}>
                      {ticket.status === 'resolved' || ticket.status === 'closed' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> :
                        ticket.status === 'escalated' ? <AlertOctagon className="w-6 h-6 text-red-600" /> :
                          ticket.status === 'in_progress' ? <Clock className="w-6 h-6 text-blue-600" /> :
                            <MessageSquare className="w-6 h-6 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-[#a67c52] font-bold">{ticket.id}</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold", PRIORITY_COLORS[ticket.priority])}>
                          {ticket.priority}
                        </span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold border", STATUS_COLORS[ticket.status])}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-full font-semibold">
                          {ticket.category}
                        </span>
                        {ticket.orderId && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {ticket.orderId}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-[#1a3c28] mt-1 truncate">{ticket.subject}</h4>
                      <p className="text-sm text-[#5c3d1f] mt-0.5 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#a67c52]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {ticket.entity}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(ticket.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          {SOURCE_ICONS[ticket.source]}
                          {ticket.source}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white text-xs font-bold">
                        {ticket.agent.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-[#1a3c28]">{ticket.agent}</span>
                    </div>
                    <span className="text-xs text-[#a67c52]">{ticket.messages.length} messages</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Active Ticket Modal */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden border border-[#dbc4a4]"
            >
              {/* Left Panel - Chat */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="p-6 border-b border-[#f0e6d3] bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-[#e8f5ed]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#e8f5ed]">{activeTicket.id}</h3>
                        <p className="text-sm text-[#e8f5ed]/70">{activeTicket.subject}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 p-3 bg-[#f0e6d3]/30 border-b border-[#dbc4a4] overflow-x-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#2d5a42] rounded-lg text-sm font-semibold border border-[#dbc4a4] hover:bg-[#e8f5ed] transition-all whitespace-nowrap"
                  >
                    <User className="w-4 h-4" />
                    Assign
                  </motion.button>
                  {activeTicket.status !== 'escalated' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={escalateTicket}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-200 hover:bg-red-100 transition-all whitespace-nowrap"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      Escalate
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-600 rounded-lg text-sm font-semibold border border-amber-200 hover:bg-amber-100 transition-all whitespace-nowrap"
                  >
                    <Forward className="w-4 h-4" />
                    Forward
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold border border-blue-200 hover:bg-blue-100 transition-all whitespace-nowrap"
                  >
                    <History className="w-4 h-4" />
                    History
                  </motion.button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender === 'agent' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] p-4 rounded-2xl",
                          message.sender === 'customer' ? "bg-white border border-[#dbc4a4] text-[#1a3c28] rounded-bl-sm" :
                            message.sender === 'agent' ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-br-sm" :
                              message.sender === 'system' ? "bg-amber-100 text-amber-800 border border-amber-200 mx-auto text-center text-sm" :
                                "bg-slate-100 text-slate-700 rounded-br-sm"
                        )}
                      >
                        {message.sender === 'system' && <Bot className="w-4 h-4 inline mr-1" />}
                        <p className="text-sm">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          message.sender === 'agent' ? "text-white/70" : "text-[#a67c52]"
                        )}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={sendReply} className="p-4 bg-white border-t border-[#f0e6d3] flex gap-3">
                  <button type="button" className="p-3 text-[#a67c52] hover:bg-[#f0e6d3] rounded-xl transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-[#faf9f6] px-4 py-3 text-[#1a3c28] outline-none rounded-xl border border-[#dbc4a4] focus:border-[#2d5a42] transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!replyText.trim()}
                    className="p-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>

              {/* Right Panel - Details */}
              <div className="w-80 bg-white border-l border-[#f0e6d3] flex flex-col">
                <div className="p-6 border-b border-[#f0e6d3]">
                  <h4 className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-4">Ticket Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Status</span>
                      <span className={cn("text-xs px-2 py-1 rounded-full font-bold border", STATUS_COLORS[activeTicket.status])}>
                        {activeTicket.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Priority</span>
                      <span className={cn("text-xs px-2 py-1 rounded-full font-bold", PRIORITY_COLORS[activeTicket.priority])}>
                        {activeTicket.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Category</span>
                      <span className="text-sm font-semibold text-[#1a3c28]">{activeTicket.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5c3d1f]">Source</span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-[#1a3c28]">
                        {SOURCE_ICONS[activeTicket.source]}
                        {activeTicket.source}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b border-[#f0e6d3]">
                  <h4 className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-4">Customer Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold">
                        {activeTicket.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a3c28] text-sm">{activeTicket.customerName}</p>
                        <p className="text-xs text-[#a67c52]">{activeTicket.entityType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                      <Mail className="w-4 h-4 text-[#a67c52]" />
                      {activeTicket.customerEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5c3d1f]">
                      <Phone className="w-4 h-4 text-[#a67c52]" />
                      {activeTicket.customerPhone}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-b border-[#f0e6d3]">
                  <h4 className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-4">Assignment</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b6914] to-[#a67c52] flex items-center justify-center text-white font-bold">
                      {activeTicket.agent.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a3c28] text-sm">{activeTicket.agent}</p>
                      <p className="text-xs text-[#a67c52]">{activeTicket.agentId || 'Unassigned'}</p>
                    </div>
                  </div>
                </div>

                {activeTicket.orderId && (
                  <div className="p-6 border-b border-[#f0e6d3]">
                    <h4 className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-2">Related Order</h4>
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Hash className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-700">{activeTicket.orderId}</span>
                    </div>
                  </div>
                )}

                <div className="p-6 border-b border-[#f0e6d3]">
                  <h4 className="text-xs font-bold text-[#a67c52] uppercase tracking-wider mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeTicket.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg text-xs font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 mt-auto space-y-2">
                  {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resolveTicket}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Resolve Ticket
                    </motion.button>
                  )}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && activeTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-md border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <h3 className="text-lg font-bold text-[#e8f5ed]">Assign Ticket</h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-[#5c3d1f] mb-4">Select an agent to assign <span className="font-bold text-[#1a3c28]">{activeTicket.id}</span></p>
                <div className="space-y-3">
                  {AGENTS.map((agent) => (
                    <motion.button
                      key={agent.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => assignTicket(agent.id, agent.name)}
                      className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-[#dbc4a4] hover:border-[#2d5a42] hover:bg-[#e8f5ed]/50 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-[#1a3c28]">{agent.name}</p>
                        <p className="text-xs text-[#a67c52]">{agent.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          agent.status === 'online' ? "bg-emerald-500" : agent.status === 'busy' ? "bg-amber-500" : "bg-slate-400"
                        )} />
                        <span className="text-xs text-[#a67c52]">{agent.tickets} tickets</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


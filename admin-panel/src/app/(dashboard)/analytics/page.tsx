"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { 
  BarChart2, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  AlertCircle,
  X,
  Download,
  Calendar,
  Filter,
  ChevronDown,
  RefreshCcw,
  Wifi,
  WifiOff,
  PieChart,
  Activity,
  Users,
  Package,
  DollarSign,
  Target,
  Zap,
  Award,
  TrendingDown,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Printer,
  Share2,
  Building2,
  Headphones
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RePieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';

// Mock Data for Charts
const CSAT_DATA = [
  { name: 'Mon', score: 4.2, orders: 45 },
  { name: 'Tue', score: 4.1, orders: 52 },
  { name: 'Wed', score: 4.5, orders: 48 },
  { name: 'Thu', score: 4.0, orders: 61 },
  { name: 'Fri', score: 3.8, orders: 55 },
  { name: 'Sat', score: 4.8, orders: 38 },
  { name: 'Sun', score: 4.9, orders: 42 },
];

const REVENUE_DATA = [
  { name: 'Week 1', revenue: 12500, target: 15000 },
  { name: 'Week 2', revenue: 18200, target: 16000 },
  { name: 'Week 3', revenue: 15600, target: 17000 },
  { name: 'Week 4', revenue: 22400, target: 18000 },
];

const ORDER_STATUS_DATA = [
  { name: 'Delivered', value: 68, color: '#2d5a42' },
  { name: 'In Progress', value: 20, color: '#3d7a58' },
  { name: 'Pending', value: 8, color: '#a67c52' },
  { name: 'Cancelled', value: 4, color: '#ef4444' },
];

const SUPPORT_TICKETS_DATA = [
  { name: 'Mon', open: 12, resolved: 8 },
  { name: 'Tue', open: 15, resolved: 14 },
  { name: 'Wed', open: 8, resolved: 16 },
  { name: 'Thu', open: 18, resolved: 12 },
  { name: 'Fri', open: 22, resolved: 18 },
  { name: 'Sat', open: 10, resolved: 9 },
  { name: 'Sun', open: 6, resolved: 7 },
];

const CLIENT_GROWTH_DATA = [
  { name: 'Jan', clients: 120, new: 8 },
  { name: 'Feb', clients: 128, new: 12 },
  { name: 'Mar', clients: 135, new: 15 },
  { name: 'Apr', clients: 142, new: 10 },
];

const TOP_CLIENTS = [
  { name: 'ABC Pvt Ltd', revenue: 45000, orders: 156, growth: 12 },
  { name: 'XYZ Enterprises', revenue: 38000, orders: 134, growth: 8 },
  { name: 'Global Tech Solutions', revenue: 32000, orders: 98, growth: -3 },
  { name: 'Sunrise Industries', revenue: 28000, orders: 87, growth: 15 },
  { name: 'Innovate Startup', revenue: 22000, orders: 72, growth: 22 },
];

const COMPLIANCE_STATUS = [
  { type: 'GST', completed: 85, pending: 12, overdue: 3 },
  { type: 'Income Tax', completed: 92, pending: 6, overdue: 2 },
  { type: 'TDS', completed: 78, pending: 18, overdue: 4 },
  { type: 'ROC', completed: 95, pending: 4, overdue: 1 },
  { type: 'PF/ESI', completed: 88, pending: 10, overdue: 2 },
];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('7days');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [caPanelConnected, setCaPanelConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [useRealtimeData, setUseRealtimeData] = useState(false);

  const { data: realtimeStats } = useRealtime({
    table: 'analytics_metrics',
    enabled: useRealtimeData,
  });

  // Simulate CA Panel connection
  useEffect(() => {
    const checkConnection = async () => {
      // In production, this would check actual CA Panel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCaPanelConnected(true);
    };
    checkConnection();
  }, []);

  const stats = {
    totalRevenue: 68400,
    revenueGrowth: 12.5,
    totalOrders: 341,
    ordersGrowth: 8.3,
    activeClients: 142,
    clientsGrowth: 5.7,
    csat: 4.4,
    csatGrowth: 0.3,
    fcr: '86%',
    avgResponse: '4m 32s',
    slaCompliance: 94,
    complianceTasks: 78,
    pendingTasks: 12,
    overdueTasks: 3,
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    // Mock export functionality
    alert(`Exporting dashboard data as ${format.toUpperCase()}...`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-[#e8f5ed]" />
              </div>
              Analytics Dashboard
            </h1>
            {caPanelConnected && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                <Building2 className="w-3 h-3" />
                CA Panel Connected
              </span>
            )}
          </div>
          <p className="text-[#5c3d1f] mt-2">Comprehensive analytics for orders, revenue, compliance, and support metrics</p>
        </div>
        <div className="flex items-center gap-3">
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
          
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 appearance-none pr-10"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a67c52] pointer-events-none" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleExport('csv')}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['overview', 'revenue', 'orders', 'compliance', 'support'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-6 py-3 rounded-xl text-sm font-bold transition-all capitalize",
              activeTab === tab 
                ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-lg'
                : 'bg-white text-[#5c3d1f] hover:bg-[#f0e6d3] border border-[#dbc4a4]'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }} 
              className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-black text-[#1a3c28] mt-1">{formatCurrency(stats.totalRevenue)}</p>
                  <div className="flex items-center gap-1 mt-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-bold">+{stats.revenueGrowth}%</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }} 
              className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">{stats.totalOrders}</p>
                  <div className="flex items-center gap-1 mt-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-bold">+{stats.ordersGrowth}%</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }} 
              className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#8b6914] to-[#a67c52]" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#8b6914] uppercase tracking-wider">Active Clients</p>
                  <p className="text-2xl font-black text-[#8b6914] mt-1">{stats.activeClients}</p>
                  <div className="flex items-center gap-1 mt-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-bold">+{stats.clientsGrowth}%</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#8b6914] to-[#a67c52]">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, y: -2 }} 
              className="relative overflow-hidden bg-[#faf9f6] p-5 rounded-2xl border border-[#dbc4a4]/50 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-600" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">CSAT Score</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">{stats.csat}<span className="text-sm text-[#a67c52]">/5</span></p>
                  <div className="flex items-center gap-1 mt-1 text-emerald-600">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-xs font-bold">+{stats.csatGrowth}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#1a3c28]">{stats.fcr}</p>
                  <p className="text-xs text-[#a67c52]">First Contact Resolution</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#1a3c28]">{stats.avgResponse}</p>
                  <p className="text-xs text-[#a67c52]">Avg Response Time</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#1a3c28]">{stats.slaCompliance}%</p>
                  <p className="text-xs text-[#a67c52]">SLA Compliance</p>
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#f0e6d3] text-[#5c3d1f]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#1a3c28]">{stats.complianceTasks}</p>
                  <p className="text-xs text-[#a67c52]">Compliance Tasks</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSAT Chart */}
            <div className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3c28]">Customer Satisfaction (CSAT)</h3>
                  <p className="text-sm text-[#5c3d1f]">Last 7 days performance</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f5ed] text-[#2d5a42] rounded-full text-xs font-bold">
                    <ArrowUpRight className="w-3 h-3" />
                    +{stats.csatGrowth} pts
                  </span>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CSAT_DATA}>
                    <defs>
                      <linearGradient id="csatGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2d5a42" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2d5a42" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6d3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f' }} dy={10} />
                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#faf9f6', border: '1px solid #dbc4a4', borderRadius: '12px' }}
                      labelStyle={{ color: '#1a3c28', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2d5a42" strokeWidth={3} fillOpacity={1} fill="url(#csatGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order Status Pie Chart */}
            <div className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3c28]">Order Status Distribution</h3>
                  <p className="text-sm text-[#5c3d1f]">Current order pipeline breakdown</p>
                </div>
              </div>
              <div className="h-[280px] flex items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <RePieChart>
                    <Pie
                      data={ORDER_STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ORDER_STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {ORDER_STATUS_DATA.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-semibold text-[#1a3c28]">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-[#1a3c28]">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3c28]">Revenue vs Target</h3>
                  <p className="text-sm text-[#5c3d1f]">Weekly performance tracking</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#2d5a42]" />
                    <span className="text-[#5c3d1f]">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#a67c52]" />
                    <span className="text-[#5c3d1f]">Target</span>
                  </div>
                </div>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6d3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f' }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#faf9f6', border: '1px solid #dbc4a4', borderRadius: '12px' }}
                      formatter={(val: number) => formatCurrency(val)}
                    />
                    <Bar dataKey="revenue" fill="#2d5a42" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="target" fill="#a67c52" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-[#1a3c28]">Support Tickets</h3>
                <p className="text-sm text-[#5c3d1f]">Open vs Resolved</p>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SUPPORT_TICKETS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0e6d3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#faf9f6', border: '1px solid #dbc4a4', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                    <Line type="monotone" dataKey="resolved" stroke="#2d5a42" strokeWidth={2} dot={{ fill: '#2d5a42' }} />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clients */}
            <div className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3c28]">Top Performing Clients</h3>
                  <p className="text-sm text-[#5c3d1f]">By revenue and order volume</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="text-sm font-semibold text-[#2d5a42] hover:underline"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-4">
                {TOP_CLIENTS.map((client, index) => (
                  <div key={client.name} className="flex items-center justify-between p-4 bg-[#faf9f6] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a3c28]">{client.name}</p>
                        <p className="text-xs text-[#a67c52]">{client.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1a3c28]">{formatCurrency(client.revenue)}</p>
                      <p className={cn(
                        "text-xs font-bold",
                        client.growth > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {client.growth > 0 ? '+' : ''}{client.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Overview */}
            <div className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3c28]">Compliance Overview</h3>
                  <p className="text-sm text-[#5c3d1f]">Task completion status</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  {stats.slaCompliance}% On Track
                </div>
              </div>
              <div className="space-y-4">
                {COMPLIANCE_STATUS.map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1a3c28]">{item.type}</span>
                      <span className="text-sm text-[#5c3d1f]">{item.completed}% Complete</span>
                    </div>
                    <div className="h-2 bg-[#f0e6d3] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-full"
                        style={{ width: `${item.completed}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-600 font-semibold">{item.completed}% Done</span>
                      {item.pending > 0 && <span className="text-amber-600">{item.pending} Pending</span>}
                      {item.overdue > 0 && <span className="text-red-600">{item.overdue} Overdue</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Tab Placeholders */}
      {activeTab !== 'overview' && (
        <div className="bg-white p-12 rounded-3xl border border-[#dbc4a4]/50 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
            <BarChart2 className="w-10 h-10 text-[#a67c52]" />
          </div>
          <h3 className="text-lg font-bold text-[#1a3c28]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics</h3>
          <p className="text-[#5c3d1f] mt-2">Detailed {activeTab} analytics will be displayed here</p>
          <p className="text-sm text-[#a67c52] mt-1">Connected to CA Panel for real-time data</p>
        </div>
      )}
    </div>
  );
}

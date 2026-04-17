"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageSquareWarning,
  MapPin,
  Activity,
  Timer,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  Zap,
  Users,
  Store,
  Package,
  CreditCard,
  Bell,
  RefreshCcw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  ShoppingCart,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  LayoutGrid,
  List,
  ExternalLink,
  Target,
  BarChart3,
  PieChart,
  TrendingDown,
  Wallet,
  Receipt,
  Gift,
  Percent,
  Crown,
  Shield,
  Wifi,
  WifiOff,
  Settings,
  Plus,
  Eye,
  EyeOff,
  FileText,
  Printer,
  Share2,
  ChevronDown,
  ChevronUp,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Theme Constants
const THEME = {
  primary: '#2d5a42',
  secondary: '#3d7a58',
  accent: '#a67c52',
  light: '#e8f5ed',
  cream: '#f0e6d3',
  border: '#dbc4a4',
  text: '#1a3c28',
  muted: '#5c3d1f',
  success: '#3d7a58',
  warning: '#8b6914',
  danger: '#9b2335',
  info: '#4a9a6e'
};

const CHART_COLORS = ['#2d5a42', '#3d7a58', '#a67c52', '#8b6914', '#9b2335', '#4a9a6e'];

// Types
interface DashboardStats {
  orders: number;
  deliveries: number;
  sla: number;
  customers: number;
  vendors: number;
  revenue: string;
  revenueValue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  avgOrderValue: string;
  todayOrders: number;
  growthRate: number;
  activeRiders: number;
  totalProducts: number;
  lowStockItems: number;
  newCustomersToday: number;
  repeatCustomers: number;
  conversionRate: number;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'delivery' | 'customer' | 'vendor' | 'payment' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'warning' | 'error';
  amount?: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: string;
  growth: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: 'pending' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  time: string;
}

interface Rider {
  id: string;
  name: string;
  cases: number;
  status: 'BUSY' | 'ONLINE' | 'OFFLINE';
  deliveries: number;
  rating: number;
  avatar: string;
}

// Fallback Data
const FALLBACK_SLA_DATA = [
  { name: '08:00', resolved: 40, breached: 2, pending: 15 },
  { name: '10:00', resolved: 30, breached: 5, pending: 20 },
  { name: '12:00', resolved: 85, breached: 12, pending: 35 },
  { name: '14:00', resolved: 110, breached: 18, pending: 25 },
  { name: '16:00', resolved: 90, breached: 8, pending: 30 },
  { name: '18:00', resolved: 65, breached: 4, pending: 20 },
  { name: '20:00', resolved: 45, breached: 3, pending: 10 },
];

const FALLBACK_REVENUE_DATA = [
  { name: 'Mon', revenue: 45000, target: 50000 },
  { name: 'Tue', revenue: 52000, target: 50000 },
  { name: 'Wed', revenue: 48000, target: 50000 },
  { name: 'Thu', revenue: 61000, target: 55000 },
  { name: 'Fri', revenue: 58000, target: 55000 },
  { name: 'Sat', revenue: 72000, target: 60000 },
  { name: 'Sun', revenue: 65000, target: 60000 },
];

const FALLBACK_ORDER_STATUS_DATA = [
  { name: 'Pending', value: 25, color: '#8b6914' },
  { name: 'Processing', value: 35, color: '#2d5a42' },
  { name: 'Out for Delivery', value: 20, color: '#3d7a58' },
  { name: 'Delivered', value: 15, color: '#4a9a6e' },
  { name: 'Cancelled', value: 5, color: '#9b2335' },
];

const FALLBACK_AGENTS: Rider[] = [
  { id: '1', name: 'Rajesh Kumar', cases: 8, status: 'BUSY', deliveries: 45, rating: 4.8, avatar: 'R' },
  { id: '2', name: 'Priya Sharma', cases: 3, status: 'ONLINE', deliveries: 32, rating: 4.9, avatar: 'P' },
  { id: '3', name: 'Amit Patel', cases: 12, status: 'BUSY', deliveries: 67, rating: 4.7, avatar: 'A' },
  { id: '4', name: 'Sneha Gupta', cases: 0, status: 'ONLINE', deliveries: 28, rating: 4.6, avatar: 'S' },
  { id: '5', name: 'Vikram Singh', cases: 5, status: 'OFFLINE', deliveries: 41, rating: 4.8, avatar: 'V' },
];

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  { id: '1', type: 'order', title: 'New Order Received', description: 'Order #12345 from John Doe', timestamp: '2 mins ago', status: 'success', amount: '₹2,450' },
  { id: '2', type: 'delivery', title: 'Order Delivered', description: 'Order #12340 delivered by Rajesh', timestamp: '15 mins ago', status: 'success' },
  { id: '3', type: 'customer', title: 'New Customer', description: 'Sarah Connor registered', timestamp: '32 mins ago', status: 'success' },
  { id: '4', type: 'alert', title: 'Low Stock Alert', description: 'Chicken Breast running low', timestamp: '1 hour ago', status: 'warning' },
  { id: '5', type: 'payment', title: 'Payment Received', description: '₹15,000 from Order #12335', timestamp: '2 hours ago', status: 'success', amount: '₹15,000' },
];

const FALLBACK_TOP_PRODUCTS: TopProduct[] = [
  { id: '1', name: 'Chicken Breast', sales: 245, revenue: '₹73,500', growth: 12.5 },
  { id: '2', name: 'Mutton Curry Cut', sales: 189, revenue: '₹56,700', growth: 8.3 },
  { id: '3', name: 'Prawns Medium', sales: 156, revenue: '₹46,800', growth: -2.1 },
  { id: '4', name: 'Fish Fillet', sales: 134, revenue: '₹40,200', growth: 15.7 },
  { id: '5', name: 'Eggs (30 pcs)', sales: 112, revenue: '₹33,600', growth: 5.2 },
];

const FALLBACK_RECENT_ORDERS: RecentOrder[] = [
  { id: '#12345', customer: 'John Doe', items: 5, total: '₹2,450', status: 'pending', time: '2 mins ago' },
  { id: '#12344', customer: 'Jane Smith', items: 3, total: '₹1,850', status: 'processing', time: '15 mins ago' },
  { id: '#12343', customer: 'Mike Johnson', items: 8, total: '₹4,200', status: 'out_for_delivery', time: '45 mins ago' },
  { id: '#12342', customer: 'Sarah Connor', items: 2, total: '₹980', status: 'delivered', time: '1 hour ago' },
  { id: '#12341', customer: 'Robert Brown', items: 4, total: '₹2,100', status: 'cancelled', time: '2 hours ago' },
];

// Date utility functions
const getToday = () => new Date();
const getWeekStart = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};
const getMonthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function DashboardPage() {
  // State
  const [slaData, setSlaData] = useState(FALLBACK_SLA_DATA);
  const [revenueData, setRevenueData] = useState(FALLBACK_REVENUE_DATA);
  const [orderStatusData, setOrderStatusData] = useState(FALLBACK_ORDER_STATUS_DATA);
  const [agents, setAgents] = useState<Rider[]>(FALLBACK_AGENTS);
  const [activities, setActivities] = useState<ActivityItem[]>(FALLBACK_ACTIVITIES);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(FALLBACK_TOP_PRODUCTS);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(FALLBACK_RECENT_ORDERS);
  const [stats, setStats] = useState<DashboardStats>({
    orders: 156,
    deliveries: 42,
    sla: 8,
    customers: 2458,
    vendors: 67,
    revenue: '₹4.2L',
    revenueValue: 420000,
    pendingOrders: 45,
    completedOrders: 89,
    cancelledOrders: 12,
    avgOrderValue: '₹2,700',
    todayOrders: 156,
    growthRate: 12.5,
    activeRiders: 24,
    totalProducts: 156,
    lowStockItems: 8,
    newCustomersToday: 18,
    repeatCustomers: 342,
    conversionRate: 68.5
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [customDateRange, setCustomDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [showCalendar, setShowCalendar] = useState(false);
  const [useRealtimeData, setUseRealtimeData] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const calendarRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showTrackDeliveryModal, setShowTrackDeliveryModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showManageVendorsModal, setShowManageVendorsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllRiders, setShowAllRiders] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Form states
  const [newOrderForm, setNewOrderForm] = useState({ customer: '', items: '', total: '' });
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', email: '', phone: '' });
  const [trackOrderId, setTrackOrderId] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [shareEmail, setShareEmail] = useState('');

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setSlaData(FALLBACK_SLA_DATA);
      setRevenueData(FALLBACK_REVENUE_DATA);
      setOrderStatusData(FALLBACK_ORDER_STATUS_DATA);
      setAgents(FALLBACK_AGENTS);
      setActivities(FALLBACK_ACTIVITIES);
      setTopProducts(FALLBACK_TOP_PRODUCTS);
      setRecentOrders(FALLBACK_RECENT_ORDERS);
    } catch (e: any) {
      setError(`Failed to load dashboard data: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Calendar functions - Modern Date Range Picker
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const isDateInRange = (day: number) => {
    if (!customDateRange.start && !customDateRange.end) return false;
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const start = customDateRange.start;
    const end = customDateRange.end;

    if (start && end) {
      return checkDate >= start && checkDate <= end;
    }
    return false;
  };

  const isDateSelected = (day: number, type: 'start' | 'end') => {
    const date = type === 'start' ? customDateRange.start : customDateRange.end;
    if (!date) return false;
    return day === date.getDate() &&
      currentMonth.getMonth() === date.getMonth() &&
      currentMonth.getFullYear() === date.getFullYear();
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (selecting === 'start') {
      setCustomDateRange({ start: selected, end: null });
      setSelecting('end');
    } else {
      if (customDateRange.start && selected < customDateRange.start) {
        setCustomDateRange({ start: selected, end: customDateRange.start });
      } else {
        setCustomDateRange({ ...customDateRange, end: selected });
      }
      setSelecting('start');
    }
    setDateRange('custom');
  };

  const applyDateRange = () => {
    if (customDateRange.start) {
      setShowCalendar(false);
      const end = customDateRange.end || customDateRange.start;
      console.log('Date range selected:', formatDate(customDateRange.start), 'to', formatDate(end));
    }
  };

  const clearDateRange = () => {
    setCustomDateRange({ start: null, end: null });
    setSelecting('start');
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action handlers
  const handleNewOrder = () => {
    if (newOrderForm.customer && newOrderForm.items && newOrderForm.total) {
      const newOrder: RecentOrder = {
        id: `#${12346 + recentOrders.length}`,
        customer: newOrderForm.customer,
        items: parseInt(newOrderForm.items),
        total: `₹${newOrderForm.total}`,
        status: 'pending',
        time: 'Just now'
      };
      setRecentOrders([newOrder, ...recentOrders]);
      setStats({ ...stats, todayOrders: stats.todayOrders + 1, orders: stats.orders + 1 });
      setNewOrderForm({ customer: '', items: '', total: '' });
      setShowNewOrderModal(false);
      alert('Order created successfully!');
    }
  };

  const handleAddCustomer = () => {
    if (newCustomerForm.name && newCustomerForm.email) {
      setStats({ ...stats, customers: stats.customers + 1, newCustomersToday: stats.newCustomersToday + 1 });
      const newActivity: ActivityItem = {
        id: `${activities.length + 1}`,
        type: 'customer',
        title: 'New Customer Added',
        description: `${newCustomerForm.name} registered`,
        timestamp: 'Just now',
        status: 'success'
      };
      setActivities([newActivity, ...activities]);
      setNewCustomerForm({ name: '', email: '', phone: '' });
      setShowAddCustomerModal(false);
      alert('Customer added successfully!');
    }
  };

  const handleTrackDelivery = () => {
    if (trackOrderId) {
      const order = recentOrders.find(o => o.id.toLowerCase() === trackOrderId.toLowerCase());
      if (order) {
        alert(`Order ${order.id} Status: ${order.status.replace(/_/g, ' ').toUpperCase()}\nCustomer: ${order.customer}\nTotal: ${order.total}`);
      } else {
        alert('Order not found. Please check the order ID.');
      }
      setTrackOrderId('');
      setShowTrackDeliveryModal(false);
    }
  };

  const handleExport = () => {
    const data = [
      ['Order ID', 'Customer', 'Items', 'Total', 'Status'],
      ...recentOrders.map(o => [o.id, o.customer, o.items.toString(), o.total, o.status])
    ];

    if (exportFormat === 'csv') {
      const csv = data.map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      // JSON export
      const json = JSON.stringify(recentOrders, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
    setShowExportModal(false);
    alert(`Report exported as ${exportFormat.toUpperCase()}!`);
  };

  const handleShare = () => {
    if (shareEmail) {
      alert(`Dashboard report shared with ${shareEmail}`);
      setShareEmail('');
      setShowShareModal(false);
    }
  };

  const handlePrint = () => {
    window.print();
    setShowPrintModal(false);
  };

  const handleManageVendors = () => {
    alert('Redirecting to Vendor Management...');
    setShowManageVendorsModal(false);
  };

  const notifications = [
    { id: 1, title: 'New Order #12345', message: '₹2,450 from John Doe', time: '2 mins ago', unread: true },
    { id: 2, title: 'Low Stock Alert', message: 'Chicken Breast running low', time: '1 hour ago', unread: true },
    { id: 3, title: 'Rider Offline', message: 'Vikram Singh is now offline', time: '3 hours ago', unread: false },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#1a3c28] animate-pulse shadow-lg shadow-[#2d5a42]/30" />
            <div className="absolute inset-2 rounded-lg bg-[#faf9f6]/90 backdrop-blur-sm" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[#2d5a42]" />
          </div>
          <p className="text-[#5c3d1f] font-semibold text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Welcome back, Admin! 👋</h2>
                <p className="text-[#e8f5ed]/80">Here&apos;s what&apos;s happening with your business today.</p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black bg-gradient-to-r from-[#1a3c28] via-[#234836] to-[#2d5a42] bg-clip-text text-transparent tracking-tight">
              Dashboard Overview
            </h1>
            <Sparkles className="w-6 h-6 text-[#8b6914]" />
          </div>
          <p className="text-[#5c3d1f] font-medium">Real-time operational metrics & analytics</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Selector with Calendar */}
          <div className="flex items-center gap-2 bg-[#faf9f6]/90 backdrop-blur-sm rounded-xl border border-[#dbc4a4]/50 p-1">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => {
                  setDateRange(range);
                  setSelectedDate(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize",
                  dateRange === range && !selectedDate
                    ? 'bg-[#2d5a42] text-[#e8f5ed]'
                    : 'text-[#5c3d1f] hover:bg-[#f0e6d3]'
                )}
              >
                {range}
              </button>
            ))}

            {/* Calendar Button */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  (dateRange === 'custom' && (customDateRange.start || customDateRange.end))
                    ? 'bg-[#8b6914] text-white'
                    : 'text-[#5c3d1f] hover:bg-[#f0e6d3]'
                )}
              >
                <Calendar className="w-4 h-4" />
                {customDateRange.start
                  ? `${formatDisplayDate(customDateRange.start)} ${customDateRange.end ? '- ' + formatDisplayDate(customDateRange.end) : ''}`
                  : 'Custom Date'}
                <ChevronDown className={cn("w-4 h-4 transition-transform", showCalendar && "rotate-180")} />
              </button>

              {/* Calendar Dropdown - Modern Date Range Picker */}
              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    ref={calendarRef}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="fixed sm:absolute right-4 sm:right-0 top-20 sm:top-full sm:mt-2 bg-white rounded-2xl shadow-2xl border border-[#dbc4a4] p-5 z-[100] w-[calc(100vw-2rem)] sm:w-[420px] max-w-[420px]"
                  >
                    {/* Header with Date Range Display */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-[#e8f5ed] to-[#f0e6d3] rounded-xl">
                      <p className="text-xs text-[#5c3d1f] font-medium mb-2">Selected Date Range</p>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "flex-1 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all",
                          selecting === 'start'
                            ? 'border-[#2d5a42] bg-white text-[#1a3c28]'
                            : 'border-transparent bg-white/50 text-[#5c3d1f]'
                        )}>
                          <span className="text-xs text-[#a67c52] block">From</span>
                          {customDateRange.start ? formatDisplayDate(customDateRange.start) : 'Select date'}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#a67c52]" />
                        <div className={cn(
                          "flex-1 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all",
                          selecting === 'end'
                            ? 'border-[#2d5a42] bg-white text-[#1a3c28]'
                            : 'border-transparent bg-white/50 text-[#5c3d1f]'
                        )}>
                          <span className="text-xs text-[#a67c52] block">To</span>
                          {customDateRange.end ? formatDisplayDate(customDateRange.end) : 'Select date'}
                        </div>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {[
                        { label: 'Last 7 Days', days: 7 },
                        { label: 'Last 30 Days', days: 30 },
                        { label: 'This Month', days: 0, type: 'month' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            const end = new Date();
                            let start = new Date();
                            if (preset.type === 'month') {
                              start = new Date(end.getFullYear(), end.getMonth(), 1);
                            } else {
                              start.setDate(end.getDate() - preset.days);
                            }
                            setCustomDateRange({ start, end });
                            setSelecting('start');
                          }}
                          className="px-3 py-1.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg text-xs font-semibold hover:bg-[#e8f5ed] transition-all whitespace-nowrap"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 hover:bg-[#f0e6d3] rounded-xl transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-[#5c3d1f]" />
                      </button>
                      <span className="font-bold text-[#1a3c28] text-lg">
                        {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </span>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 hover:bg-[#f0e6d3] rounded-xl transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-[#5c3d1f]" />
                      </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs text-[#a67c52] font-semibold py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {getDaysInMonth(currentMonth).map((day, idx) => {
                        const isToday = day === new Date().getDate() &&
                          currentMonth.getMonth() === new Date().getMonth() &&
                          currentMonth.getFullYear() === new Date().getFullYear();
                        const inRange = day ? isDateInRange(day) : false;
                        const isStart = day ? isDateSelected(day, 'start') : false;
                        const isEnd = day ? isDateSelected(day, 'end') : false;

                        return (
                          <button
                            key={idx}
                            onClick={() => day && handleDateSelect(day)}
                            disabled={!day}
                            className={cn(
                              "h-10 w-10 rounded-xl text-sm font-semibold transition-all relative",
                              !day && "invisible",
                              day && !inRange && !isStart && !isEnd && "hover:bg-[#f0e6d3] text-[#5c3d1f]",
                              isToday && !isStart && !isEnd && "border-2 border-[#2d5a42] text-[#2d5a42]",
                              inRange && "bg-[#e8f5ed] text-[#2d5a42]",
                              isStart && "bg-[#2d5a42] text-white rounded-r-none",
                              isEnd && "bg-[#2d5a42] text-white rounded-l-none",
                              isStart && isEnd && "rounded-xl"
                            )}
                          >
                            {day}
                            {isToday && !isStart && !isEnd && (
                              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2d5a42] rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Selection Hint */}
                    <div className="mt-4 p-3 bg-[#faf9f6] rounded-xl">
                      <p className="text-xs text-[#5c3d1f] text-center">
                        {selecting === 'start'
                          ? '👆 Click a date to set the START date'
                          : '👆 Click a date to set the END date'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={clearDateRange}
                        className="flex-1 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold text-sm hover:bg-[#e8f5ed] transition-all"
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyDateRange}
                        disabled={!customDateRange.start}
                        className={cn(
                          "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                          customDateRange.start
                            ? 'bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white hover:shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        )}
                      >
                        Apply Range
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Realtime Toggle */}
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

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4]"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-[#faf9f6]/90 backdrop-blur-sm border border-[#dbc4a4]/50 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Bell className="w-5 h-5 text-[#5c3d1f]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#9b2335] text-white text-xs font-bold rounded-full flex items-center justify-center">
                {notifications.filter(n => n.unread).length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#dbc4a4] w-80 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-[#f0e6d3]">
                    <h3 className="font-bold text-[#1a3c28]">Notifications</h3>
                    <p className="text-xs text-[#5c3d1f]">You have {notifications.filter(n => n.unread).length} unread</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-3 border-b border-[#f0e6d3] hover:bg-[#faf9f6] transition-colors cursor-pointer",
                          notif.unread ? 'bg-[#e8f5ed]/30' : ''
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            notif.unread ? 'bg-[#2d5a42]' : 'bg-transparent'
                          )} />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-[#1a3c28]">{notif.title}</p>
                            <p className="text-xs text-[#5c3d1f]">{notif.message}</p>
                            <p className="text-xs text-[#a67c52] mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full p-3 text-sm font-semibold text-[#2d5a42] hover:bg-[#e8f5ed] transition-colors"
                  >
                    View All Notifications
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-[#f0e6d3] to-[#faf6f0] border border-[#c49a6c]/50 p-4 rounded-2xl flex items-center gap-3 text-[#8b6914] shadow-lg shadow-[#8b6914]/10"
        >
          <div className="p-2 bg-[#f0e6d3] rounded-lg">
            <Activity className="w-5 h-5 text-[#8b6914]" />
          </div>
          <span className="font-semibold">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-sm font-semibold underline">Dismiss</button>
        </motion.div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {/* Total Orders */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] p-4 rounded-2xl text-white shadow-lg cursor-pointer"
          onClick={() => setShowAllOrders(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-[#e8f5ed]" />
            <span className="flex items-center gap-1 text-xs text-[#e8f5ed]/70">
              <ArrowUpRight className="w-3 h-3" />
              +{stats.growthRate}%
            </span>
          </div>
          <p className="text-2xl font-black">{stats.todayOrders}</p>
          <p className="text-xs text-[#e8f5ed]/70 mt-1">Today&apos;s Orders</p>
        </motion.div>

        {/* Revenue */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-[#8b6914] to-[#c49a6c] p-4 rounded-2xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Wallet className="w-5 h-5 text-white" />
            <span className="flex items-center gap-1 text-xs text-white/70">
              <ArrowUpRight className="w-3 h-3" />
              +8.2%
            </span>
          </div>
          <p className="text-2xl font-black">{stats.revenue}</p>
          <p className="text-xs text-white/70 mt-1">Revenue</p>
        </motion.div>

        {/* Active Orders */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#e8f5ed] p-4 rounded-2xl border border-[#2d5a42]/20 cursor-pointer"
          onClick={() => setShowAllOrders(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-[#2d5a42]" />
            <span className="text-xs text-[#a67c52]">Active</span>
          </div>
          <p className="text-2xl font-black text-[#2d5a42]">{stats.orders}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Active Orders</p>
        </motion.div>

        {/* Out for Delivery */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm cursor-pointer"
          onClick={() => setShowTrackDeliveryModal(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-5 h-5 text-[#3d7a58]" />
            <span className="text-xs text-[#a67c52]">Transit</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.deliveries}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Out for Delivery</p>
        </motion.div>

        {/* Customers */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white p-4 rounded-2xl border border-[#dbc4a4] shadow-sm cursor-pointer"
          onClick={() => setShowAddCustomerModal(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-[#a67c52]" />
            <span className="text-xs text-[#a67c52]">Total</span>
          </div>
          <p className="text-2xl font-black text-[#1a3c28]">{stats.customers}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Customers</p>
        </motion.div>

        {/* Vendors */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-[#f0e6d3] p-4 rounded-2xl border border-[#dbc4a4] cursor-pointer"
          onClick={() => setShowManageVendorsModal(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <Store className="w-5 h-5 text-[#8b6914]" />
            <span className="text-xs text-[#a67c52]">Active</span>
          </div>
          <p className="text-2xl font-black text-[#8b6914]">{stats.vendors}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">Vendors</p>
        </motion.div>

        {/* Critical Tickets */}
        <motion.div
          whileHover={{ y: -4 }}
          className={cn(
            "p-4 rounded-2xl border shadow-sm cursor-pointer",
            stats.sla > 5 ? 'bg-red-50 border-red-200' : 'bg-white border-[#dbc4a4]'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <AlertOctagon className={cn("w-5 h-5", stats.sla > 5 ? 'text-red-600' : 'text-[#9b2335]')} />
            <span className={cn("text-xs", stats.sla > 5 ? 'text-red-600' : 'text-[#a67c52]')}>Critical</span>
          </div>
          <p className={cn("text-2xl font-black", stats.sla > 5 ? 'text-red-600' : 'text-[#9b2335]')}>{stats.sla}</p>
          <p className="text-xs text-[#5c3d1f] mt-1">High Priority</p>
        </motion.div>

        {/* Conversion Rate */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-white" />
            <span className="text-xs text-white/70">Rate</span>
          </div>
          <p className="text-2xl font-black">{stats.conversionRate}%</p>
          <p className="text-xs text-white/70 mt-1">Conversion</p>
        </motion.div>
      </div>

      {/* Rest of the dashboard content... (charts, tables, etc) */}
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-[#1a3c28]">Order Activity</h3>
              <p className="text-sm text-[#5c3d1f]">Last 7 hours performance</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#3d7a58] to-[#4a9a6e]" />
                <span className="text-[#5c3d1f] font-semibold">Completed</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#8b6914] to-[#c49a6c]" />
                <span className="text-[#5c3d1f] font-semibold">Pending</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#9b2335] to-[#c44569]" />
                <span className="text-[#5c3d1f] font-semibold">Cancelled</span>
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={slaData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbc4a4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f', fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c3d1f', fontWeight: 500 }} />
                <Tooltip
                  cursor={{ fill: '#f0e6d3' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px -10px rgba(26,60,40,0.15)', padding: '12px 16px', background: '#faf9f6' }}
                />
                <Bar dataKey="resolved" fill="url(#gradientSuccess)" radius={[8, 8, 0, 0]} barSize={24} name="Completed" />
                <Bar dataKey="pending" fill="url(#gradientWarning)" radius={[8, 8, 0, 0]} barSize={24} name="Pending" />
                <Bar dataKey="breached" fill="url(#gradientDanger)" radius={[8, 8, 0, 0]} barSize={24} name="Cancelled" />
                <defs>
                  <linearGradient id="gradientSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a9a6e" />
                    <stop offset="100%" stopColor="#2d5a42" />
                  </linearGradient>
                  <linearGradient id="gradientWarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c49a6c" />
                    <stop offset="100%" stopColor="#8b6914" />
                  </linearGradient>
                  <linearGradient id="gradientDanger" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c44569" />
                    <stop offset="100%" stopColor="#9b2335" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-[#1a3c28]">Order Status</h3>
              <p className="text-sm text-[#5c3d1f]">Distribution breakdown</p>
            </div>
            <PieChart className="w-5 h-5 text-[#a67c52]" />
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(26,60,40,0.15)', background: '#faf9f6' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#5c3d1f]">{item.name}</span>
                </div>
                <span className="font-bold text-[#1a3c28]">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* More sections... */}
      {/* Quick Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3 p-4 bg-[#faf9f6]/80 backdrop-blur-xl rounded-2xl border border-[#dbc4a4]/40 shadow-lg"
      >
        <span className="text-sm font-bold text-[#5c3d1f] py-2">Quick Actions:</span>
        <button
          onClick={() => setShowNewOrderModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#2d5a42] text-white rounded-xl font-semibold text-sm hover:bg-[#3d7a58] transition-all"
        >
          <Plus className="w-4 h-4" />
          New Order
        </button>
        <button
          onClick={() => setShowTrackDeliveryModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e8f5ed] text-[#2d5a42] rounded-xl font-semibold text-sm hover:bg-[#f0e6d3] transition-all"
        >
          <Truck className="w-4 h-4" />
          Track Delivery
        </button>
        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold text-sm hover:bg-[#e8f5ed] transition-all"
        >
          <Users className="w-4 h-4" />
          Add Customer
        </button>
        <button
          onClick={() => setShowManageVendorsModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold text-sm hover:bg-[#e8f5ed] transition-all"
        >
          <Store className="w-4 h-4" />
          Manage Vendors
        </button>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold text-sm hover:bg-[#e8f5ed] transition-all"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
        <button
          onClick={() => setShowPrintModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold text-sm hover:bg-[#e8f5ed] transition-all"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold text-sm hover:bg-[#e8f5ed] transition-all"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </motion.div>

      {/* Modals */}
      {/* New Order Modal */}
      <AnimatePresence>
        {showNewOrderModal && (
          <Modal onClose={() => setShowNewOrderModal(false)} title="Create New Order">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newOrderForm.customer}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customer: e.target.value })}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Number of Items</label>
                <input
                  type="number"
                  value={newOrderForm.items}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, items: e.target.value })}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter item count"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Total Amount (₹)</label>
                <input
                  type="number"
                  value={newOrderForm.total}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, total: e.target.value })}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter total amount"
                />
              </div>
              <button
                onClick={handleNewOrder}
                className="w-full py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Create Order
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Track Delivery Modal */}
      <AnimatePresence>
        {showTrackDeliveryModal && (
          <Modal onClose={() => setShowTrackDeliveryModal(false)} title="Track Delivery">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Order ID</label>
                <input
                  type="text"
                  value={trackOrderId}
                  onChange={(e) => setTrackOrderId(e.target.value)}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter order ID (e.g., #12345)"
                />
              </div>
              <button
                onClick={handleTrackDelivery}
                className="w-full py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Track Order
              </button>
              <div className="bg-[#f0e6d3]/50 p-3 rounded-xl">
                <p className="text-sm text-[#5c3d1f]">Recent orders: #12345, #12344, #12343, #12342, #12341</p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomerModal && (
          <Modal onClose={() => setShowAddCustomerModal(false)} title="Add New Customer">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Full Name</label>
                <input
                  type="text"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Email</label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter phone number"
                />
              </div>
              <button
                onClick={handleAddCustomer}
                className="w-full py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Add Customer
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Manage Vendors Modal */}
      <AnimatePresence>
        {showManageVendorsModal && (
          <Modal onClose={() => setShowManageVendorsModal(false)} title="Manage Vendors">
            <div className="space-y-4">
              <p className="text-[#5c3d1f]">You have {stats.vendors} active vendors.</p>
              <div className="bg-[#f0e6d3]/50 p-4 rounded-xl space-y-2">
                <p className="text-sm font-medium text-[#1a3c28]">Quick Actions:</p>
                <button onClick={handleManageVendors} className="block w-full text-left px-4 py-2 bg-white rounded-lg text-sm text-[#5c3d1f] hover:bg-[#e8f5ed] transition-colors">
                  View All Vendors
                </button>
                <button onClick={handleManageVendors} className="block w-full text-left px-4 py-2 bg-white rounded-lg text-sm text-[#5c3d1f] hover:bg-[#e8f5ed] transition-colors">
                  Pending Approvals
                </button>
                <button onClick={handleManageVendors} className="block w-full text-left px-4 py-2 bg-white rounded-lg text-sm text-[#5c3d1f] hover:bg-[#e8f5ed] transition-colors">
                  Vendor Performance
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <Modal onClose={() => setShowExportModal(false)} title="Export Report">
            <div className="space-y-4">
              <p className="text-[#5c3d1f]">Choose export format:</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setExportFormat('csv')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                    exportFormat === 'csv'
                      ? 'bg-[#2d5a42] text-white'
                      : 'bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]'
                  )}
                >
                  CSV Format
                </button>
                <button
                  onClick={() => setExportFormat('json')}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-semibold text-sm transition-all",
                    exportFormat === 'json'
                      ? 'bg-[#2d5a42] text-white'
                      : 'bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]'
                  )}
                >
                  JSON Format
                </button>
              </div>
              <button
                onClick={handleExport}
                className="w-full py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Download Report
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <Modal onClose={() => setShowShareModal(false)} title="Share Report">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c3d1f] mb-1">Email Address</label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  placeholder="Enter recipient email"
                />
              </div>
              <button
                onClick={handleShare}
                className="w-full py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Share Report
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Print Modal */}
      <AnimatePresence>
        {showPrintModal && (
          <Modal onClose={() => setShowPrintModal(false)} title="Print Report">
            <div className="space-y-4">
              <p className="text-[#5c3d1f]">Print the current dashboard report?</p>
              <div className="bg-[#f0e6d3]/50 p-4 rounded-xl">
                <p className="text-sm text-[#5c3d1f]">This will print:</p>
                <ul className="text-sm text-[#5c3d1f] list-disc list-inside mt-2">
                  <li>KPI Summary</li>
                  <li>Order Activity Chart</li>
                  <li>Recent Orders</li>
                  <li>Top Products</li>
                </ul>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="flex-1 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Print Now
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Component
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1a3c28]">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-[#f0e6d3] rounded-xl transition-colors">
            <X className="w-5 h-5 text-[#5c3d1f]" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

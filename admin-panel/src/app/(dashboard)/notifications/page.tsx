'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  X,
  Users,
  ShoppingBag,
  Store,
  Truck,
  MessageSquare,
  AlertCircle,
  FileText,
  CreditCard,
  Settings,
  Trash2,
  CheckCheck,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Pin,
  Archive,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Notification {
  id: string;
  type: 'order' | 'user' | 'vendor' | 'partner' | 'payment' | 'support' | 'system' | 'alert';
  title: string;
  message: string;
  metadata?: {
    orderId?: string;
    userId?: string;
    vendorId?: string;
    amount?: string;
    status?: string;
  };
  isRead: boolean;
  isPinned: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  priority: 'high' | 'medium' | 'low';
}

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOT-001',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2024-000123 has been placed by Priya Sharma for ₹2,450',
    metadata: { orderId: 'ORD-2024-000123', amount: '₹2,450', status: 'pending' },
    isRead: false,
    isPinned: true,
    priority: 'high',
    createdAt: '2024-01-16T10:30:00Z',
    actionUrl: '/orders/ORD-2024-000123',
    actionText: 'View Order',
  },
  {
    id: 'NOT-002',
    type: 'partner',
    title: 'New Partner Application',
    message: 'Rajesh Kumar has applied as a delivery partner. Documents pending verification.',
    metadata: { userId: 'DP-001' },
    isRead: false,
    isPinned: false,
    priority: 'medium',
    createdAt: '2024-01-16T09:45:00Z',
    actionUrl: '/partner-applications',
    actionText: 'Review Application',
  },
  {
    id: 'NOT-003',
    type: 'vendor',
    title: 'Vendor Registration Complete',
    message: 'Premium Meats has completed their registration and is now live.',
    metadata: { vendorId: 'VN-001' },
    isRead: true,
    isPinned: false,
    priority: 'medium',
    createdAt: '2024-01-16T08:20:00Z',
    readAt: '2024-01-16T08:25:00Z',
    actionUrl: '/vendors/VN-001',
    actionText: 'View Vendor',
  },
  {
    id: 'NOT-004',
    type: 'payment',
    title: 'Payment Failed',
    message: 'Payment for Order #ORD-2024-000120 failed. Customer needs to retry.',
    metadata: { orderId: 'ORD-2024-000120', amount: '₹1,850' },
    isRead: false,
    isPinned: false,
    priority: 'high',
    createdAt: '2024-01-16T07:15:00Z',
    actionUrl: '/payments',
    actionText: 'View Details',
  },
  {
    id: 'NOT-005',
    type: 'support',
    title: 'New Support Ticket',
    message: 'Ticket #TKT-00456: Customer reporting delivery delay in Koramangala.',
    metadata: { orderId: 'ORD-2024-000115' },
    isRead: true,
    isPinned: false,
    priority: 'high',
    createdAt: '2024-01-16T06:30:00Z',
    readAt: '2024-01-16T06:35:00Z',
    actionUrl: '/support/TKT-00456',
    actionText: 'View Ticket',
  },
  {
    id: 'NOT-006',
    type: 'alert',
    title: 'Low Stock Alert',
    message: 'Premium Meats has reported low stock on Chicken Breast. Consider restocking.',
    metadata: { vendorId: 'VN-001' },
    isRead: false,
    isPinned: false,
    priority: 'medium',
    createdAt: '2024-01-16T05:00:00Z',
  },
  {
    id: 'NOT-007',
    type: 'system',
    title: 'Daily Report Ready',
    message: 'Your daily sales and performance report for Jan 15, 2024 is now available.',
    isRead: true,
    isPinned: false,
    priority: 'low',
    createdAt: '2024-01-16T00:00:00Z',
    readAt: '2024-01-16T08:00:00Z',
  },
  {
    id: 'NOT-008',
    type: 'user',
    title: 'New User Registration',
    message: 'Welcome! 150 new users signed up today. 45 completed their first order.',
    isRead: true,
    isPinned: false,
    priority: 'low',
    createdAt: '2024-01-15T23:59:00Z',
    readAt: '2024-01-16T08:00:00Z',
  },
];

const TYPE_CONFIG = {
  order: { icon: ShoppingBag, color: 'bg-blue-100 text-blue-700', label: 'Order' },
  user: { icon: Users, color: 'bg-emerald-100 text-emerald-700', label: 'User' },
  vendor: { icon: Store, color: 'bg-violet-100 text-violet-700', label: 'Vendor' },
  partner: { icon: Truck, color: 'bg-amber-100 text-amber-700', label: 'Partner' },
  payment: { icon: CreditCard, color: 'bg-rose-100 text-rose-700', label: 'Payment' },
  support: { icon: MessageSquare, color: 'bg-indigo-100 text-indigo-700', label: 'Support' },
  system: { icon: Settings, color: 'bg-gray-100 text-gray-700', label: 'System' },
  alert: { icon: AlertCircle, color: 'bg-orange-100 text-orange-700', label: 'Alert' },
};

const PRIORITY_CONFIG = {
  high: { color: 'text-rose-600 bg-rose-50 border-rose-200', label: 'High' },
  medium: { color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Medium' },
  low: { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Low' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter notifications
  useEffect(() => {
    let filtered = [...notifications];
    
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }
    
    if (readFilter !== 'all') {
      filtered = filtered.filter(n => readFilter === 'read' ? n.isRead : !n.isRead);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(n => n.priority === priorityFilter);
    }

    // Sort: pinned first, then by date (newest first)
    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setFilteredNotifications(filtered);
  }, [searchQuery, typeFilter, readFilter, priorityFilter, notifications]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, isRead: true, readAt: new Date().toISOString() }
        : n
    ));
  };

  const handleMarkAsUnread = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, isRead: false, readAt: undefined }
        : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => 
      !n.isRead 
        ? { ...n, isRead: true, readAt: new Date().toISOString() }
        : n
    ));
  };

  const handleTogglePin = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, isPinned: !n.isPinned }
        : n
    ));
  };

  const handleDelete = (notificationId: string) => {
    if (!confirm('Delete this notification?')) return;
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
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
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    pinned: notifications.filter(n => n.isPinned).length,
    highPriority: notifications.filter(n => n.priority === 'high' && !n.isRead).length,
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-6">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
              {stats.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {stats.unread > 9 ? '9+' : stats.unread}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a3c28]">Notifications Center</h1>
              <p className="text-[#5c3d1f]">Real-time alerts for registrations, orders, and system events</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 bg-white border border-[#dbc4a4]/50 rounded-xl hover:bg-[#f0e6d3] transition-colors"
            >
              <RefreshCw className={cn("w-5 h-5 text-[#5c3d1f]", refreshing && "animate-spin")} />
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={stats.unread === 0}
              className="px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-medium hover:bg-[#e8dcc8] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Bell, color: 'from-[#2d5a42] to-[#3d7a58]' },
          { label: 'Unread', value: stats.unread, icon: Eye, color: 'from-rose-500 to-rose-600' },
          { label: 'Pinned', value: stats.pinned, icon: Pin, color: 'from-amber-500 to-amber-600' },
          { label: 'High Priority', value: stats.highPriority, icon: AlertTriangle, color: 'from-orange-500 to-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "bg-white rounded-xl p-4 border border-[#dbc4a4]/30 shadow-sm cursor-pointer hover:shadow-md transition-shadow",
              stat.label === 'Unread' && stats.unread > 0 && "ring-2 ring-rose-200"
            )}
            onClick={() => {
              if (stat.label === 'Unread') setReadFilter('unread');
              else if (stat.label === 'Pinned') {
                // Show only pinned (would need additional state)
              }
              else setReadFilter('all');
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[#5c3d1f]">{stat.label}</p>
              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1a3c28]">{stat.value}</p>
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
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Types</option>
            <option value="order">Orders</option>
            <option value="user">Users</option>
            <option value="vendor">Vendors</option>
            <option value="partner">Partners</option>
            <option value="payment">Payments</option>
            <option value="support">Support</option>
            <option value="alert">Alerts</option>
            <option value="system">System</option>
          </select>

          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value as any)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#faf9f6] border border-[#dbc4a4]/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-[#dbc4a4]/30 shadow-sm overflow-hidden"
      >
        <div className="max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => {
              const TypeIcon = TYPE_CONFIG[notification.type].icon;
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-4 border-b border-[#dbc4a4]/20 transition-colors group",
                    !notification.isRead ? "bg-blue-50/30" : "hover:bg-[#faf9f6]",
                    notification.isPinned && "border-l-4 border-l-amber-400"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", TYPE_CONFIG[notification.type].color)}>
                      <TypeIcon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={cn("font-semibold text-[#1a3c28]", !notification.isRead && "text-blue-900")}>
                              {notification.title}
                            </h4>
                            <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", PRIORITY_CONFIG[notification.priority].color)}>
                              {PRIORITY_CONFIG[notification.priority].label}
                            </span>
                            {notification.isPinned && (
                              <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <p className={cn("text-sm mb-2", !notification.isRead ? "text-blue-800" : "text-[#5c3d1f]")}>
                            {notification.message}
                          </p>
                          
                          {/* Metadata */}
                          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {notification.metadata.orderId && (
                                <span className="px-2 py-1 bg-[#f0e6d3] text-[#5c3d1f] text-xs rounded">
                                  Order: {notification.metadata.orderId}
                                </span>
                              )}
                              {notification.metadata.amount && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">
                                  Amount: {notification.metadata.amount}
                                </span>
                              )}
                              {notification.metadata.status && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded capitalize">
                                  {notification.metadata.status}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center gap-4 text-xs text-[#8b6914]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(notification.createdAt)}
                            </span>
                            {notification.isRead && notification.readAt && (
                              <span className="text-[#5c3d1f]">
                                Read {formatTime(notification.readAt)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead ? (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsUnread(notification.id)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Mark as unread"
                            >
                              <EyeOff className="w-4 h-4 text-blue-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleTogglePin(notification.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              notification.isPinned ? "bg-amber-100" : "hover:bg-amber-50"
                            )}
                            title={notification.isPinned ? "Unpin" : "Pin"}
                          >
                            <Pin className={cn("w-4 h-4", notification.isPinned ? "text-amber-600 fill-amber-600" : "text-[#5c3d1f]")} />
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </button>
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#2d5a42] text-white rounded-lg text-sm font-medium hover:bg-[#1a3c28] transition-colors"
                        >
                          {notification.actionText || 'View Details'}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-[#c49a6c] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1a3c28] mb-2">No notifications</h3>
            <p className="text-[#5c3d1f]">You&apos;re all caught up!</p>
          </div>
        )}
      </motion.div>

      {/* Notification Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
          >
            <div className="p-6 border-b border-[#dbc4a4]/30 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1a3c28]">Notification Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-[#f0e6d3] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#5c3d1f]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-[#faf9f6] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.color)}>
                      <config.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-[#1a3c28]">{config.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d5a42]"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

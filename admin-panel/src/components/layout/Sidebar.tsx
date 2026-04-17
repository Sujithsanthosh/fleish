"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Users,
  Truck,
  Package,
  CreditCard,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  Settings,
  LogOut,
  Map as MapIcon,
  Building2,
  Sparkles,
  Crown,
  ChevronRight,
  Zap,
  Globe,
  Briefcase,
  Star,
  Quote,
  Smartphone,
  Tag,
  Image as ImageIcon,
  Edit3,
  Bell
} from 'lucide-react';
import { Module, useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';

interface SidebarItem {
  name: string;
  module: Module;
  icon: any;
  href: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', module: 'DASHBOARD', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Live Tracking', module: 'ORDERS', icon: MapIcon, href: '/tracking' },
  { name: 'Orders', module: 'ORDERS', icon: ShoppingBag, href: '/orders' },
  { name: 'Stores', module: 'VENDORS', icon: Store, href: '/stores' },
  { name: 'Vendors', module: 'VENDORS', icon: Building2, href: '/vendors' },
  { name: 'Customers', module: 'CUSTOMERS', icon: Users, href: '/customers' },
  { name: 'Delivery Partners', module: 'RIDERS', icon: Truck, href: '/riders' },
  { name: 'Products', module: 'PRODUCTS', icon: Package, href: '/products' },
  { name: 'Payments', module: 'PAYMENTS', icon: CreditCard, href: '/payments' },
  { name: 'Accounts', module: 'ACCOUNTS', icon: Building2, href: '/accounts' },
  { name: 'Support Tickets', module: 'SUPPORT_TICKETS', icon: MessageSquare, href: '/support' },
  { name: 'Analytics', module: 'ANALYTICS', icon: BarChart3, href: '/analytics' },
];

const NEW_FEATURES: SidebarItem[] = [
  { name: 'Partner Applications', module: 'RIDERS', icon: Users, href: '/partner-applications' },
  { name: 'Document Verification', module: 'VENDORS', icon: ShieldCheck, href: '/document-verification' },
  { name: 'Promo Banners', module: 'SETTINGS', icon: ImageIcon, href: '/promo-banners' },
  { name: 'Content Editor', module: 'SETTINGS', icon: Edit3, href: '/content-editor' },
  { name: 'Notifications', module: 'SETTINGS', icon: Bell, href: '/notifications' },
  { name: 'Pricing Plans', module: 'SETTINGS', icon: Tag, href: '/pricing' },
  { name: 'Vendor Onboarding', module: 'VENDORS', icon: Briefcase, href: '/vendor-onboarding' },
  { name: 'Delivery Partners', module: 'RIDERS', icon: Truck, href: '/delivery-partners' },
  { name: 'Subscriptions', module: 'PAYMENTS', icon: Crown, href: '/subscriptions' },
  { name: 'Careers', module: 'ROLES', icon: Briefcase, href: '/careers' },
  { name: 'Testimonials', module: 'SETTINGS', icon: Quote, href: '/testimonials' },
  { name: 'Team', module: 'ROLES', icon: Users, href: '/team' },
  { name: 'Ecosystem Apps', module: 'SETTINGS', icon: Smartphone, href: '/ecosystem' },
];

const ECOSYSTEM_LINKS = [
  { name: 'Support Panel', icon: MessageSquare, href: 'http://localhost:3002', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { name: 'Vendor App', icon: Store, href: 'http://localhost:8081', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Delivery App', icon: Truck, href: 'http://localhost:8082', color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: 'Website', icon: Globe, href: 'http://localhost:3000', color: 'text-violet-500', bg: 'bg-violet-50' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, hasPermission, logout } = useAuthStore();

  const filteredItems = SIDEBAR_ITEMS.filter(item => hasPermission(item.module, 'VIEW'));
  const filteredNewFeatures = NEW_FEATURES.filter(item => hasPermission(item.module, 'VIEW'));

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-[#faf9f6] to-[#f0ebe3] backdrop-blur-xl border-r border-[#dbc4a4]/50 flex flex-col fixed left-0 top-0 shadow-xl shadow-[#1a3c28]/10 z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#c49a6c]/30">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2d5a42] via-[#234836] to-[#1a3c28] rounded-xl flex items-center justify-center shadow-lg shadow-[#2d5a42]/30 group-hover:shadow-[#2d5a42]/50 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-[#e8f5ed]" />
          </div>
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-[#1a3c28] to-[#3d7a58] bg-clip-text text-transparent">Fleish</span>
            <p className="text-[11px] font-bold text-[#8b6914] tracking-wider uppercase">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#5c3d1f] mb-2 px-3">Main Menu</p>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#2d5a42]/15 to-[#3d7a58]/10 text-[#1a3c28] border border-[#2d5a42]/25 shadow-sm"
                    : "text-[#3d2914] hover:bg-[#f0e6d3]/60 hover:text-[#1a3c28]"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  pathname === item.href 
                    ? "bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-md shadow-[#2d5a42]/25" 
                    : "bg-[#f0e6d3] text-[#5c3d1f] group-hover:bg-[#e8f5ed] group-hover:shadow-sm"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="flex-1">{item.name}</span>
                {pathname === item.href && <ChevronRight className="w-4 h-4 text-[#2d5a42]" />}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* New Features Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8b6914] mb-2 px-3 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            New Features
          </p>
          {filteredNewFeatures.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#8b6914]/15 to-[#c49a6c]/10 text-[#5c3d1f] border border-[#8b6914]/25 shadow-sm"
                    : "text-[#5c3d1f] hover:bg-[#f0e6d3]/60 hover:text-[#3d2914]"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-all duration-200",
                  pathname === item.href 
                    ? "bg-gradient-to-br from-[#8b6914] to-[#c49a6c] text-[#faf6f0] shadow-md shadow-[#8b6914]/25" 
                    : "bg-[#f0e6d3] text-[#8b6914] group-hover:bg-[#faf6f0] group-hover:shadow-sm"
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="flex-1">{item.name}</span>
                {pathname === item.href && <ChevronRight className="w-4 h-4 text-[#8b6914]" />}
              </Link>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Ecosystem Links */}
      <div className="px-4 py-4 border-t border-[#c49a6c]/30">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#5c3d1f] mb-3 px-3 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          Ecosystem
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ECOSYSTEM_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105",
                link.bg,
                link.color,
                "hover:shadow-md"
              )}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-[10px]">{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-[#c49a6c]/30 bg-gradient-to-r from-[#f0e6d3]/40 to-[#faf9f6]/60">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] rounded-xl flex items-center justify-center text-[#e8f5ed] font-bold shadow-lg shadow-[#2d5a42]/30">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1a3c28] truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-[#5c3d1f] truncate">{typeof user?.role === 'string' ? user.role : user?.role?.name || 'Super Admin'}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#9b2335] bg-[#fff5f5] hover:bg-[#fee2e2] transition-all duration-200 border border-[#fecaca]/50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </div>
  );
}

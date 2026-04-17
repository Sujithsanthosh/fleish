"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Truck,
  Clock,
  Package,
  Phone,
  User,
  Search,
  Filter,
  RefreshCcw,
  Wifi,
  WifiOff,
  ChevronRight,
  ChevronLeft,
  Target,
  Route,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Maximize2,
  Minimize2,
  Layers,
  Satellite,
  Map as MapIcon,
  Crosshair
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  totalDeliveries: number;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

interface LiveOrder {
  id: string;
  orderId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  vendor: {
    name: string;
    address: string;
  };
  items: number;
  total: string;
  status: 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'nearby' | 'delivered';
  partner: DeliveryPartner;
  location: {
    lat: number;
    lng: number;
  };
  estimatedTime: string;
  distance: string;
  path: { lat: number; lng: number }[];
}

// Mock Data - Delivery Partners
const DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 'dp1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    vehicle: 'Bike',
    vehicleNumber: 'MH-12-AB-1234',
    rating: 4.8,
    totalDeliveries: 1256,
    avatar: 'RK',
    status: 'online'
  },
  {
    id: 'dp2',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    vehicle: 'Scooter',
    vehicleNumber: 'MH-12-CD-5678',
    rating: 4.9,
    totalDeliveries: 892,
    avatar: 'PS',
    status: 'busy'
  },
  {
    id: 'dp3',
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    vehicle: 'Bike',
    vehicleNumber: 'MH-12-EF-9012',
    rating: 4.7,
    totalDeliveries: 634,
    avatar: 'AP',
    status: 'online'
  },
  {
    id: 'dp4',
    name: 'Sneha Gupta',
    phone: '+91 98765 43213',
    vehicle: 'Bike',
    vehicleNumber: 'MH-12-GH-3456',
    rating: 4.6,
    totalDeliveries: 445,
    avatar: 'SG',
    status: 'offline'
  }
];

// Mock Live Orders
const MOCK_ORDERS: LiveOrder[] = [
  {
    id: 'live1',
    orderId: '#ORD-2024-001',
    customer: {
      name: 'John Doe',
      phone: '+91 98765 12345',
      address: '123 Main Street, Koregaon Park, Pune'
    },
    vendor: {
      name: 'Fresh Meat Shop',
      address: 'FC Road, Pune'
    },
    items: 5,
    total: '₹2,450',
    status: 'in_transit',
    partner: DELIVERY_PARTNERS[0],
    location: { lat: 18.5204, lng: 73.8567 },
    estimatedTime: '15 mins',
    distance: '2.3 km',
    path: [
      { lat: 18.5204, lng: 73.8567 },
      { lat: 18.5210, lng: 73.8570 },
      { lat: 18.5215, lng: 73.8575 },
      { lat: 18.5220, lng: 73.8580 }
    ]
  },
  {
    id: 'live2',
    orderId: '#ORD-2024-002',
    customer: {
      name: 'Jane Smith',
      phone: '+91 98765 12346',
      address: '456 Oak Avenue, Kalyani Nagar, Pune'
    },
    vendor: {
      name: 'Premium Meats',
      address: 'JM Road, Pune'
    },
    items: 3,
    total: '₹1,850',
    status: 'picked_up',
    partner: DELIVERY_PARTNERS[1],
    location: { lat: 18.5350, lng: 73.8900 },
    estimatedTime: '25 mins',
    distance: '4.1 km',
    path: [
      { lat: 18.5350, lng: 73.8900 },
      { lat: 18.5355, lng: 73.8895 },
      { lat: 18.5360, lng: 73.8890 }
    ]
  },
  {
    id: 'live3',
    orderId: '#ORD-2024-003',
    customer: {
      name: 'Mike Johnson',
      phone: '+91 98765 12347',
      address: '789 Pine Road, Baner, Pune'
    },
    vendor: {
      name: 'City Meat Market',
      address: 'Baner Road, Pune'
    },
    items: 8,
    total: '₹4,200',
    status: 'nearby',
    partner: DELIVERY_PARTNERS[2],
    location: { lat: 18.5590, lng: 73.7860 },
    estimatedTime: '5 mins',
    distance: '0.8 km',
    path: [
      { lat: 18.5590, lng: 73.7860 },
      { lat: 18.5595, lng: 73.7855 }
    ]
  }
];

// Status configurations
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  preparing: { label: 'Preparing', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  ready: { label: 'Ready for Pickup', color: 'text-blue-600', bg: 'bg-blue-100', icon: Package },
  picked_up: { label: 'Picked Up', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Truck },
  in_transit: { label: 'In Transit', color: 'text-purple-600', bg: 'bg-purple-100', icon: Navigation },
  nearby: { label: 'Nearby', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: MapPin },
  delivered: { label: 'Delivered', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 }
};

// Simulated Map Component
const SimulatedMap = ({
  orders,
  selectedOrder,
  mapType,
  center,
  zoom,
  onOrderClick
}: {
  orders: LiveOrder[];
  selectedOrder: LiveOrder | null;
  mapType: 'standard' | 'satellite';
  center: { lat: number; lng: number };
  zoom: number;
  onOrderClick: (order: LiveOrder) => void;
}) => {
  // Generate grid lines for map effect
  const gridLines = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      {/* Map Background */}
      <div
        className={cn(
          "absolute inset-0 transition-all duration-500",
          mapType === 'satellite'
            ? 'bg-gradient-to-br from-[#2d3436] via-[#636e72] to-[#b2bec3]'
            : 'bg-gradient-to-br from-[#e8f5ed] via-[#d4e8d9] to-[#c8e0cf]'
        )}
      >
        {/* Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke={mapType === 'satellite' ? '#ffffff' : '#2d5a42'} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Roads/Paths */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Main Roads */}
          <path
            d="M 0 30% Q 25% 35% 50% 30% T 100% 35%"
            fill="none"
            stroke={mapType === 'satellite' ? '#636e72' : '#ffffff'}
            strokeWidth="8"
            opacity="0.6"
          />
          <path
            d="M 20% 0 Q 25% 50% 20% 100%"
            fill="none"
            stroke={mapType === 'satellite' ? '#636e72' : '#ffffff'}
            strokeWidth="6"
            opacity="0.5"
          />
          <path
            d="M 70% 0 Q 75% 40% 70% 100%"
            fill="none"
            stroke={mapType === 'satellite' ? '#636e72' : '#ffffff'}
            strokeWidth="5"
            opacity="0.5"
          />
          <path
            d="M 0 70% Q 40% 65% 60% 70% T 100% 65%"
            fill="none"
            stroke={mapType === 'satellite' ? '#636e72' : '#ffffff'}
            strokeWidth="4"
            opacity="0.4"
          />
        </svg>

        {/* Parks/Areas */}
        <div className="absolute top-[15%] left-[10%] w-[20%] h-[15%] rounded-2xl bg-[#2d5a42]/10" />
        <div className="absolute top-[60%] right-[15%] w-[25%] h-[20%] rounded-2xl bg-[#2d5a42]/10" />
        <div className="absolute bottom-[20%] left-[30%] w-[15%] h-[12%] rounded-2xl bg-[#2d5a42]/10" />

        {/* Buildings/POI Markers */}
        <div className="absolute top-[25%] left-[40%] flex flex-col items-center">
          <div className="w-3 h-3 bg-[#8b6914] rounded-sm" />
          <span className="text-[8px] text-[#5c3d1f] font-medium mt-1 bg-white/80 px-1 rounded">Shop 1</span>
        </div>
        <div className="absolute top-[45%] right-[35%] flex flex-col items-center">
          <div className="w-3 h-3 bg-[#8b6914] rounded-sm" />
          <span className="text-[8px] text-[#5c3d1f] font-medium mt-1 bg-white/80 px-1 rounded">Shop 2</span>
        </div>
        <div className="absolute bottom-[35%] left-[55%] flex flex-col items-center">
          <div className="w-3 h-3 bg-[#2d5a42] rounded-sm" />
          <span className="text-[8px] text-[#5c3d1f] font-medium mt-1 bg-white/80 px-1 rounded">Customer</span>
        </div>
      </div>

      {/* Order Routes and Markers */}
      {orders.map((order, index) => {
        const isSelected = selectedOrder?.id === order.id;
        const positions = [
          { top: '30%', left: '25%' },
          { top: '45%', left: '70%' },
          { top: '65%', left: '45%' }
        ];
        const pos = positions[index % positions.length];

        return (
          <React.Fragment key={order.id}>
            {/* Route Path Animation */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d={`M ${parseInt(pos.left) - 10}% ${parseInt(pos.top) - 5}% Q ${parseInt(pos.left)}% ${parseInt(pos.top) - 10}% ${parseInt(pos.left)}% ${parseInt(pos.top)}%`}
                fill="none"
                stroke={isSelected ? '#2d5a42' : '#8b6914'}
                strokeWidth="3"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                opacity={isSelected ? 1 : 0.5}
              />
            </svg>

            {/* Delivery Partner Marker */}
            <motion.div
              className="absolute cursor-pointer"
              style={{ top: pos.top, left: pos.left }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              onClick={() => onOrderClick(order)}
            >
              {/* Pulse Animation */}
              <motion.div
                className={cn(
                  "absolute -inset-4 rounded-full",
                  isSelected ? 'bg-[#2d5a42]/20' : 'bg-[#8b6914]/20'
                )}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Marker */}
              <div className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg border-2 transition-all",
                isSelected
                  ? 'bg-[#2d5a42] border-white'
                  : 'bg-[#8b6914] border-white'
              )}>
                <Truck className="w-5 h-5 text-white" />
              </div>

              {/* Info Card */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl border border-[#dbc4a4] p-3 z-50"
                  >
                    <p className="text-xs font-bold text-[#1a3c28] mb-1">{order.orderId}</p>
                    <p className="text-[10px] text-[#5c3d1f]">{order.partner.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Navigation className="w-3 h-3 text-[#2d5a42]" />
                      <span className="text-[10px] text-[#5c3d1f]">{order.distance} • {order.estimatedTime}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Destination Marker */}
            <motion.div
              className="absolute"
              style={{
                top: `${parseInt(pos.top) + 15}%`,
                left: `${parseInt(pos.left) + 10}%`
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#2d5a42] shadow-lg border-2 border-white">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#2d5a42]" />
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-[#f0e6d3] transition-colors">
          <Plus className="w-5 h-5 text-[#5c3d1f]" />
        </button>
        <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-[#f0e6d3] transition-colors">
          <Minus className="w-5 h-5 text-[#5c3d1f]" />
        </button>
        <button className="p-2 bg-white rounded-lg shadow-lg hover:bg-[#f0e6d3] transition-colors">
          <Crosshair className="w-5 h-5 text-[#5c3d1f]" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-[#dbc4a4]">
        <p className="text-[10px] font-bold text-[#1a3c28] mb-2">Map Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b6914]" />
            <span className="text-[10px] text-[#5c3d1f]">Delivery Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2d5a42]" />
            <span className="text-[10px] text-[#5c3d1f]">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8b6914]/30" />
            <span className="text-[10px] text-[#5c3d1f]">Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Minus = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
  </svg>
);

// Main Page Component
export default function LiveTrackingPage() {
  const [orders, setOrders] = useState<LiveOrder[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(MOCK_ORDERS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLive, setIsLive] = useState(true);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.partner.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Simulate live location updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if (order.status === 'delivered') return order;

        // Simulate slight location movement
        const newLat = order.location.lat + (Math.random() - 0.5) * 0.001;
        const newLng = order.location.lng + (Math.random() - 0.5) * 0.001;

        return {
          ...order,
          location: { lat: newLat, lng: newLng }
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const handleOrderClick = (order: LiveOrder) => {
    setSelectedOrder(order);
  };

  const handleStatusUpdate = (orderId: string, newStatus: LiveOrder['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white border-b border-[#dbc4a4]">
        <div>
          <h1 className="text-2xl font-black text-[#1a3c28] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#2d5a42]" />
            Live Order Tracking
          </h1>
          <p className="text-sm text-[#5c3d1f] mt-1">
            Real-time monitoring of {orders.length} active deliveries
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              isLive
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                : 'bg-[#f0e6d3] text-[#5c3d1f] border border-[#dbc4a4]'
            )}
          >
            {isLive ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isLive ? 'Live Tracking' : 'Paused'}
          </button>

          {/* Map Type Toggle */}
          <div className="flex items-center gap-1 bg-[#f0e6d3] rounded-xl p-1">
            <button
              onClick={() => setMapType('standard')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                mapType === 'standard'
                  ? 'bg-white text-[#1a3c28] shadow-sm'
                  : 'text-[#5c3d1f] hover:bg-white/50'
              )}
            >
              <MapIcon className="w-3 h-3" />
              Standard
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                mapType === 'satellite'
                  ? 'bg-white text-[#1a3c28] shadow-sm'
                  : 'text-[#5c3d1f] hover:bg-white/50'
              )}
            >
              <Satellite className="w-3 h-3" />
              Satellite
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-[#f0e6d3] rounded-xl hover:bg-[#e8f5ed] transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-[#5c3d1f]" /> : <Maximize2 className="w-5 h-5 text-[#5c3d1f]" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Orders List */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-[#dbc4a4] bg-white flex flex-col"
            >
              {/* Search & Filter */}
              <div className="p-4 border-b border-[#f0e6d3] space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-[#a67c52]" />
                  <input
                    type="text"
                    placeholder="Search orders, customers, riders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20"
                >
                  <option value="all">All Status</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="nearby">Nearby</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

              {/* Orders List */}
              <div className="flex-1 overflow-y-auto">
                {filteredOrders.map((order) => {
                  const status = STATUS_CONFIG[order.status];
                  const StatusIcon = status.icon;
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <motion.div
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className={cn(
                        "p-4 border-b border-[#f0e6d3] cursor-pointer transition-all",
                        isSelected ? 'bg-[#e8f5ed]' : 'hover:bg-[#faf9f6]'
                      )}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-[#1a3c28] text-sm">{order.orderId}</p>
                          <p className="text-xs text-[#5c3d1f]">{order.customer.name}</p>
                        </div>
                        <div className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase", status.bg, status.color)}>
                          {status.label}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[#5c3d1f] mb-2">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {order.items} items
                        </span>
                        <span className="font-semibold text-[#1a3c28]">{order.total}</span>
                      </div>

                      <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-[#f0e6d3]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white text-xs font-bold">
                          {order.partner.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-[#1a3c28]">{order.partner.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#5c3d1f]">{order.partner.vehicle}</span>
                            <span className="text-[10px] text-[#a67c52]">•</span>
                            <span className="text-[10px] text-[#2d5a42] font-semibold">{order.estimatedTime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#5c3d1f]">{order.distance}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-1.5 bg-[#2d5a42] text-white rounded-lg text-[10px] font-semibold hover:bg-[#3d7a58] transition-colors">
                          Call Partner
                        </button>
                        <button className="flex-1 py-1.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg text-[10px] font-semibold hover:bg-[#e8f5ed] transition-colors">
                          Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <div className="p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-[#a67c52] mx-auto mb-3" />
                    <p className="text-[#5c3d1f] font-medium">No orders found</p>
                    <p className="text-xs text-[#a67c52] mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              <div className="p-4 bg-[#faf9f6] border-t border-[#dbc4a4]">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-black text-[#2d5a42]">{orders.filter(o => o.status !== 'delivered').length}</p>
                    <p className="text-[10px] text-[#5c3d1f]">Active</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-[#8b6914]">{orders.filter(o => o.status === 'in_transit').length}</p>
                    <p className="text-[10px] text-[#5c3d1f]">In Transit</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-emerald-600">{orders.filter(o => o.status === 'delivered').length}</p>
                    <p className="text-[10px] text-[#5c3d1f]">Delivered</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Left Panel Button */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-[#dbc4a4] rounded-r-xl shadow-lg hover:bg-[#f0e6d3] transition-colors"
          style={{ marginLeft: showLeftPanel ? '380px' : '0' }}
        >
          {showLeftPanel ? <ChevronLeft className="w-5 h-5 text-[#5c3d1f]" /> : <ChevronRight className="w-5 h-5 text-[#5c3d1f]" />}
        </button>

        {/* Map Area */}
        <div className="flex-1 relative bg-[#e8f5ed]">
          <SimulatedMap
            orders={orders}
            selectedOrder={selectedOrder}
            mapType={mapType}
            center={{ lat: 18.5204, lng: 73.8567 }}
            zoom={12}
            onOrderClick={handleOrderClick}
          />

          {/* Selected Order Details Overlay */}
          <AnimatePresence>
            {selectedOrder && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-[#dbc4a4] overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-white">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{selectedOrder.orderId}</p>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold", STATUS_CONFIG[selectedOrder.status].bg, STATUS_CONFIG[selectedOrder.status].color)}>
                      {STATUS_CONFIG[selectedOrder.status].label}
                    </div>
                    <span className="text-xs text-[#e8f5ed]">{selectedOrder.estimatedTime} remaining</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Customer Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0e6d3] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#5c3d1f]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a3c28] text-sm">{selectedOrder.customer.name}</p>
                      <p className="text-xs text-[#5c3d1f]">{selectedOrder.customer.phone}</p>
                      <p className="text-xs text-[#a67c52] mt-1">{selectedOrder.customer.address}</p>
                    </div>
                  </div>

                  {/* Delivery Partner */}
                  <div className="p-3 bg-[#faf9f6] rounded-xl border border-[#f0e6d3]">
                    <p className="text-[10px] font-bold text-[#5c3d1f] uppercase mb-2">Delivery Partner</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8b6914] to-[#c49a6c] flex items-center justify-center text-white text-sm font-bold">
                        {selectedOrder.partner.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#1a3c28] text-sm">{selectedOrder.partner.name}</p>
                        <div className="flex items-center gap-2 text-xs text-[#5c3d1f]">
                          <span>{selectedOrder.partner.vehicle}</span>
                          <span>•</span>
                          <span>{selectedOrder.partner.vehicleNumber}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Target className="w-3 h-3 text-[#8b6914]" />
                          <span className="text-[10px] text-[#5c3d1f]">{selectedOrder.partner.rating} ★</span>
                          <span className="text-[10px] text-[#a67c52]">({selectedOrder.partner.totalDeliveries} deliveries)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 bg-[#2d5a42] text-white rounded-lg text-xs font-semibold hover:bg-[#3d7a58] transition-colors flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                      <button className="flex-1 py-2 bg-[#f0e6d3] text-[#5c3d1f] rounded-lg text-xs font-semibold hover:bg-[#e8f5ed] transition-colors flex items-center justify-center gap-1">
                        <Navigation className="w-3 h-3" />
                        Navigate
                      </button>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-[#5c3d1f] uppercase">Order Details</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5c3d1f]">Items</span>
                      <span className="font-semibold text-[#1a3c28]">{selectedOrder.items}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5c3d1f]">Total</span>
                      <span className="font-semibold text-[#1a3c28]">{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5c3d1f]">Distance</span>
                      <span className="font-semibold text-[#1a3c28]">{selectedOrder.distance}</span>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="pt-3 border-t border-[#f0e6d3]">
                    <p className="text-[10px] font-bold text-[#5c3d1f] uppercase mb-2">Update Status</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => handleStatusUpdate(selectedOrder.id, key as LiveOrder['status'])}
                          disabled={selectedOrder.status === key}
                          className={cn(
                            "py-2 rounded-lg text-[10px] font-semibold transition-all",
                            selectedOrder.status === key
                              ? 'bg-[#2d5a42] text-white'
                              : 'bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]'
                          )}
                        >
                          {config.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

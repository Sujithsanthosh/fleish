"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Store, MapPin, Navigation, Phone, Clock, Star, Search,
  Fish, Beef, ChevronRight, LocateFixed, AlertCircle,
  ShoppingBag, ArrowLeft, Filter, Heart, Share2, Info,
  X, Plus, Minus, Trash2, CreditCard, Truck, ShieldCheck,
  Sparkles, TrendingUp, Award, Leaf, Flame, Droplets,
  ChevronDown, Map as MapIcon, List, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: 'fish' | 'meat';
  image: string;
  rating: number;
  reviews: number;
  isFresh: boolean;
  discount?: number;
  weight: string;
}

interface StoreData {
  id: string;
  name: string;
  type: 'fish' | 'meat' | 'both';
  address: string;
  distance: number;
  rating: number;
  phone: string;
  hours: string;
  isOpen: boolean;
  coordinates: { lat: number; lng: number };
  image: string;
  products: Product[];
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
}

interface CartItem {
  product: Product;
  storeId: string;
  storeName: string;
  quantity: number;
}

// Mock Products Data
const FISH_PRODUCTS: Product[] = [
  { id: 'f1', name: 'Fresh Salmon', price: 899, unit: 'kg', category: 'fish', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400', rating: 4.8, reviews: 234, isFresh: true, discount: 10, weight: '500g - 1kg' },
  { id: 'f2', name: 'King Prawns', price: 649, unit: 'kg', category: 'fish', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', rating: 4.7, reviews: 189, isFresh: true, weight: '250g - 500g' },
  { id: 'f3', name: 'Tuna Steak', price: 549, unit: 'kg', category: 'fish', image: 'https://images.unsplash.com/photo-1611171711791-b34bff4f5e84?w=400', rating: 4.6, reviews: 156, isFresh: true, discount: 15, weight: '300g - 600g' },
  { id: 'f4', name: 'Rohu Fish', price: 299, unit: 'kg', category: 'fish', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', rating: 4.5, reviews: 312, isFresh: true, weight: '1kg - 2kg' },
  { id: 'f5', name: 'Crab (Live)', price: 799, unit: 'kg', category: 'fish', image: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400', rating: 4.4, reviews: 98, isFresh: true, weight: '500g - 1kg' },
  { id: 'f6', name: 'Seer Fish', price: 699, unit: 'kg', category: 'fish', image: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=400', rating: 4.7, reviews: 145, isFresh: true, weight: '500g - 1kg' },
];

const MEAT_PRODUCTS: Product[] = [
  { id: 'm1', name: 'Premium Chicken Breast', price: 249, unit: 'kg', category: 'meat', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', rating: 4.6, reviews: 278, isFresh: true, discount: 5, weight: '500g - 1kg' },
  { id: 'm2', name: 'Mutton Curry Cut', price: 699, unit: 'kg', category: 'meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=400', rating: 4.8, reviews: 201, isFresh: true, weight: '500g - 1kg' },
  { id: 'm3', name: 'Beef Steak', price: 599, unit: 'kg', category: 'meat', image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400', rating: 4.5, reviews: 167, isFresh: true, weight: '250g - 500g' },
  { id: 'm4', name: 'Chicken Wings', price: 199, unit: 'kg', category: 'meat', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', rating: 4.4, reviews: 234, isFresh: true, discount: 20, weight: '1kg' },
  { id: 'm5', name: 'Lamb Chops', price: 899, unit: 'kg', category: 'meat', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400', rating: 4.7, reviews: 134, isFresh: true, weight: '500g' },
  { id: 'm6', name: 'Turkey Breast', price: 549, unit: 'kg', category: 'meat', image: 'https://images.unsplash.com/photo-1574672280609-4b487f92f313?w=400', rating: 4.3, reviews: 89, isFresh: true, weight: '500g - 1kg' },
];

const MOCK_STORES: StoreData[] = [
  {
    id: '1',
    name: 'Ocean Fresh Fish Market',
    type: 'fish',
    address: '123 Marine Drive, Coastal Area',
    distance: 0.8,
    rating: 4.5,
    phone: '+91 98765 43210',
    hours: '6:00 AM - 9:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    image: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=400',
    products: FISH_PRODUCTS.slice(0, 4),
    deliveryTime: '15-25 min',
    minOrder: 200,
    deliveryFee: 30
  },
  {
    id: '2',
    name: 'Premium Meat House',
    type: 'meat',
    address: '45 Butcher Street, Meat District',
    distance: 1.2,
    rating: 4.3,
    phone: '+91 98765 43211',
    hours: '8:00 AM - 8:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9756, lng: 77.5986 },
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1a5c557?w=400',
    products: MEAT_PRODUCTS.slice(0, 4),
    deliveryTime: '20-30 min',
    minOrder: 300,
    deliveryFee: 40
  },
  {
    id: '3',
    name: 'Fresh Catch & Butcher',
    type: 'both',
    address: '78 Market Road, Central Hub',
    distance: 2.1,
    rating: 4.7,
    phone: '+91 98765 43212',
    hours: '5:30 AM - 10:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9616, lng: 77.5846 },
    image: 'https://images.unsplash.com/photo-1544025162-d76690b60944?w=400',
    products: [...FISH_PRODUCTS.slice(2, 4), ...MEAT_PRODUCTS.slice(0, 2)],
    deliveryTime: '25-35 min',
    minOrder: 250,
    deliveryFee: 25
  },
  {
    id: '4',
    name: 'Daily Fresh Seafood',
    type: 'fish',
    address: '22 Fisherman Wharf, Harbor Area',
    distance: 3.5,
    rating: 4.2,
    phone: '+91 98765 43213',
    hours: '5:00 AM - 7:00 PM',
    isOpen: false,
    coordinates: { lat: 12.9816, lng: 77.6046 },
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    products: FISH_PRODUCTS.slice(3, 6),
    deliveryTime: '30-40 min',
    minOrder: 150,
    deliveryFee: 50
  },
  {
    id: '5',
    name: 'Royal Meat Palace',
    type: 'meat',
    address: '156 Palace Road, City Center',
    distance: 4.2,
    rating: 4.6,
    phone: '+91 98765 43214',
    hours: '9:00 AM - 9:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9916, lng: 77.6146 },
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    products: MEAT_PRODUCTS.slice(2, 6),
    deliveryTime: '35-45 min',
    minOrder: 500,
    deliveryFee: 60
  },
  {
    id: '6',
    name: 'Coastal Fish Hub',
    type: 'fish',
    address: '33 Beach Road, Seaside',
    distance: 5.1,
    rating: 4.4,
    phone: '+91 98765 43215',
    hours: '6:00 AM - 8:00 PM',
    isOpen: true,
    coordinates: { lat: 12.9516, lng: 77.5746 },
    image: 'https://images.unsplash.com/photo-1615141982880-1313d06a7ba5?w=400',
    products: FISH_PRODUCTS.slice(0, 3),
    deliveryTime: '40-50 min',
    minOrder: 300,
    deliveryFee: 70
  }
];

export default function StorePage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [stores, setStores] = useState<StoreData[]>(MOCK_STORES);
  const [filteredStores, setFilteredStores] = useState<StoreData[]>(MOCK_STORES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'fish' | 'meat' | 'both'>('all');
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Cart functions
  const addToCart = useCallback((product: Product, storeId: string, storeName: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.storeId === storeId);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.storeId === storeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, storeId, storeName, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, storeId: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.storeId === storeId)));
  }, []);

  const updateQuantity = useCallback((productId: string, storeId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.storeId === storeId) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null as unknown as CartItem : { ...item, quantity: newQty };
      }
      return item;
    }).filter((item): item is CartItem => item !== null));
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Request location permission and get user location
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Filter stores when search or type changes
  useEffect(() => {
    let filtered = stores;
    
    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.products.some((p: Product) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(store => store.type === selectedType);
    }
    
    filtered = filtered.sort((a, b) => a.distance - b.distance);
    
    setFilteredStores(filtered);
  }, [searchQuery, selectedType, stores]);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        
        result.addEventListener('change', () => {
          setPermissionStatus(result.state as 'prompt' | 'granted' | 'denied');
        });

        if (result.state === 'granted') {
          getCurrentLocation();
        } else if (result.state === 'denied') {
          setLocationError('Location permission denied. Please enable location access to find nearby stores.');
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setPermissionStatus('granted');
        setLocationError('');
        setIsLoading(false);
        updateStoreDistances(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionStatus('denied');
            setLocationError('Location permission denied. Please enable location access in your browser settings to find nearby stores.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const updateStoreDistances = (userLat: number, userLng: number) => {
    const updatedStores = stores.map(store => {
      const distance = calculateDistance(userLat, userLng, store.coordinates.lat, store.coordinates.lng);
      return { ...store, distance: parseFloat(distance.toFixed(1)) };
    });
    setStores(updatedStores);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'fish': return <Fish className="w-4 h-4" />;
      case 'meat': return <Beef className="w-4 h-4" />;
      case 'both': return <><Fish className="w-3 h-3" /><Beef className="w-3 h-3 -ml-1" /></>;
      default: return <Store className="w-4 h-4" />;
    }
  };

  const getStoreTypeLabel = (type: string) => {
    switch (type) {
      case 'fish': return 'Fish Market';
      case 'meat': return 'Meat Shop';
      case 'both': return 'Fish & Meat';
      default: return 'Store';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      <Navbar />

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, x: 100 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 100 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-emerald-600 text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs font-medium opacity-80">Cart Total</p>
              <p className="font-bold">₹{cartTotal.toLocaleString()}</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-32 pb-16 px-4 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-semibold tracking-wide">Fresh from Local Markets</span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Fish</span> &
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"> Meat</span> Stores
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover the finest selection of fresh seafood and premium meats from trusted local vendors near you.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12"
          >
            {[
              { icon: Store, value: '50+', label: 'Partner Stores' },
              { icon: TrendingUp, value: '15min', label: 'Avg Delivery' },
              { icon: ShieldCheck, value: '100%', label: 'Fresh Quality' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/10">
                <stat.icon className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Location Permission Banner */}
          <AnimatePresence>
            {(permissionStatus === 'prompt' || permissionStatus === 'denied' || locationError) && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="max-w-2xl mx-auto mb-10"
              >
                <div className={`rounded-2xl p-6 border backdrop-blur-sm ${permissionStatus === 'denied' || locationError ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      animate={{ rotate: permissionStatus === 'prompt' ? [0, -10, 10, 0] : 0 }}
                      transition={{ repeat: permissionStatus === 'prompt' ? Infinity : 0, duration: 2 }}
                      className={`p-3 rounded-xl ${permissionStatus === 'denied' || locationError ? 'bg-red-500/20' : 'bg-amber-500/20'}`}
                    >
                      {permissionStatus === 'denied' || locationError ? (
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      ) : (
                        <LocateFixed className="w-6 h-6 text-amber-400" />
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg mb-1 ${permissionStatus === 'denied' || locationError ? 'text-red-400' : 'text-amber-400'}`}>
                        {permissionStatus === 'denied' ? 'Location Access Denied' : 'Enable Location for Better Experience'}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">
                        {locationError || 'Allow location access to find the nearest fish and meat stores. We only use this to show accurate distances.'}
                      </p>
                      {permissionStatus !== 'denied' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={getCurrentLocation}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
                        >
                          <Navigation className="w-4 h-4" />
                          Allow Location Access
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Search & Filter Section */}
      <section className="sticky top-20 z-30 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stores, products, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {[
                  { id: 'all', label: 'All Stores', icon: Store },
                  { id: 'fish', label: 'Fish', icon: Fish },
                  { id: 'meat', label: 'Meat', icon: Beef },
                  { id: 'both', label: 'Both', icon: ShoppingBag }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedType(id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                      selectedType === id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <p className="text-slate-400 text-sm">
          Found <span className="text-emerald-400 font-semibold">{filteredStores.length}</span> stores nearby
        </p>
      </div>

      {/* Stores Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <span>Loading stores...</span>
              </div>
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No stores found</h3>
              <p className="text-slate-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores.map((store, index) => (
                <Link
                  key={store.id}
                  href={`/store/${store.id}`}
                >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  {/* Store Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                      {getStoreTypeIcon(store.type)}
                      <span className="text-xs font-medium text-white">{getStoreTypeLabel(store.type)}</span>
                    </div>
                    
                    {/* Open Status */}
                    <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium ${
                      store.isOpen 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {store.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                    
                    {/* Distance Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                      <Navigation className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs font-medium text-white">{store.distance} km</span>
                    </div>
                  </div>
                  
                  {/* Store Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-amber-400">{store.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-4 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                      <span>{store.address}</span>
                    </p>
                    
                    {/* Delivery Info */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {store.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        Min ₹{store.minOrder}
                      </span>
                    </div>
                    
                    {/* Products Preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {store.products.slice(0, 3).map((product: Product, i: number) => (
                        <span 
                          key={i}
                          className="px-2 py-1 text-xs rounded-lg bg-white/5 text-slate-400 border border-white/5"
                        >
                          {product.name}
                        </span>
                      ))}
                      {store.products.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-lg bg-white/5 text-slate-400 border border-white/5">
                          +{store.products.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all">
                        <ShoppingBag className="w-4 h-4" />
                        View Store
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${store.phone}`;
                        }}
                        className="flex items-center justify-center w-12 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Store Detail Modal */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedStore(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header Image */}
              <div className="relative h-64">
                <img
                  src={selectedStore.image}
                  alt={selectedStore.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                
                <button
                  onClick={() => setSelectedStore(null)}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    {getStoreTypeIcon(selectedStore.type)}
                    <span className="text-sm font-medium text-emerald-400">{getStoreTypeLabel(selectedStore.type)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedStore.name}</h2>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Distance</p>
                      <p className="font-semibold text-white">{selectedStore.distance} km</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Rating</p>
                      <p className="font-semibold text-white">{selectedStore.rating} / 5</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedStore.isOpen ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      <Clock className={`w-5 h-5 ${selectedStore.isOpen ? 'text-emerald-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Hours</p>
                      <p className="font-semibold text-white">{selectedStore.hours}</p>
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${selectedStore.phone}`}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-semibold text-white">{selectedStore.phone}</p>
                    </div>
                  </a>
                </div>
                
                {/* Address */}
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Address</p>
                      <p className="text-white">{selectedStore.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Products Grid */}
                <div>
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    Available Products
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedStore.products.map((product: Product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/30 transition-all"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-white">{product.name}</h4>
                            {product.discount && (
                              <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 rounded">
                                -{product.discount}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{product.weight}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-white">₹{product.price}</span>
                              <span className="text-xs text-slate-500">/{product.unit}</span>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addToCart(product, selectedStore.id, selectedStore.name)}
                              className="flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all"
                            >
                              <Plus className="w-4 h-4" />
                              Add
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-white/10 shadow-2xl"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Your Cart</h2>
                    <p className="text-sm text-slate-400">{cartCount} items</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={`${item.storeId}-${item.product.id}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{item.product.name}</h4>
                        <p className="text-xs text-slate-400 mb-2">{item.storeName}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-semibold">₹{item.product.price * item.quantity}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.storeId, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.storeId, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.storeId)}
                        className="text-slate-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-white/10">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Delivery Fee</span>
                      <span className="text-emerald-400">FREE</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-white/10">
                      <span className="text-white">Total</span>
                      <span className="text-emerald-400">₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCheckout(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold text-lg transition-all"
                  >
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-8 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Coming Soon!</h2>
              <p className="text-slate-400 mb-6">
                Our checkout system is being prepared. You can browse and add items to your cart now!
              </p>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
              >
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

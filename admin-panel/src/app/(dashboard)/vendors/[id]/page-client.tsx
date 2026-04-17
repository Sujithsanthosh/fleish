"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  Package,
  TrendingUp,
  Users,
  ArrowLeft,
  Edit2,
  Save,
  X,
  Navigation,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  ImageIcon,
  Calendar,
  DollarSign,
  BadgeCheck,
  Ban,
  Plus,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  Upload,
  Tag,
  Weight,
  ShoppingBag,
  Eye,
  Heart,
  Share2,
  Sparkles,
  Megaphone,
  Percent,
  Truck,
  Shield,
  Award,
  Zap,
  BarChart3,
  Download,
  Printer,
  Settings,
  Grid3X3,
  List,
  ChevronRight,
  Minus,
  Plus as PlusIcon,
  Copy,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Product type with weight pricing
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  comparePrice: number;
  images: string[];
  stock: number;
  sold: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  rating: number;
  reviews: number;
  weightOptions: WeightOption[];
  tags: string[];
  sku: string;
  createdAt: string;
}

interface WeightOption {
  id: string;
  weight: number;
  unit: 'g' | 'kg' | 'lb' | 'oz' | 'ml' | 'l' | 'unit';
  price: number;
  stock: number;
  isDefault: boolean;
}

interface StoreBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  isActive: boolean;
  position: 'hero' | 'top' | 'middle' | 'bottom';
}

interface Promo {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
}

// Mock data for vendor products with weight pricing
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Fresh Chicken Breast',
    description: 'Farm-raised, hormone-free chicken breast. Perfect for grilling, roasting, or stir-frying.',
    category: 'Poultry',
    basePrice: 280,
    comparePrice: 320,
    images: [],
    stock: 150,
    sold: 1250,
    status: 'active',
    rating: 4.8,
    reviews: 234,
    weightOptions: [
      { id: 'w1', weight: 500, unit: 'g', price: 280, stock: 50, isDefault: true },
      { id: 'w2', weight: 1, unit: 'kg', price: 540, stock: 40, isDefault: false },
      { id: 'w3', weight: 2, unit: 'kg', price: 1050, stock: 30, isDefault: false },
    ],
    tags: ['fresh', 'organic', 'bestseller'],
    sku: 'CHICK-BR-001',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Atlantic Salmon Fillets',
    description: 'Wild-caught Atlantic salmon, rich in Omega-3 fatty acids. Flash-frozen for freshness.',
    category: 'Seafood',
    basePrice: 650,
    comparePrice: 780,
    images: [],
    stock: 80,
    sold: 890,
    status: 'active',
    rating: 4.9,
    reviews: 156,
    weightOptions: [
      { id: 'w4', weight: 500, unit: 'g', price: 650, stock: 25, isDefault: true },
      { id: 'w5', weight: 1, unit: 'kg', price: 1250, stock: 20, isDefault: false },
    ],
    tags: ['wild-caught', 'omega-3', 'premium'],
    sku: 'SALMON-ATL-002',
    createdAt: '2024-02-10',
  },
  {
    id: '3',
    name: 'New Zealand Lamb Chops',
    description: 'Premium grass-fed lamb chops from New Zealand. Tender and flavorful.',
    category: 'Mutton',
    basePrice: 520,
    comparePrice: 580,
    images: [],
    stock: 45,
    sold: 567,
    status: 'active',
    rating: 4.7,
    reviews: 89,
    weightOptions: [
      { id: 'w6', weight: 500, unit: 'g', price: 520, stock: 15, isDefault: true },
      { id: 'w7', weight: 1, unit: 'kg', price: 990, stock: 12, isDefault: false },
    ],
    tags: ['grass-fed', 'imported', 'premium'],
    sku: 'LAMB-NZ-003',
    createdAt: '2024-01-20',
  },
  {
    id: '4',
    name: 'Jumbo Tiger Prawns',
    description: 'Fresh jumbo tiger prawns, perfect for BBQ or curry. Deveined and cleaned.',
    category: 'Seafood',
    basePrice: 480,
    comparePrice: 550,
    images: [],
    stock: 0,
    sold: 2100,
    status: 'out_of_stock',
    rating: 4.6,
    reviews: 312,
    weightOptions: [
      { id: 'w8', weight: 500, unit: 'g', price: 480, stock: 0, isDefault: true },
      { id: 'w9', weight: 1, unit: 'kg', price: 920, stock: 0, isDefault: false },
    ],
    tags: ['fresh', 'cleaned', 'bestseller'],
    sku: 'PRAWN-JUM-004',
    createdAt: '2024-01-05',
  },
  {
    id: '5',
    name: 'Free-Range Turkey Breast',
    description: 'Free-range turkey breast, lean and healthy. Great for sandwiches or roasts.',
    category: 'Poultry',
    basePrice: 340,
    comparePrice: 380,
    images: [],
    stock: 25,
    sold: 432,
    status: 'active',
    rating: 4.5,
    reviews: 67,
    weightOptions: [
      { id: 'w10', weight: 500, unit: 'g', price: 340, stock: 10, isDefault: true },
      { id: 'w11', weight: 1, unit: 'kg', price: 650, stock: 8, isDefault: false },
    ],
    tags: ['free-range', 'lean', 'healthy'],
    sku: 'TURKEY-BR-005',
    createdAt: '2024-03-01',
  },
  {
    id: '6',
    name: 'Wagyu Beef Steak',
    description: 'Premium A5 Wagyu beef steak. Melt-in-your-mouth tenderness.',
    category: 'Beef',
    basePrice: 2500,
    comparePrice: 3000,
    images: [],
    stock: 12,
    sold: 156,
    status: 'active',
    rating: 5.0,
    reviews: 45,
    weightOptions: [
      { id: 'w12', weight: 250, unit: 'g', price: 1250, stock: 5, isDefault: true },
      { id: 'w13', weight: 500, unit: 'g', price: 2500, stock: 4, isDefault: false },
    ],
    tags: ['wagyu', 'premium', 'a5-grade'],
    sku: 'WAGYU-A5-006',
    createdAt: '2024-02-15',
  },
];

const MOCK_BANNERS: StoreBanner[] = [
  {
    id: 'b1',
    title: 'Fresh Arrivals Daily',
    subtitle: 'Get 20% off on all seafood today!',
    image: '',
    link: '/products/seafood',
    isActive: true,
    position: 'hero',
  },
  {
    id: 'b2',
    title: 'Premium Quality Meats',
    subtitle: 'Grass-fed, hormone-free, delivered fresh',
    image: '',
    link: '/products/premium',
    isActive: true,
    position: 'middle',
  },
];

const MOCK_PROMOS: Promo[] = [
  {
    id: 'p1',
    code: 'FRESH20',
    discount: 20,
    type: 'percentage',
    minOrder: 500,
    maxDiscount: 200,
    validFrom: '2024-04-01',
    validUntil: '2024-04-30',
    isActive: true,
    usageCount: 145,
  },
  {
    id: 'p2',
    code: 'MEAT50',
    discount: 50,
    type: 'fixed',
    minOrder: 1000,
    maxDiscount: 50,
    validFrom: '2024-04-15',
    validUntil: '2024-05-15',
    isActive: true,
    usageCount: 89,
  },
];

// Mock orders data
const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Rahul Sharma', total: 840, status: 'completed', date: '2024-04-10', items: 3 },
  { id: 'ORD-002', customer: 'Priya Patel', total: 650, status: 'pending', date: '2024-04-09', items: 2 },
  { id: 'ORD-003', customer: 'Amit Kumar', total: 1560, status: 'completed', date: '2024-04-08', items: 5 },
  { id: 'ORD-004', customer: 'Sneha Gupta', total: 420, status: 'cancelled', date: '2024-04-07', items: 1 },
  { id: 'ORD-005', customer: 'Vikram Rao', total: 2340, status: 'processing', date: '2024-04-10', items: 4 },
  { id: 'ORD-006', customer: 'Anita Desai', total: 890, status: 'completed', date: '2024-04-06', items: 2 },
];

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'location' | 'promos' | 'analytics'>('overview');
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    latitude: 0,
    longitude: 0,
    openingTime: '09:00',
    closingTime: '21:00',
    isAvailable: true,
    commission: 15,
  });

  // Product management state
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [banners, setBanners] = useState<StoreBanner[]>(MOCK_BANNERS);
  const [promos, setPromos] = useState<Promo[]>(MOCK_PROMOS);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);

  const loadVendor = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getVendor(vendorId);
      setVendor(data);
      setFormData({
        shopName: data.shopName || '',
        ownerName: data.ownerName || data.owner?.name || '',
        email: data.email || data.owner?.email || '',
        phone: data.phone || data.owner?.phone || '',
        address: data.address || '',
        description: data.description || '',
        latitude: data.latitude || 17.4,
        longitude: data.longitude || 78.4,
        openingTime: data.openingTime || '09:00',
        closingTime: data.closingTime || '21:00',
        isAvailable: data.isAvailable ?? true,
        commission: data.commission || 15,
      });
    } catch (e: any) {
      console.error('Failed to load vendor:', e);
      setError(`Failed to load vendor: ${e.message}`);
      // Create mock vendor data for demonstration
      setVendor({
        id: vendorId,
        shopName: 'Fresh Meat & Seafood',
        ownerName: 'Rajesh Kumar',
        email: 'rajesh@freshmeat.com',
        phone: '+91 98765 43210',
        address: '123 Market Street, Hyderabad, Telangana',
        description: 'Premium quality meat and seafood delivered fresh to your doorstep. We source directly from farms and fishing boats.',
        latitude: 17.4065,
        longitude: 78.4772,
        rating: 4.8,
        totalSales: 125000,
        totalOrders: 450,
        isAvailable: true,
        openingTime: '09:00',
        closingTime: '21:00',
        commission: 15,
        joinedDate: '2023-06-15',
        status: 'active',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendor();
  }, [vendorId]);

  const handleSave = async () => {
    try {
      await api.updateVendor(vendorId, formData);
      setVendor({ ...vendor, ...formData });
      setIsEditing(false);
    } catch (e: any) {
      setError(`Failed to update: ${e.message}`);
      setVendor({ ...vendor, ...formData });
      setIsEditing(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = !vendor?.isAvailable;
    try {
      await api.updateVendor(vendorId, { isAvailable: newStatus });
      setVendor({ ...vendor, isAvailable: newStatus });
    } catch {
      setVendor({ ...vendor, isAvailable: newStatus });
    }
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${vendor?.latitude},${vendor?.longitude}`;
    window.open(url, '_blank');
  };

  // Product management functions
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleBulkDelete = () => {
    if (!confirm(`Delete ${selectedProducts.length} selected products?`)) return;
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
  };

  const handleToggleProductStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'active' ? 'inactive' : 'active';
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  const handleDuplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`,
      sku: `${product.sku}-COPY`,
      name: `${product.name} (Copy)`,
      sold: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const handleDeletePromo = (id: string) => {
    setPromos(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#1a3c28] animate-pulse shadow-lg shadow-[#2d5a42]/30" />
          <p className="text-[#5c3d1f] font-semibold">Loading vendor store...</p>
        </motion.div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#9b2335] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a3c28] mb-2">Vendor Not Found</h2>
          <p className="text-[#5c3d1f] mb-6">The vendor you are looking for does not exist.</p>
          <button 
            onClick={() => router.push('/vendors')}
            className="px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/vendors')}
            className="p-2 rounded-xl bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#1a3c28] via-[#234836] to-[#2d5a42] bg-clip-text text-transparent flex items-center gap-3">
              <Store className="w-8 h-8 text-[#2d5a42]" />
              {vendor.shopName}
            </h1>
            <p className="text-[#5c3d1f] flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4" />
              {vendor.address}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openInMaps}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8b6914] to-[#c49a6c] text-[#faf6f0] rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Navigation className="w-4 h-4" />
            View on Map
          </button>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all",
              isEditing 
                ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] hover:shadow-lg"
                : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]"
            )}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Edit Store'}
          </button>
          {isEditing && (
            <button 
              onClick={() => setIsEditing(false)}
              className="p-2.5 bg-[#fff5f5] text-[#9b2335] rounded-xl hover:bg-[#fee2e2] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#fff5f5] border border-[#fecaca] p-4 rounded-2xl flex items-center gap-3 text-[#9b2335]"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
          <button onClick={loadVendor} className="ml-auto text-sm font-bold underline hover:text-[#c44569]">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#f0e6d3]/50 rounded-2xl overflow-x-auto">
        {(['overview', 'products', 'orders', 'promos', 'analytics', 'location'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              activeTab === tab 
                ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-md"
                : "text-[#5c3d1f] hover:bg-[#e8f5ed]/50"
            )}
          >
            {tab === 'promos' && <Megaphone className="w-4 h-4 inline mr-1.5" />}
            {tab === 'analytics' && <BarChart3 className="w-4 h-4 inline mr-1.5" />}
            {tab === 'orders' && <ShoppingBag className="w-4 h-4 inline mr-1.5" />}
            {tab === 'products' && <Package className="w-4 h-4 inline mr-1.5" />}
            {tab === 'overview' && <Store className="w-4 h-4 inline mr-1.5" />}
            {tab === 'location' && <MapPin className="w-4 h-4 inline mr-1.5" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Store Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl shadow-[#2d5a42]/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-[#e8f5ed] shadow-lg shadow-[#2d5a42]/30">
                    <Store className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1a3c28]">{vendor.shopName}</h2>
                    <p className="text-sm text-[#5c3d1f]">{vendor.ownerName}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-[#8b6914] fill-[#8b6914]" />
                      <span className="font-bold text-[#8b6914]">{vendor.rating || 4.5}</span>
                      <span className="text-sm text-[#5c3d1f]">({vendor.totalOrders || 0} orders)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5",
                    vendor.isAvailable 
                      ? "bg-[#e8f5ed] text-[#2d5a42]" 
                      : "bg-[#fff5f5] text-[#9b2335]"
                  )}>
                    {vendor.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                    {vendor.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#f0e6d3] text-[#8b6914] flex items-center gap-1.5">
                    <BadgeCheck className="w-3 h-3" />
                    {vendor.status === 'active' ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#f0e6d3]/30 rounded-2xl">
                <div>
                  <p className="font-semibold text-[#1a3c28]">Store Status</p>
                  <p className="text-sm text-[#5c3d1f]">Control vendor visibility to customers</p>
                </div>
                <button
                  onClick={handleToggleStatus}
                  className={cn(
                    "relative w-14 h-7 rounded-full transition-all duration-300",
                    vendor.isAvailable ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]" : "bg-[#9b2335]/30"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-[#e8f5ed] shadow-md transition-all duration-300",
                    vendor.isAvailable ? "left-8" : "left-1"
                  )} />
                </button>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl shadow-[#2d5a42]/10"
            >
              <h3 className="text-lg font-bold text-[#1a3c28] mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-[#5c3d1f] uppercase">Owner Name</label>
                      <input 
                        type="text" 
                        value={formData.ownerName}
                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="w-full mt-1 px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#5c3d1f] uppercase">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full mt-1 px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#5c3d1f] uppercase">Phone</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full mt-1 px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#5c3d1f] uppercase">Address</label>
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full mt-1 px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                      <div className="p-2 bg-[#2d5a42]/10 rounded-lg">
                        <Users className="w-4 h-4 text-[#2d5a42]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#5c3d1f]">Owner</p>
                        <p className="font-semibold text-[#1a3c28]">{vendor.ownerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                      <div className="p-2 bg-[#2d5a42]/10 rounded-lg">
                        <Mail className="w-4 h-4 text-[#2d5a42]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#5c3d1f]">Email</p>
                        <p className="font-semibold text-[#1a3c28]">{vendor.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                      <div className="p-2 bg-[#2d5a42]/10 rounded-lg">
                        <Phone className="w-4 h-4 text-[#2d5a42]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#5c3d1f]">Phone</p>
                        <p className="font-semibold text-[#1a3c28]">{vendor.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#f0e6d3]/30 rounded-xl">
                      <div className="p-2 bg-[#2d5a42]/10 rounded-lg">
                        <MapPin className="w-4 h-4 text-[#2d5a42]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#5c3d1f]">Address</p>
                        <p className="font-semibold text-[#1a3c28] truncate max-w-[200px]">{vendor.address}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Store Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl shadow-[#2d5a42]/10"
            >
              <h3 className="text-lg font-bold text-[#1a3c28] mb-3">About Store</h3>
              {isEditing ? (
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28] resize-none"
                />
              ) : (
                <p className="text-[#5c3d1f] leading-relaxed">
                  {vendor.description || 'No description available for this store.'}
                </p>
              )}
            </motion.div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-gradient-to-br from-[#2d5a42]/15 to-[#3d7a58]/10 rounded-3xl border border-[#2d5a42]/20"
            >
              <h3 className="text-sm font-bold text-[#1a3c28] mb-4 uppercase tracking-wider">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#2d5a42]" />
                    <span className="text-sm text-[#5c3d1f]">Total Sales</span>
                  </div>
                  <span className="font-bold text-[#1a3c28]">₹{(vendor.totalSales || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#2d5a42]" />
                    <span className="text-sm text-[#5c3d1f]">Total Orders</span>
                  </div>
                  <span className="font-bold text-[#1a3c28]">{vendor.totalOrders || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#2d5a42]" />
                    <span className="text-sm text-[#5c3d1f]">Avg. Order</span>
                  </div>
                  <span className="font-bold text-[#1a3c28]">
                    ₹{vendor.totalOrders ? Math.round((vendor.totalSales || 0) / vendor.totalOrders) : 0}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-[#8b6914]/15 to-[#c49a6c]/10 rounded-3xl border border-[#8b6914]/20"
            >
              <h3 className="text-sm font-bold text-[#3d2914] mb-4 uppercase tracking-wider">Business Info</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8b6914]" />
                    <span className="text-sm text-[#5c3d1f]">Hours</span>
                  </div>
                  <span className="font-semibold text-[#3d2914]">{vendor.openingTime} - {vendor.closingTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8b6914]" />
                    <span className="text-sm text-[#5c3d1f]">Joined</span>
                  </div>
                  <span className="font-semibold text-[#3d2914]">{vendor.joinedDate || '2024'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PercentIcon className="w-4 h-4 text-[#8b6914]" />
                    <span className="text-sm text-[#5c3d1f]">Commission</span>
                  </div>
                  <span className="font-semibold text-[#3d2914]">{vendor.commission || 15}%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Store Banner Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.filter(b => b.isActive).map((banner, idx) => (
              <motion.div 
                key={banner.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-6 bg-gradient-to-br from-[#2d5a42] via-[#3d7a58] to-[#2d5a42] rounded-2xl overflow-hidden group shadow-xl shadow-[#2d5a42]/20"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f5ed]/20 backdrop-blur-sm text-[#e8f5ed] text-xs font-bold rounded-lg mb-3 border border-[#e8f5ed]/20">
                        <Sparkles className="w-3 h-3" /> Featured Banner
                      </span>
                      <h4 className="text-xl font-bold text-[#e8f5ed] mb-1">{banner.title}</h4>
                      <p className="text-sm text-[#e8f5ed]/80">{banner.subtitle}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2.5 bg-[#e8f5ed]/10 hover:bg-[#9b2335] text-[#e8f5ed] rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-[#e8f5ed]/20 border-2 border-[#2d5a42]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#e8f5ed]/60">Active now</span>
                  </div>
                </div>
              </motion.div>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, borderColor: '#2d5a42' }}
              onClick={() => setShowBannerForm(true)}
              className="p-6 border-2 border-dashed border-[#c49a6c]/50 rounded-2xl flex flex-col items-center justify-center gap-3 text-[#a67c52] hover:border-[#2d5a42] hover:text-[#2d5a42] transition-all bg-[#faf9f6]/50 hover:bg-[#e8f5ed]/20"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f0e6d3]/50 flex items-center justify-center">
                <Plus className="w-7 h-7" />
              </div>
              <span className="font-semibold">Add Store Banner</span>
              <span className="text-xs text-[#a67c52]/70">Promote products & offers</span>
            </motion.button>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 p-1">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#2d5a42]/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Product
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl text-sm font-bold hover:bg-[#e8f5ed] transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl text-sm font-bold hover:bg-[#e8f5ed] transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-[#a67c52]">{filteredProducts.length} products</span>
            </div>
          </div>

          {/* Product Stats - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-5 bg-gradient-to-br from-[#faf9f6] to-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#2d5a42]/10 rounded-xl">
                  <Package className="w-5 h-5 text-[#2d5a42]" />
                </div>
                <p className="text-xs text-[#5c3d1f] uppercase font-bold">Total Products</p>
              </div>
              <p className="text-3xl font-black text-[#1a3c28]">{products.length}</p>
              <p className="text-xs text-[#a67c52] mt-1">Across {categories.length} categories</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-5 bg-gradient-to-br from-[#e8f5ed] to-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#2d5a42]/20 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-[#2d5a42]" />
                </div>
                <p className="text-xs text-[#2d5a42] uppercase font-bold">Active</p>
              </div>
              <p className="text-3xl font-black text-[#1a3c28]">
                {products.filter(p => p.status === 'active').length}
              </p>
              <p className="text-xs text-[#2d5a42]/70 mt-1">Ready for sale</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-5 bg-gradient-to-br from-[#fff5f5] to-[#fff5f5]/50 rounded-2xl border border-[#fecaca]/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#9b2335]/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-[#9b2335]" />
                </div>
                <p className="text-xs text-[#9b2335] uppercase font-bold">Out of Stock</p>
              </div>
              <p className="text-3xl font-black text-[#9b2335]">
                {products.filter(p => p.status === 'out_of_stock').length}
              </p>
              <p className="text-xs text-[#9b2335]/70 mt-1">Needs restocking</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2 }}
              className="p-5 bg-gradient-to-br from-[#f0e6d3] to-[#f0e6d3]/50 rounded-2xl border border-[#c49a6c]/40 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#8b6914]/20 rounded-xl">
                  <TrendingUp className="w-5 h-5 text-[#8b6914]" />
                </div>
                <p className="text-xs text-[#8b6914] uppercase font-bold">Total Sales</p>
              </div>
              <p className="text-3xl font-black text-[#1a3c28]">
                {products.reduce((sum, p) => sum + p.sold, 0).toLocaleString()}
              </p>
              <p className="text-xs text-[#8b6914]/70 mt-1">Units sold</p>
            </motion.div>
          </div>

          {/* Product Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-[#faf9f6]/80 rounded-2xl border border-[#dbc4a4]/30">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#a67c52]" />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-sm text-[#1a3c28] w-64 focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                />
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-sm text-[#1a3c28] focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/30 rounded-xl text-sm text-[#1a3c28] focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {selectedProducts.length > 0 && (
                <button 
                  onClick={handleBulkDelete}
                  className="px-3 py-2 bg-[#fff5f5] text-[#9b2335] rounded-xl text-sm font-semibold hover:bg-[#9b2335] hover:text-[#fff5f5] transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedProducts.length})
                </button>
              )}
              <div className="flex items-center bg-[#f0e6d3]/50 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'grid' ? "bg-[#2d5a42] text-[#e8f5ed]" : "text-[#5c3d1f] hover:text-[#2d5a42]"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === 'list' ? "bg-[#2d5a42] text-[#e8f5ed]" : "text-[#5c3d1f] hover:text-[#2d5a42]"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-gradient-to-br from-[#faf9f6] to-[#f0e6d3]/20 rounded-3xl border border-[#dbc4a4]/50 overflow-hidden hover:shadow-2xl hover:shadow-[#2d5a42]/15 hover:border-[#2d5a42]/30 transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative h-52 bg-gradient-to-br from-[#e8f5ed] via-[#f0e6d3] to-[#e8f5ed] flex items-center justify-center overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2d5a42]/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#8b6914]/5 rounded-full blur-2xl" />
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#faf9f6] to-[#f0e6d3] flex items-center justify-center shadow-xl border border-[#dbc4a4]/30"
                    >
                      <ImageIcon className="w-12 h-12 text-[#2d5a42]/60" />
                    </motion.div>
                    
                    {/* Status Badge - Top Left */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className={cn(
                        "p-1.5 rounded-lg backdrop-blur-sm transition-all",
                        selectedProducts.includes(product.id) ? "bg-[#2d5a42]" : "bg-[#faf9f6]/90"
                      )}>
                        <input 
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 rounded border-[#c49a6c] text-[#2d5a42] focus:ring-[#2d5a42] cursor-pointer"
                        />
                      </div>
                      {product.status === 'active' && (
                        <span className="px-2.5 py-1 bg-[#e8f5ed] text-[#2d5a42] text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#2d5a42] rounded-full animate-pulse" />
                          Active
                        </span>
                      )}
                      {product.status === 'out_of_stock' && (
                        <span className="px-2.5 py-1 bg-[#fff5f5] text-[#9b2335] text-xs font-bold rounded-full shadow-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      )}
                      {product.status === 'inactive' && (
                        <span className="px-2.5 py-1 bg-[#f0e6d3] text-[#8b6914] text-xs font-bold rounded-full shadow-sm">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    {/* Quick Actions - Top Right */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                        className="p-2.5 bg-[#faf9f6] text-[#2d5a42] rounded-xl hover:bg-[#2d5a42] hover:text-[#e8f5ed] transition-all shadow-lg"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDuplicateProduct(product)}
                        className="p-2.5 bg-[#faf9f6] text-[#8b6914] rounded-xl hover:bg-[#8b6914] hover:text-[#faf6f0] transition-all shadow-lg"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleProductStatus(product.id)}
                        className="p-2.5 bg-[#faf9f6] text-[#5c3d1f] rounded-xl hover:bg-[#3d7a58] hover:text-[#e8f5ed] transition-all shadow-lg"
                        title="Toggle Status"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2.5 bg-[#faf9f6] text-[#9b2335] rounded-xl hover:bg-[#9b2335] hover:text-[#fff5f5] transition-all shadow-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    {/* Tags - Bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2.5 py-1 bg-[#2d5a42]/90 backdrop-blur-sm text-[#e8f5ed] text-xs font-medium rounded-lg shadow-sm">
                            #{tag}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="px-2 py-1 bg-[#faf9f6]/80 text-[#5c3d1f] text-xs rounded-lg">
                            +{product.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-[#f0e6d3] text-[#8b6914] text-xs font-bold rounded-md uppercase tracking-wider">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#8b6914] fill-[#8b6914]" />
                            <span className="text-sm font-bold text-[#1a3c28]">{product.rating}</span>
                            <span className="text-xs text-[#a67c52]">({product.reviews})</span>
                          </div>
                        </div>
                        <h4 className="font-bold text-[#1a3c28] line-clamp-1 text-lg" title={product.name}>{product.name}</h4>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#5c3d1f] line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                    
                    {/* Weight Options - Enhanced */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#5c3d1f] uppercase flex items-center gap-1.5">
                          <Weight className="w-3.5 h-3.5 text-[#2d5a42]" /> Weight Options
                        </p>
                        <span className="text-xs text-[#a67c52]">{product.weightOptions.length} variants</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.weightOptions.map(option => (
                          <motion.div 
                            key={option.id}
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-default",
                              option.isDefault 
                                ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-md" 
                                : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#e8f5ed]"
                            )}
                          >
                            <span className="font-bold">{option.weight}{option.unit}</span>
                            <span className="mx-1 text-[#a67c52]">|</span>
                            <span>₹{option.price}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats - Enhanced */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#dbc4a4]/30">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-[#a67c52] mb-0.5">Stock</p>
                          <p className={cn(
                            "font-bold text-lg",
                            product.stock < 20 ? "text-[#9b2335]" : "text-[#2d5a42]"
                          )}>{product.stock}</p>
                        </div>
                        <div className="w-px h-8 bg-[#dbc4a4]/50" />
                        <div className="text-center">
                          <p className="text-xs text-[#a67c52] mb-0.5">Sold</p>
                          <p className="font-bold text-lg text-[#1a3c28]">{product.sold.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#a67c52] mb-0.5">SKU</p>
                        <p className="text-xs font-mono font-medium text-[#5c3d1f] bg-[#f0e6d3]/50 px-2 py-1 rounded-lg">{product.sku}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40 overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f0e6d3]/50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input 
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={selectAllProducts}
                        className="w-5 h-5 rounded border-[#c49a6c] text-[#2d5a42]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#5c3d1f] uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#5c3d1f] uppercase">Weight Options</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#5c3d1f] uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#5c3d1f] uppercase">Sold</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-[#5c3d1f] uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-[#5c3d1f] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dbc4a4]/30">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-[#f0e6d3]/20 transition-colors">
                      <td className="px-4 py-4">
                        <input 
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-5 h-5 rounded border-[#c49a6c] text-[#2d5a42]"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#f0e6d3] flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-[#8b6914]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#1a3c28]">{product.name}</p>
                            <p className="text-xs text-[#a67c52]">{product.sku} • {product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.weightOptions.map(opt => (
                            <span key={opt.id} className="px-2 py-1 bg-[#f0e6d3] text-[#5c3d1f] text-xs rounded-lg">
                              {opt.weight}{opt.unit}: ₹{opt.price}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "font-bold",
                          product.stock < 20 ? "text-[#9b2335]" : "text-[#2d5a42]"
                        )}>{product.stock}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-[#1a3c28]">{product.sold}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          product.status === 'active' ? "bg-[#e8f5ed] text-[#2d5a42]" :
                          product.status === 'out_of_stock' ? "bg-[#fff5f5] text-[#9b2335]" :
                          "bg-[#f0e6d3] text-[#8b6914]"
                        )}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                            className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDuplicateProduct(product)}
                            className="p-2 text-[#5c3d1f] hover:bg-[#f0e6d3] rounded-xl transition-all"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleProductStatus(product.id)}
                            className="p-2 text-[#5c3d1f] hover:bg-[#f0e6d3] rounded-xl transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-[#9b2335] hover:bg-[#fff5f5] rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#f0e6d3] to-[#e8f5ed] flex items-center justify-center shadow-lg">
                <Package className="w-12 h-12 text-[#a67c52]/50" />
              </div>
              <h3 className="text-xl font-bold text-[#1a3c28] mb-2">No products found</h3>
              <p className="text-[#5c3d1f] max-w-md mx-auto mb-6">
                Try adjusting your search filters or add a new product to your store inventory.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                  className="px-5 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {activeTab === 'orders' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Order Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#e8f5ed]/50 rounded-2xl border border-[#9dd4b3]/30">
              <p className="text-xs text-[#2d5a42] uppercase font-bold">Completed</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="p-4 bg-[#f0e6d3]/50 rounded-2xl border border-[#c49a6c]/30">
              <p className="text-xs text-[#8b6914] uppercase font-bold">Pending</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#c49a6c]/20">
              <p className="text-xs text-[#5c3d1f] uppercase font-bold">Processing</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="p-4 bg-[#fff5f5]/50 rounded-2xl border border-[#fecaca]/30">
              <p className="text-xs text-[#9b2335] uppercase font-bold">Cancelled</p>
              <p className="text-2xl font-black text-[#9b2335] mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'cancelled').length}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl shadow-[#2d5a42]/10 overflow-hidden">
            <div className="p-6 border-b border-[#dbc4a4]/40 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#2d5a42]" />
                Recent Orders
              </h3>
              <div className="flex gap-2">
                <button className="p-2 text-[#5c3d1f] hover:bg-[#f0e6d3] rounded-xl transition-all" title="Print">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="p-2 text-[#5c3d1f] hover:bg-[#f0e6d3] rounded-xl transition-all" title="Download CSV">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f0e6d3]/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#5c3d1f] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dbc4a4]/30">
                  {MOCK_ORDERS.map((order) => (
                    <motion.tr 
                      key={order.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-[#f0e6d3]/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#1a3c28]">#{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-[#e8f5ed] text-xs font-bold">
                            {order.customer.charAt(0)}
                          </div>
                          <span className="text-sm text-[#5c3d1f]">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#5c3d1f]">{order.items} items</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#5c3d1f]">{order.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#2d5a42]">₹{order.total}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 w-fit",
                          order.status === 'completed' ? "bg-[#e8f5ed] text-[#2d5a42]" :
                          order.status === 'pending' ? "bg-[#f0e6d3] text-[#8b6914]" :
                          order.status === 'processing' ? "bg-[#e8f5ed]/50 text-[#2d5a42] border border-[#2d5a42]/30" :
                          "bg-[#fff5f5] text-[#9b2335]"
                        )}>
                          {order.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          {order.status === 'pending' && <Clock className="w-3 h-3" />}
                          {order.status === 'processing' && <Zap className="w-3 h-3" />}
                          {order.status === 'cancelled' && <X className="w-3 h-3" />}
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'promos' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Promo Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-[#2d5a42]/10 to-[#3d7a58]/5 rounded-2xl border border-[#2d5a42]/20">
              <p className="text-xs text-[#5c3d1f] uppercase font-bold">Active Promos</p>
              <p className="text-3xl font-black text-[#1a3c28] mt-1">{promos.filter(p => p.isActive).length}</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-[#8b6914]/10 to-[#c49a6c]/5 rounded-2xl border border-[#8b6914]/20">
              <p className="text-xs text-[#5c3d1f] uppercase font-bold">Total Usage</p>
              <p className="text-3xl font-black text-[#1a3c28] mt-1">
                {promos.reduce((sum, p) => sum + p.usageCount, 0)}
              </p>
            </div>
            <div className="p-5 bg-gradient-to-br from-[#9b2335]/10 to-[#c44569]/5 rounded-2xl border border-[#9b2335]/20">
              <p className="text-xs text-[#9b2335] uppercase font-bold">Expired</p>
              <p className="text-3xl font-black text-[#9b2335] mt-1">
                {promos.filter(p => !p.isActive).length}
              </p>
            </div>
          </div>

          {/* Promos List */}
          <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40 overflow-hidden">
            <div className="p-6 border-b border-[#dbc4a4]/40 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#2d5a42]" />
                Promotions & Discounts
              </h3>
              <button 
                onClick={() => setShowPromoForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Promo
              </button>
            </div>
            <div className="divide-y divide-[#dbc4a4]/30">
              {promos.map(promo => (
                <motion.div 
                  key={promo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 flex items-center justify-between hover:bg-[#f0e6d3]/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center",
                      promo.isActive ? "bg-[#e8f5ed] text-[#2d5a42]" : "bg-[#f0e6d3] text-[#8b6914]"
                    )}>
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#1a3c28]">{promo.code}</h4>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-bold",
                          promo.isActive ? "bg-[#e8f5ed] text-[#2d5a42]" : "bg-[#f0e6d3] text-[#8b6914]"
                        )}>
                          {promo.isActive ? 'Active' : 'Expired'}
                        </span>
                      </div>
                      <p className="text-sm text-[#5c3d1f]">
                        {promo.type === 'percentage' ? `${promo.discount}% off` : `₹${promo.discount} off`} 
                        • Min order ₹{promo.minOrder}
                        {promo.type === 'percentage' && ` • Max ₹${promo.maxDiscount}`}
                      </p>
                      <p className="text-xs text-[#a67c52]">
                        Valid: {promo.validFrom} to {promo.validUntil} • Used {promo.usageCount} times
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePromo(promo.id)}
                    className="p-2 text-[#9b2335] hover:bg-[#fff5f5] rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'analytics' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#faf9f6]/90 rounded-2xl border border-[#dbc4a4]/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#e8f5ed] rounded-xl">
                  <DollarSign className="w-5 h-5 text-[#2d5a42]" />
                </div>
                <span className="text-sm text-[#5c3d1f]">Revenue</span>
              </div>
              <p className="text-2xl font-black text-[#1a3c28]">₹{vendor?.totalSales?.toLocaleString() || '125,000'}</p>
              <p className="text-xs text-[#2d5a42] mt-1">+12% from last month</p>
            </div>
            <div className="p-5 bg-[#faf9f6]/90 rounded-2xl border border-[#dbc4a4]/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#f0e6d3] rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-[#8b6914]" />
                </div>
                <span className="text-sm text-[#5c3d1f]">Orders</span>
              </div>
              <p className="text-2xl font-black text-[#1a3c28]">{vendor?.totalOrders || '450'}</p>
              <p className="text-xs text-[#2d5a42] mt-1">+8% from last month</p>
            </div>
            <div className="p-5 bg-[#faf9f6]/90 rounded-2xl border border-[#dbc4a4]/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#e8f5ed] rounded-xl">
                  <Users className="w-5 h-5 text-[#2d5a42]" />
                </div>
                <span className="text-sm text-[#5c3d1f]">Customers</span>
              </div>
              <p className="text-2xl font-black text-[#1a3c28]">1,234</p>
              <p className="text-xs text-[#2d5a42] mt-1">+5% from last month</p>
            </div>
            <div className="p-5 bg-[#faf9f6]/90 rounded-2xl border border-[#dbc4a4]/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#f0e6d3] rounded-xl">
                  <Heart className="w-5 h-5 text-[#9b2335]" />
                </div>
                <span className="text-sm text-[#5c3d1f]">Wishlist Adds</span>
              </div>
              <p className="text-2xl font-black text-[#1a3c28]">3,456</p>
              <p className="text-xs text-[#2d5a42] mt-1">+15% from last month</p>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#faf9f6]/90 rounded-3xl border border-[#dbc4a4]/40 overflow-hidden">
            <div className="p-6 border-b border-[#dbc4a4]/40">
              <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2d5a42]" />
                Top Selling Products
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {products.slice(0, 5).map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-[#e8f5ed] text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-[#1a3c28]">{product.name}</p>
                      <p className="font-bold text-[#2d5a42]">{product.sold} sold</p>
                    </div>
                    <div className="h-2 bg-[#f0e6d3] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-full"
                        style={{ width: `${(product.sold / 2100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Edit Modal */}
      <AnimatePresence>
        {showProductForm && editingProduct && (
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
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#faf9f6] rounded-3xl shadow-2xl border border-[#dbc4a4]"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#e8f5ed]/20 rounded-xl">
                    <Edit2 className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#e8f5ed]">Edit Product</h3>
                    <p className="text-sm text-[#e8f5ed]/70">{editingProduct.sku}</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                  className="p-2 bg-[#e8f5ed]/10 hover:bg-[#9b2335] text-[#e8f5ed] rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Product Images */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#5c3d1f] uppercase flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Product Images
                  </label>
                  <div className="flex gap-4">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#f0e6d3] to-[#e8f5ed] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#c49a6c]/40 cursor-pointer hover:border-[#2d5a42] transition-all group">
                      <Upload className="w-8 h-8 text-[#a67c52] group-hover:text-[#2d5a42]" />
                      <span className="text-xs text-[#a67c52] group-hover:text-[#2d5a42]">Upload</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center rounded-2xl bg-[#f0e6d3]/30 border border-dashed border-[#c49a6c]/30">
                      <p className="text-sm text-[#a67c52]">Click upload to add product images</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Product Name</label>
                    <input 
                      type="text"
                      defaultValue={editingProduct.name}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>

                  {/* SKU */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">SKU Code</label>
                    <input 
                      type="text"
                      defaultValue={editingProduct.sku}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-mono focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Category</label>
                    <select 
                      defaultValue={editingProduct.category}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    >
                      <option>Poultry</option>
                      <option>Seafood</option>
                      <option>Mutton</option>
                      <option>Beef</option>
                      <option>Pork</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Status</label>
                    <select 
                      defaultValue={editingProduct.status}
                      className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5c3d1f] uppercase">Description</label>
                  <textarea 
                    rows={3}
                    defaultValue={editingProduct.description}
                    className="w-full px-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30 resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#5c3d1f] uppercase flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editingProduct.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-[#2d5a42]/10 text-[#2d5a42] rounded-lg text-sm font-medium flex items-center gap-1">
                        #{tag}
                        <button className="hover:text-[#9b2335]">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button className="px-3 py-1.5 border border-dashed border-[#c49a6c] text-[#a67c52] rounded-lg text-sm hover:border-[#2d5a42] hover:text-[#2d5a42] transition-all">
                      + Add Tag
                    </button>
                  </div>
                </div>

                {/* Weight Options Section */}
                <div className="space-y-4 p-6 bg-[#f0e6d3]/20 rounded-2xl border border-[#dbc4a4]/40">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase flex items-center gap-2">
                      <Weight className="w-4 h-4" /> Weight & Pricing Options
                    </label>
                    <button className="px-3 py-1.5 bg-[#2d5a42] text-[#e8f5ed] rounded-lg text-sm font-semibold hover:bg-[#3d7a58] transition-all flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {editingProduct.weightOptions.map((option, idx) => (
                      <div key={option.id} className="grid grid-cols-12 gap-3 items-center p-4 bg-[#faf9f6] rounded-xl border border-[#dbc4a4]/40">
                        <div className="col-span-1">
                          <span className="text-sm font-bold text-[#a67c52]">#{idx + 1}</span>
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-[#a67c52] block mb-1">Weight</label>
                          <div className="flex gap-2">
                            <input 
                              type="number"
                              defaultValue={option.weight}
                              className="w-20 px-3 py-2 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-lg text-[#1a3c28] text-sm"
                            />
                            <select 
                              defaultValue={option.unit}
                              className="px-2 py-2 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-lg text-[#1a3c28] text-sm"
                            >
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="lb">lb</option>
                              <option value="oz">oz</option>
                              <option value="unit">unit</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-[#a67c52] block mb-1">Price (₹)</label>
                          <input 
                            type="number"
                            defaultValue={option.price}
                            className="w-full px-3 py-2 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-lg text-[#1a3c28] text-sm font-semibold"
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="text-xs text-[#a67c52] block mb-1">Stock</label>
                          <input 
                            type="number"
                            defaultValue={option.stock}
                            className="w-full px-3 py-2 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-lg text-[#1a3c28] text-sm"
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <button 
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                              option.isDefault 
                                ? "bg-[#2d5a42] text-[#e8f5ed]" 
                                : "bg-[#f0e6d3] text-[#5c3d1f] hover:bg-[#2d5a42] hover:text-[#e8f5ed]"
                            )}
                          >
                            {option.isDefault ? 'Default' : 'Set Default'}
                          </button>
                          <button className="p-2 text-[#9b2335] hover:bg-[#fff5f5] rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Base Price & Compare Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Base Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#a67c52]">₹</span>
                      <input 
                        type="number"
                        defaultValue={editingProduct.basePrice}
                        className="w-full pl-8 pr-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#5c3d1f] uppercase">Compare Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#a67c52]">₹</span>
                      <input 
                        type="number"
                        defaultValue={editingProduct.comparePrice}
                        className="w-full pl-8 pr-4 py-3 bg-[#f0e6d3]/30 border border-[#c49a6c]/30 rounded-xl text-[#1a3c28] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                      />
                    </div>
                    <p className="text-xs text-[#a67c52]">Original price to show discount</p>
                  </div>
                </div>

                {/* Stats (Read Only) */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-[#f0e6d3]/20 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-[#a67c52] uppercase">Total Sold</p>
                    <p className="text-xl font-black text-[#1a3c28]">{editingProduct.sold}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a67c52] uppercase">Rating</p>
                    <p className="text-xl font-black text-[#1a3c28]">{editingProduct.rating} ★</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a67c52] uppercase">Reviews</p>
                    <p className="text-xl font-black text-[#1a3c28]">{editingProduct.reviews}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 bg-[#faf9f6] border-t border-[#dbc4a4]/40 rounded-b-3xl">
                <button 
                  onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                  className="px-6 py-3 text-[#5c3d1f] font-semibold hover:bg-[#f0e6d3] rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                  className="px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#2d5a42]/20 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'location' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl shadow-[#2d5a42]/10">
            <h3 className="text-lg font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#2d5a42]" />
              Store Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-bold text-[#5c3d1f] uppercase">Latitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={isEditing ? formData.latitude : vendor.latitude}
                  onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                  readOnly={!isEditing}
                  className="w-full mt-1 px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#5c3d1f] uppercase">Longitude</label>
                <input 
                  type="number" 
                  step="0.000001"
                  value={isEditing ? formData.longitude : vendor.longitude}
                  onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                  readOnly={!isEditing}
                  className="w-full mt-1 px-3 py-2 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28]"
                />
              </div>
            </div>
            <button 
              onClick={openInMaps}
              className="w-full py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps
            </button>
          </div>

          {/* Live Location Card */}
          <div className="p-6 bg-gradient-to-br from-[#2d5a42]/10 to-[#3d7a58]/5 rounded-3xl border border-[#2d5a42]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#3d7a58] animate-pulse" />
              <h3 className="text-lg font-bold text-[#1a3c28]">Live Location Tracking</h3>
            </div>
            <div className="p-4 bg-[#faf9f6]/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5c3d1f]">Current Status</p>
                  <p className="text-lg font-bold text-[#1a3c28]">Store Location Active</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#5c3d1f]">Last Updated</p>
                  <p className="font-semibold text-[#2d5a42]">Just now</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#f0e6d3]/50 rounded-xl">
                  <p className="text-xs text-[#5c3d1f]">Latitude</p>
                  <p className="font-mono font-semibold text-[#1a3c28]">{vendor.latitude?.toFixed(6)}</p>
                </div>
                <div className="p-3 bg-[#f0e6d3]/50 rounded-xl">
                  <p className="text-xs text-[#5c3d1f]">Longitude</p>
                  <p className="font-mono font-semibold text-[#1a3c28]">{vendor.longitude?.toFixed(6)}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper component for the commission icon
function PercentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

// Helper function to format currency
function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString()}`;
}

// Helper function to calculate total stock for a product
function getTotalStock(product: Product) {
  return product.weightOptions.reduce((sum, opt) => sum + opt.stock, 0);
}


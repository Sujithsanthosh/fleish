"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Search, 
  Package, 
  Edit3, 
  Trash2, 
  Plus, 
  AlertCircle, 
  RefreshCcw, 
  Eye,
  X,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Tag,
  Scale,
  Box,
  Archive,
  ShoppingBag,
  BarChart3,
  Calendar,
  Clock,
  ChevronDown,
  Save,
  History,
  Star,
  ThumbsUp,
  ThumbsDown,
  ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  subcategory: string;
  isAvailable: boolean;
  stock: number;
  minOrderQty: number;
  maxOrderQty: number;
  sku: string;
  barcode: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  tags: string[];
  rating: number;
  totalSales: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
  images: string[];
  supplier: string;
  taxRate: number;
  discount: number;
  reviews: { id: string; customer: string; rating: number; comment: string; date: string }[];
  salesHistory: { date: string; quantity: number; revenue: number }[];
}

// Mock Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PRD-001',
    name: 'Fresh Atlantic Salmon',
    description: 'Premium quality Atlantic salmon, wild-caught and flash-frozen to preserve freshness. Rich in Omega-3 fatty acids.',
    price: 899,
    unit: 'kg',
    category: 'Seafood',
    subcategory: 'Fresh Fish',
    isAvailable: true,
    stock: 150,
    minOrderQty: 0.5,
    maxOrderQty: 10,
    sku: 'FSH-SAL-001',
    barcode: '8901234567890',
    weight: 1,
    dimensions: { length: 30, width: 15, height: 5 },
    tags: ['fresh', 'omega-3', 'wild-caught', 'premium'],
    rating: 4.8,
    totalSales: 2847,
    totalRevenue: 2559543,
    createdAt: '2023-01-15',
    updatedAt: '2024-04-12',
    images: ['salmon-1.jpg', 'salmon-2.jpg'],
    supplier: 'Nordic Seafood Exports',
    taxRate: 5,
    discount: 0,
    reviews: [
      { id: 'REV-001', customer: 'Rahul M.', rating: 5, comment: 'Excellent quality! Very fresh.', date: '2024-04-10' },
      { id: 'REV-002', customer: 'Priya S.', rating: 4, comment: 'Good but slightly expensive', date: '2024-04-08' }
    ],
    salesHistory: [
      { date: '2024-04-01', quantity: 45, revenue: 40455 },
      { date: '2024-04-02', quantity: 38, revenue: 34162 },
      { date: '2024-04-03', quantity: 52, revenue: 46748 }
    ]
  },
  {
    id: 'PRD-002',
    name: 'Organic Chicken Breast',
    description: 'Farm-raised organic chicken breast, antibiotic-free. Perfect for healthy meals.',
    price: 349,
    unit: 'kg',
    category: 'Poultry',
    subcategory: 'Fresh Chicken',
    isAvailable: true,
    stock: 200,
    minOrderQty: 0.5,
    maxOrderQty: 15,
    sku: 'PLY-CHB-001',
    barcode: '8901234567891',
    weight: 1,
    dimensions: { length: 20, width: 15, height: 3 },
    tags: ['organic', 'antibiotic-free', 'farm-raised', 'healthy'],
    rating: 4.6,
    totalSales: 4521,
    totalRevenue: 1577829,
    createdAt: '2023-02-20',
    updatedAt: '2024-04-11',
    images: ['chicken-1.jpg'],
    supplier: 'Green Farms Organic',
    taxRate: 5,
    discount: 10,
    reviews: [
      { id: 'REV-003', customer: 'Amit K.', rating: 5, comment: 'Very tender and fresh', date: '2024-04-09' }
    ],
    salesHistory: [
      { date: '2024-04-01', quantity: 89, revenue: 31061 },
      { date: '2024-04-02', quantity: 76, revenue: 26524 }
    ]
  },
  {
    id: 'PRD-003',
    name: 'Tiger Prawns Jumbo',
    description: 'Large tiger prawns, perfect for grilling or curries. Deveined and cleaned.',
    price: 1299,
    unit: 'kg',
    category: 'Seafood',
    subcategory: 'Shellfish',
    isAvailable: false,
    stock: 0,
    minOrderQty: 0.25,
    maxOrderQty: 5,
    sku: 'FSH-TPR-001',
    barcode: '8901234567892',
    weight: 1,
    dimensions: { length: 25, width: 20, height: 5 },
    tags: ['jumbo', 'deveined', 'cleaned', 'premium'],
    rating: 4.9,
    totalSales: 1823,
    totalRevenue: 2368077,
    createdAt: '2023-03-10',
    updatedAt: '2024-04-10',
    images: ['prawns-1.jpg', 'prawns-2.jpg'],
    supplier: 'Ocean Catch Seafood',
    taxRate: 5,
    discount: 0,
    reviews: [
      { id: 'REV-004', customer: 'Sneha R.', rating: 5, comment: 'Best prawns I\'ve ever had!', date: '2024-04-07' }
    ],
    salesHistory: [
      { date: '2024-04-01', quantity: 12, revenue: 15588 },
      { date: '2024-04-02', quantity: 18, revenue: 23382 }
    ]
  },
  {
    id: 'PRD-004',
    name: 'Grass-fed Lamb Chops',
    description: 'Premium grass-fed lamb chops from New Zealand. Tender and flavorful.',
    price: 1599,
    unit: 'kg',
    category: 'Mutton',
    subcategory: 'Lamb',
    isAvailable: true,
    stock: 80,
    minOrderQty: 0.5,
    maxOrderQty: 8,
    sku: 'MTN-LMB-001',
    barcode: '8901234567893',
    weight: 1,
    dimensions: { length: 25, width: 20, height: 4 },
    tags: ['grass-fed', 'new-zealand', 'premium', 'tender'],
    rating: 4.7,
    totalSales: 1234,
    totalRevenue: 1973166,
    createdAt: '2023-04-05',
    updatedAt: '2024-04-12',
    images: ['lamb-1.jpg'],
    supplier: 'NZ Premium Meats',
    taxRate: 5,
    discount: 0,
    reviews: [],
    salesHistory: [
      { date: '2024-04-01', quantity: 8, revenue: 12792 }
    ]
  },
  {
    id: 'PRD-005',
    name: 'Rohu Fish (Whole)',
    description: 'Fresh river rohu fish, cleaned and gutted. Popular for curries.',
    price: 249,
    unit: 'kg',
    category: 'Seafood',
    subcategory: 'Fresh Water Fish',
    isAvailable: true,
    stock: 300,
    minOrderQty: 1,
    maxOrderQty: 20,
    sku: 'FSH-ROH-001',
    barcode: '8901234567894',
    weight: 1,
    dimensions: { length: 40, width: 10, height: 8 },
    tags: ['fresh', 'cleaned', 'gutted', 'river-fish'],
    rating: 4.4,
    totalSales: 5621,
    totalRevenue: 1399629,
    createdAt: '2023-05-15',
    updatedAt: '2024-04-11',
    images: ['rohu-1.jpg'],
    supplier: 'Local Fish Farms',
    taxRate: 5,
    discount: 5,
    reviews: [
      { id: 'REV-005', customer: 'Vikram P.', rating: 4, comment: 'Fresh but has bones', date: '2024-04-06' }
    ],
    salesHistory: [
      { date: '2024-04-01', quantity: 156, revenue: 38844 }
    ]
  }
];

const CATEGORIES: Record<string, { color: string; icon: React.ReactNode }> = {
  'Seafood': { color: 'bg-blue-100 text-blue-600', icon: <Box className="w-4 h-4" /> },
  'Poultry': { color: 'bg-amber-100 text-amber-600', icon: <ShoppingBag className="w-4 h-4" /> },
  'Mutton': { color: 'bg-red-100 text-red-600', icon: <Archive className="w-4 h-4" /> }
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', unit: 'kg', category: '', stock: '' });
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'sales' | 'reviews'>('overview');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(MOCK_PRODUCTS);
    } catch (e: any) {
      setError(`Failed to load products: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      name: formData.name,
      description: '',
      price: parseFloat(formData.price),
      unit: formData.unit,
      category: formData.category,
      subcategory: '',
      isAvailable: true,
      stock: parseInt(formData.stock) || 0,
      minOrderQty: 0.5,
      maxOrderQty: 10,
      sku: `SKU-${Date.now()}`,
      barcode: '',
      weight: 1,
      dimensions: { length: 10, width: 10, height: 10 },
      tags: [],
      rating: 0,
      totalSales: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      images: [],
      supplier: '',
      taxRate: 5,
      discount: 0,
      reviews: [],
      salesHistory: []
    };
    setProducts(prev => [product, ...prev]);
    setFormData({ name: '', price: '', unit: 'kg', category: '', stock: '' });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedProduct) return;
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...editForm } as Product : p));
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
    setActiveTab('overview');
  };

  const filtered = products.filter(p => 
    !search || 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: products.length,
    available: products.filter(p => p.isAvailable).length,
    unavailable: products.filter(p => !p.isAvailable).length,
    totalRevenue: products.reduce((acc, p) => acc + p.totalRevenue, 0)
  };

  return (
    <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a3c28] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center">
              <Package className="w-5 h-5 text-[#e8f5ed]" />
            </div>
            Product Management
          </h1>
          <p className="text-[#5c3d1f] mt-2">Manage product catalog, pricing, inventory, and view detailed analytics</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={loadProducts} 
            disabled={loading} 
            className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all border border-[#dbc4a4] disabled:opacity-50"
          >
            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? 'Loading...' : 'Refresh'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg shadow-[#2d5a42]/20 hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" /> 
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2d5a42] to-[#3d7a58]" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Products</p>
              <p className="text-2xl font-black text-[#1a3c28] mt-1">{stats.total}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58]">
              <Package className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-600 to-emerald-500" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Available</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{stats.available}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-red-400" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Out of Stock</p>
              <p className="text-2xl font-black text-red-500 mt-1">{stats.unavailable}</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-red-400">
              <XCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} className="relative overflow-hidden bg-[#faf9f6] p-4 rounded-2xl border border-[#dbc4a4]/50 shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-yellow-600" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#a67c52] uppercase tracking-wider">Total Revenue</p>
              <p className="text-2xl font-black text-amber-600 mt-1">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
        </motion.div>
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

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#f0e6d3]/30 rounded-2xl border border-[#dbc4a4]/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a67c52]" />
          <input 
            type="text" 
            placeholder="Search products by name, category, SKU..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all" 
          />
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate} 
            className="bg-white p-6 rounded-3xl border border-[#dbc4a4]/50 shadow-sm space-y-4 overflow-hidden"
          >
            <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#2d5a42]" />
              Add New Product
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Product Name *" 
                value={formData.name} 
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                required 
              />
              <input 
                type="number" 
                placeholder="Price (₹) *" 
                value={formData.price} 
                onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                required 
              />
              <input 
                type="number" 
                placeholder="Stock Quantity *" 
                value={formData.stock} 
                onChange={e => setFormData(p => ({ ...p, stock: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                required 
              />
              <select
                value={formData.unit}
                onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]"
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="gm">Gram (gm)</option>
                <option value="piece">Piece</option>
                <option value="pack">Pack</option>
              </select>
              <input 
                type="text" 
                placeholder="Category *" 
                value={formData.category} 
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} 
                className="px-4 py-3 bg-[#faf9f6] border border-[#dbc4a4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42]" 
                required 
              />
            </div>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="px-6 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Create Product
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button" 
                onClick={() => setShowForm(false)} 
                className="px-6 py-3 bg-[#f0e6d3] text-[#5c3d1f] font-bold rounded-xl hover:bg-[#e8f5ed] transition-all"
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#dbc4a4]/50 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-[#f0e6d3]/50 to-[#faf9f6]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0e6d3]/50">
            {filtered.map(product => {
              const categoryInfo = CATEGORIES[product.category] || { color: 'bg-slate-100 text-slate-600', icon: <Tag className="w-4 h-4" /> };
              
              return (
                <motion.tr 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: 'rgba(240, 230, 211, 0.3)' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold shadow-sm">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1a3c28]">{product.name}</p>
                        <p className="text-xs text-[#a67c52]">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold", categoryInfo.color)}>
                      {categoryInfo.icon}
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-[#1a3c28]">₹{product.price}</span>
                      <span className="text-xs text-[#a67c52]">/{product.unit}</span>
                    </div>
                    {product.discount > 0 && (
                      <p className="text-xs text-emerald-600 font-semibold">{product.discount}% OFF</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        product.stock > 100 ? "bg-emerald-500" : product.stock > 20 ? "bg-amber-500" : "bg-red-500"
                      )} />
                      <span className="text-sm font-semibold text-[#1a3c28]">{product.stock} {product.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                      product.isAvailable ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'
                    )}>
                      {product.isAvailable ? (
                        <><CheckCircle2 className="w-3 h-3" /> Available</>
                      ) : (
                        <><XCircle className="w-3 h-3" /> Out of Stock</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleView(product)}
                        className="p-2 text-[#2d5a42] hover:bg-[#e8f5ed] rounded-xl transition-all"
                        title="View Full Details"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(product)}
                        className="p-2 text-[#8b6914] hover:bg-[#f0e6d3] rounded-xl transition-all"
                        title="Edit Product"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Product"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f0e6d3] flex items-center justify-center">
              <Package className="w-10 h-10 text-[#a67c52]" />
            </div>
            <h3 className="text-lg font-bold text-[#1a3c28]">No products found</h3>
            <p className="text-[#5c3d1f] mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* View Product Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">{selectedProduct.name}</h2>
                    <p className="text-sm text-[#e8f5ed]/70">SKU: {selectedProduct.sku} • {selectedProduct.barcode}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-2 bg-[#f0e6d3]/30 border-b border-[#dbc4a4]">
                {['overview', 'details', 'sales', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                      activeTab === tab 
                        ? "bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] shadow-md"
                        : "text-[#5c3d1f] hover:bg-[#e8f5ed]/50"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-black text-[#1a3c28]">{selectedProduct.rating}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Rating</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <ShoppingBag className="w-6 h-6 text-[#2d5a42] mx-auto mb-2" />
                        <p className="text-2xl font-black text-[#1a3c28]">{selectedProduct.totalSales}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Total Sales</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-emerald-600">₹{(selectedProduct.totalRevenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">Revenue</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 text-center">
                        <Archive className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-black text-blue-600">{selectedProduct.stock}</p>
                        <p className="text-xs font-bold text-[#a67c52] uppercase">In Stock</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                      <h3 className="font-bold text-[#1a3c28] flex items-center gap-2 mb-3">
                        <Tag className="w-5 h-5 text-[#2d5a42]" />
                        Description
                      </h3>
                      <p className="text-[#5c3d1f] leading-relaxed">{selectedProduct.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedProduct.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-[#f0e6d3] text-[#5c3d1f] rounded-full text-xs font-semibold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 space-y-3">
                        <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#2d5a42]" />
                          Pricing
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Base Price</span>
                            <span className="font-semibold text-[#1a3c28]">₹{selectedProduct.price}/{selectedProduct.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Tax Rate</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.taxRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Discount</span>
                            <span className="font-semibold text-emerald-600">{selectedProduct.discount}%</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-[#f0e6d3]">
                            <span className="text-[#a67c52] font-bold">Final Price</span>
                            <span className="font-bold text-[#2d5a42]">
                              ₹{(selectedProduct.price * (1 + selectedProduct.taxRate/100) * (1 - selectedProduct.discount/100)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40 space-y-3">
                        <h3 className="font-bold text-[#1a3c28] flex items-center gap-2">
                          <Scale className="w-5 h-5 text-[#2d5a42]" />
                          Inventory
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Current Stock</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.stock} {selectedProduct.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Min Order Qty</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.minOrderQty} {selectedProduct.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Max Order Qty</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.maxOrderQty} {selectedProduct.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#a67c52]">Weight</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.weight} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                        <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                          <Box className="w-5 h-5 text-[#2d5a42]" />
                          Product Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-[#f0e6d3]">
                            <span className="text-[#a67c52]">Product ID</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.id}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#f0e6d3]">
                            <span className="text-[#a67c52]">SKU</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.sku}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#f0e6d3]">
                            <span className="text-[#a67c52]">Barcode</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.barcode || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#f0e6d3]">
                            <span className="text-[#a67c52]">Category</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-[#f0e6d3]">
                            <span className="text-[#a67c52]">Subcategory</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.subcategory || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-[#a67c52]">Supplier</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.supplier || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                        <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-[#2d5a42]" />
                          Timeline
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-[#f0e6d3]">
                            <span className="text-[#a67c52]">Created At</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.createdAt}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-[#a67c52]">Last Updated</span>
                            <span className="font-semibold text-[#1a3c28]">{selectedProduct.updatedAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                      <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-[#2d5a42]" />
                        Product Images
                      </h3>
                      <div className="flex gap-4">
                        {selectedProduct.images.length > 0 ? (
                          selectedProduct.images.map((img, idx) => (
                            <div key={idx} className="w-24 h-24 bg-[#f0e6d3] rounded-xl flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-[#a67c52]" />
                            </div>
                          ))
                        ) : (
                          <p className="text-[#a67c52] italic">No images uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sales' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-[#e8f5ed] to-[#f0e6d3] rounded-2xl border border-[#dbc4a4]/40">
                      <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#2d5a42]" />
                        Sales Performance
                      </h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <p className="text-2xl font-black text-[#1a3c28]">{selectedProduct.totalSales}</p>
                          <p className="text-xs font-bold text-[#a67c52] uppercase">Units Sold</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <p className="text-2xl font-black text-emerald-600">₹{(selectedProduct.totalRevenue / 1000).toFixed(1)}k</p>
                          <p className="text-xs font-bold text-[#a67c52] uppercase">Revenue</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <p className="text-2xl font-black text-blue-600">₹{(selectedProduct.totalRevenue / selectedProduct.totalSales).toFixed(0)}</p>
                          <p className="text-xs font-bold text-[#a67c52] uppercase">Avg Price</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                          <p className="text-2xl font-black text-amber-600">{selectedProduct.stock}</p>
                          <p className="text-xs font-bold text-[#a67c52] uppercase">Remaining</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-[#dbc4a4]/40">
                      <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#2d5a42]" />
                        Recent Sales History
                      </h3>
                      <div className="space-y-3">
                        {selectedProduct.salesHistory?.map((sale, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-[#faf9f6] rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-100 rounded-lg">
                                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#1a3c28] text-sm">{sale.date}</p>
                                <p className="text-xs text-[#a67c52]">{sale.quantity} units sold</p>
                              </div>
                            </div>
                            <p className="font-bold text-[#2d5a42]">₹{sale.revenue}</p>
                          </div>
                        ))}
                        {(!selectedProduct.salesHistory || selectedProduct.salesHistory.length === 0) && (
                          <p className="text-sm text-[#a67c52] italic text-center py-4">No sales history available</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                      <h3 className="font-bold text-[#1a3c28] mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        Customer Reviews Summary
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-4xl font-black text-[#1a3c28]">{selectedProduct.rating}</p>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "w-4 h-4",
                                  star <= Math.round(selectedProduct.rating) ? "text-amber-400 fill-amber-400" : "text-slate-300"
                                )} 
                              />
                            ))}
                          </div>
                          <p className="text-xs text-[#a67c52] mt-1">{selectedProduct.reviews?.length || 0} reviews</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = selectedProduct.reviews?.filter(r => r.rating === rating).length || 0;
                            const total = selectedProduct.reviews?.length || 1;
                            const percentage = (count / total) * 100;
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="text-xs text-[#a67c52] w-3">{rating}</span>
                                <Star className="w-3 h-3 text-amber-400" />
                                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-xs text-[#a67c52] w-6">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedProduct.reviews?.map((review) => (
                        <motion.div 
                          key={review.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-white rounded-2xl border border-[#dbc4a4]/40"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-white font-bold">
                                {review.customer.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-[#1a3c28]">{review.customer}</p>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={cn(
                                        "w-3 h-3",
                                        star <= review.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"
                                      )} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-[#a67c52]">{review.date}</span>
                          </div>
                          <p className="text-[#5c3d1f] mt-3">{review.comment}</p>
                        </motion.div>
                      ))}
                      {(!selectedProduct.reviews || selectedProduct.reviews.length === 0) && (
                        <div className="text-center py-12">
                          <Star className="w-16 h-16 text-[#a67c52]/30 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-[#1a3c28]">No reviews yet</h3>
                          <p className="text-[#5c3d1f] mt-2">This product hasn't received any reviews</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#faf9f6] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#dbc4a4]"
            >
              <div className="p-6 border-b border-[#f0e6d3] flex items-center justify-between bg-gradient-to-r from-[#2d5a42] to-[#3d7a58]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5ed]/20 flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-[#e8f5ed]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5ed]">Edit Product</h2>
                    <p className="text-sm text-[#e8f5ed]/70">Update product information or add to shop</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 text-[#e8f5ed]/70 hover:text-[#e8f5ed] hover:bg-[#e8f5ed]/20 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-4 bg-[#f0e6d3]/30 border-b border-[#dbc4a4]">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (confirm(`Add "${selectedProduct.name}" to the shop?`)) {
                        setEditForm({ ...editForm, isAvailable: true });
                        alert(`✅ ${selectedProduct.name} has been added to the shop!`);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Shop
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (confirm(`Remove "${selectedProduct.name}" from the shop?`)) {
                        setEditForm({ ...editForm, isAvailable: false });
                        alert(`⚠️ ${selectedProduct.name} has been removed from the shop!`);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-400 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Archive className="w-4 h-4" />
                    Remove from Shop
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={editForm.stock || ''}
                      onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Category</label>
                    <input
                      type="text"
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Unit</label>
                    <select
                      value={editForm.unit || 'kg'}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="gm">Gram (gm)</option>
                      <option value="piece">Piece</option>
                      <option value="pack">Pack</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Discount (%)</label>
                    <input
                      type="number"
                      value={editForm.discount || 0}
                      onChange={(e) => setEditForm({ ...editForm, discount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5c3d1f] uppercase tracking-wider mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={editForm.taxRate || 5}
                      onChange={(e) => setEditForm({ ...editForm, taxRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-[#dbc4a4] rounded-xl text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/20 focus:border-[#2d5a42] transition-all"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-4 bg-[#f0e6d3]/30 rounded-xl">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={editForm.isAvailable || false}
                    onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-[#2d5a42] border-[#dbc4a4] rounded focus:ring-[#2d5a42]"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-semibold text-[#1a3c28]">Product is available</label>
                </div>
              </div>

              <div className="p-6 border-t border-[#f0e6d3] flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl font-semibold hover:bg-[#e8f5ed] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Store, MapPin, Navigation, Phone, Clock, Star, Search,
  Fish, Beef, ChevronRight, ArrowLeft, Heart, Share2,
  ShoppingBag, Plus, Minus, Trash2, CreditCard, Truck,
  ShieldCheck, Sparkles, Info, X, CheckCircle2,
  TrendingUp, Award, BadgeCheck, Calendar, Package,
  Scale, IndianRupee, AlertCircle, RotateCcw, Filter,
  Tag, Flame, Leaf, Crown, Shell, Anchor, Waves,
  UtensilsCrossed, Droplets,
  BadgePercent, Receipt, MapPinned, ArrowUpRight,
  Sparkle, Gem, Medal, ThumbsUp, Mic
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { StoreVoiceCommandUI } from '@/components/StoreVoiceCommandUI';
import { Product, StoreData, PricingOption, ProductVariant } from './storeData';

interface CartItem {
  product: Product;
  storeId: string;
  storeName: string;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedPricingOption?: PricingOption;
  calculatedWeight?: number;
  cutType?: string;
}

// Global cart state with localStorage
function useGlobalCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fleish-cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cart');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('fleish-cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Initialize AdSense ads on client side after animations complete
  useEffect(() => {
    const initAds = () => {
      if (typeof window === 'undefined') return;
      
      // Wait for adsbygoogle to be available
      const checkAndInit = () => {
        if ((window as any).adsbygoogle) {
          try {
            // Initialize each ad unit separately
            const adElements = document.querySelectorAll('.adsbygoogle');
            adElements.forEach(() => {
              (window as any).adsbygoogle.push({});
            });
          } catch (e) {
            // Silently ignore - ad may already be initialized
          }
        } else {
          // Retry after 500ms if not loaded yet
          setTimeout(checkAndInit, 500);
        }
      };
      
      checkAndInit();
    };
    
    // Delay to ensure DOM elements are rendered after framer-motion animations
    const timer = setTimeout(initAds, 2000);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = useCallback((product: Product, storeId: string, storeName: string,
    selectedVariant?: ProductVariant, selectedPricingOption?: PricingOption, calculatedWeight?: number, cutType?: string) => {
    setCart(prev => {
      // Create unique key based on product, variant, pricing option, and requested cut.
      const itemKey = `${product.id}-${selectedVariant?.id || 'default'}-${selectedPricingOption?.id || 'default'}-${cutType || 'default'}`;
      const existingIndex = prev.findIndex(item => {
        const existingKey = `${item.product.id}-${item.selectedVariant?.id || 'default'}-${item.selectedPricingOption?.id || 'default'}-${item.cutType || 'default'}`;
        return existingKey === itemKey && item.storeId === storeId;
      });
      
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        product, 
        storeId, 
        storeName, 
        quantity: 1, 
        selectedVariant, 
        selectedPricingOption,
        calculatedWeight,
        cutType
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, storeId: string, variantId?: string, pricingOptionId?: string, cutType?: string) => {
    setCart(prev => prev.filter(item => {
      const itemVariantId = item.selectedVariant?.id || 'default';
      const itemPricingId = item.selectedPricingOption?.id || 'default';
      const targetVariantId = variantId || 'default';
      const targetPricingId = pricingOptionId || 'default';
      const itemCutType = item.cutType || 'default';
      const targetCutType = cutType || 'default';
      return !(item.product.id === productId && 
               item.storeId === storeId && 
               itemVariantId === targetVariantId &&
               itemPricingId === targetPricingId &&
               itemCutType === targetCutType);
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, storeId: string, delta: number, variantId?: string, pricingOptionId?: string, cutType?: string) => {
    setCart(prev => prev.map(item => {
      const itemVariantId = item.selectedVariant?.id || 'default';
      const itemPricingId = item.selectedPricingOption?.id || 'default';
      const targetVariantId = variantId || 'default';
      const targetPricingId = pricingOptionId || 'default';
      const itemCutType = item.cutType || 'default';
      const targetCutType = cutType || 'default';
      
      if (item.product.id === productId && 
          item.storeId === storeId &&
          itemVariantId === targetVariantId &&
          itemPricingId === targetPricingId &&
          itemCutType === targetCutType) {
        const newQty = Math.max(0, item.quantity + delta);
        return newQty === 0 ? null as unknown as CartItem : { ...item, quantity: newQty };
      }
      return item;
    }).filter((item): item is CartItem => item !== null));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate cart total considering variants and pricing options
  const cartTotal = cart.reduce((sum, item) => {
    let itemPrice = item.product.price;
    
    // Use variant price if selected
    if (item.selectedVariant) {
      itemPrice = item.selectedVariant.pricePerKg;
    }
    
    // For amount-based pricing (₹100, ₹200), use the amount directly
    if (item.selectedPricingOption?.type === 'calculated') {
      return sum + (item.selectedPricingOption.value * item.quantity);
    }
    
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isLoaded };
}

export default function StoreDetailClient({ store }: { store: StoreData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVoiceCommandOpen, setIsVoiceCommandOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Product selection states
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [selectedPricingOptions, setSelectedPricingOptions] = useState<Record<string, PricingOption>>({});
  const [showProductDetails, setShowProductDetails] = useState<string | null>(null);

  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useGlobalCart();

  // Sync cart with Navbar cart button
  useEffect(() => {
    const cartBtn = document.getElementById('navbar-cart-btn');
    const cartCountEl = document.getElementById('navbar-cart-count');
    const cartTotalEl = document.getElementById('navbar-cart-total');
    if (cartCountEl && cartTotalEl) {
      if (cart.length > 0) {
        cartCountEl.textContent = String(cartCount);
        cartCountEl.classList.remove('hidden');
        cartTotalEl.textContent = '₹' + cartTotal.toLocaleString();
        cartBtn?.classList.remove('hidden');
      } else {
        cartCountEl.classList.add('hidden');
        cartBtn?.classList.add('hidden');
      }
    }
  }, [cart, cartTotal, cartCount]);

  // Handle Navbar cart button click
  useEffect(() => {
    const cartBtn = document.getElementById('navbar-cart-btn');
    if (!cartBtn) return;
    const handleClick = () => setIsCartOpen(true);
    cartBtn.addEventListener('click', handleClick);
    return () => cartBtn.removeEventListener('click', handleClick);
  }, []);

  // Get enabled categories from store
  const enabledCategories = store.categories?.filter(cat => cat.enabled) || [];
  
  // Get all subcategories from enabled products
  const availableSubcategories = Array.from(new Set(
    store.products
      .filter(p => p.vendorEnabled && p.inStock)
      .map(p => p.subcategory)
      .filter(Boolean)
  ));

  // Filter products - only show vendorEnabled and inStock products
  const filteredProducts = store.products.filter(product => {
    // Only show enabled products
    if (!product.vendorEnabled || !product.inStock) return false;
    
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });
  
  // Group products by subcategory
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const key = product.subcategory || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  // Handle variant selection
  const handleVariantSelect = (productId: string, variant: ProductVariant) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
  };

  // Handle pricing option selection
  const handlePricingOptionSelect = (productId: string, option: PricingOption) => {
    setSelectedPricingOptions(prev => ({ ...prev, [option.id]: option }));
    // Also store by product for easier lookup
    setSelectedPricingOptions(prev => ({ ...prev, [productId]: option }));
  };

  // Calculate weight for amount-based pricing
  const calculateWeightForAmount = (amount: number, pricePerKg: number): number => {
    return (amount / pricePerKg) * 1000; // Returns grams
  };

  // Handle add to cart with variant and pricing options
  const handleAddToCart = (product: Product, customPricingOption?: PricingOption) => {
    const variant = selectedVariants[product.id];
    const pricingOption = customPricingOption || selectedPricingOptions[product.id];
    
    // Calculate weight if using amount-based pricing
    let calculatedWeight: number | undefined;
    if (pricingOption?.type === 'calculated') {
      const pricePerKg = variant?.pricePerKg || product.price;
      calculatedWeight = (pricingOption.value / pricePerKg) * 1000;
    }
    
    // Add to cart
    addToCart(product, store.id, store.name, variant, pricingOption, calculatedWeight);
    
    // Show success animation
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 1500);
  };

  // Handle voice command add to cart
  const handleVoiceAddToCart = useCallback((product: Product, variant?: ProductVariant, pricingOption?: PricingOption, cutType?: string) => {
    // Store the variant and pricing option in state
    if (variant) {
      setSelectedVariants(prev => ({ ...prev, [product.id]: variant }));
    }
    if (pricingOption) {
      setSelectedPricingOptions(prev => ({ ...prev, [product.id]: pricingOption }));
    }
    
    // Calculate weight for amount-based pricing
    let calculatedWeight: number | undefined;
    if (pricingOption?.type === 'calculated') {
      const pricePerKg = variant?.pricePerKg || product.price;
      calculatedWeight = (pricingOption.value / pricePerKg) * 1000;
    }
    
    // Add to cart
    addToCart(product, store.id, store.name, variant, pricingOption, calculatedWeight, cutType);
    
    // Show success animation
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 1500);
    
    // Open cart to show the added item
    setTimeout(() => setIsCartOpen(true), 500);
  }, [addToCart, store.id, store.name]);

  // Handle checkout
  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const placeOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setShowCheckout(false);
      setOrderPlaced(false);
      setIsCartOpen(false);
    }, 3000);
  };

  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'fish': return <Fish className="w-5 h-5" />;
      case 'meat': return <Beef className="w-5 h-5" />;
      case 'both': return <><Fish className="w-4 h-4" /><Beef className="w-4 h-4 -ml-1" /></>;
      default: return <Store className="w-5 h-5" />;
    }
  };

  // Get current price considering variant selection
  const getCurrentPrice = (product: Product) => {
    const selectedVariant = selectedVariants[product.id];
    return selectedVariant ? selectedVariant.pricePerKg : product.price;
  };

  return (
    <main className="min-h-screen bg-slate-950 relative overflow-x-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs with animation */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -30, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-gradient-to-br from-emerald-600/20 to-teal-500/20 rounded-full blur-[120px]" 
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBWMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMCA0MEg0MFYweiIgZmlsbD0ibm9uZSIvPjxyZWN0IHg9IjM5IiB5PSIzOSIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
      </div>

      <Navbar />

      {/* Enhanced Hero Section with Cinematic Video Background */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Cinematic Video Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Video Background - Cinematic muted loop */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            poster="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-salmon-fillets-on-a-wooden-board-42995-large.mp4" type="video/mp4" />
          </video>
          
          {/* Cinematic Color Grading Overlay - Teal & Orange film look */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-emerald-950/60 to-slate-950/90" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 via-transparent to-cyan-900/30 mix-blend-overlay" />
          
          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
          
          {/* Film Grain Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />
        </div>

        {/* Animated Background Pattern Overlay */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
          
          {/* Animated Gradient Orbs - More Subtle */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/15 to-teal-500/15 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-[100px]"
          />
        </div>

        {/* Store Cover Image as Parallax Layer */}
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-[2]"
        >
          <img
            src={store.coverImage}
            alt={store.name}
            className="w-full h-full object-cover mix-blend-luminosity"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/50" />
        </motion.div>
        
        {/* Cinematic Floating Elements - More Elegant */}
        <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 8, -8, 0], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 left-20"
          >
            <Fish className="w-32 h-32 text-emerald-400/30" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -10, 10, 0], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-40 right-32"
          >
            <Shell className="w-24 h-24 text-cyan-400/30" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 left-1/4"
          >
            <Waves className="w-40 h-40 text-teal-400/20" />
          </motion.div>
        </div>

        {/* Google AdSense - Right Side Banner Ad (Larger) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="hidden lg:block absolute top-32 right-4 z-[5] w-72"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl blur-2xl opacity-60" />
            
            {/* Ad Container with glassmorphism */}
            <div className="relative bg-slate-950/90 backdrop-blur-3xl border border-white/20 rounded-3xl p-5 overflow-hidden shadow-2xl shadow-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Sponsored</span>
                <span className="text-[11px] text-slate-500">Ad</span>
              </div>
              
              {/* Google AdSense Ad Unit - Larger */}
              <div className="relative bg-slate-900/50 rounded-lg overflow-hidden">
                <ins
                  className="adsbygoogle block w-full h-[250px]"
                  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                  data-ad-slot="HERO_BANNER_AD"
                  data-ad-format="vertical"
                  data-full-width-responsive="false"
                  suppressHydrationWarning
                />
                {/* Placeholder when ad doesn't load */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                  <span className="text-xs uppercase tracking-wider">Advertisement</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Animated Top Bar with Glass Effect */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-0 left-0 right-0 z-20 p-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Back Button with Enhanced Styling */}
            <Link
              href="/store"
              className="group flex items-center gap-2 px-4 py-2.5 bg-black/30 backdrop-blur-xl text-white rounded-xl hover:bg-white/10 transition-all border border-white/10 hover:border-white/30"
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">Back</span>
            </Link>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-black/30 backdrop-blur-xl text-white rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-black/30 backdrop-blur-xl text-white rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <Heart className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              {/* Store Type Badge with Animation */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/40 text-emerald-300 mb-5 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="font-semibold text-sm tracking-wide uppercase">{store.type === 'both' ? 'Fish & Meat Specialist' : store.type === 'fish' ? 'Premium Fish Market' : 'Artisan Meat Shop'}</span>
              </motion.div>

              {/* Store Name with Enhanced Gradient Text */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl font-black mb-5 bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl"
              >
                {store.name}
              </motion.h1>
              
              {/* Store Address */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-300 mb-5 flex items-center gap-2"
              >
                <MapPin className="w-5 h-5 text-emerald-400" />
                {store.address}
              </motion.p>
              
              {/* Enhanced Info Row */}
              <div className="flex flex-wrap items-center gap-3 md:gap-5">
                {/* Rating Badge */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{store.rating}</span>
                  <span className="text-white/60 text-sm">({store.rating * 100}+ reviews)</span>
                </motion.div>
                
                {/* Distance Badge */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <MapPinned className="w-4 h-4 text-emerald-400" />
                  <span className="text-white/90 text-sm">{store.distance} km away</span>
                </motion.div>
                
                {/* Open Status */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${store.isOpen ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-red-500/20 border-red-500/40 text-red-300'}`}
                >
                  <div className={`w-2 h-2 rounded-full animate-pulse ${store.isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {store.isOpen ? 'Open Now' : 'Closed'}
                </motion.div>
                
                {/* Delivery Time */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span className="text-white/90 text-sm">{store.deliveryTime}</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* Main Content */}
      <section className="relative px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Products */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Banner Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/30 p-8"
              >
                {/* Animated background elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 rounded-full blur-3xl"
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex-1">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-300 text-sm font-semibold mb-4 border border-emerald-500/30"
                    >
                      <Sparkles className="w-4 h-4" />
                      Special Offers Today
                    </motion.div>
                    <h2 className="text-3xl font-black text-white mb-2">
                      Fresh Catch Daily
                    </h2>
                    <p className="text-slate-300 text-lg mb-4 max-w-md">
                      Premium quality fish & meat delivered fresh to your doorstep. Order now and get up to 20% off!
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <BadgeCheck className="w-5 h-5" />
                        <span className="font-semibold">Certified Quality</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Truck className="w-5 h-5" />
                        <span className="font-semibold">Free Delivery</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden md:block"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-50" />
                      <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-500/80 to-cyan-500/80 rounded-2xl flex items-center justify-center">
                        <Fish className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { icon: Package, label: 'Products', value: store.products.length, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
                  { icon: Star, label: 'Rating', value: store.rating, color: 'from-amber-500/20 to-yellow-500/20', iconColor: 'text-amber-400' },
                  { icon: Clock, label: 'Delivery', value: store.deliveryTime, color: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400' },
                  { icon: ShieldCheck, label: 'Certified', value: '100%', color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`relative bg-gradient-to-br ${stat.color} backdrop-blur-xl border border-white/10 rounded-2xl p-4 overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3">
                      <div className={`p-3 bg-white/10 rounded-xl ${stat.iconColor}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Featured Products Horizontal Scroll - ENHANCED */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
                      <Crown className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Featured Products</h3>
                      <p className="text-sm text-slate-400">Top rated picks for you</p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                  >
                    View All
                  </motion.button>
                </div>
                
                <div className="relative">
                  {/* Gradient fade edges */}
                  <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {store.products
                      .filter(p => p.rating >= 4.5)
                      .slice(0, 8)
                      .map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 30, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                        whileHover={{ scale: 1.03, y: -6 }}
                        className="flex-shrink-0 w-72 bg-gradient-to-br from-white/15 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden cursor-pointer group shadow-xl shadow-black/20"
                      >
                        {/* Product Image Container */}
                        <div className="relative h-40 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-slate-900/50 z-10" />
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imIXij77ij6Y8L3RleHQ+PC9zdmc+';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                          
                          {/* Badges */}
                          <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                            <span className="px-3 py-1 bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white text-xs font-bold rounded-xl shadow-lg">
                              {product.discount ? `-${product.discount}% OFF` : 'BESTSELLER'}
                            </span>
                            {product.isFresh && (
                              <span className="px-3 py-1 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                FRESH
                              </span>
                            )}
                          </div>
                          
                          {/* Rating on image */}
                          <div className="absolute bottom-3 left-3 z-20">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-xl border border-white/10">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-white text-sm font-bold">{product.rating}</span>
                              <span className="text-white/60 text-xs">({product.reviews})</span>
                            </div>
                          </div>
                          
                          {/* Category icon */}
                          <div className="absolute top-3 right-3 z-20">
                            <div className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10">
                              {product.category === 'fish' ? <Fish className="w-5 h-5 text-cyan-400" /> : <Beef className="w-5 h-5 text-orange-400" />}
                            </div>
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-4">
                          <h4 className="font-bold text-white text-base mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors">{product.name}</h4>
                          <p className="text-slate-400 text-xs mb-3 line-clamp-1">{product.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-emerald-400">₹{product.price}</span>
                                <span className="text-slate-400 text-xs">/kg</span>
                              </div>
                              {product.discount && (
                                <span className="text-xs text-slate-500 line-through">
                                  ₹{Math.round(product.price / (1 - product.discount / 100))}
                                </span>
                              )}
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.inStock}
                              className={`p-3 rounded-xl font-bold transition-all ${
                                product.inStock
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
                                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {product.inStock ? <Plus className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Google AdSense - Inline Content Ad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="relative"
              >
                <div className="relative bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Sponsored</span>
                  </div>
                  <div className="relative bg-slate-900/30 rounded-lg overflow-hidden">
                    <ins
                      className="adsbygoogle block w-full h-[100px]"
                      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                      data-ad-slot="INLINE_CONTENT_AD"
                      data-ad-format="horizontal"
                      data-full-width-responsive="true"
                      suppressHydrationWarning
                    />
                    {/* Placeholder when ad doesn't load */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 pointer-events-none">
                      <span className="text-[10px] uppercase tracking-wider">Advertisement</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Search & Filter Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl shadow-black/20"
              >
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Enhanced Search Input */}
                  <div className="relative flex-1 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center">
                      <Search className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search fresh products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
                      />
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                        >
                          <X className="w-4 h-4 text-slate-400" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Category Filters */}
                  <div className="flex gap-2">
                    {(['all', 'fish', 'meat'] as const).map((cat, idx) => (
                      <motion.button
                        key={cat}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative px-5 py-3.5 rounded-2xl font-semibold capitalize transition-all overflow-hidden ${
                          selectedCategory === cat
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {cat === 'all' ? (
                            <><Filter className="w-4 h-4" /> All</>
                          ) : cat === 'fish' ? (
                            <><Fish className="w-4 h-4" /> Fish</>
                          ) : (
                            <><Beef className="w-4 h-4" /> Meat</>
                          )}
                        </span>
                        {selectedCategory === cat && (
                          <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Results count & Sort */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{filteredProducts.length} products available</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">Sort by:</span>
                    <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer">
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Best Rated</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Category Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { name: 'Fresh Fish', icon: Fish, count: store.products.filter(p => p.category === 'fish').length, color: 'from-cyan-500/20 to-blue-500/20' },
                  { name: 'Premium Meat', icon: Beef, count: store.products.filter(p => p.category === 'meat').length, color: 'from-orange-500/20 to-red-500/20' },
                  { name: 'Best Sellers', icon: TrendingUp, count: store.products.filter(p => p.rating >= 4.5).length, color: 'from-amber-500/20 to-yellow-500/20' },
                  { name: 'Organic', icon: Leaf, count: store.products.filter(p => p.isOrganic).length, color: 'from-green-500/20 to-emerald-500/20' },
                ].map((cat, i) => (
                  <motion.button
                    key={cat.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${cat.color} backdrop-blur-xl border border-white/20 rounded-2xl text-white text-sm font-semibold hover:border-white/40 transition-all`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                    <span className="px-2 py-0.5 bg-white/20 rounded-lg text-xs">{cat.count}</span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 via-white/20 to-transparent" />
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-semibold">All Products</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/50 via-white/20 to-transparent" />
              </motion.div>

              {/* Enhanced Products Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => {
                    const currentPrice = getCurrentPrice(product);
                    const selectedVariant = selectedVariants[product.id];
                    const hasVariants = product.variants && product.variants.length > 0;
                    const hasPricingOptions = product.pricingOptions && product.pricingOptions.length > 0;
                    
                    return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all flex flex-col"
                    >
                      {/* Gradient glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-cyan-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-cyan-500/5 group-hover:to-emerald-500/5 transition-all duration-500" />
                      
                      {/* Product Image */}
                      <div className="relative h-52 overflow-hidden">
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                        
                        {/* Stock Status Overlay */}
                        <AnimatePresence>
                          {!product.inStock && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-slate-900/80 flex items-center justify-center backdrop-blur-md"
                            >
                              <div className="text-center">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                                <span className="px-5 py-2.5 bg-red-500/20 border border-red-500/40 text-red-300 font-bold rounded-2xl backdrop-blur-sm">
                                  Out of Stock
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Enhanced Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.isFresh && (
                            <motion.span 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/30"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Fresh Catch
                            </motion.span>
                          )}
                          {product.isOrganic && (
                            <motion.span 
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-white text-xs font-bold rounded-xl shadow-lg"
                            >
                              <Leaf className="w-3.5 h-3.5" />
                              Organic
                            </motion.span>
                          )}
                          {product.discount && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-500/90 to-rose-500/90 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1"
                            >
                              <BadgePercent className="w-3.5 h-3.5" />
                              {product.discount}% OFF
                            </motion.span>
                          )}
                        </div>

                        {/* Category & Origin */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10"
                          >
                            {product.category === 'fish' ? <Fish className="w-5 h-5 text-cyan-400" /> : <Beef className="w-5 h-5 text-orange-400" />}
                          </motion.div>
                          {product.origin && (
                            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-xl text-white/90 text-xs font-medium rounded-xl border border-white/10 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {product.origin}
                            </span>
                          )}
                        </div>

                        {/* Enhanced Rating & Tags */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="text-white font-bold text-sm">{product.rating}</span>
                              <span className="text-white/50 text-xs">({product.reviews})</span>
                            </div>
                            <div className="flex gap-1">
                              {product.tags && product.tags.slice(0, 2).map((tag, i) => (
                                <span key={tag} className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/80 text-[10px] font-medium rounded-full capitalize border border-white/10">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Product Info */}
                      <div className="relative p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-white text-xl mb-2 group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                        
                        {/* Enhanced Variant Selector */}
                        {hasVariants && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <UtensilsCrossed className="w-3 h-3" />
                              Select Cut
                            </p>
                            <div className="flex gap-2">
                              {product.variants!.map(variant => (
                                <motion.button
                                  key={variant.id}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleVariantSelect(product.id, variant)}
                                  disabled={!variant.isAvailable}
                                  className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    selectedVariant?.id === variant.id
                                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/50'
                                      : variant.isAvailable
                                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                        : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                                  }`}
                                >
                                  <span className="block">{variant.name}</span>
                                  <span className="block text-xs opacity-70 mt-0.5">₹{variant.pricePerKg}/kg</span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Pricing Options */}
                        {hasPricingOptions && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                              <Scale className="w-3 h-3" />
                              Choose Quantity
                            </p>
                            <div className="grid grid-cols-5 gap-1.5">
                              {product.pricingOptions!.map(option => (
                                <motion.button
                                  key={option.id}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handlePricingOptionSelect(product.id, option)}
                                  className={`px-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    selectedPricingOptions[product.id]?.id === option.id
                                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                                      : 'bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  {option.type === 'calculated' ? (
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-0.5">
                                        <IndianRupee className="w-2.5 h-2.5" />
                                        {option.value}
                                      </div>
                                      <span className="block text-[8px] opacity-70 mt-0.5">
                                        ~{Math.round((option.value / currentPrice) * 1000)}g
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <span>{option.value >= 1000 ? `${option.value/1000}kg` : `${option.value}g`}</span>
                                      <span className="block text-[8px] opacity-70 mt-0.5">
                                        ₹{Math.round((option.value / 1000) * currentPrice)}
                                      </span>
                                    </div>
                                  )}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Weight Info */}
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                            <Scale className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{product.weight}</span>
                          </div>
                          {selectedPricingOptions[product.id]?.type === 'calculated' && (
                            <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 font-medium">
                              Est. {Math.round((selectedPricingOptions[product.id]!.value / currentPrice) * 1000)}g
                            </span>
                          )}
                        </div>

                        {/* Enhanced Price & Add to Cart */}
                        <div className="mt-auto flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black text-white bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                ₹{currentPrice}
                              </span>
                              <span className="text-sm text-slate-400 font-medium">/kg</span>
                            </div>
                            {product.discount && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-slate-500 line-through">
                                  ₹{Math.round(currentPrice / (1 - product.discount / 100))}
                                </span>
                                <span className="text-xs text-emerald-400 font-medium">
                                  Save ₹{Math.round((currentPrice / (1 - product.discount / 100)) - currentPrice)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced Add to Cart Button */}
                          <motion.button
                            whileHover={{ scale: product.inStock ? 1.05 : 1, y: product.inStock ? -2 : 0 }}
                            whileTap={{ scale: product.inStock ? 0.95 : 1 }}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock || addedProduct === product.id}
                            className={`relative overflow-hidden px-5 py-3 rounded-2xl font-bold transition-all shadow-lg ${
                              !product.inStock
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed shadow-none'
                                : addedProduct === product.id
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/40'
                                  : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:shadow-emerald-500/40 hover:shadow-xl'
                            }`}
                          >
                            {/* Button shine effect */}
                            {!product.inStock && (
                              <span className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">Out</span>
                              </span>
                            )}
                            {addedProduct === product.id && (
                              <motion.span 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                Added
                              </motion.span>
                            )}
                            {product.inStock && addedProduct !== product.id && (
                              <span className="flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                <span className="text-sm">Add</span>
                              </span>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Enhanced Empty State */}
              <AnimatePresence>
                {filteredProducts.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                        <Search className="w-20 h-20 text-emerald-400/50 mx-auto mb-6 relative z-10" />
                      </div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">No products found</h3>
                    <p className="text-slate-400 mb-6 max-w-md mx-auto">Try adjusting your search terms or category filter to find what you're looking for</p>
                    {searchQuery && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSearchQuery('')}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all border border-white/20"
                      >
                        Clear Search
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - Enhanced Store Details */}
            <div className="lg:sticky lg:top-28 space-y-6 h-fit">
              {/* Enhanced About Store Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative bg-gradient-to-br from-white/15 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 overflow-hidden group"
              >
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <h3 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Store className="w-5 h-5 text-emerald-400" />
                    </div>
                    About Store
                  </h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">{store.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Established</span>
                        <span className="text-white font-medium">{store.established}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Business Hours</span>
                        <span className="text-white font-medium">{store.hours}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm p-3 bg-white/5 rounded-xl border border-white/10">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Phone className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs block">Contact</span>
                        <a href={`tel:${store.phone}`} className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">{store.phone}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Certifications */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  Certifications
                </h3>
                <div className="space-y-2">
                  {store.certifications.map((cert, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 font-medium">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Features */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  Store Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {store.features.map((feature, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-300 text-sm font-medium rounded-xl border border-emerald-500/30 hover:border-emerald-500/50 transition-colors cursor-default"
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Delivery Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative bg-gradient-to-br from-emerald-600/30 via-teal-600/20 to-cyan-600/30 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl"
                />
                
                <div className="relative">
                  <h3 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    Delivery Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300 text-sm">Delivery Time</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{store.deliveryTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300 text-sm">Minimum Order</span>
                      </div>
                      <span className="text-white font-semibold text-sm">₹{store.minOrder}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-emerald-400" />
                        <span className="text-slate-300 text-sm">Delivery Fee</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm">₹{store.deliveryFee}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Why Choose Us */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6"
              >
                <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                  <div className="p-2 bg-amber-500/20 rounded-xl">
                    <ThumbsUp className="w-5 h-5 text-amber-400" />
                  </div>
                  Why Choose Us
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Award, text: 'Premium Quality Assurance', color: 'text-amber-400' },
                    { icon: Clock, text: 'Same Day Delivery', color: 'text-emerald-400' },
                    { icon: BadgeCheck, text: '100% Fresh Guarantee', color: 'text-cyan-400' },
                    { icon: ShieldCheck, text: 'Secure Payment', color: 'text-purple-400' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className={`p-1.5 bg-white/10 rounded-lg ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-slate-300 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Customer Reviews Preview */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <div className="p-2 bg-pink-500/20 rounded-xl">
                      <Star className="w-5 h-5 text-pink-400" />
                    </div>
                    Recent Reviews
                  </h3>
                  <span className="text-xs text-slate-400">{store.reviews} reviews</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Rahul M.', rating: 5, text: 'Amazing quality! The fish was super fresh and delivery was quick.', avatar: 'RM' },
                    { name: 'Priya K.', rating: 5, text: 'Best meat shop in Bangalore. Always fresh and clean cuts.', avatar: 'PK' },
                    { name: 'Arun S.', rating: 4, text: 'Great service and quality. Will definitely order again!', avatar: 'AS' },
                  ].map((review, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="p-3 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{review.name}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{review.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar - FIXED WITH HIGHEST Z-INDEX */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[10001]"
              onClick={() => setIsCartOpen(false)}
            />
            
            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 shadow-2xl shadow-black/50 z-[10002] flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">Your Cart</h2>
                    <p className="text-sm text-slate-400">{cartCount} items from {store.name}</p>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    // Calculate item price considering variant and pricing option
                    let itemPrice = item.product.price;
                    let itemTotal = 0;
                    let displayWeight = '';
                    
                    if (item.selectedVariant) {
                      itemPrice = item.selectedVariant.pricePerKg;
                    }
                    
                    if (item.selectedPricingOption?.type === 'calculated') {
                      // Amount-based pricing (₹100, ₹200)
                      itemTotal = item.selectedPricingOption.value * item.quantity;
                      const grams = item.calculatedWeight || Math.round((item.selectedPricingOption.value / itemPrice) * 1000);
                      displayWeight = `~${grams}g`;
                    } else if (item.selectedPricingOption?.type === 'fixed') {
                      // Fixed weight pricing (500g, 1kg)
                      const weightInKg = item.selectedPricingOption.value / 1000;
                      itemTotal = itemPrice * weightInKg * item.quantity;
                      displayWeight = item.selectedPricingOption.value >= 1000 
                        ? `${item.selectedPricingOption.value/1000}kg` 
                        : `${item.selectedPricingOption.value}g`;
                    } else {
                      // Default per kg pricing
                      itemTotal = itemPrice * item.quantity;
                      displayWeight = '1kg';
                    }
                    
                    return (
                    <motion.div
                      key={`${item.storeId}-${item.product.id}-${item.selectedVariant?.id || 'default'}-${item.selectedPricingOption?.id || 'default'}-${item.cutType || 'default'}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{item.product.name}</h4>
                        
                        {/* Variant Badge */}
                        {item.selectedVariant && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                            {item.selectedVariant.name} @ ₹{item.selectedVariant.pricePerKg}/kg
                          </span>
                        )}
                        
                        {item.cutType && (
                          <span className="inline-block mt-1 ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full capitalize">
                            {item.cutType} cut
                          </span>
                        )}

                        {/* Weight/Pricing Info */}
                        <p className="text-xs text-slate-400 mt-1">
                          {item.selectedPricingOption?.type === 'calculated' ? (
                            <span className="text-amber-400">₹{item.selectedPricingOption.value} worth</span>
                          ) : item.selectedPricingOption?.type === 'fixed' ? (
                            <span>{displayWeight}</span>
                          ) : (
                            <span>1kg per unit</span>
                          )}
                          {displayWeight && item.selectedPricingOption?.type === 'calculated' && (
                            <span className="text-slate-500"> ({displayWeight})</span>
                          )}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-emerald-400 font-bold">₹{Math.round(itemTotal)}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(
                                item.product.id, 
                                item.storeId, 
                                -1, 
                                item.selectedVariant?.id, 
                                item.selectedPricingOption?.id,
                                item.cutType
                              )}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(
                                item.product.id, 
                                item.storeId, 
                                1, 
                                item.selectedVariant?.id, 
                                item.selectedPricingOption?.id,
                                item.cutType
                              )}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(
                          item.product.id, 
                          item.storeId, 
                          item.selectedVariant?.id, 
                          item.selectedPricingOption?.id,
                          item.cutType
                        )}
                        className="text-slate-500 hover:text-red-400 transition-all self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                    );
                  })
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-slate-900 border-t border-white/10 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Delivery Fee</span>
                      <span className="text-emerald-400">₹{store.deliveryFee}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-white/10">
                      <span className="text-white">Total</span>
                      <span className="text-emerald-400">₹{(cartTotal + store.deliveryFee).toLocaleString()}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Checkout
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-8"
            >
              {!orderPlaced ? (
                <>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">Order Summary</h2>
                  <p className="text-slate-400 text-center mb-6">
                    Complete your purchase from {store.name}
                  </p>
                  
                  <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Items ({cartCount})</span>
                      <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Delivery</span>
                      <span className="text-white">₹{store.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                      <span className="text-white">Total</span>
                      <span className="text-emerald-400">₹{(cartTotal + store.deliveryFee).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={placeOrder}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold transition-all"
                    >
                      Place Order
                    </motion.button>
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-medium transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
                  <p className="text-slate-400">
                    Thank you for shopping with {store.name}. Your order will be delivered soon!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Command Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVoiceCommandOpen(true)}
        className="fixed bottom-24 right-6 z-[9997] w-14 h-14 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 border border-white/20"
      >
        <Mic className="w-6 h-6 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-violet-400"
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.button>

      {/* Store Voice Command UI */}
      <StoreVoiceCommandUI
        store={store}
        products={store.products}
        onAddToCart={handleVoiceAddToCart}
        isOpen={isVoiceCommandOpen}
        onClose={() => setIsVoiceCommandOpen(false)}
      />
    </main>
  );
}

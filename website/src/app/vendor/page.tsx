"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Store, MapPin, Phone, Tag, CheckCircle2, ArrowLeft, IndianRupee, TrendingUp, Users, Zap, Shield, Star, BarChart3, Truck, Upload, ChevronRight, Sparkles, Award, Clock, HeartHandshake, BadgeCheck, Target, Rocket, Crown, Gem, Flame, Fish, Beef, Leaf, Smile, ThumbsUp, MessageCircle, Play, Pause, Gift, Percent, ArrowUpRight, Quote, PhoneCall, Mail, Building2, ScrollText, FileCheck } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorEffect from '@/components/CursorEffect';
import VendorHeroScene from '@/components/VendorHeroScene';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } })
};

const VENDOR_BENEFITS = [
  { icon: Gift, title: "Zero Commission", desc: "First 3 months with 0% commission. Keep 100% of your earnings while you grow.", color: "from-emerald-500 to-emerald-600", bgGlow: "emerald-500/20" },
  { icon: TrendingUp, title: "Revenue Growth", desc: "Vendors see an average 40% increase in monthly revenue within 6 months.", color: "from-orange-500 to-orange-600", bgGlow: "orange-500/20" },
  { icon: Users, title: "25K+ Customers", desc: "Instant access to our growing customer base actively looking for quality meat.", color: "from-cyan-500 to-cyan-600", bgGlow: "cyan-500/20" },
  { icon: Zap, title: "Daily Payouts", desc: "No waiting for weeks. Get your earnings deposited to your bank account daily.", color: "from-yellow-500 to-yellow-600", bgGlow: "yellow-500/20" },
  { icon: Shield, title: "FSSAI Support", desc: "Free guidance on obtaining and maintaining your FSSAI license and compliance.", color: "from-purple-500 to-purple-600", bgGlow: "purple-500/20" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Powerful insights into sales trends, customer preferences, and inventory.", color: "from-pink-500 to-pink-600", bgGlow: "pink-500/20" },
  { icon: Truck, title: "Delivery Network", desc: "We handle logistics with our trained delivery partners and insulated boxes.", color: "from-blue-500 to-blue-600", bgGlow: "blue-500/20" },
  { icon: HeartHandshake, title: "Dedicated Support", desc: "24/7 dedicated vendor support team to help you succeed on our platform.", color: "from-rose-500 to-rose-600", bgGlow: "rose-500/20" },
];

const SUCCESS_STORIES = [
  { name: "Meat King", location: "Hyderabad", growth: "+150%", months: "6 months", quote: "Fleish helped us reach customers we never knew existed. Our revenue doubled in 4 months!", rating: 4.9, orders: "2,400+" },
  { name: "Fresh Cuts", location: "Bangalore", growth: "+85%", months: "8 months", quote: "The delivery infrastructure is world-class. We focus on quality, they handle logistics.", rating: 4.8, orders: "1,800+" },
  { name: "Premium Meats", location: "Mumbai", growth: "+200%", months: "12 months", quote: "Best business decision ever. Zero commission period was a game changer for us.", rating: 5.0, orders: "3,100+" },
];

const ONBOARDING_STEPS = [
  { icon: FileCheck, title: "Apply Online", desc: "Fill the form with your shop details and FSSAI license", step: 1, color: "blue" },
  { icon: BadgeCheck, title: "Verification", desc: "We verify your documents within 24-48 hours", step: 2, color: "purple" },
  { icon: Store, title: "Go Live", desc: "Start receiving orders and growing your business", step: 3, color: "emerald" },
];

const COMMISSION_RATES = {
  months0_3: 0,
  months4_6: 8,
  months7_12: 12,
  after12: 15,
};

function RevenueCalculator() {
  const [dailyOrders, setDailyOrders] = useState(20);
  const [avgOrderValue, setAvgOrderValue] = useState(400);
  const [month, setMonth] = useState(2);

  const monthlyRevenue = dailyOrders * avgOrderValue * 30;
  
  const getCommissionRate = (m: number) => {
    if (m < 3) return COMMISSION_RATES.months0_3;
    if (m < 6) return COMMISSION_RATES.months4_6;
    if (m < 12) return COMMISSION_RATES.months7_12;
    return COMMISSION_RATES.after12;
  };

  const commissionRate = getCommissionRate(month);
  const commissionAmount = monthlyRevenue * (commissionRate / 100);
  const yourEarnings = monthlyRevenue - commissionAmount;
  const savings = commissionRate > 0 ? monthlyRevenue * (15 - commissionRate) / 100 : monthlyRevenue * 0.15;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-3xl blur-xl" />
      
      <div className="relative glass-card rounded-3xl p-6 md:p-8 border border-orange-500/20">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> Live Calculator
          </div>
        </div>
        
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-white" />
          </div>
          Revenue Calculator
        </h3>
        
        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Daily Orders</span>
              <span className="text-orange-400">{dailyOrders} orders</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="100" 
              value={dailyOrders} 
              onChange={(e) => setDailyOrders(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Average Order Value</span>
              <span className="text-orange-400">₹{avgOrderValue}</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="1000" 
              step="50"
              value={avgOrderValue} 
              onChange={(e) => setAvgOrderValue(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
              <span>Business Duration</span>
              <span className={month < 3 ? "text-emerald-400" : "text-orange-400"}>Month {month + 1}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="18" 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all"
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-500">
                Commission Rate: <span className={commissionRate === 0 ? "text-emerald-400 font-bold" : "text-orange-400 font-bold"}>
                  {commissionRate === 0 ? '0% (FREE)' : `${commissionRate}%`}
                </span>
              </p>
              {month < 3 && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Gift className="w-3 h-3" /> Zero Commission!
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Monthly Revenue</span>
            <span className="text-white font-semibold">₹{monthlyRevenue.toLocaleString()}</span>
          </div>
          {commissionRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Platform Fee ({commissionRate}%)</span>
              <span className="text-orange-400 font-semibold">-₹{commissionAmount.toLocaleString()}</span>
            </div>
          )}
          <motion.div 
            key={yourEarnings}
            initial={{ scale: 1.02 }}
            animate={{ scale: 1 }}
            className="flex justify-between text-xl pt-3 border-t border-white/10"
          >
            <span className="text-white font-bold">Your Earnings</span>
            <span className="text-emerald-400 font-black text-2xl">₹{yourEarnings.toLocaleString()}</span>
          </motion.div>
          {month < 12 && commissionRate < 15 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mt-3">
              <p className="text-xs text-emerald-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                You save ₹{savings.toLocaleString()}/mo vs standard 15% commission platforms!
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function VendorOnboarding() {
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ shopName: '', ownerName: '', location: '', phone: '', email: '', category: 'chicken', fssai: '' });
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`, {
        method: 'POST',
        body: JSON.stringify({ type: 'VENDOR', ...form, appliedAt: new Date().toISOString() }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {}
    setUploading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-950 relative overflow-hidden">
        <CursorEffect />
        <Navbar />
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[150px]" />
        </div>
        <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-lg"
          >
            {/* Success animation */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-14 h-14 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Welcome Aboard!</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-4">Application Submitted!</h2>
              <p className="text-slate-400 text-lg mb-6">You're now part of the Fleish Vendor Network</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-2xl p-6 mb-8 border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <PhoneCall className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-2">We'll contact you at</p>
              <p className="text-xl font-bold text-white mb-1">{form.phone}</p>
              <p className="text-xs text-emerald-400">within 24 hours</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <Link href="/store" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                <Store className="w-4 h-4" /> Explore Stores
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      <CursorEffect />
      <Navbar />
      
      {/* Hero with Bangalore Vendor Market Scene */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden min-h-[600px] flex items-center">
        <VendorHeroScene />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-4">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeUp} custom={1}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Vendor Registration Open</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                  Grow Your <span className="text-gradient-warm">Meat Business</span>
                </h1>
                <p className="text-lg text-slate-400 mb-6">
                  Join 200+ successful vendors. Get access to 25,000+ customers with zero commission for 3 months.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-orange-400">200+</p>
                    <p className="text-xs text-slate-500">Vendors</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-emerald-400">40%</p>
                    <p className="text-xs text-slate-500">Avg Growth</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-cyan-400">25K+</p>
                    <p className="text-xs text-slate-500">Customers</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} custom={2}>
                <RevenueCalculator />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[150px]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-black uppercase tracking-wider text-orange-400">Why Partner With Us</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="text-gradient-warm">Succeed</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Join hundreds of successful vendors growing their meat business with Fleish
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VENDOR_BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${benefit.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500`} />
                <div className="relative glass-card rounded-2xl p-6 h-full border border-white/10 group-hover:border-white/20 transition-all">
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{benefit.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full mb-6"
            >
              <ThumbsUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Verified Reviews</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Vendors Who <span className="text-gradient-warm">Grew With Us</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Real success stories from vendors who transformed their business with Fleish
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30, rotateY: -5 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/30 to-amber-500/30 rounded-3xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                <div className="relative glass-card rounded-3xl p-8 border border-white/10 group-hover:border-orange-500/30 transition-all h-full">
                  {/* Quote icon */}
                  <div className="absolute top-4 right-4 text-orange-500/20">
                    <Quote className="w-12 h-12" />
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(story.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    ))}
                    <span className="ml-2 text-sm font-bold text-white">{story.rating}</span>
                  </div>
                  
                  {/* Quote */}
                  <p className="text-slate-300 mb-6 italic leading-relaxed">&ldquo;{story.quote}&rdquo;</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                      <p className="text-xl font-black text-emerald-400">{story.growth}</p>
                      <p className="text-xs text-slate-500">Revenue Growth</p>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center">
                      <p className="text-lg font-black text-orange-400">{story.orders}</p>
                      <p className="text-xs text-slate-500">Orders Completed</p>
                    </div>
                  </div>
                  
                  {/* Author */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{story.name}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {story.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-emerald-400 font-medium">{story.months}</p>
                      <p className="text-[10px] text-slate-500">on platform</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Onboarding Steps */}
      <section className="py-24 px-6 relative overflow-hidden bg-white/[0.01]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full mb-6"
            >
              <Rocket className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">Get Started in 3 Steps</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              How to <span className="text-gradient-warm">Become a Vendor</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Simple onboarding process to get your shop online and start receiving orders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ONBOARDING_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="relative"
              >
                {/* Connection line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent z-0" />
                )}
                
                <div className="relative z-10">
                  <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-br ${step.color === 'blue' ? 'from-blue-500 to-cyan-500' : step.color === 'purple' ? 'from-purple-500 to-pink-500' : 'from-emerald-500 to-green-500'} rounded-3xl flex items-center justify-center shadow-2xl`}>
                    <step.icon className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-black text-slate-900">{step.step}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[150px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full mb-6"
            >
              <Percent className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Transparent Pricing</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Commission <span className="text-gradient-warm">Structure</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              We grow when you grow. Start with zero commission and scale gradually.
            </p>
          </motion.div>

          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-orange-500/20 rounded-3xl blur-xl" />
            
            <div className="relative glass-card rounded-3xl p-8 md:p-12 border border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-4xl font-black text-emerald-400 mb-1">0%</p>
                  <p className="text-sm text-white font-medium">Months 1-3</p>
                  <p className="text-xs text-emerald-400 mt-2">Zero Commission!</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all"
                >
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">8%</p>
                  <p className="text-sm text-white font-medium">Months 4-6</p>
                  <p className="text-xs text-amber-400 mt-2">Early Growth</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Rocket className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">12%</p>
                  <p className="text-sm text-white font-medium">Months 7-12</p>
                  <p className="text-xs text-orange-400 mt-2">Scale Up</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                >
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">15%</p>
                  <p className="text-sm text-white font-medium">After 12mo</p>
                  <p className="text-xs text-purple-400 mt-2">Partner Rate</p>
                </motion.div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  No hidden fees • No setup charges • Daily payouts guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-6 relative">
        {/* Human Vendor Illustrations */}
        <div className="absolute left-4 lg:left-12 bottom-20 hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {/* Vendor cutting meat */}
            <svg width="180" height="200" viewBox="0 0 180 200" className="drop-shadow-2xl">
              {/* Shadow */}
              <ellipse cx="90" cy="190" rx="60" ry="8" fill="rgba(0,0,0,0.3)" />
              
              {/* Cutting board */}
              <rect x="40" y="140" width="100" height="12" rx="2" fill="#92400e" />
              
              {/* Meat on board */}
              <ellipse cx="70" cy="135" rx="15" ry="8" fill="#dc2626" />
              <ellipse cx="95" cy="138" rx="18" ry="9" fill="#b91c1c" />
              
              {/* Vendor body */}
              <rect x="70" y="70" width="40" height="55" rx="5" fill="#f97316" />
              {/* White apron */}
              <rect x="75" y="75" width="30" height="50" rx="3" fill="#f8fafc" />
              <rect x="78" y="85" width="24" height="3" fill="#e2e8f0" />
              <rect x="78" y="95" width="24" height="3" fill="#e2e8f0" />
              <rect x="78" y="105" width="24" height="3" fill="#e2e8f0" />
              
              {/* Neck */}
              <rect x="82" y="60" width="16" height="12" fill="#fdba74" />
              
              {/* Head */}
              <circle cx="90" cy="45" r="20" fill="#fdba74" />
              
              {/* Head covering/turban style */}
              <path d="M70 45 Q90 15 110 45 L110 50 L70 50 Z" fill="#f97316" />
              
              {/* Face */}
              <circle cx="83" cy="45" r="2" fill="#1e293b" />
              <circle cx="97" cy="45" r="2" fill="#1e293b" />
              <path d="M86 52 Q90 55 94 52" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              
              {/* Arms - cutting pose */}
              <path d="M70 80 L50 110" stroke="#fdba74" strokeWidth="9" strokeLinecap="round" />
              <path d="M110 80 L130 100" stroke="#fdba74" strokeWidth="9" strokeLinecap="round" />
              
              {/* Hands */}
              <circle cx="48" cy="112" r="6" fill="#fdba74" />
              <circle cx="132" cy="102" r="6" fill="#fdba74" />
              
              {/* Cleaver/knife */}
              <rect x="35" y="100" width="12" height="30" rx="1" fill="#64748b" transform="rotate(-20 41 115)" />
              <rect x="30" y="125" width="25" height="10" rx="2" fill="#94a3b8" transform="rotate(-20 42 130)" />
              
              {/* Legs */}
              <path d="M78 125 L75 160" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
              <path d="M102 125 L105 160" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
              
              {/* Shoes */}
              <ellipse cx="73" cy="165" rx="10" ry="4" fill="#1e293b" />
              <ellipse cx="107" cy="165" rx="10" ry="4" fill="#1e293b" />
            </svg>
          </motion.div>
        </div>

        <div className="absolute right-4 lg:right-12 bottom-40 hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {/* Fish vendor - showing fish */}
            <svg width="150" height="180" viewBox="0 0 150 180" className="drop-shadow-2xl">
              {/* Shadow */}
              <ellipse cx="75" cy="170" rx="50" ry="6" fill="rgba(0,0,0,0.3)" />
              
              {/* Vendor body */}
              <rect x="50" y="70" width="50" height="60" rx="8" fill="#06b6d4" />
              
              {/* Apron */}
              <rect x="55" y="75" width="40" height="55" rx="3" fill="#f0f9ff" />
              {/* Fish scale pattern on apron */}
              <circle cx="65" cy="90" r="2" fill="#0ea5e9" opacity="0.5" />
              <circle cx="75" cy="95" r="2" fill="#0ea5e9" opacity="0.5" />
              <circle cx="85" cy="90" r="2" fill="#0ea5e9" opacity="0.5" />
              
              {/* Neck */}
              <rect x="65" y="60" width="20" height="12" fill="#8b5a2b" />
              
              {/* Head */}
              <circle cx="75" cy="40" r="22" fill="#8b5a2b" />
              
              {/* Hair */}
              <path d="M53 38 Q75 15 97 38" fill="#1e293b" />
              
              {/* Face - happy */}
              <circle cx="68" cy="40" r="2.5" fill="#1e293b" />
              <circle cx="82" cy="40" r="2.5" fill="#1e293b" />
              <path d="M65 48 Q75 58 85 48" stroke="#1e293b" strokeWidth="2" fill="none" />
              
              {/* Arms showing fish */}
              <path d="M50 85 L30 75" stroke="#8b5a2b" strokeWidth="10" strokeLinecap="round" />
              <circle cx="27" cy="72" r="6" fill="#8b5a2b" />
              
              {/* Fish in hand */}
              <ellipse cx="25" cy="65" rx="15" ry="6" fill="#0ea5e9" />
              <ellipse cx="20" cy="62" rx="3" ry="2" fill="white" opacity="0.6" />
              <circle cx="18" cy="63" r="1.5" fill="#1e293b" />
              <path d="M8 65 L2 60 M8 65 L2 70" stroke="#0ea5e9" strokeWidth="2" />
              
              {/* Other arm gesturing */}
              <path d="M100 85 L115 70" stroke="#8b5a2b" strokeWidth="10" strokeLinecap="round" />
              <circle cx="118" cy="67" r="6" fill="#8b5a2b" />
              
              {/* Legs */}
              <path d="M62 130 L58 160" stroke="#1e3a5f" strokeWidth="12" strokeLinecap="round" />
              <path d="M88 130 L92 160" stroke="#1e3a5f" strokeWidth="12" strokeLinecap="round" />
              
              {/* Shoes */}
              <ellipse cx="56" cy="165" rx="10" ry="5" fill="#1e293b" />
              <ellipse cx="94" cy="165" rx="10" ry="5" fill="#1e293b" />
            </svg>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-full mb-6"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-black uppercase tracking-wider text-orange-400">Join 200+ Vendors</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to <span className="text-gradient-warm">Grow Your Business?</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Fill out the form below and our team will get in touch within 24 hours
            </p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-xl" />
            <div className="relative glass-card rounded-3xl p-8 md:p-10 space-y-6 border border-orange-500/10">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Shop Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input required value={form.shopName} onChange={e => setForm({...form, shopName: e.target.value})} type="text"
                      placeholder="Your shop name" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Owner Name</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                    <input required value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} type="text"
                      placeholder="Your full name" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel"
                    placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-orange-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email"
                    placeholder="shop@email.com" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Shop Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input required value={form.location} onChange={e => setForm({...form, location: e.target.value})} type="text"
                  placeholder="Complete shop address with landmark" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Meat Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                    <option value="chicken" className="bg-slate-900">Chicken</option>
                    <option value="mutton" className="bg-slate-900">Mutton / Goat</option>
                    <option value="fish" className="bg-slate-900">Fish & Seafood</option>
                    <option value="multi" className="bg-slate-900">Multi-Category</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">FSSAI License No.</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required value={form.fssai} onChange={e => setForm({...form, fssai: e.target.value})} type="text"
                    placeholder="XXXXXXXXXXXXX" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all" />
                </div>
              </div>
            </div>

              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setForm((prev: any) => ({ ...prev, fssaiLicense: file }));
                      alert(`FSSAI License selected: ${file.name}`);
                    }
                  }}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group bg-white/5 border border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all"
                >
                  <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500/20 transition-all">
                    <Upload className="w-7 h-7 text-orange-400" />
                  </div>
                  <p className="text-sm text-white font-medium mb-1">Upload FSSAI License</p>
                  <p className="text-xs text-slate-500">JPG or PDF, max 5MB</p>
                </div>
              </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="vendor-terms" 
                required
                className="mt-1 w-5 h-5 rounded-lg border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="vendor-terms" className="text-sm text-slate-300 cursor-pointer select-none">
                I agree to the <a href="#" className="text-orange-400 hover:text-orange-300 hover:underline transition-colors">Vendor Terms</a> and confirm I have a valid FSSAI license for selling meat products.
              </label>
            </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={uploading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 text-base"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Submitting...
                  </span>
                ) : (
                  <><Rocket className="w-5 h-5" /> Apply as Vendor <ChevronRight className="w-5 h-5" /></>
                )}
              </motion.button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 bg-white/5 rounded-xl py-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Our team will verify your FSSAI license before onboarding</span>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

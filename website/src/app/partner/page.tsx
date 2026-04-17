"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, User, Phone, FileText, CheckCircle2, ArrowLeft, Wallet, TrendingUp, Clock, Shield, Star, Upload, ChevronRight, MapPin, IndianRupee, Zap, Award, Headphones } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorEffect from '@/components/CursorEffect';
import PartnerHeroScene from '@/components/PartnerHeroScene';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } })
};

const STEPS = [
  { step: 1, title: "Apply Online", desc: "Fill out the form in 2 minutes", icon: FileText },
  { step: 2, title: "Document Verification", desc: "We'll verify your DL & vehicle docs", icon: Shield },
  { step: 3, title: "Training", desc: "2-hour online training session", icon: Award },
  { step: 4, title: "Start Earning", desc: "Get orders & start delivering", icon: Wallet },
];

const BENEFITS = [
  { icon: Wallet, title: "Weekly Payouts", desc: "Get paid every Wednesday directly to your bank" },
  { icon: Clock, title: "Flexible Hours", desc: "Work when you want - full-time or part-time" },
  { icon: TrendingUp, title: "Incentives", desc: "Earn extra with peak hour bonuses & referrals" },
  { icon: Shield, title: "Insurance", desc: "Accident insurance coverage up to ₹5 lakhs" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated partner helpline anytime" },
  { icon: Zap, title: "Instant Onboarding", desc: "Start earning within 48 hours of signup" },
];

const TESTIMONIALS = [
  { name: "Ramesh K.", location: "Hyderabad", earnings: "₹45,000/month", quote: "Best decision ever! I earn more than my previous office job with complete flexibility." },
  { name: "Suresh P.", location: "Bangalore", earnings: "₹52,000/month", quote: "The weekly payouts are reliable and the incentive structure is transparent. Love it!" },
  { name: "Amit S.", location: "Mumbai", earnings: "₹38,000/month", quote: "Part-time evenings only and still make great money. Perfect for college students." },
];

const VEHICLE_RATES: Record<string, { perOrder: number; perKm: number; minGuarantee: number }> = {
  bicycle: { perOrder: 25, perKm: 8, minGuarantee: 150 },
  bike: { perOrder: 35, perKm: 10, minGuarantee: 300 },
  scooter: { perOrder: 35, perKm: 10, minGuarantee: 300 },
};

function EarningsCalculator() {
  const [vehicle, setVehicle] = useState('bike');
  const [orders, setOrders] = useState(10);
  const [days, setDays] = useState(26);

  const rate = VEHICLE_RATES[vehicle];
  const dailyEarnings = (orders * rate.perOrder) + (orders * 3 * rate.perKm); // avg 3km per order
  const monthlyEarnings = dailyEarnings * days;
  const incentives = monthlyEarnings * 0.15; // 15% avg incentives
  const total = monthlyEarnings + incentives;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8">
      <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-cyan-400" /> Earnings Calculator
      </h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">Vehicle Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(VEHICLE_RATES).map(([type, rates]) => (
              <button
                key={type}
                onClick={() => setVehicle(type)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  vehicle === type 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">Daily Orders: {orders}</label>
          <input 
            type="range" 
            min="5" 
            max="30" 
            value={orders} 
            onChange={(e) => setOrders(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 mb-2 block">Working Days/Month: {days}</label>
          <input 
            type="range" 
            min="10" 
            max="30" 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Base Earnings</span>
          <span className="text-white font-semibold">₹{monthlyEarnings.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Incentives (15%)</span>
          <span className="text-emerald-400 font-semibold">+₹{incentives.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg pt-2 border-t border-white/10">
          <span className="text-white font-bold">Estimated Monthly</span>
          <span className="text-cyan-400 font-black">₹{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function PartnerOnboarding() {
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', vehicleType: 'bike', licenseNumber: '', city: '', hasSmartphone: true });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/applications`, {
        method: 'POST',
        body: JSON.stringify({ type: 'DELIVERY_PARTNER', ...form, appliedAt: new Date().toISOString() }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {}
    setUploading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen">
        <CursorEffect />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Application Submitted!</h2>
            <p className="text-slate-400 mb-2">You're on your way to becoming a Fleish Partner!</p>
            <div className="glass-card rounded-2xl p-4 mb-8">
              <p className="text-sm text-slate-300">📱 We'll contact you at <strong>{form.phone}</strong> within 24 hours</p>
            </div>
            <Link href="/" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      <CursorEffect />
      <Navbar />
      
      {/* Hero with Bangalore City Scene */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden min-h-[600px] flex items-center">
        <PartnerHeroScene />
        
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
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Now Hiring</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                  Become a <span className="text-gradient">Fleish Partner</span>
                </h1>
                <p className="text-lg text-slate-400 mb-6">
                  Earn up to ₹50,000/month delivering fresh meat to happy customers. 
                  Join 500+ partners across 15+ cities.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-cyan-400">₹50K+</p>
                    <p className="text-xs text-slate-500">Monthly</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-emerald-400">500+</p>
                    <p className="text-xs text-slate-500">Partners</p>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <p className="text-xl font-black text-orange-400">24h</p>
                    <p className="text-xs text-slate-500">Onboarding</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} custom={2}>
                <EarningsCalculator />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Start Earning in 4 Simple Steps</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-sm font-black text-white">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4">Partner Benefits</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why Partners Love Fleish</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6"
              >
                <benefit.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4">Partner Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">What Our Partners Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">{t.earnings}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-6 relative">
        {/* Human Delivery Boys Illustrations */}
        <div className="absolute left-4 lg:left-12 bottom-20 hidden md:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {/* Delivery Boy 1 - Standing with bike */}
            <svg width="180" height="200" viewBox="0 0 180 200" className="drop-shadow-2xl">
              {/* Shadow */}
              <ellipse cx="90" cy="190" rx="60" ry="8" fill="rgba(0,0,0,0.3)" />
              {/* Bike */}
              <circle cx="50" cy="160" r="18" stroke="#475569" strokeWidth="3" fill="none" />
              <circle cx="130" cy="160" r="18" stroke="#475569" strokeWidth="3" fill="none" />
              <path d="M50 160 L75 140 L90 120 L110 140 L130 160" stroke="#475569" strokeWidth="3" fill="none" />
              <path d="M75 140 L110 140" stroke="#475569" strokeWidth="2" />
              {/* Person body */}
              <rect x="75" y="70" width="35" height="55" rx="5" fill="#10b981" />
              {/* Fleish logo on shirt */}
              <circle cx="92" cy="95" r="8" fill="#059669" />
              <text x="92" y="98" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">F</text>
              {/* Neck */}
              <rect x="85" y="60" width="15" height="12" fill="#fca5a5" />
              {/* Head */}
              <circle cx="92" cy="45" r="20" fill="#fca5a5" />
              {/* Helmet */}
              <path d="M72 45 Q72 20 92 20 Q112 20 112 45" fill="#f97316" />
              <rect x="70" y="42" width="44" height="8" rx="2" fill="#ea580c" />
              {/* Face features */}
              <circle cx="85" cy="45" r="2" fill="#1e293b" />
              <circle cx="99" cy="45" r="2" fill="#1e293b" />
              <path d="M88 52 Q92 55 96 52" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              {/* Arms */}
              <path d="M75 80 L60 110" stroke="#fca5a5" strokeWidth="8" strokeLinecap="round" />
              <path d="M110 80 L125 110" stroke="#fca5a5" strokeWidth="8" strokeLinecap="round" />
              {/* Hands on bike */}
              <circle cx="60" cy="110" r="5" fill="#fca5a5" />
              <circle cx="125" cy="110" r="5" fill="#fca5a5" />
              {/* Legs */}
              <path d="M82 125 L75 155" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
              <path d="M103 125 L110 155" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
              {/* Shoes */}
              <ellipse cx="75" cy="160" rx="8" ry="4" fill="#1e293b" />
              <ellipse cx="115" cy="160" rx="8" ry="4" fill="#1e293b" />
              {/* Delivery Bag on back */}
              <rect x="70" y="65" width="45" height="35" rx="5" fill="#059669" stroke="#047857" strokeWidth="2" />
              <text x="92" y="85" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">FLEISH</text>
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
            {/* Delivery Boy 2 - Happy with thumbs up */}
            <svg width="150" height="180" viewBox="0 0 150 180" className="drop-shadow-2xl">
              {/* Shadow */}
              <ellipse cx="75" cy="170" rx="50" ry="6" fill="rgba(0,0,0,0.3)" />
              {/* Body */}
              <rect x="50" y="70" width="50" height="60" rx="8" fill="#06b6d4" />
              {/* Fleish logo */}
              <circle cx="75" cy="95" r="10" fill="#0891b2" />
              <text x="75" y="99" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">F</text>
              {/* Neck */}
              <rect x="65" y="60" width="20" height="12" fill="#8b5a2b" />
              {/* Head */}
              <circle cx="75" cy="40" r="25" fill="#8b5a2b" />
              {/* Hair */}
              <path d="M50 35 Q75 10 100 35" fill="#1e293b" />
              {/* Face features - happy */}
              <circle cx="68" cy="38" r="2.5" fill="#1e293b" />
              <circle cx="82" cy="38" r="2.5" fill="#1e293b" />
              <path d="M65 48 Q75 58 85 48" stroke="#1e293b" strokeWidth="2" fill="none" />
              {/* Thumbs up arm */}
              <path d="M50 85 L30 70" stroke="#8b5a2b" strokeWidth="10" strokeLinecap="round" />
              <circle cx="30" cy="65" r="8" fill="#8b5a2b" />
              <text x="30" y="69" textAnchor="middle" fontSize="12">👍</text>
              {/* Other arm */}
              <path d="M100 85 L115 100" stroke="#8b5a2b" strokeWidth="10" strokeLinecap="round" />
              <circle cx="115" cy="105" r="6" fill="#8b5a2b" />
              {/* Legs */}
              <path d="M62 130 L58 160" stroke="#1e3a5f" strokeWidth="12" strokeLinecap="round" />
              <path d="M88 130 L92 160" stroke="#1e3a5f" strokeWidth="12" strokeLinecap="round" />
              {/* Shoes */}
              <ellipse cx="60" cy="165" rx="10" ry="5" fill="#1e293b" />
              <ellipse cx="95" cy="165" rx="10" ry="5" fill="#1e293b" />
              {/* Delivery bag beside */}
              <rect x="100" y="110" width="35" height="40" rx="5" fill="#059669" stroke="#047857" strokeWidth="2" />
              <text x="117" y="135" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">FLEISH</text>
              {/* Bag handle */}
              <path d="M110 115 Q117 108 125 115" stroke="#047857" strokeWidth="2" fill="none" />
              <rect x="108" y="122" width="6" height="10" rx="1" fill="white" opacity="0.3" />
            </svg>
          </motion.div>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Ready to Join?</h2>
            <p className="text-slate-400">Fill out the form below and start your journey</p>
          </motion.div>

          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl p-6 md:p-8 space-y-5">
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text"
                    placeholder="Your full name" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel"
                    placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <select required value={form.city} onChange={e => setForm({...form, city: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white outline-none focus:border-cyan-500/50 transition-all appearance-none">
                    <option value="" className="bg-slate-900">Select your city</option>
                    <option value="hyderabad" className="bg-slate-900">Hyderabad</option>
                    <option value="bangalore" className="bg-slate-900">Bangalore</option>
                    <option value="mumbai" className="bg-slate-900">Mumbai</option>
                    <option value="delhi" className="bg-slate-900">Delhi</option>
                    <option value="chennai" className="bg-slate-900">Chennai</option>
                    <option value="pune" className="bg-slate-900">Pune</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Vehicle Type</label>
                <div className="relative">
                  <Bike className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <select required value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white outline-none focus:border-cyan-500/50 transition-all appearance-none">
                    <option value="bike" className="bg-slate-900">Motorcycle / Bike</option>
                    <option value="scooter" className="bg-slate-900">Scooter</option>
                    <option value="bicycle" className="bg-slate-900">Bicycle</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Driving License Number</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input required value={form.licenseNumber} onChange={e => setForm({...form, licenseNumber: e.target.value})} type="text"
                  placeholder="DL-XXXXXXXXXX" className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 transition-all" />
              </div>
            </div>

            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    setForm((prev: any) => ({ ...prev, licenseFront: files[0], licenseBack: files[1] || null }));
                    alert(`${files.length} file(s) selected: ${files.map(f => f.name).join(', ')}`);
                  }
                }}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400 mb-1">Upload Driving License (Front & Back)</p>
                <p className="text-xs text-slate-600">JPG or PDF, max 5MB</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                required
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a> and confirm I have a valid driving license and vehicle insurance.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={uploading}
              className="w-full btn-primary !bg-gradient-to-r !from-cyan-500 !to-cyan-600 !shadow-cyan-500/25 !border-cyan-500/30 flex items-center justify-center gap-2 text-base py-4"
            >
              {uploading ? (
                <span className="flex items-center gap-2">Submitting...</span>
              ) : (
                <>Apply Now <ChevronRight className="w-5 h-5" /></>
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              By applying, you agree to our background verification process.
            </p>
          </motion.form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

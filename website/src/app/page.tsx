"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Shield, Truck, Users, Store, Smartphone, 
  Zap, ArrowRight, ChevronRight, Package, BarChart3, Headphones,
  CheckCircle2, Globe, Cpu, Sparkles, Terminal, Activity, X, IndianRupee, TrendingDown, Crown, Star, Anchor
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Typing animation component
function TypeWriter({ text, delay = 0, speed = 50 }: { text: string; delay?: number; speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className="typing-cursor">
      {displayText}
    </span>
  );
}
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import LiveStats from '@/components/LiveStats';
import TrustBadges from '@/components/TrustBadges';
import Pricing from '@/components/Pricing';
import SubscriptionComparison from '@/components/SubscriptionComparison';
import Team from '@/components/Team';
import CursorEffect from '@/components/CursorEffect';
import LiveChat from '@/components/LiveChat';
import ParticleNetwork from '@/components/ParticleNetwork';
import ScrollProgress from '@/components/ScrollProgress';
import PromoBanner from '@/components/PromoBanner';
import CookieConsent from '@/components/CookieConsent';
import CommandPalette from '@/components/CommandPalette';
import SocialProof from '@/components/SocialProof';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

const HeroScene = dynamic(() => import('@/components/HeroScene'), { ssr: false });

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

/* ─── HERO ─── */
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-32 aurora floating-orbs">
      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-900/95 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-transparent z-10 pointer-events-none mix-blend-screen" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse z-0" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] animate-pulse z-0" style={{ animationDelay: '4s' }} />
      
      <Suspense fallback={<div className="absolute inset-0 bg-slate-900" />}>
        <HeroScene />
      </Suspense>

      <div className="relative z-20 text-center max-w-5xl mx-auto px-6 py-20">
        {/* Futuristic badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass neon-border mb-8 group cursor-pointer hover:scale-105 transition-transform"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
            <TypeWriter text="Live Platform — Serving 50+ Cities" delay={500} speed={30} />
          </span>
          <Terminal className="w-3.5 h-3.5 text-emerald-400/60" />
        </motion.div>

        {/* Main headline with neon effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
            <motion.span 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="block text-white mb-2"
            >
              Fresh Meat.
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="block text-gradient neon-text mb-2 glitch"
              data-text="Smarter Delivery."
            >
              Smarter Delivery.
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="block text-slate-400 text-4xl md:text-5xl lg:text-6xl"
            >
              One Unified System.
            </motion.span>
          </h1>
        </motion.div>

        {/* AI-powered description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            <TypeWriter 
              text="Connecting customers, vendors, and delivery partners in real-time through cutting-edge hyperlocal technology." 
              delay={1200} 
              speed={25} 
            />
          </p>
        </motion.div>

        {/* Futuristic CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/#ecosystem" className="group relative btn-primary flex items-center gap-2 overflow-hidden">
            <span className="relative z-10">Order Now</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link href="/partner" className="btn-outline neon-border flex items-center gap-2 hover:bg-white/5 transition-colors">
            Partner With Us <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Futuristic stats with tech styling */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { icon: Activity, label: '10K+ Orders/Day', color: 'text-emerald-400' },
            { icon: Store, label: '200+ Vendors', color: 'text-cyan-400' },
            { icon: Clock, label: '30 Min Delivery', color: 'text-orange-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 + i * 0.1 }}
              className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-slate-500">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Decorative tech elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-emerald-500/20 rounded-lg opacity-50 hidden lg:block">
          <div className="absolute top-2 left-2 w-2 h-2 bg-emerald-500/40 rounded-full" />
          <div className="absolute bottom-2 right-2 w-2 h-2 bg-emerald-500/40 rounded-full" />
        </div>
        <div className="absolute bottom-32 right-10 w-24 h-24 border border-cyan-500/20 rounded-lg opacity-50 hidden lg:block">
          <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-500/40 rounded-full" />
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-cyan-500/40 rounded-full" />
        </div>
      </div>

    </section>
  );
}

/* ─── ABOUT ─── */
function AboutSection() {
  return (
    <section id="about" className="section-padding relative grid-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.p variants={fadeUp} custom={0} className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">About the Platform</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Built for <span className="text-gradient">Speed</span>,<br/>Designed for <span className="text-gradient-warm">Scale</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-400 leading-relaxed mb-8">
              Fleish is a hyperlocal meat delivery ecosystem that connects neighborhood butchers and premium meat vendors 
              directly to customers through a network of trained delivery partners. Our proprietary routing engine ensures 
              the freshest meat reaches your doorstep in under 30 minutes.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="space-y-4">
              {[
                { icon: Globe, text: "Hyperlocal connection model — 3km vendor radius" },
                { icon: Cpu, text: "AI-powered routing for fastest delivery paths" },
                { icon: Shield, text: "Cold-chain verified delivery with real-time monitoring" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Realistic Map with Sailors Catching Fish */}
          <motion.div 
            variants={fadeUp} 
            custom={4}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
              {/* Background Map - Enhanced */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                {/* Map glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px]" />
                
                {/* Map Grid Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mapGrid)" />
                </svg>
                
                {/* India Map - Larger and More Visible */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
                  {/* Map background glow */}
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* India Map Outline - Scaled up */}
                  <path 
                    d="M180 120 Q240 90 300 120 Q340 160 320 220 Q300 280 260 330 Q220 380 180 400 Q140 370 100 320 Q60 250 100 180 Q140 130 180 120 Z" 
                    fill="rgba(16, 185, 129, 0.1)" 
                    stroke="#10b981" 
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                  
                  {/* Inner glow line */}
                  <path 
                    d="M180 120 Q240 90 300 120 Q340 160 320 220 Q300 280 260 330 Q220 380 180 400 Q140 370 100 320 Q60 250 100 180 Q140 130 180 120 Z" 
                    fill="none" 
                    stroke="#34d399" 
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  
                  {/* Major Cities */}
                  <g>
                    {/* Mumbai */}
                    <circle cx="140" cy="280" r="6" fill="#10b981">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <text x="140" y="300" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Mumbai</text>
                    
                    {/* Delhi */}
                    <circle cx="220" cy="150" r="6" fill="#10b981">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin="0.3s" />
                    </circle>
                    <text x="220" y="170" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Delhi</text>
                    
                    {/* Bangalore */}
                    <circle cx="240" cy="340" r="6" fill="#10b981">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin="0.6s" />
                    </circle>
                    <text x="240" y="360" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Bangalore</text>
                    
                    {/* Chennai */}
                    <circle cx="280" cy="360" r="6" fill="#10b981">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin="0.9s" />
                    </circle>
                    <text x="280" y="380" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Chennai</text>
                    
                    {/* Hyderabad */}
                    <circle cx="260" cy="310" r="6" fill="#10b981">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin="1.2s" />
                    </circle>
                    <text x="260" y="295" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Hyderabad</text>
                    
                    {/* Kolkata */}
                    <circle cx="340" cy="240" r="6" fill="#10b981">
                      <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite" begin="1.5s" />
                    </circle>
                    <text x="340" y="220" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">Kolkata</text>
                  </g>
                  
                  {/* Connection Lines */}
                  <g stroke="#10b981" strokeWidth="2" strokeDasharray="8,4" opacity="0.7" fill="none">
                    <path d="M220 150 Q180 215 140 280">
                      <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" />
                    </path>
                    <path d="M220 150 Q230 230 240 340">
                      <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" begin="0.3s" />
                    </path>
                    <path d="M140 280 Q190 310 240 340">
                      <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" begin="0.6s" />
                    </path>
                    <path d="M260 310 Q270 335 280 360">
                      <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" begin="0.9s" />
                    </path>
                    <path d="M300 120 Q320 180 340 240">
                      <animate attributeName="stroke-dashoffset" from="0" to="24" dur="2s" repeatCount="indefinite" begin="1.2s" />
                    </path>
                  </g>
                  
                  {/* Coastal Highlight - Where fishing happens */}
                  <path 
                    d="M100 320 Q60 250 100 180 Q120 150 140 140" 
                    stroke="#0ea5e9" 
                    strokeWidth="3" 
                    strokeDasharray="5,5"
                    fill="none"
                    opacity="0.8"
                    filter="url(#glow)"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" />
                  </path>
                  <text x="70" y="240" textAnchor="middle" fill="#0ea5e9" fontSize="9" fontWeight="bold" opacity="0.9">Arabian Sea</text>
                  
                  {/* Bay of Bengal */}
                  <path 
                    d="M340 240 Q360 300 320 360 Q300 390 280 400" 
                    stroke="#0ea5e9" 
                    strokeWidth="3" 
                    strokeDasharray="5,5"
                    fill="none"
                    opacity="0.8"
                    filter="url(#glow)"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="20" dur="3s" repeatCount="indefinite" begin="1.5s" />
                  </path>
                  <text x="360" y="310" textAnchor="middle" fill="#0ea5e9" fontSize="9" fontWeight="bold" opacity="0.9">Bay of Bengal</text>
                </svg>
              </div>

              {/* 3D Fishermen/Boat Scene */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <svg width="280" height="200" viewBox="0 0 280 200" className="drop-shadow-2xl">
                    {/* Water waves */}
                    <motion.path
                      d="M0 160 Q70 150 140 160 Q210 170 280 160"
                      stroke="#0ea5e9"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.6"
                      animate={{ d: ["M0 160 Q70 150 140 160 Q210 170 280 160", "M0 160 Q70 170 140 160 Q210 150 280 160", "M0 160 Q70 150 140 160 Q210 170 280 160"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M20 175 Q90 165 160 175 Q230 185 260 175"
                      stroke="#0284c7"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.4"
                      animate={{ d: ["M20 175 Q90 165 160 175 Q230 185 260 175", "M20 175 Q90 185 160 175 Q230 165 260 175", "M20 175 Q90 165 160 175 Q230 185 260 175"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    />

                    {/* Boat */}
                    <path d="M60 140 L220 140 L200 170 L80 170 Z" fill="#78350f" />
                    <path d="M60 140 L220 140 L200 150 L80 150 Z" fill="#92400e" />
                    
                    {/* Boat details */}
                    <rect x="130" y="115" width="8" height="35" fill="#5c4033" />
                    <path d="M138 115 L180 140 L138 140 Z" fill="#f8fafc" opacity="0.9" />
                    <path d="M138 115 L100 140 L138 140 Z" fill="#e2e8f0" opacity="0.7" />

                    {/* Fisherman 1 - Casting net with realistic animation */}
                    <g transform="translate(100, 95)">
                      <motion.g
                        animate={{
                          rotate: [0, -15, -15, 0, 0],
                          x: [0, 0, 0, 0, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          times: [0, 0.15, 0.4, 0.6, 1],
                          ease: "easeInOut",
                        }}
                      >
                        {/* Body */}
                        <rect x="0" y="20" width="18" height="30" rx="3" fill="#f97316" />
                        {/* Head */}
                        <circle cx="9" cy="12" r="10" fill="#fdba74" />
                        {/* Hair */}
                        <path d="M-1 8 Q9 0 19 8" fill="#1e293b" />
                        {/* Face */}
                        <circle cx="6" cy="12" r="1.5" fill="#1e293b" />
                        <circle cx="12" cy="12" r="1.5" fill="#1e293b" />
                        <path d="M6 16 Q9 18 12 16" stroke="#1e293b" strokeWidth="1" fill="none" />
                        
                        {/* Animated Arms - casting motion */}
                        <motion.path
                          d="M0 28 L-15 35"
                          stroke="#fdba74"
                          strokeWidth="5"
                          strokeLinecap="round"
                          animate={{
                            d: [
                              "M0 28 L-15 35",
                              "M0 28 L-25 20",
                              "M0 28 L-25 20",
                              "M0 28 L-15 35",
                              "M0 28 L-15 35",
                            ],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            times: [0, 0.15, 0.4, 0.6, 1],
                          }}
                        />
                        <motion.path
                          d="M18 28 L33 35"
                          stroke="#fdba74"
                          strokeWidth="5"
                          strokeLinecap="round"
                          animate={{
                            d: [
                              "M18 28 L33 35",
                              "M18 28 L43 20",
                              "M18 28 L43 20",
                              "M18 28 L33 35",
                              "M18 28 L33 35",
                            ],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            times: [0, 0.15, 0.4, 0.6, 1],
                          }}
                        />
                        
                        {/* Legs */}
                        <path d="M4 50 L2 68" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />
                        <path d="M14 50 L16 68" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" />
                      </motion.g>
                      
                      {/* Net casting animation */}
                      <motion.g
                        initial={{ scale: 0.3, opacity: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0.3, 1.2, 1.2, 0.3, 0.3],
                          opacity: [0.7, 1, 1, 0.7, 0.7],
                          x: [0, 0, 0, 0, 0],
                          y: [0, -20, 10, 0, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          times: [0, 0.15, 0.4, 0.6, 1],
                          ease: "easeInOut",
                        }}
                      >
                        {/* Net circle */}
                        <ellipse cx="9" cy="45" rx="30" ry="12" fill="none" stroke="#64748b" strokeWidth="1.5" />
                        <ellipse cx="9" cy="45" rx="22" ry="9" fill="none" stroke="#64748b" strokeWidth="1" opacity="0.6" />
                        <ellipse cx="9" cy="45" rx="15" ry="6" fill="none" stroke="#64748b" strokeWidth="0.5" opacity="0.4" />
                        
                        {/* Net mesh lines */}
                        <path d="M-21 45 L-15 55 M-5 53 L0 65 M9 53 L9 68 M20 55 L25 65 M39 45 L45 55" stroke="#64748b" strokeWidth="0.5" opacity="0.5" />
                        <path d="M-21 45 L-15 35 M-5 37 L0 25 M9 37 L9 22 M20 35 L25 25 M39 45 L45 35" stroke="#64748b" strokeWidth="0.5" opacity="0.5" />
                        
                        {/* Caught fish in net */}
                        <motion.g
                          animate={{ y: [0, -5, 0, 0, 0] }}
                          transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1] }}
                        >
                          <ellipse cx="5" cy="45" rx="7" ry="4" fill="#0ea5e9" />
                          <ellipse cx="5" cy="43" rx="2.5" ry="2" fill="white" opacity="0.7" />
                          <circle cx="3" cy="44" r="1" fill="#1e293b" />
                          <path d="M12 45 L16 42 M12 45 L16 48" stroke="#0ea5e9" strokeWidth="1" />
                        </motion.g>
                        
                        {/* Second fish */}
                        <motion.g
                          animate={{ y: [0, -3, 0, 0, 0], x: [0, 2, 0, 0, 0] }}
                          transition={{ duration: 6, repeat: Infinity, times: [0, 0.35, 0.45, 0.6, 1] }}
                        >
                          <ellipse cx="15" cy="48" rx="5" ry="3" fill="#0284c7" />
                          <ellipse cx="15" cy="46.5" rx="2" ry="1.5" fill="white" opacity="0.6" />
                          <circle cx="13.5" cy="47.5" r="0.8" fill="#1e293b" />
                        </motion.g>
                        
                        {/* Third small fish */}
                        <motion.g
                          animate={{ y: [0, -4, 0, 0, 0] }}
                          transition={{ duration: 6, repeat: Infinity, times: [0, 0.38, 0.48, 0.6, 1] }}
                        >
                          <ellipse cx="0" cy="50" rx="4" ry="2.5" fill="#06b6d4" />
                          <circle cx="-1" cy="49.5" r="0.6" fill="#1e293b" />
                        </motion.g>
                      </motion.g>
                      
                      {/* Water splash effect when net hits water */}
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 0, 1, 0, 0],
                          scale: [0.5, 0.5, 1.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          times: [0, 0.38, 0.43, 0.5, 1],
                        }}
                      >
                        <ellipse cx="9" cy="55" rx="35" ry="8" fill="#0ea5e9" opacity="0.3" />
                        <path d="M-20 55 L-25 50 M-10 58 L-12 65 M9 60 L9 68 M25 58 L28 65 M35 55 L40 50" stroke="#0ea5e9" strokeWidth="1" opacity="0.6" />
                      </motion.g>
                    </g>

                    {/* Fisherman 2 - Sitting with caught fish */}
                    <g transform="translate(160, 105)">
                      {/* Body sitting */}
                      <rect x="0" y="18" width="18" height="25" rx="3" fill="#06b6d4" />
                      {/* Head */}
                      <circle cx="9" cy="10" r="9" fill="#8b5a2b" />
                      {/* Hair */}
                      <path d="M0 6 Q9 -2 18 6" fill="#1e293b" />
                      {/* Face - happy */}
                      <circle cx="6" cy="10" r="1.2" fill="#1e293b" />
                      <circle cx="12" cy="10" r="1.2" fill="#1e293b" />
                      <path d="M5 14 Q9 16 13 14" stroke="#1e293b" strokeWidth="1" fill="none" />
                      {/* Arms holding big fish */}
                      <path d="M0 25 L-10 20" stroke="#8b5a2b" strokeWidth="4" strokeLinecap="round" />
                      <path d="M18 25 L28 15" stroke="#8b5a2b" strokeWidth="4" strokeLinecap="round" />
                      {/* Big Fish */}
                      <motion.g
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ellipse cx="25" cy="12" rx="12" ry="5" fill="#0ea5e9" />
                        <path d="M13 12 L5 8 M13 12 L5 16" stroke="#0ea5e9" strokeWidth="2" />
                        <ellipse cx="22" cy="10" rx="3" ry="2" fill="white" opacity="0.7" />
                        <circle cx="21" cy="10" r="1" fill="#1e293b" />
                        <path d="M32 10 L38 6 M32 12 L40 12 M32 14 L38 18" stroke="#0ea5e9" strokeWidth="1" opacity="0.5" />
                      </motion.g>
                      {/* Legs sitting */}
                      <path d="M4 43 L2 55" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
                      <path d="M14 43 L20 50" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
                    </g>

                    {/* Fisherman 3 - Standing at back with pole */}
                    <g transform="translate(190, 90)">
                      {/* Body */}
                      <rect x="0" y="22" width="16" height="28" rx="3" fill="#10b981" />
                      {/* Head */}
                      <circle cx="8" cy="14" r="9" fill="#fdba74" />
                      {/* Turban */}
                      <path d="M-2 12 Q8 2 18 12" fill="#f97316" />
                      <rect x="-3" y="10" width="22" height="5" rx="1" fill="#ea580c" />
                      {/* Face */}
                      <circle cx="5" cy="14" r="1.2" fill="#1e293b" />
                      <circle cx="11" cy="14" r="1.2" fill="#1e293b" />
                      <path d="M5 18 Q8 20 11 18" stroke="#1e293b" strokeWidth="0.8" fill="none" />
                      {/* Arms with fishing pole */}
                      <path d="M0 30 L-15 25" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
                      <circle cx="-18" cy="23" r="3" fill="#fdba74" />
                      {/* Fishing pole */}
                      <line x1="-18" y1="23" x2="-50" y2="-5" stroke="#5c4033" strokeWidth="2" />
                      <line x1="-50" y1="-5" x2="-50" y2="25" stroke="#94a3b8" strokeWidth="1" opacity="0.7" />
                      {/* Fish on line */}
                      <motion.g
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ellipse cx="-50" cy="28" rx="5" ry="3" fill="#0ea5e9" />
                        <circle cx="-52" cy="27" r="0.6" fill="#1e293b" />
                      </motion.g>
                      {/* Legs */}
                      <path d="M3 50 L2 65" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
                      <path d="M13 50 L16 62" stroke="#1e3a5f" strokeWidth="5" strokeLinecap="round" />
                    </g>

                    {/* Fish bucket */}
                    <ellipse cx="80" cy="145" rx="15" ry="8" fill="#64748b" />
                    <ellipse cx="80" cy="143" rx="12" ry="5" fill="#475569" />
                    {/* Fish in bucket */}
                    <ellipse cx="78" cy="141" rx="5" ry="2" fill="#0ea5e9" opacity="0.8" />
                    <ellipse cx="82" cy="142" rx="4" ry="2" fill="#0284c7" opacity="0.8" />

                    {/* Additional small fish jumping */}
                    <motion.g
                      animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      <ellipse cx="50" cy="145" rx="4" ry="2" fill="#0ea5e9" opacity="0.6" />
                    </motion.g>
                  </svg>

                  {/* Floating labels */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute -top-4 -right-8 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-sm"
                  >
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Fresh Catch
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                    className="absolute top-8 -left-12 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-sm"
                  >
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Coastal India
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom stats overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                {[
                  { label: "Fresh Fish", value: "Daily", icon: CheckCircle2 },
                  { label: "Source", value: "Local Fishermen", icon: Users },
                  { label: "Delivery", value: "< 30 min", icon: Zap },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + i * 0.2 }}
                    className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Why Fleish Wins - Enhanced Comparison */}
          <motion.div variants={fadeUp} custom={4} className="relative lg:col-span-2">
            <div className="rounded-3xl glass-strong p-6 lg:p-8 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-cyan-500/5 to-violet-500/5" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px]" />
              
              {/* Floating particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400/40 rounded-full"
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      delay: i * 0.3,
                      repeat: Infinity,
                    }}
                    style={{
                      left: `${60 + i * 5}%`,
                      top: `${20 + i * 10}%`,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10">
                {/* Header with crown icon */}
                <div className="flex items-center gap-4 mb-8">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-xl shadow-emerald-500/30"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring" }}
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-1">
                      Why <span className="text-gradient-animated">Fleish</span> Wins
                    </h3>
                    <p className="text-sm text-slate-400">The clear winner in fresh delivery</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                  {/* Left Side - Comparison Table (3 cols) */}
                  <div className="lg:col-span-3">
                    {/* Comparison Table - Enhanced */}
                    <div className="space-y-2">
                      {/* Header Row */}
                      <div className="grid grid-cols-4 gap-2 pb-3 border-b-2 border-white/10">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Feature
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/50">
                            <span className="text-xs font-bold text-slate-400">Licious</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/50">
                            <span className="text-xs font-bold text-slate-400">FreshToHome</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                            <Star className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-bold text-emerald-400">Fleish</span>
                          </div>
                        </div>
                      </div>

                      {/* Row 1 - Delivery Speed */}
                      <motion.div 
                        className="grid grid-cols-4 gap-2 items-center p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all border border-transparent hover:border-emerald-500/20"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300">Delivery Time</span>
                        </div>
                        <div className="text-center text-xs text-slate-500 bg-slate-800/30 py-2 rounded-lg">60-90 min</div>
                        <div className="text-center text-xs text-slate-500 bg-slate-800/30 py-2 rounded-lg">45-60 min</div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg shadow-emerald-500/10">
                            <Zap className="w-3 h-3" /> 30 min
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 2 - Freshness */}
                      <motion.div 
                        className="grid grid-cols-4 gap-2 items-center p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all border border-transparent hover:border-cyan-500/20"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300">Freshness</span>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                            <X className="w-4 h-4 text-red-400" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center opacity-50">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold shadow-lg shadow-cyan-500/10">
                            <CheckCircle2 className="w-3 h-3" /> 2X Guarantee
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 3 - Local Vendors */}
                      <motion.div 
                        className="grid grid-cols-4 gap-2 items-center p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all border border-transparent hover:border-violet-500/20"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <Store className="w-4 h-4 text-violet-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300">Local Vendors</span>
                        </div>
                        <div className="text-center text-xs text-slate-500 bg-slate-800/30 py-2 rounded-lg">Warehouses</div>
                        <div className="text-center text-xs text-slate-500 bg-slate-800/30 py-2 rounded-lg">Mixed</div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400 text-xs font-bold shadow-lg shadow-violet-500/10">
                            <Store className="w-3 h-3" /> 200+ Local
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 4 - Pricing */}
                      <motion.div 
                        className="grid grid-cols-4 gap-2 items-center p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all border border-transparent hover:border-amber-500/20"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <IndianRupee className="w-4 h-4 text-amber-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300">Best Prices</span>
                        </div>
                        <div className="text-center text-xs text-slate-500 bg-slate-800/30 py-2 rounded-lg">Premium</div>
                        <div className="text-center text-xs text-slate-500 bg-slate-800/30 py-2 rounded-lg">Moderate</div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg shadow-amber-500/10">
                            <TrendingDown className="w-3 h-3" /> 20% Lower
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 5 - Live Tracking */}
                      <motion.div 
                        className="grid grid-cols-4 gap-2 items-center p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-all border border-transparent hover:border-rose-500/20"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-rose-400" />
                          </div>
                          <span className="text-sm font-semibold text-slate-300">Live Tracking</span>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                            <X className="w-4 h-4 text-red-400" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center opacity-50">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold shadow-lg shadow-rose-500/10">
                            <MapPin className="w-3 h-3" /> Real-time
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Side - Visual Showcase (2 cols) */}
                  <div className="lg:col-span-2 relative">
                    {/* Delivery Boy Illustration */}
                    <div className="relative h-full min-h-[300px] flex flex-col items-center justify-center">
                      {/* Animated Delivery Bike */}
                      <motion.div
                        animate={{ x: [-20, 20, -20] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10"
                      >
                        <svg width="160" height="120" viewBox="0 0 160 120" className="drop-shadow-2xl">
                          {/* Bike shadow */}
                          <ellipse cx="80" cy="110" rx="50" ry="6" fill="rgba(0,0,0,0.3)" />
                          {/* Delivery bag */}
                          <rect x="60" y="45" width="40" height="35" rx="5" fill="#059669" stroke="#047857" strokeWidth="2" />
                          <text x="80" y="67" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">FLEISH</text>
                          <rect x="75" y="40" width="10" height="8" rx="2" fill="#047857" />
                          {/* Bike body */}
                          <circle cx="45" cy="95" r="18" stroke="#475569" strokeWidth="3" fill="none" />
                          <circle cx="115" cy="95" r="18" stroke="#475569" strokeWidth="3" fill="none" />
                          <path d="M45 95 L70 75 L85 55 L105 75 L115 95" stroke="#475569" strokeWidth="3" fill="none" />
                          <path d="M70 75 L105 75" stroke="#475569" strokeWidth="2" />
                          {/* Delivery person */}
                          <circle cx="85" cy="35" r="12" fill="#fdba74" />
                          <rect x="78" y="45" width="14" height="20" rx="3" fill="#10b981" />
                          <circle cx="85" cy="55" r="6" fill="#059669" opacity="0.5" />
                          <text x="85" y="58" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">F</text>
                          {/* Arms on handlebars */}
                          <path d="M78 50 L65 60" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
                          <path d="M92 50 L105 60" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
                          {/* Helmet */}
                          <path d="M73 30 Q85 15 97 30" fill="#f97316" />
                          <rect x="70" y="28" width="30" height="6" rx="2" fill="#ea580c" />
                          {/* Speed lines */}
                          <motion.path
                            d="M10 70 L30 70 M5 80 L25 80"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                            animate={{ opacity: [0, 1, 0], x: [-10, -30] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                        </svg>
                      </motion.div>

                      {/* Floating badges */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-sm"
                      >
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> 30min Delivery
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="absolute bottom-20 left-0 px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-500/30 backdrop-blur-sm"
                      >
                        <span className="text-xs font-bold text-violet-400 flex items-center gap-1">
                          <Store className="w-3 h-3" /> 200+ Vendors
                        </span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm"
                      >
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" /> 20% Savings
                        </span>
                      </motion.div>

                      {/* Animated circles */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-emerald-500/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-500/20"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Stats - Enhanced */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                  {[
                    { val: "50+", label: "Cities Covered", icon: MapPin, color: "emerald" },
                    { val: "200+", label: "Local Vendors", icon: Store, color: "violet" },
                    { val: "99.9%", label: "Uptime SLA", icon: Shield, color: "cyan" },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      className="text-center p-4 rounded-2xl bg-white/[0.02] hover:bg-white/5 transition-all group"
                      whileHover={{ y: -3 }}
                    >
                      <div className={`w-10 h-10 mx-auto rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                      </div>
                      <p className="text-2xl font-black text-gradient">{stat.val}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorksSection() {
  const steps = [
    { 
      title: "Customer Orders", 
      desc: "Browse local vendors, select premium cuts, and place your order in seconds.", 
      color: "emerald",
      animation: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
          {/* Phone */}
          <rect x="35" y="20" width="50" height="80" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
          <rect x="38" y="25" width="44" height="70" rx="4" fill="#0f172a" />
          {/* Screen content */}
          <rect x="42" y="35" width="36" height="8" rx="2" fill="#334155" />
          <rect x="42" y="48" width="28" height="6" rx="2" fill="#10b981" opacity="0.5" />
          <rect x="42" y="58" width="32" height="6" rx="2" fill="#334155" />
          <rect x="42" y="68" width="24" height="6" rx="2" fill="#334155" />
          {/* Animated finger tapping */}
          <motion.g
            animate={{ y: [0, 5, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="85" cy="75" rx="8" ry="10" fill="#fdba74" />
            <ellipse cx="85" cy="68" rx="6" ry="4" fill="#f97316" opacity="0.3" />
          </motion.g>
          {/* Tapping ripple effect */}
          <motion.circle
            cx="70"
            cy="65"
            r="0"
            stroke="#10b981"
            strokeWidth="2"
            fill="none"
            opacity="0"
            animate={{ r: [0, 15, 20], opacity: [1, 0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          {/* Floating meat icons */}
          <motion.g
            animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ellipse cx="25" cy="40" rx="6" ry="4" fill="#ef4444" opacity="0.8" />
            <ellipse cx="25" cy="38" rx="2" ry="1.5" fill="white" opacity="0.5" />
          </motion.g>
          <motion.g
            animate={{ y: [0, -3, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <ellipse cx="95" cy="45" rx="5" ry="3" fill="#0ea5e9" opacity="0.8" />
            <ellipse cx="95" cy="43" rx="2" ry="1.2" fill="white" opacity="0.5" />
          </motion.g>
        </svg>
      )
    },
    { 
      title: "Vendor Prepares", 
      desc: "Your neighborhood vendor receives the order instantly and begins fresh preparation.", 
      color: "orange",
      animation: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
          {/* Vendor */}
          <circle cx="60" cy="35" r="12" fill="#fdba74" />
          <rect x="50" y="45" width="20" height="25" rx="3" fill="#f97316" />
          <path d="M48 50 L35 60" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
          <path d="M72 50 L85 40" stroke="#fdba74" strokeWidth="4" strokeLinecap="round" />
          {/* Cleaver knife */}
          <motion.g
            animate={{ rotate: [-5, 10, -5], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="82" y="30" width="8" height="25" rx="1" fill="#64748b" />
            <rect x="78" y="52" width="16" height="8" rx="2" fill="#94a3b8" />
          </motion.g>
          {/* Chopping board */}
          <rect x="35" y="75" width="50" height="10" rx="2" fill="#92400e" />
          {/* Meat being chopped */}
          <motion.ellipse
            cx="60" cy="72"
            rx="12" ry="6"
            fill="#ef4444"
            animate={{ scaleX: [1, 0.8, 1], x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Flying meat pieces */}
          <motion.g
            animate={{ y: [0, -8, 0], x: [0, 3, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          >
            <ellipse cx="75" cy="65" rx="4" ry="3" fill="#dc2626" />
          </motion.g>
          {/* Order notification */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <circle cx="30" cy="30" r="12" fill="#10b981" />
            <text x="30" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
          </motion.g>
        </svg>
      )
    },
    { 
      title: "Lightning Delivery", 
      desc: "A trained delivery partner picks up and delivers to your door in under 30 minutes.", 
      color: "cyan",
      animation: (
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
          {/* Speed lines background */}
          <motion.line
            x1="10" y1="40" x2="30" y2="40"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.5"
            animate={{ x: [-10, 10], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.line
            x1="5" y1="60" x2="25" y2="60"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.5"
            animate={{ x: [-10, 10], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.line
            x1="15" y1="80" x2="35" y2="80"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.5"
            animate={{ x: [-10, 10], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
          />
          {/* Delivery bike */}
          <motion.g
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {/* Wheels */}
            <circle cx="40" cy="85" r="12" stroke="#475569" strokeWidth="3" fill="none" />
            <circle cx="80" cy="85" r="12" stroke="#475569" strokeWidth="3" fill="none" />
            {/* Bike body */}
            <path d="M40 85 L55 65 L75 65 L80 85" stroke="#64748b" strokeWidth="3" fill="none" />
            <path d="M55 65 L45 50" stroke="#64748b" strokeWidth="3" />
            {/* Delivery box */}
            <rect x="55" y="50" width="20" height="15" rx="2" fill="#10b981" />
            <text x="65" y="61" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">F</text>
            {/* Rider */}
            <circle cx="50" cy="45" r="8" fill="#1e293b" />
            <rect x="45" y="52" width="10" height="15" rx="2" fill="#10b981" />
          </motion.g>
          {/* Lightning bolts */}
          <motion.path
            d="M90 35 L100 50 L95 50 L105 70"
            stroke="#fbbf24"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* 30 min badge */}
          <motion.g
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <circle cx="95" cy="90" r="18" fill="#06b6d4" opacity="0.9" />
            <text x="95" y="88" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">30</text>
            <text x="95" y="97" textAnchor="middle" fill="white" fontSize="6">min</text>
          </motion.g>
        </svg>
      )
    },
  ];

  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">The Process</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white tracking-tight">
            How It <span className="text-gradient">Works</span>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-500/30 via-orange-500/30 to-cyan-500/30 -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="relative z-10 glass-strong rounded-3xl p-8 text-center group hover:border-emerald-500/20 transition-all">
              <div className="w-4 h-4 absolute -top-2 left-1/2 -translate-x-1/2 bg-white rounded-full border-4 border-black hidden md:block" />
              <div className="text-6xl font-black text-white/5 absolute top-4 right-6">0{i + 1}</div>
              
              {/* Animated Illustration Container */}
              <div className={`w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl transition-all group-hover:scale-110 ${
                step.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20 shadow-emerald-500/10' :
                step.color === 'orange' ? 'bg-orange-500/10 border border-orange-500/20 shadow-orange-500/10' :
                'bg-cyan-500/10 border border-cyan-500/20 shadow-cyan-500/10'
              }`}>
                {step.animation}
              </div>
              
              <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
function FeaturesSection() {
  const features = [
    { icon: MapPin, title: "Real-Time Tracking", desc: "GPS-powered live tracking for every order from vendor to doorstep.", accent: "emerald" },
    { icon: Store, title: "Local Vendor Network", desc: "Deep integration with neighborhood butchers and premium meat shops.", accent: "orange" },
    { icon: Clock, title: "30-Min Guarantee", desc: "Hyperlocal routing ensures the fastest possible delivery window.", accent: "cyan" },
    { icon: BarChart3, title: "Smart Operations", desc: "Enterprise-grade backend for analytics, inventory, and fleet management.", accent: "violet" },
    { icon: Shield, title: "Quality Assured", desc: "Cold-chain verification and freshness scoring on every delivery.", accent: "rose" },
    { icon: Headphones, title: "24/7 Support", desc: "Live customer support with AI-assisted resolution and escalation.", accent: "amber" },
  ];

  const colors: Record<string, string> = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 text-emerald-400',
    orange: 'from-orange-500/10 to-orange-500/5 border-orange-500/10 text-orange-400',
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/10 text-cyan-400',
    violet: 'from-violet-500/10 to-violet-500/5 border-violet-500/10 text-violet-400',
    rose: 'from-rose-500/10 to-rose-500/5 border-rose-500/10 text-rose-400',
    amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/10 text-amber-400',
  };

  return (
    <section id="features" className="section-padding relative grid-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Capabilities</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Built for <span className="text-gradient">Excellence</span>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className={`rounded-3xl bg-gradient-to-br ${colors[f.accent]} border p-8 group hover:scale-[1.02] transition-all duration-300`}>
              <f.icon className={`w-10 h-10 mb-5 ${colors[f.accent].split(' ').pop()}`} />
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── ECOSYSTEM ─── */
function EcosystemSection() {
  const apps = [
    { 
      title: "Customer App", 
      desc: "Browse, order, and track fresh meat deliveries in real-time.", 
      icon: Smartphone, 
      color: "emerald",
      storeLinks: { playStore: true, appStore: true }
    },
    { 
      title: "Vendor Dashboard", 
      desc: "Manage inventory, accept orders, and track revenue performance.", 
      icon: Store, 
      color: "orange",
      storeLinks: { playStore: true, appStore: true }
    },
    { 
      title: "Delivery App", 
      desc: "Optimized routes, earnings tracker, and live navigation for riders.", 
      icon: Truck, 
      color: "cyan",
      storeLinks: { playStore: true, appStore: false }
    },
  ];

  // Google Play Icon SVG
  const PlayStoreIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  );

  // App Store Icon SVG
  const AppStoreIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
    </svg>
  );

  return (
    <section id="ecosystem" className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">The Ecosystem</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Three Apps. <span className="text-gradient">One Platform.</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-lg text-slate-400 max-w-2xl mx-auto">
            Every stakeholder gets a dedicated, purpose-built application — all connected through our unified backend.
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apps.map((app, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="glass-strong rounded-3xl p-10 text-center group hover:border-emerald-500/20 transition-all relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-b ${
                app.color === 'emerald' ? 'from-emerald-500/5' : app.color === 'orange' ? 'from-orange-500/5' : 'from-cyan-500/5'
              } to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl ${
                  app.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20 shadow-emerald-500/10' :
                  app.color === 'orange' ? 'bg-orange-500/10 border border-orange-500/20 shadow-orange-500/10' :
                  'bg-cyan-500/10 border border-cyan-500/20 shadow-cyan-500/10'
                }`} style={{ animation: `float ${6 + i}s ease-in-out infinite` }}>
                  <app.icon className={`w-10 h-10 ${
                    app.color === 'emerald' ? 'text-emerald-400' : app.color === 'orange' ? 'text-orange-400' : 'text-cyan-400'
                  }`} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{app.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{app.desc}</p>
                
                {/* Store Links */}
                <div className="flex items-center justify-center gap-3">
                  {app.storeLinks.playStore && (
                    <motion.a
                      href={
                        app.color === 'emerald' ? 'https://play.google.com/store/apps/details?id=com.fleish.customer' :
                        app.color === 'orange' ? 'https://play.google.com/store/apps/details?id=com.fleish.vendor' :
                        'https://play.google.com/store/apps/details?id=com.fleish.delivery'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        app.color === 'emerald' 
                          ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' :
                        app.color === 'orange'
                          ? 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400' :
                          'border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      <PlayStoreIcon />
                      <span className="text-xs font-semibold">Google Play</span>
                    </motion.a>
                  )}
                  {app.storeLinks.appStore && (
                    <motion.a
                      href={
                        app.color === 'emerald' ? 'https://apps.apple.com/app/fleish-customer/id1234567890' :
                        'https://apps.apple.com/app/fleish-vendor/id1234567891'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        app.color === 'emerald' 
                          ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' :
                        app.color === 'orange'
                          ? 'border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400' :
                          'border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400'
                      }`}
                    >
                      <AppStoreIcon />
                      <span className="text-xs font-semibold">App Store</span>
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── ONBOARDING CTA ─── */
function OnboardingSection() {
  return (
    <section className="section-padding relative grid-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-12">
          <motion.p variants={fadeUp} custom={0} className="text-xs font-black uppercase tracking-widest text-orange-400 mb-4">Join the Network</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Grow With <span className="text-gradient-warm">Fleish</span>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <motion.div variants={fadeUp} custom={0}>
            <Link href="/vendor" className="block glass-strong rounded-3xl p-10 group hover:border-orange-500/20 transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Store className="w-12 h-12 text-orange-400 mb-6" />
                <h3 className="text-2xl font-black text-white mb-3">Become a Vendor</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">List your meat shop on Fleish and reach thousands of customers in your area. Zero commission for the first 3 months.</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-400 group-hover:gap-3 transition-all">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <Link href="/partner" className="block glass-strong rounded-3xl p-10 group hover:border-cyan-500/20 transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Truck className="w-12 h-12 text-cyan-400 mb-6" />
                <h3 className="text-2xl font-black text-white mb-3">Become a Delivery Partner</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">Earn on your own schedule. Join our fleet with your own vehicle and start delivering within 24 hours.</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:gap-3 transition-all">
                  Sign Up <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ─── */
export default function HomePage() {
  return (
    <main className="relative pb-20">
      <ParticleNetwork />
      <CursorEffect />
      <PromoBanner />
      <ScrollProgress />
      <CommandPalette />
      <Navbar />
      <HeroSection />
      <TrustBadges />
      <AboutSection />
      <HowItWorksSection />
      <FeaturesSection />
      <LiveStats />
      <EcosystemSection />
      <Testimonials />
      <Pricing />
      <SubscriptionComparison />
      <Team />
      <OnboardingSection />
      <Footer />
      <SocialProof />
      <LiveChat />
      <KeyboardShortcuts />
      <CookieConsent />
    </main>
  );
}

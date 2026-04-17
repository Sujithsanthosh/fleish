"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Vendor Shop SVG Component
function VendorShop({ x, type, delay }: { x: string; type: 'meat' | 'fish'; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="absolute bottom-32"
      style={{ left: x }}
    >
      <svg width="140" height="120" viewBox="0 0 140 120" className="drop-shadow-xl">
        {/* Shop Awning */}
        <path d="M10 50 L130 50 L120 70 L20 70 Z" fill={type === 'meat' ? '#ef4444' : '#06b6d4'} />
        <path d="M10 50 L130 50 L125 55 L15 55 Z" fill="rgba(255,255,255,0.3)" />
        
        {/* Shop Structure */}
        <rect x="20" y="70" width="100" height="50" fill="#78350f" />
        <rect x="25" y="75" width="90" height="40" fill="#451a03" />
        
        {/* Shop Name Board */}
        <rect x="30" y="55" width="80" height="12" rx="2" fill="#1e293b" />
        <text x="70" y="64" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">
          {type === 'meat' ? 'FRESH MEATS' : 'FISH MARKET'}
        </text>
        
        {/* Cutting Board */}
        <rect x="35" y="90" width="50" height="8" rx="2" fill="#92400e" />
        
        {/* Meat/Fish on display */}
        {type === 'meat' ? (
          <>
            <ellipse cx="45" cy="85" rx="8" ry="5" fill="#dc2626" />
            <ellipse cx="60" cy="88" rx="10" ry="6" fill="#b91c1c" />
            <ellipse cx="75" cy="85" rx="7" ry="4" fill="#991b1b" />
          </>
        ) : (
          <>
            <ellipse cx="50" cy="86" rx="12" ry="4" fill="#0ea5e9" />
            <ellipse cx="70" cy="88" rx="10" ry="3" fill="#0284c7" />
            <circle cx="55" cy="82" r="2" fill="white" opacity="0.5" />
            <circle cx="68" cy="84" r="2" fill="white" opacity="0.5" />
          </>
        )}
        
        {/* Hanging items */}
        <line x1="40" y1="50" x2="40" y2="65" stroke="#92400e" strokeWidth="1" />
        <ellipse cx="40" cy="70" rx="5" ry="8" fill={type === 'meat' ? '#dc2626' : '#0ea5e9'} />
        <line x1="100" y1="50" x2="100" y2="65" stroke="#92400e" strokeWidth="1" />
        <ellipse cx="100" cy="70" rx="5" ry="8" fill={type === 'meat' ? '#b91c1c' : '#0284c7'} />
      </svg>
    </motion.div>
  );
}

// Vendor Person SVG
function VendorPerson({ x, y, delay, type }: { x: string; y: number; delay: number; type: 'cutter' | 'shopkeeper' }) {
  const isCutter = type === 'cutter';
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="absolute z-20"
      style={{ left: x, bottom: y }}
    >
      <svg width="80" height="100" viewBox="0 0 80 100" className="drop-shadow-lg">
        {/* Shadow */}
        <ellipse cx="40" cy="95" rx="25" ry="4" fill="rgba(0,0,0,0.3)" />
        
        {/* Body */}
        <rect x="25" y="45" width="30" height="35" rx="5" fill={isCutter ? '#f97316' : '#10b981'} />
        {/* Apron */}
        <rect x="30" y="50" width="20" height="30" rx="2" fill="#f8fafc" opacity="0.9" />
        
        {/* Neck */}
        <rect x="35" y="38" width="10" height="10" fill="#fdba74" />
        
        {/* Head */}
        <circle cx="40" cy="28" r="15" fill="#fdba74" />
        
        {/* Hair */}
        <path d="M25 25 Q40 10 55 25" fill="#1e293b" />
        <path d="M25 25 L25 32 L55 32 L55 25" fill="#1e293b" />
        
        {/* Face features */}
        <circle cx="35" cy="28" r="1.5" fill="#1e293b" />
        <circle cx="45" cy="28" r="1.5" fill="#1e293b" />
        <path d="M37 33 Q40 36 43 33" stroke="#1e293b" strokeWidth="1" fill="none" />
        
        {/* Arms - different poses for cutter vs shopkeeper */}
        {isCutter ? (
          <>
            {/* Holding cleaver */}
            <path d="M25 55 L15 70" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <rect x="10" y="65" width="8" height="20" rx="2" fill="#64748b" transform="rotate(-30 14 75)" />
            <rect x="8" y="80" width="20" height="8" rx="2" fill="#94a3b8" transform="rotate(-30 18 84)" />
            {/* Other arm */}
            <path d="M55 55 L65 70" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <circle cx="68" cy="72" r="4" fill="#fdba74" />
          </>
        ) : (
          <>
            {/* Arms welcoming */}
            <path d="M25 55 L15 45" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <circle cx="12" cy="42" r="4" fill="#fdba74" />
            <path d="M55 55 L65 45" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" />
            <circle cx="68" cy="42" r="4" fill="#fdba74" />
          </>
        )}
        
        {/* Legs */}
        <path d="M32 80 L30 95" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
        <path d="M48 80 L50 95" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
        
        {/* Shoes */}
        <ellipse cx="28" cy="97" rx="8" ry="3" fill="#1e293b" />
        <ellipse cx="52" cy="97" rx="8" ry="3" fill="#1e293b" />
      </svg>
    </motion.div>
  );
}

// Customer SVG
function Customer({ x, y, delay, action }: { x: string; y: number; delay: number; action: 'waiting' | 'buying' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="absolute z-20"
      style={{ left: x, bottom: y }}
    >
      <svg width="60" height="90" viewBox="0 0 60 90" className="drop-shadow-lg">
        {/* Shadow */}
        <ellipse cx="30" cy="85" rx="20" ry="3" fill="rgba(0,0,0,0.3)" />
        
        {/* Body */}
        <rect x="18" y="40" width="24" height="32" rx="4" fill="#3b82f6" />
        
        {/* Head */}
        <circle cx="30" cy="25" r="12" fill="#8b5a2b" />
        
        {/* Hair */}
        <path d="M18 22 Q30 10 42 22" fill="#1e293b" />
        
        {/* Face */}
        <circle cx="26" cy="25" r="1.5" fill="#1e293b" />
        <circle cx="34" cy="25" r="1.5" fill="#1e293b" />
        <path d="M27 30 Q30 32 33 30" stroke="#1e293b" strokeWidth="1" fill="none" />
        
        {/* Arms */}
        <path d="M18 48 L10 60" stroke="#8b5a2b" strokeWidth="5" strokeLinecap="round" />
        {action === 'buying' && (
          <>
            <rect x="5" y="55" width="12" height="10" rx="2" fill="#10b981" />
            <circle cx="20" cy="75" r="3" fill="#f97316" />
          </>
        )}
        <path d="M42 48 L50 60" stroke="#8b5a2b" strokeWidth="5" strokeLinecap="round" />
        
        {/* Legs */}
        <path d="M24 72 L22 85" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        <path d="M36 72 L38 85" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
        
        {/* Shoes */}
        <ellipse cx="20" cy="87" rx="6" ry="2" fill="#1e293b" />
        <ellipse cx="40" cy="87" rx="6" ry="2" fill="#1e293b" />
      </svg>
    </motion.div>
  );
}

// Coconut Tree for Bangalore vibe
function CoconutTreeBangalore({ x, y }: { x: string; y: number }) {
  return (
    <motion.div
      animate={{ rotate: [-1, 1, -1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute opacity-60"
      style={{ left: x, bottom: y }}
    >
      <svg width="80" height="140" viewBox="0 0 80 140">
        {/* Trunk */}
        <path d="M38 140 Q42 100 40 60 Q38 40 45 20" stroke="#5c4033" strokeWidth="8" fill="none" />
        {/* Leaves */}
        <path d="M45 20 Q20 10 10 30" stroke="#15803d" strokeWidth="3" fill="none" />
        <path d="M45 20 Q70 10 75 25" stroke="#15803d" strokeWidth="3" fill="none" />
        <path d="M45 20 Q25 5 20 25" stroke="#16a34a" strokeWidth="3" fill="none" />
        <path d="M45 20 Q65 5 70 20" stroke="#16a34a" strokeWidth="3" fill="none" />
        <path d="M45 15 Q45 0 40 5" stroke="#22c55e" strokeWidth="3" fill="none" />
        {/* Coconuts */}
        <circle cx="42" cy="30" r="4" fill="#3f6212" />
        <circle cx="50" cy="35" r="4" fill="#3f6212" />
      </svg>
    </motion.div>
  );
}

// Auto Rickshaw
function BangaloreAuto({ delay, y }: { delay: number; y: number }) {
  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: '100vw' }}
      transition={{
        duration: 25,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute z-10"
      style={{ bottom: y }}
    >
      <svg width="70" height="50" viewBox="0 0 70 50">
        {/* Auto body */}
        <path d="M5 25 L10 15 L50 15 L60 25 L60 40 L10 40 Z" fill="#f59e0b" />
        {/* Windshield */}
        <path d="M12 18 L48 18 L55 25 L8 25 Z" fill="#1e293b" opacity="0.7" />
        {/* Driver */}
        <circle cx="25" cy="22" r="4" fill="#8b5a2b" />
        {/* Wheels */}
        <circle cx="18" cy="42" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <circle cx="52" cy="42" r="7" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        {/* Auto sign */}
        <rect x="20" y="8" width="20" height="7" rx="2" fill="#1e293b" />
        <text x="30" y="13" textAnchor="middle" fill="#fbbf24" fontSize="5" fontWeight="bold">AUTO</text>
        {/* Headlights */}
        <circle cx="58" cy="32" r="3" fill="#fef3c7" opacity="0.8" />
      </svg>
    </motion.div>
  );
}

export default function VendorHeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Evening sky - Bangalore market vibes */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Distant Bangalore skyline */}
      <div className="absolute bottom-40 left-0 right-0 h-32 opacity-20">
        <svg viewBox="0 0 1440 128" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0 128 L0 80 L40 80 L40 60 L80 60 L80 40 L120 40 L120 70 L160 70 L160 128 Z" fill="#64748b" />
          <path d="M200 128 L200 50 L240 30 L280 50 L280 128 Z" fill="#475569" />
          <path d="M320 128 L320 70 L380 50 L440 70 L440 128 Z" fill="#64748b" />
          <path d="M500 128 L500 40 L550 20 L600 40 L600 128 Z" fill="#475569" />
          <path d="M700 128 L700 60 L760 60 L760 128 Z" fill="#64748b" />
          <path d="M850 128 L850 45 L920 25 L990 45 L990 128 Z" fill="#475569" />
          <path d="M1100 128 L1100 55 L1160 35 L1220 55 L1220 128 Z" fill="#64748b" />
          <path d="M1300 128 L1300 70 L1340 50 L1380 70 L1380 128 Z" fill="#475569" />
        </svg>
      </div>

      {/* Coconut trees */}
      <CoconutTreeBangalore x="5%" y={100} />
      <CoconutTreeBangalore x="85%" y={120} />
      <CoconutTreeBangalore x="70%" y={90} />

      {/* Market ground */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-800 to-slate-700">
        {/* Market pavement pattern */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white/30"
              style={{
                bottom: `${(i % 5) * 25}px`,
                left: 0,
                right: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Street Lights */}
      <div className="absolute bottom-32 left-[20%]">
        <div className="w-0.5 h-28 bg-slate-600" />
        <div className="absolute -top-1 -left-2 w-4 h-2 bg-yellow-200 rounded-full blur-md animate-pulse" />
        <div className="absolute top-0 -left-1.5 w-3 h-1.5 bg-yellow-300 rounded-full" />
      </div>
      <div className="absolute bottom-32 right-[25%]">
        <div className="w-0.5 h-28 bg-slate-600" />
        <div className="absolute -top-1 -left-2 w-4 h-2 bg-yellow-200 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Vendor Shops */}
      <VendorShop x="15%" type="meat" delay={0.2} />
      <VendorShop x="45%" type="fish" delay={0.4} />
      <VendorShop x="75%" type="meat" delay={0.6} />

      {/* Vendor People */}
      <VendorPerson x="18%" y={60} delay={0.5} type="cutter" />
      <VendorPerson x="48%" y={60} delay={0.7} type="shopkeeper" />
      <VendorPerson x="78%" y={60} delay={0.9} type="cutter" />

      {/* Customers */}
      <Customer x="28%" y={55} delay={1} action="buying" />
      <Customer x="58%" y={55} delay={1.2} action="waiting" />
      <Customer x="88%" y={55} delay={1.4} action="buying" />

      {/* Auto rickshaws passing by */}
      <BangaloreAuto delay={0} y={20} />
      <BangaloreAuto delay={15} y={35} />

      {/* Market activity particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 5,
              repeat: Infinity,
            }}
            style={{
              left: `${10 + Math.random() * 80}%`,
              bottom: `${40 + Math.random() * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40 pointer-events-none" />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bike, ShoppingBag, MapPin, Building2, TreePine, Cloud } from 'lucide-react';

// Bangalore City Skyline SVG
function CitySkyline() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 opacity-30">
      <svg viewBox="0 0 1440 200" className="w-full h-full" preserveAspectRatio="none">
        {/* Vidhana Soudha inspired building */}
        <path d="M50,200 L50,120 L70,120 L70,100 L90,100 L90,80 L110,80 L110,60 L130,60 L130,80 L150,80 L150,100 L170,100 L170,120 L190,120 L190,200 Z" 
              fill="rgba(16,185,129,0.3)" />
        {/* UB City / Modern towers */}
        <path d="M250,200 L250,60 L280,40 L310,60 L310,200 Z" 
              fill="rgba(6,182,212,0.3)" />
        <path d="M320,200 L320,80 L340,70 L360,80 L360,200 Z" 
              fill="rgba(6,182,212,0.2)" />
        {/* IT parks */}
        <path d="M450,200 L450,90 L550,90 L550,200 Z" 
              fill="rgba(16,185,129,0.25)" />
        {/* MG Road area buildings */}
        <path d="M600,200 L600,70 L620,70 L620,50 L640,50 L640,70 L660,70 L660,200 Z" 
              fill="rgba(249,115,22,0.2)" />
        <path d="M700,200 L700,100 L750,100 L750,200 Z" 
              fill="rgba(16,185,129,0.2)" />
        {/* Koramangala/HSR tech hub */}
        <path d="M850,200 L850,55 L900,35 L950,55 L950,200 Z" 
              fill="rgba(6,182,212,0.25)" />
        {/* Residency Road style */}
        <path d="M1000,200 L1000,85 L1040,65 L1080,85 L1080,200 Z" 
              fill="rgba(249,115,22,0.2)" />
        {/* Manyata Tech Park style */}
        <path d="M1150,200 L1150,75 L1200,50 L1250,75 L1250,200 Z" 
              fill="rgba(16,185,129,0.3)" />
        {/* Apartments */}
        <path d="M1300,200 L1300,110 L1330,110 L1330,90 L1360,90 L1360,110 L1390,110 L1390,200 Z" 
              fill="rgba(6,182,212,0.2)" />
      </svg>
    </div>
  );
}

// Delivery Boy on Bike
function DeliveryBoy({ delay, direction = 'left', y, color }: { delay: number; direction?: 'left' | 'right'; y: number; color: string }) {
  const isLeft = direction === 'left';
  
  return (
    <motion.div
      initial={{ x: isLeft ? -200 : '100vw', y }}
      animate={{ x: isLeft ? '100vw' : -200 }}
      transition={{
        duration: 15 + Math.random() * 5,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute z-20"
      style={{ y }}
    >
      <div className="flex items-center gap-1">
        {/* Delivery Person */}
        <div className="relative">
          {/* Backpack with Fleish bag */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-3 h-3 text-white" />
          </div>
          
          {/* Person on bike */}
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <div className={`w-4 h-6 rounded ${color} opacity-80`} />
            <div className="flex items-center gap-0.5 mt-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border-2 border-slate-600 rounded-full border-t-slate-400"
              />
              <div className={`w-8 h-1 ${color} rounded`} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
                className="w-3 h-3 border-2 border-slate-600 rounded-full border-t-slate-400"
              />
            </div>
          </div>
        </div>
        
        {/* Delivery box with glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/30 blur-md rounded-lg" />
          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-1 shadow-lg">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Auto Rickshaw
function AutoRickshaw({ delay, y }: { delay: number; y: number }) {
  return (
    <motion.div
      initial={{ x: -150 }}
      animate={{ x: '100vw' }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
      className="absolute z-10"
      style={{ y }}
    >
      <div className="relative">
        {/* Auto body */}
        <div className="w-12 h-8 bg-amber-500 rounded-lg relative">
          {/* Windows */}
          <div className="absolute top-1 left-1 right-1 h-3 bg-slate-800/50 rounded" />
          {/* Driver */}
          <div className="absolute top-2 left-2 w-2 h-2 bg-slate-700 rounded-full" />
        </div>
        {/* Wheels */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1 left-1 w-3 h-3 bg-slate-700 rounded-full border border-slate-500"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1 right-1 w-3 h-3 bg-slate-700 rounded-full border border-slate-500"
        />
      </div>
    </motion.div>
  );
}

// Street Light
function StreetLight({ x }: { x: string }) {
  return (
    <div className="absolute bottom-32" style={{ left: x }}>
      <div className="w-0.5 h-24 bg-gradient-to-t from-slate-700 to-slate-600" />
      <div className="absolute -top-1 -left-3 w-6 h-3 bg-yellow-200 rounded-full blur-md animate-pulse" />
      <div className="absolute top-0 -left-2 w-4 h-2 bg-yellow-300 rounded-full" />
      {/* Light cone */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-b from-yellow-200/10 to-transparent rounded-full blur-xl" />
    </div>
  );
}

// Coconut Tree (iconic Bangalore)
function CoconutTree({ x, y }: { x: string; y: number }) {
  return (
    <motion.div 
      className="absolute opacity-40"
      style={{ left: x, bottom: y }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <TreePine className="w-16 h-24 text-emerald-700" strokeWidth={1} />
    </motion.div>
  );
}

// Cloud
function FloatingCloud({ x, y, delay }: { x: string; y: number; delay: number }) {
  return (
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: [0, 30, 0] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute opacity-20"
      style={{ left: x, top: y }}
    >
      <Cloud className="w-24 h-12 text-white" />
    </motion.div>
  );
}

export default function PartnerHeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Gradient sky - Bangalore evening */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
      
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${10 + Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Floating clouds */}
      <FloatingCloud x="10%" y={50} delay={0} />
      <FloatingCloud x="60%" y={80} delay={2} />
      <FloatingCloud x="80%" y={40} delay={4} />

      {/* City Skyline */}
      <CitySkyline />

      {/* Coconut Trees */}
      <CoconutTree x="5%" y={140} />
      <CoconutTree x="25%" y={160} />
      <CoconutTree x="75%" y={150} />
      <CoconutTree x="90%" y={170} />

      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800 to-slate-700">
        {/* Road markings */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-full w-8 bg-yellow-400/30"
              style={{ left: `${i * 5}%` }}
            />
          ))}
        </div>
      </div>

      {/* Street Lights */}
      <StreetLight x="15%" />
      <StreetLight x="50%" />
      <StreetLight x="85%" />

      {/* Delivery Boys on Bikes - Layer 1 (closer) */}
      <div className="absolute bottom-16 left-0 right-0">
        <DeliveryBoy delay={0} y={0} direction="right" color="bg-cyan-500" />
        <DeliveryBoy delay={4} y={10} direction="left" color="bg-emerald-500" />
        <DeliveryBoy delay={8} y={-5} direction="right" color="bg-orange-500" />
      </div>

      {/* Delivery Boys on Bikes - Layer 2 (farther) */}
      <div className="absolute bottom-24 left-0 right-0 opacity-60 scale-75">
        <DeliveryBoy delay={2} y={5} direction="left" color="bg-slate-400" />
        <DeliveryBoy delay={6} y={-5} direction="right" color="bg-slate-500" />
        <DeliveryBoy delay={10} y={8} direction="left" color="bg-slate-400" />
      </div>

      {/* Auto Rickshaws */}
      <div className="absolute bottom-20 left-0 right-0">
        <AutoRickshaw delay={1} y={0} />
        <AutoRickshaw delay={12} y={15} />
      </div>

      {/* Map pins showing delivery locations */}
      <motion.div
        animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-40 left-[20%]"
      >
        <div className="relative">
          <MapPin className="w-6 h-6 text-emerald-400 drop-shadow-lg" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
        className="absolute bottom-36 left-[60%]"
      >
        <div className="relative">
          <MapPin className="w-6 h-6 text-cyan-400 drop-shadow-lg" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        className="absolute bottom-44 left-[80%]"
      >
        <div className="relative">
          <MapPin className="w-6 h-6 text-orange-400 drop-shadow-lg" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </motion.div>

      {/* Building icons */}
      <div className="absolute bottom-32 left-[40%] opacity-30">
        <Building2 className="w-8 h-8 text-slate-500" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none" />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

const PROMOS = [
  {
    id: 1,
    icon: Sparkles,
    text: "New User Offer: Get 50% OFF your first 3 orders! Use code: WELCOME50",
    link: "/#pricing",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    icon: Zap,
    text: "Flash Sale: Subscribe to Pro & get 2 months FREE! Limited time offer",
    link: "/#pricing",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 3,
    icon: Sparkles,
    text: "Become a Vendor: 0% commission for first 3 months! Start selling today",
    link: "/vendor",
    color: "from-emerald-500 to-cyan-500",
  },
];

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Clear previous session on mount to show banner again
    sessionStorage.removeItem('promoBannerDismissed');
    setIsDismissed(false);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isDismissed) return;
    
    // Rotate promos every 8 seconds
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % PROMOS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('promoBannerDismissed', 'true');
  };

  if (isDismissed) return null;

  const promo = PROMOS[currentPromo];
  const Icon = promo.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[60]"
        >
          <div className={`bg-gradient-to-r ${promo.color} text-white py-2.5 px-4 relative overflow-hidden shadow-lg`}>
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                animation: 'shimmer 20s linear infinite',
              }} />
            </div>
            
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10">
              <motion.div
                key={currentPromo}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <Icon className="w-5 h-5 animate-pulse" />
                <p className="text-sm font-semibold">
                  {promo.text}
                </p>
                <Link 
                  href={promo.link}
                  className="flex items-center gap-1 text-sm font-bold underline underline-offset-2 hover:no-underline whitespace-nowrap"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-white/20 transition-colors ml-4"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

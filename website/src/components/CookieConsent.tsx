"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield, Info } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[450px] z-50"
      >
        <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1 flex items-center gap-2">
                Cookie Preferences
                <Shield className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                We use cookies to enhance your experience, analyze site traffic, and serve personalized content. 
                Read our{" "}
                <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>.
              </p>
              
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 mb-3 text-sm"
                >
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">Essential</span>
                    </div>
                    <span className="text-xs text-emerald-400">Always on</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">Analytics</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-white/20" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-300">Marketing</span>
                    </div>
                    <input type="checkbox" className="rounded border-white/20" />
                  </div>
                </motion.div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 bg-white/5 text-slate-300 text-sm font-bold rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  Decline
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-3 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

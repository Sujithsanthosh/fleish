"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const scrollProgress = (scrollPosition / totalHeight) * 100;
      setProgress(scrollProgress);
      setShowBackToTop(scrollPosition > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Back to Top Button with Circular Progress */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 left-6 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center group hover:border-emerald-500/30 transition-all"
          >
            {/* Circular Progress SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
              {/* Background circle */}
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <circle
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-100"
              />
            </svg>
            <ArrowUp className="w-5 h-5 text-emerald-400 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

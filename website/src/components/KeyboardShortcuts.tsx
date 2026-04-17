"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Command, Search, ArrowUp, HelpCircle, MessageSquare, Home, Briefcase, Store, Truck } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  icon: React.ReactNode;
  action?: () => void;
}

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const openCommandPalette = useCallback(() => {
    setIsCommandOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, []);

  const SHORTCUTS: Shortcut[] = [
    { key: '⌘ K', description: 'Open Command Palette', icon: <Search className="w-4 h-4" />, action: openCommandPalette },
    { key: '/', description: 'Focus Search', icon: <Search className="w-4 h-4" />, action: focusSearch },
    { key: '⌘ H', description: 'Go to Home', icon: <Home className="w-4 h-4" />, action: () => router.push('/') },
    { key: '⌘ J', description: 'View Jobs', icon: <Briefcase className="w-4 h-4" />, action: () => router.push('/jobs') },
    { key: '⌘ V', description: 'Become a Vendor', icon: <Store className="w-4 h-4" />, action: () => router.push('/vendor') },
    { key: '⌘ D', description: 'Delivery Partner', icon: <Truck className="w-4 h-4" />, action: () => router.push('/partner') },
    { key: 'C', description: 'Open Live Chat', icon: <MessageSquare className="w-4 h-4" />, action: toggleChat },
    { key: '?', description: 'Show Help', icon: <HelpCircle className="w-4 h-4" />, action: () => setIsOpen(true) },
    { key: '↑', description: 'Scroll to Top', icon: <ArrowUp className="w-4 h-4" />, action: scrollToTop },
    { key: 'ESC', description: 'Close/Cancel', icon: <X className="w-4 h-4" />, action: () => setIsOpen(false) },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName);
    const isCmdOrCtrl = e.metaKey || e.ctrlKey;

    // Command Palette - ⌘ K
    if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openCommandPalette();
      return;
    }

    // Navigation shortcuts - only work when not in input
    if (!isInput) {
      // Go Home - ⌘ H
      if (isCmdOrCtrl && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        router.push('/');
        return;
      }

      // View Jobs - ⌘ J
      if (isCmdOrCtrl && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        router.push('/jobs');
        return;
      }

      // Become Vendor - ⌘ V
      if (isCmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        router.push('/vendor');
        return;
      }

      // Delivery Partner - ⌘ D
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        router.push('/partner');
        return;
      }

      // Focus Search - /
      if (e.key === '/') {
        e.preventDefault();
        focusSearch();
        return;
      }

      // Open Live Chat - C
      if (e.key.toLowerCase() === 'c' && !e.repeat) {
        toggleChat();
        return;
      }

      // Scroll to Top - ↑
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToTop();
        return;
      }

      // Show Help - ?
      if (e.key === '?') {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
    }

    // Close on Escape - works everywhere
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsCommandOpen(false);
      return;
    }
  }, [router, openCommandPalette, toggleChat, scrollToTop, focusSearch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-24 z-40 w-10 h-10 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all hidden md:flex"
        title="Keyboard Shortcuts (?)"
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                    <Keyboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Keyboard Shortcuts</h3>
                    <p className="text-sm text-slate-400">Work faster with these shortcuts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Shortcuts Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHORTCUTS.map((shortcut, index) => (
                    <motion.button
                      key={shortcut.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        shortcut.action?.();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400">
                        {shortcut.icon}
                      </div>
                      <span className="flex-1 text-sm text-slate-300">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-white/10 rounded-lg text-xs font-mono text-white border border-white/20">
                        {shortcut.key}
                      </kbd>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-center">
                <p className="text-sm text-slate-400">
                  Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs mx-1">?</kbd> anytime to show this help
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles, Home, Briefcase, Store, Truck, Phone, Info, Star, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Command {
  id: string;
  title: string;
  shortcut?: string;
  icon: React.ReactNode;
  href: string;
  category: string;
}

const COMMANDS: Command[] = [
  { id: '1', title: 'Go to Home', shortcut: '⌘H', icon: <Home className="w-4 h-4" />, href: '/', category: 'Navigation' },
  { id: '2', title: 'View Jobs', shortcut: '⌘J', icon: <Briefcase className="w-4 h-4" />, href: '/jobs', category: 'Navigation' },
  { id: '3', title: 'Become a Vendor', shortcut: '⌘V', icon: <Store className="w-4 h-4" />, href: '/vendor', category: 'Navigation' },
  { id: '4', title: 'Delivery Partner', shortcut: '⌘D', icon: <Truck className="w-4 h-4" />, href: '/partner', category: 'Navigation' },
  { id: '5', title: 'Contact Support', shortcut: '⌘C', icon: <Phone className="w-4 h-4" />, href: '#', category: 'Actions' },
  { id: '6', title: 'About Us', icon: <Info className="w-4 h-4" />, href: '#about', category: 'Pages' },
  { id: '7', title: 'Pricing Plans', icon: <DollarSign className="w-4 h-4" />, href: '#pricing', category: 'Pages' },
  { id: '8', title: 'Customer Reviews', icon: <Star className="w-4 h-4" />, href: '#testimonials', category: 'Pages' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = COMMANDS.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Open with Cmd/Ctrl + K
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
    // Close with Escape
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    // Navigation
    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          window.location.href = selected.href;
          setIsOpen(false);
        }
      }
    }
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <>
      {/* Keyboard Shortcut Hint */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-slate-400 hover:text-white transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Quick search...</span>
        <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-32 p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commands, pages, or actions..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-lg"
                  autoFocus
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center">
                    <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No commands found</p>
                    <p className="text-sm text-slate-600 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, commands]) => (
                    <div key={category} className="mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-2">
                        {category}
                      </p>
                      {commands.map((cmd, index) => {
                        const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <Link
                            key={cmd.id}
                            href={cmd.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                              isSelected
                                ? 'bg-emerald-500/20 border border-emerald-500/30'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                            }`}>
                              {cmd.icon}
                            </div>
                            <span className={`flex-1 font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                              {cmd.title}
                            </span>
                            {cmd.shortcut && (
                              <kbd className="px-2 py-1 bg-white/5 rounded text-xs text-slate-500">
                                {cmd.shortcut}
                              </kbd>
                            )}
                            {isSelected && <ArrowRight className="w-4 h-4 text-emerald-400" />}
                          </Link>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-white/10 bg-white/5 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">esc</kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

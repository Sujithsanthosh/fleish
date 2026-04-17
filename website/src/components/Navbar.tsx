"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Zap, Home, Info, HelpCircle, Layers,
  Tag, Phone, ArrowRight, UserPlus, Briefcase, Store, ShoppingCart
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/#about', icon: Info },
  { label: 'How', href: '/#how-it-works', icon: HelpCircle },
  { label: 'Eco', href: '/#ecosystem', icon: Layers },
  { label: 'Price', href: '/#pricing', icon: Tag },
  { label: 'Contact', href: '/#contact', icon: Phone },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;
          const scrollingUp = currentScrollY < lastScrollY;

          // Hide navbar when scrolling down (after 100px)
          if (scrollingDown && currentScrollY > 100) {
            setVisible(false);
          }
          // Show navbar when scrolling up
          else if (scrollingUp) {
            setVisible(true);
          }

          // Update scrolled state for background
          setScrolled(currentScrollY > 50);

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: visible ? 0 : -120 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-11 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong shadow-2xl shadow-black/20' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all group-hover:scale-105">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black tracking-tight text-white">Fleish</span>
              <span className="block text-[10px] text-emerald-400 uppercase tracking-wider -mt-0.5">Fresh Delivery</span>
            </div>
          </Link>

          {/* Desktop Navigation - Beautiful Pills */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = activeLink === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setActiveLink(link.href)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 whitespace-nowrap ${isActive
                        ? 'text-white bg-emerald-500/20 shadow-lg shadow-emerald-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-emerald-500/10 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/store"
              className="group flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white hover:border-emerald-500/30 transition-all hover:scale-105"
              title="Find Fish & Meat Stores"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stores</span>
            </Link>
            <Link
              href="/partner"
              className="group flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Join</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              id="navbar-cart-btn"
              className="hidden group flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 ml-2"
            >
              <div className="relative">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span id="navbar-cart-count" className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white text-emerald-600 text-[8px] font-bold rounded-full flex items-center justify-center hidden">0</span>
              </div>
              <span className="hidden sm:inline" id="navbar-cart-total">₹0</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-gradient-to-b from-black/98 to-slate-900/98 backdrop-blur-2xl pt-32 px-4 lg:hidden"
          >
            <div className="max-w-sm mx-auto">
              {/* Navigation Links */}
              <div className="space-y-1 mb-6">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-center gap-4 px-4 py-4 text-lg font-bold text-white hover:text-emerald-400 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 transition-all">
                          <Icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="flex-1">{link.label}</span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 pt-4 border-t border-white/10"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold px-4">Join Our Platform</p>
                <Link
                  href="/store"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all"
                >
                  <Store className="w-4 h-4" />
                  Find Stores
                </Link>
                <Link
                  href="/partner"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Partner With Us
                </Link>
                <Link
                  href="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Briefcase className="w-4 h-4" />
                  Join Our Team
                </Link>
                <Link
                  href="/vendor"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Become a Vendor
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

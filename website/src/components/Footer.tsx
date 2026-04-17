"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin, ExternalLink, MessageCircle, Link2, Camera, Send, ArrowRight } from 'lucide-react';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 mb-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-black text-white mb-2">Stay in the Loop</h3>
          <p className="text-slate-400">Get exclusive offers, new vendor announcements, and delivery updates.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary !py-4 !px-6 flex items-center gap-2 whitespace-nowrap"
          >
            {submitted ? 'Subscribed!' : 'Subscribe'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-black/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <NewsletterSignup />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white">Fleish</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              India&apos;s most advanced hyperlocal meat delivery ecosystem. Built with precision engineering.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Platform</h4>
            <div className="space-y-3">
              <Link href="/#about" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">About Us</Link>
              <Link href="/#how-it-works" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">How It Works</Link>
              <Link href="/#ecosystem" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Ecosystem</Link>
              <Link href="/#features" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Features</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Join Us</h4>
            <div className="space-y-3">
              <Link href="/vendor" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Become a Vendor</Link>
              <Link href="/partner" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Become a Delivery Partner</Link>
              <Link href="/jobs" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Careers</Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:support@Fleish.in" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                <Mail className="w-4 h-4" /> support@Fleish.in
              </a>
              <a href="tel:+917619419900" className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                <Phone className="w-4 h-4" /> +91 76194 19900
              </a>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4" /> Bangalore, India
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">&copy; {new Date().getFullYear()} Fleish Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[MessageCircle, Camera, Link2, ExternalLink].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

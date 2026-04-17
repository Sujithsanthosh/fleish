"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, Users, Leaf, Truck, Star, BadgeCheck, Lock, Headphones } from 'lucide-react';

const trustItems = [
  { icon: Shield, label: "FSSAI Certified", color: "emerald" },
  { icon: Award, label: "ISO 22000", color: "orange" },
  { icon: Clock, label: "24/7 Support", color: "cyan" },
  { icon: Users, label: "50K+ Happy Customers", color: "violet" },
  { icon: Leaf, label: "Sustainable Sourcing", color: "emerald" },
  { icon: Truck, label: "Cold Chain Verified", color: "cyan" },
  { icon: Star, label: "4.9 App Rating", color: "amber" },
  { icon: BadgeCheck, label: "Quality Assured", color: "emerald" },
  { icon: Lock, label: "Secure Payments", color: "violet" },
  { icon: Headphones, label: "Live Chat Support", color: "cyan" },
];

export default function TrustBadges() {
  return (
    <section className="section-padding relative overflow-hidden py-16">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Trusted By</p>
          <h3 className="text-2xl font-bold text-white">Industry Leaders & Thousands of Customers</h3>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050508] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050508] to-transparent z-10" />
          
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...trustItems, ...trustItems].map((item, i) => {
              const colors: Record<string, string> = {
                emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
                orange: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
                cyan: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
                violet: 'text-violet-400 border-violet-500/20 bg-violet-500/5',
                amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
              };
              
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border mx-3 ${colors[item.color]} shrink-0 glass-card cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-${item.color}-500/10`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Partner logos row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
          {['Paytm', 'Google Pay', 'PhonePe', 'Razorpay', 'Stripe'].map((partner, i) => (
            <motion.div
              key={partner}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card rounded-xl p-6 flex items-center justify-center h-16 group cursor-pointer"
            >
              <span className="text-lg font-bold text-slate-400 group-hover:text-white transition-colors">{partner}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

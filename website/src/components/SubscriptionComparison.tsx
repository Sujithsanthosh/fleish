"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, ArrowRight, Crown, Sparkles, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const features = [
  { name: "Free Delivery", free: false, basic: "Above ₹199", pro: "All Orders", tooltip: "Delivery fee waived based on order value" },
  { name: "Order Discount", free: "0%", basic: "5%", pro: "10%", tooltip: "Instant discount on every order" },
  { name: "Delivery Time", free: "Standard", basic: "Priority", pro: "Express", tooltip: "Faster processing for higher tiers" },
  { name: "Customer Support", free: "Standard", basic: "Priority", pro: "Premium 24/7", tooltip: "Response time and support channels" },
  { name: "Family Sharing", free: false, basic: false, pro: "4 Members", tooltip: "Share benefits with family" },
  { name: "Exclusive Deals", free: false, basic: "Limited", pro: "Full Access", tooltip: "Member-only special offers" },
  { name: "Surge Pricing", free: "Yes", basic: "Weekdays Only", pro: "Never", tooltip: "Extra fees during peak hours" },
  { name: "Order History", free: "30 Days", basic: "6 Months", pro: "Unlimited", tooltip: "How long order records are kept" },
  { name: "Reward Points", free: "Standard", basic: "1.5x", pro: "2x", tooltip: "Points earned per order" },
  { name: "Early Access", free: false, basic: "Offers Only", pro: "Vendors + Offers", tooltip: "Early access to new features" },
  { name: "Birthday Specials", free: false, basic: true, pro: true, tooltip: "Special discounts during birthday month" },
  { name: "Vendor Direct Chat", free: false, basic: false, pro: true, tooltip: "Direct messaging with vendors" },
];

export default function SubscriptionComparison() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = (plan: string) => {
    router.push(`/payment?plan=${plan.toLowerCase()}&billing=monthly`);
  };

  const renderValue = (value: boolean | string, plan: string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-slate-600 mx-auto" />
      );
    }
    return (
      <span className={`font-semibold ${
        plan === 'pro' ? 'text-orange-400' : 
        plan === 'basic' ? 'text-cyan-400' : 
        'text-slate-400'
      }`}>
        {value}
      </span>
    );
  };

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Compare Plans</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Find Your Perfect <span className="text-gradient">Fit</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Detailed comparison of all subscription benefits
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 border-b border-white/10">
            <div className="p-6 flex items-end">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Features</span>
            </div>
            <div className="p-6 text-center bg-emerald-500/5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white">Free</h3>
              <p className="text-2xl font-bold text-emerald-400">₹0</p>
            </div>
            <div className="p-6 text-center bg-cyan-500/5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/20">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white">Basic</h3>
              <p className="text-2xl font-bold text-cyan-400">₹99<span className="text-sm font-normal text-slate-400">/mo</span></p>
            </div>
            <div className="p-6 text-center bg-gradient-to-b from-orange-500/10 to-transparent relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
              <div className="mb-3 inline-flex px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-xs font-bold text-white shadow-lg shadow-orange-500/25">
                POPULAR
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white">Pro</h3>
              <p className="text-2xl font-bold text-orange-400">₹199<span className="text-sm font-normal text-slate-400">/mo</span></p>
            </div>
          </div>

          {/* Features */}
          {features.map((feature, i) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`grid grid-cols-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                i % 2 === 0 ? 'bg-white/[0.02]' : ''
              }`}
              onMouseEnter={() => setHoveredFeature(feature.name)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="p-4 flex items-center gap-2">
                <span className="text-sm font-medium text-slate-300">{feature.name}</span>
                <div className="relative group">
                  <HelpCircle className="w-4 h-4 text-slate-600 cursor-help" />
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 w-48 p-2 bg-slate-800 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-white/10">
                    {feature.tooltip}
                  </div>
                </div>
              </div>
              <div className="p-4 text-center flex items-center justify-center bg-emerald-500/[0.02]">
                {renderValue(feature.free, 'free')}
              </div>
              <div className="p-4 text-center flex items-center justify-center bg-cyan-500/[0.02]">
                {renderValue(feature.basic, 'basic')}
              </div>
              <div className="p-4 text-center flex items-center justify-center bg-orange-500/[0.02]">
                {renderValue(feature.pro, 'pro')}
              </div>
            </motion.div>
          ))}

          {/* CTA Row */}
          <div className="grid grid-cols-4">
            <div className="p-6" />
            <div className="p-6 flex items-center justify-center bg-emerald-500/[0.02]">
              <button 
                onClick={() => handleSubscribe('free')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 ${
                  selectedPlan === 'free'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white/10 text-white hover:bg-emerald-500/20'
                }`}
              >
                Choose Free
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-cyan-500/[0.02]">
              <button 
                onClick={() => handleSubscribe('basic')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 ${
                  selectedPlan === 'basic'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                    : 'bg-white/10 text-white hover:bg-cyan-500/20'
                }`}
              >
                Choose Basic
              </button>
            </div>
            <div className="p-6 flex items-center justify-center bg-orange-500/[0.02]">
              <button 
                onClick={() => handleSubscribe('pro')}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 ${
                  selectedPlan === 'pro'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl'
                }`}
              >
                Get Pro <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400">
            All plans include: Secure payments, FSSAI-certified vendors, Real-time tracking, 24/7 support
          </p>
        </motion.div>
      </div>
    </section>
  );
}

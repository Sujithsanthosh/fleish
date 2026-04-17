"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
  tier: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  color: string;
  onSubscribe: () => void;
}

function PricingCard({ tier, price, period, description, features, popular, cta, color, onSubscribe }: PricingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const colors: Record<string, { gradient: string; shadow: string; icon: string }> = {
    emerald: {
      gradient: 'from-emerald-500 to-emerald-700',
      shadow: 'shadow-emerald-500/20',
      icon: 'text-emerald-400',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-700',
      shadow: 'shadow-orange-500/20',
      icon: 'text-orange-400',
    },
    cyan: {
      gradient: 'from-cyan-500 to-cyan-700',
      shadow: 'shadow-cyan-500/20',
      icon: 'text-cyan-400',
    },
    violet: {
      gradient: 'from-violet-500 to-violet-700',
      shadow: 'shadow-violet-500/20',
      icon: 'text-violet-400',
    },
  };

  const colorStyle = colors[color as keyof typeof colors];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.1s ease-out',
      }}
      className={`relative rounded-3xl p-8 ${
        popular 
          ? 'bg-gradient-to-b from-emerald-500/10 to-emerald-500/5 border-2 border-emerald-500/30' 
          : 'glass-card border border-white/10'
      }`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${colorStyle.gradient} text-white text-xs font-bold shadow-lg ${colorStyle.shadow}`}>
            Most Popular
          </div>
        </div>
      )}

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, ${color === 'emerald' ? 'rgba(16, 185, 129, 0.15)' : color === 'orange' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(139, 92, 246, 0.15)'}, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorStyle.gradient} flex items-center justify-center shadow-lg ${colorStyle.shadow}`}>
            {popular ? <Crown className="w-6 h-6 text-white" /> : color === 'orange' ? <Zap className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h3 className="text-xl font-black text-white">{tier}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-white">{price}</span>
            <span className="text-slate-400">/{period}</span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${colorStyle.gradient} flex items-center justify-center shrink-0`}>
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button 
          onClick={onSubscribe}
          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group ${
            popular 
              ? `bg-gradient-to-r ${colorStyle.gradient} text-white shadow-lg ${colorStyle.shadow} hover:shadow-xl hover:scale-[1.02]` 
              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-[1.02]'
          }`}>
          {cta}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  // Calculate prices based on billing period
  const getPrice = (basePrice: number) => {
    if (billingPeriod === 'yearly') {
      // 20% discount applied
      const yearlyPrice = Math.round(basePrice * 0.8 * 12);
      return `₹${yearlyPrice}`;
    }
    return `₹${basePrice}`;
  };

  const getPeriod = () => {
    return billingPeriod === 'yearly' ? 'year' : 'month';
  };

  const handleSubscribe = (plan: string) => {
    router.push(`/payment?plan=${plan.toLowerCase()}&billing=${billingPeriod}`);
  };

  // Actual plans from database subscription_plans table
  const plans = [
    {
      tier: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for trying out",
      features: [
        "Standard delivery charges apply",
        "Basic order tracking",
        "Customer support access",
        "All vendor access",
        "Secure payment options",
        "Real-time notifications",
      ],
      cta: "Get Started",
      color: "emerald",
    },
    {
      tier: "Basic",
      price: getPrice(99),
      period: getPeriod(),
      description: "For regular customers",
      features: [
        "Free delivery on orders above ₹199",
        "5% discount on every order",
        "Priority customer support",
        "Early access to special offers",
        "Birthday month specials",
        "No surge pricing on weekends",
        "Extended order history",
      ],
      color: "cyan",
      cta: "Subscribe Basic",
    },
    {
      tier: "Pro",
      price: getPrice(199),
      period: getPeriod(),
      description: "Best value for food lovers",
      features: [
        "Free delivery on ALL orders",
        "10% discount on every order",
        "Priority order processing",
        "Exclusive member-only deals",
        "Premium 24/7 customer support",
        "No surge pricing ever",
        "Family sharing (up to 4 members)",
        "VIP access to new vendors",
        "Double reward points",
      ],
      popular: true,
      cta: "Upgrade to Pro",
      color: "orange",
    },
  ];

  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      {/* Background effects */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px]" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="glass-card rounded-full p-1 flex gap-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                billingPeriod === 'monthly' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {plans.map((plan, i) => (
              <PricingCard 
                key={plan.tier + billingPeriod} 
                {...plan} 
                onSubscribe={() => handleSubscribe(plan.tier)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Need a custom solution?</h3>
          <p className="text-slate-400 mb-6">Contact our sales team for enterprise pricing tailored to your organization&apos;s needs.</p>
          <button 
            onClick={() => window.location.href = 'mailto:sales@fleish.com?subject=Sales Inquiry'}
            className="btn-primary inline-flex items-center gap-2 cursor-pointer"
          >
            Contact Sales Team <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

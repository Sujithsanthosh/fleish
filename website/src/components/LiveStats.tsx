"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, Clock, MapPin, Award } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
  delay: number;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const duration = 2000;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function StatItem({ icon: Icon, value, suffix, label, color, delay }: StatItemProps) {
  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20',
    violet: 'from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`glass-card rounded-2xl p-6 border bg-gradient-to-br ${colorClasses[color]} card-shine group hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
          <TrendingUp className="w-3 h-3" />
          <span>+12%</span>
        </div>
      </div>
      
      <div className={`text-3xl md:text-4xl font-black mb-1 ${colorClasses[color].split(' ')[2]}`}>
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      
      <p className="text-sm text-slate-400 font-medium">{label}</p>
    </motion.div>
  );
}

const stats = [
  { icon: ShoppingBag, value: 50000, suffix: '+', label: 'Orders Delivered', color: 'emerald' },
  { icon: Users, value: 25000, suffix: '+', label: 'Happy Customers', color: 'orange' },
  { icon: MapPin, value: 200, suffix: '+', label: 'Partner Vendors', color: 'cyan' },
  { icon: Clock, value: 28, suffix: ' min', label: 'Avg. Delivery Time', color: 'violet' },
  { icon: Award, value: 99.8, suffix: '%', label: 'Satisfaction Rate', color: 'rose' },
  { icon: Users, value: 800, suffix: '+', label: 'Delivery Partners', color: 'amber' },
];

export default function LiveStats() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Animated background blobs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Platform Stats</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Numbers That <span className="text-gradient">Speak</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real-time metrics from our active platform across all cities
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <StatItem key={i} {...stat} delay={i * 0.1} />
          ))}
        </div>

        {/* Live ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 glass rounded-2xl p-4 overflow-hidden"
        >
          <div className="flex items-center gap-4 animate-shimmer">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase">Live Activity</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-400 whitespace-nowrap animate-marquee">
              <span>New order from Hyderabad • 2 min ago</span>
              <span>•</span>
              <span>Vendor &quot;Meat King&quot; just joined from Bangalore</span>
              <span>•</span>
              <span>50+ orders completed in Mumbai today</span>
              <span>•</span>
              <span>Delivery partner Ramesh completed 100th delivery!</span>
              <span>•</span>
              <span>New customer from Delhi • just now</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

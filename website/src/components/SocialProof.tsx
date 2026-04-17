"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ShoppingBag, TrendingUp, User, Star } from 'lucide-react';

const ACTIVITIES = [
  { type: 'order', user: 'Rahul S.', location: 'Hyderabad', item: 'Fresh Chicken 1kg', time: '2 min ago' },
  { type: 'order', user: 'Priya M.', location: 'Bangalore', item: 'Premium Mutton', time: '5 min ago' },
  { type: 'review', user: 'Amit K.', location: 'Mumbai', item: '5★ rating', time: '8 min ago' },
  { type: 'order', user: 'Sneha R.', location: 'Delhi', item: 'Fish Curry Pack', time: '12 min ago' },
  { type: 'signup', user: 'Vikram P.', location: 'Chennai', item: 'joined Pro', time: '15 min ago' },
  { type: 'order', user: 'Anjali T.', location: 'Pune', item: 'Chicken Wings 2kg', time: '18 min ago' },
  { type: 'order', user: 'Rajesh K.', location: 'Hyderabad', item: 'Whole Fish', time: '22 min ago' },
  { type: 'review', user: 'Meera L.', location: 'Bangalore', item: '5★ rating', time: '25 min ago' },
  { type: 'order', user: 'Suresh B.', location: 'Mumbai', item: 'Mutton Biryani Cut', time: '30 min ago' },
  { type: 'signup', user: 'Kiran D.', location: 'Delhi', item: 'joined as vendor', time: '35 min ago' },
];

const STATS = [
  { label: 'Active Now', value: '1,247', icon: User, color: 'text-emerald-400' },
  { label: 'Orders Today', value: '3,856', icon: ShoppingBag, color: 'text-cyan-400' },
  { label: 'Cities', value: '15+', icon: MapPin, color: 'text-orange-400' },
  { label: 'Growth', value: '+127%', icon: TrendingUp, color: 'text-violet-400' },
];

export default function SocialProof() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % ACTIVITIES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const activity = ACTIVITIES[currentActivity];

  const getIcon = () => {
    switch (activity.type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-cyan-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'signup':
        return <User className="w-4 h-4 text-emerald-400" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getMessage = () => {
    switch (activity.type) {
      case 'order':
        return (
          <>
            <span className="font-semibold text-white">{activity.user}</span> from{' '}
            <span className="text-slate-300">{activity.location}</span> just ordered{' '}
            <span className="text-cyan-400">{activity.item}</span>
          </>
        );
      case 'review':
        return (
          <>
            <span className="font-semibold text-white">{activity.user}</span> gave{' '}
            <span className="text-amber-400">{activity.item}</span> for their order
          </>
        );
      case 'signup':
        return (
          <>
            <span className="font-semibold text-white">{activity.user}</span> just{' '}
            <span className="text-emerald-400">{activity.item}</span>
          </>
        );
    }
  };

  return (
    <>
      {/* Floating Activity Notification - Positioned to not overlap with chat button */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="fixed bottom-40 left-6 z-40 max-w-sm hidden md:block"
          >
            <div className="glass-card rounded-xl p-4 border-l-4 border-l-cyan-500 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shrink-0">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {getMessage()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activity.time}
                  </p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-slate-500 hover:text-white transition-colors shrink-0"
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

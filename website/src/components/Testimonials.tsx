"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Restaurant Owner",
    location: "Hyderabad",
    avatar: "RK",
    content: "Fleish has transformed how we source fresh meat for our restaurant. The delivery is always on time, and the quality is consistently excellent. Our customers have noticed the difference!",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Home Chef",
    location: "Bangalore",
    avatar: "PS",
    content: "As someone who cooks daily for my family, Fleish is a game-changer. The app is super easy to use, and I love tracking my delivery in real-time. Fresh meat delivered in 30 minutes!",
    rating: 5
  },
  {
    id: 3,
    name: "Ahmed Khan",
    role: "Catering Business",
    location: "Mumbai",
    avatar: "AK",
    content: "The bulk ordering feature and enterprise dashboard have streamlined our operations. We can now serve hundreds of guests with confidence. The vendor network is impressive.",
    rating: 5
  },
  {
    id: 4,
    name: "Sneha Patel",
    role: "Working Professional",
    location: "Delhi",
    avatar: "SP",
    content: "No more weekend trips to the butcher! I order on my commute and the meat is waiting when I reach home. The quality assurance gives me peace of mind.",
    rating: 5
  },
  {
    id: 5,
    name: "Vikram Reddy",
    role: "Cloud Kitchen Owner",
    location: "Chennai",
    avatar: "VR",
    content: "The integration with our kitchen operations was seamless. Real-time inventory updates help us plan better. Fleish understands the food business like no one else.",
    rating: 5
  }
];

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Touch gesture handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left - next testimonial
        nextTestimonial();
      } else {
        // Swiped right - previous testimonial
        prevTestimonial();
      }
    }

    // Reset values
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Loved by <span className="text-gradient">Thousands</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Main testimonial card with touch gestures */}
          <div
            className="relative max-w-4xl mx-auto"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-card rounded-3xl p-8 md:p-12 relative"
              >
                {/* Quote icon */}
                <div className="absolute -top-6 left-8 md:left-12">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6 pt-4">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 font-medium">
                  &ldquo;{current.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-emerald-400">{current.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{current.name}</h4>
                    <p className="text-sm text-slate-400">{current.role} • {current.location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Dots indicator */}
              <div className="flex items-center gap-2 px-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex
                        ? 'w-8 bg-emerald-500'
                        : 'bg-slate-600 hover:bg-slate-500'
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-slate-400 hover:text-white hover:border-emerald-500/30 transition-all group"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

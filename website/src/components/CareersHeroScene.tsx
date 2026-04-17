"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Lightbulb, Rocket, Cpu, Globe } from 'lucide-react';

// Floating Team Member
function FloatingTeamMember({ x, y, delay, role, icon: Icon }: { x: string; y: string; delay: number; role: string; icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: [0, -15, 0] }}
      transition={{ 
        opacity: { delay, duration: 0.6 },
        y: { delay: delay + 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" }
      }}
      className="absolute"
      style={{ left: x, top: y }}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all" />
        
        {/* Avatar circle */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-emerald-400" />
        </div>
        
        {/* Role label */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        >
          <span className="text-xs font-bold text-emerald-400 bg-slate-900/90 px-2 py-1 rounded-lg border border-emerald-500/30">
            {role}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Floating Code Snippet
function FloatingCode({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 0.3, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="absolute font-mono text-xs text-emerald-500/40"
      style={{ left: x, top: y }}
    >
      <pre className="leading-relaxed">
{`const future = {
  team: 'growing',
  impact: 'massive',
  culture: 'amazing'
};`}
      </pre>
    </motion.div>
  );
}

// Tech Stack Badge
function TechBadge({ x, y, tech, color, delay }: { x: string; y: string; tech: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      className="absolute cursor-default"
      style={{ left: x, top: y }}
    >
      <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${color} backdrop-blur-sm`}>
        {tech}
      </div>
    </motion.div>
  );
}

// Connection Lines
function ConnectionLine({ x1, y1, x2, y2, delay }: { x1: string; y1: string; x2: string; y2: string; delay: number }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ delay, duration: 1 }}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible' }}
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="url(#lineGradient)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.5, duration: 1.5 }}
      />
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

// Particle
function Particle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
      initial={{ 
        x: Math.random() * 100 + '%', 
        y: '100%',
        opacity: 0 
      }}
      animate={{ 
        y: '-10%',
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

// Pulse Ring
function PulseRing({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div
        className="w-20 h-20 rounded-full border border-emerald-500/30"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
}

export default function CareersHeroScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Animated aurora */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 100,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-radial from-emerald-500/10 via-transparent to-transparent blur-3xl" />
        </motion.div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.5) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(16, 185, 129, 0.5) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Floating team members */}
      <FloatingTeamMember x="8%" y="20%" delay={0.2} role="Engineers" icon={Code} />
      <FloatingTeamMember x="85%" y="15%" delay={0.4} role="Designers" icon={Lightbulb} />
      <FloatingTeamMember x="15%" y="60%" delay={0.6} role="Product" icon={Rocket} />
      <FloatingTeamMember x="80%" y="55%" delay={0.8} role="Operations" icon={Cpu} />
      <FloatingTeamMember x="5%" y="80%" delay={1.0} role="Support" icon={Users} />
      <FloatingTeamMember x="90%" y="75%" delay={1.2} role="Growth" icon={Globe} />

      {/* Tech stack badges */}
      <TechBadge x="25%" y="30%" tech="React" color="border-blue-500/30 text-blue-400 bg-blue-500/10" delay={1.5} />
      <TechBadge x="70%" y="25%" tech="Node.js" color="border-green-500/30 text-green-400 bg-green-500/10" delay={1.7} />
      <TechBadge x="20%" y="45%" tech="TypeScript" color="border-blue-400/30 text-blue-300 bg-blue-400/10" delay={1.9} />
      <TechBadge x="75%" y="40%" tech="PostgreSQL" color="border-cyan-500/30 text-cyan-400 bg-cyan-500/10" delay={2.1} />
      <TechBadge x="30%" y="70%" tech="Next.js" color="border-white/30 text-slate-300 bg-white/10" delay={2.3} />
      <TechBadge x="65%" y="65%" tech="AWS" color="border-orange-500/30 text-orange-400 bg-orange-500/10" delay={2.5} />

      {/* Floating code snippets */}
      <FloatingCode x="5%" y="35%" delay={2} />
      <FloatingCode x="75%" y="80%" delay={2.5} />

      {/* Pulse rings */}
      <PulseRing x="20%" y="30%" delay={0.5} />
      <PulseRing x="70%" y="50%" delay={1} />
      <PulseRing x="40%" y="70%" delay={1.5} />

      {/* Rising particles */}
      {[...Array(20)].map((_, i) => (
        <Particle key={i} delay={i * 0.3} />
      ))}

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
        <div className="absolute inset-0 bg-gradient-radial from-emerald-500/20 via-cyan-500/10 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Orbital rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-cyan-500/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-violet-500/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-950/80 pointer-events-none" />
    </div>
  );
}

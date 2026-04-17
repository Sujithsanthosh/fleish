"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, AtSign, Mail, ExternalLink } from 'lucide-react';

const teamMembers = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    bio: "Former Amazon executive with 15+ years in logistics and supply chain. IIT Bombay alumnus.",
    initials: "RS",
    color: "emerald",
    socials: { linkedin: "#", twitter: "#", email: "rahul@fleish.in" },
  },
  {
    name: "Priya Patel",
    role: "Co-Founder & CTO",
    bio: "Ex-Google engineer. Built scalable systems handling 10M+ daily transactions. Stanford CS.",
    initials: "PP",
    color: "orange",
    socials: { linkedin: "#", twitter: "#", email: "priya@fleish.in" },
  },
  {
    name: "Amit Kumar",
    role: "Head of Operations",
    bio: "Supply chain expert with experience at Flipkart and BigBasket. IIM Ahmedabad.",
    initials: "AK",
    color: "cyan",
    socials: { linkedin: "#", twitter: "#", email: "amit@fleish.in" },
  },
  {
    name: "Sneha Reddy",
    role: "Chief Product Officer",
    bio: "Product leader from Swiggy and Zomato. Passionate about consumer experience.",
    initials: "SR",
    color: "violet",
    socials: { linkedin: "#", twitter: "#", email: "sneha@fleish.in" },
  },
];

function TeamCard({ member }: { member: typeof teamMembers[0] }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  const colors: Record<string, { bg: string; border: string; text: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  };

  const colorStyle = colors[member.color];

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
          ? `perspective(1000px) rotateY(${mousePosition.x * 8}deg) rotateX(${-mousePosition.y * 8}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.15s ease-out',
      }}
      className={`glass-card rounded-3xl p-8 relative overflow-hidden group cursor-pointer ${colorStyle.border}`}
    >
      {/* Spotlight effect */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : ''
        }`}
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, ${member.color === 'emerald' ? 'rgba(16, 185, 129, 0.15)' : member.color === 'orange' ? 'rgba(249, 115, 22, 0.15)' : member.color === 'cyan' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(139, 92, 246, 0.15)'}, transparent 50%)`,
        }}
      />

      <div className="relative z-10">
        {/* Avatar */}
        <div className={`w-24 h-24 rounded-3xl ${colorStyle.bg} border-2 ${colorStyle.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <span className={`text-3xl font-black ${colorStyle.text}`}>{member.initials}</span>
        </div>

        {/* Info */}
        <h3 className="text-xl font-black text-white mb-1">{member.name}</h3>
        <p className={`text-sm font-semibold ${colorStyle.text} mb-3`}>{member.role}</p>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">{member.bio}</p>

        {/* Social links */}
        <div className="flex gap-3">
          <motion.a
            href={member.socials.linkedin}
            whileHover={{ scale: 1.1, y: -2 }}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Link2 className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={member.socials.twitter}
            whileHover={{ scale: 1.1, y: -2 }}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <AtSign className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={`mailto:${member.socials.email}`}
            whileHover={{ scale: 1.1, y: -2 }}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Mail className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  return (
    <section id="team" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-4">Our Team</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Meet the <span className="text-gradient">Visionaries</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Industry veterans building the future of hyperlocal meat delivery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>

        {/* Join us CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 mb-4">Want to join our team?</p>
          <a href="/jobs" className="btn-outline inline-flex items-center gap-2">
            View Open Positions <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

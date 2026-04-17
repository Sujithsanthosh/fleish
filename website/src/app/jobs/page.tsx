"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Search, Heart, Zap, Coffee, Globe, BookOpen, Award, X, Upload, FileText, ChevronDown, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CursorEffect from '@/components/CursorEffect';
import CareersHeroScene from '@/components/CareersHeroScene';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const } })
};

const BENEFITS = [
  { icon: Heart, title: "Health & Wellness", desc: "Comprehensive medical insurance for you and family" },
  { icon: Zap, title: "Flexible Hours", desc: "Work when you're most productive" },
  { icon: Coffee, title: "Free Meals", desc: "Daily lunch allowance + office snacks" },
  { icon: Globe, title: "Remote Friendly", desc: "Work from anywhere in India" },
  { icon: BookOpen, title: "Learning Budget", desc: "₹50K/year for courses & conferences" },
  { icon: Award, title: "ESOP", desc: "Employee stock ownership plan" },
];

const DEFAULT_JOBS = [
  { id: 1, title: "Senior Full-Stack Developer", dept: "Engineering", location: "Hyderabad", type: "Full-Time", desc: "Build and scale our real-time delivery infrastructure using Next.js, Node.js, and PostgreSQL. You'll own critical systems that serve thousands of orders daily.", skills: ["React", "Node.js", "PostgreSQL", "Redis"], salary: "₹20-35 LPA", exp: "4-8 years" },
  { id: 2, title: "Operations Manager", dept: "Operations", location: "Hyderabad", type: "Full-Time", desc: "Oversee daily delivery operations across multiple cities. Optimize routing, manage vendor relationships, and drive operational KPIs.", skills: ["Logistics", "Analytics", "Team Management"], salary: "₹12-18 LPA", exp: "5-10 years" },
  { id: 3, title: "Customer Support Lead", dept: "Support", location: "Remote", type: "Full-Time", desc: "Lead our 24/7 customer support team. Build processes, handle escalations, and maintain our industry-leading CSAT scores.", skills: ["CX Strategy", "Team Leadership", "Zendesk"], salary: "₹8-14 LPA", exp: "3-6 years" },
  { id: 4, title: "UI/UX Designer", dept: "Design", location: "Hyderabad", type: "Full-Time", desc: "Design beautiful, intuitive interfaces for our customer, vendor, and delivery apps. Conduct user research and iterate rapidly.", skills: ["Figma", "User Research", "Mobile Design"], salary: "₹10-18 LPA", exp: "2-5 years" },
  { id: 5, title: "Delivery Fleet Coordinator", dept: "Operations", location: "Multiple Cities", type: "Full-Time", desc: "Manage and grow our delivery partner fleet. Handle onboarding, training, and performance tracking across regions.", skills: ["Fleet Management", "Training", "Regional Ops"], salary: "₹6-10 LPA", exp: "2-4 years" },
  { id: 6, title: "Data Analyst", dept: "Engineering", location: "Remote", type: "Contract", desc: "Analyze delivery data, build dashboards, and provide insights to optimize our hyperlocal supply chain.", skills: ["SQL", "Python", "Tableau", "Statistics"], salary: "₹8-15 LPA", exp: "2-5 years" },
];

function ApplicationModal({ job, onClose, onSubmit }: { job: any, onClose: () => void, onSubmit: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', resume: null as File | null, coverLetter: '', linkedin: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('word') || file.name.endsWith('.docx'))) {
      setFormData({ ...formData, resume: file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black text-white">Apply for {job.title}</h3>
            <p className="text-sm text-slate-400">{job.dept} • {job.location}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Full Name</label>
              <input required type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-emerald-500/50 outline-none transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Email</label>
              <input required type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-emerald-500/50 outline-none transition-colors" placeholder="john@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Phone Number</label>
            <input required type="tel" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-emerald-500/50 outline-none transition-colors" placeholder="+91 98765 43210" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">LinkedIn Profile</label>
            <input type="url" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-emerald-500/50 outline-none transition-colors" placeholder="https://linkedin.com/in/johndoe" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Resume</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-emerald-500/50 transition-all cursor-pointer ${
                formData.resume ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/20'
              }`}
            >
              {formData.resume ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-white font-medium">{formData.resume.name}</p>
                    <p className="text-xs text-slate-400">{(formData.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, resume: null }); }}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Drop your resume here or click to upload</p>
                  <p className="text-xs text-slate-600 mt-1">PDF, DOCX up to 5MB</p>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">Cover Letter</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-emerald-500/50 outline-none transition-colors resize-none" placeholder="Tell us why you're perfect for this role..." />
          </div>

          <button type="submit" className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2">
            Submit Application <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState(DEFAULT_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`).then(r => r.json()).then(data => {
      if (data.jobs && data.jobs.length > 0) setJobs(data.jobs);
    }).catch(() => {});
  }, []);

  const departments = ['ALL', ...new Set(jobs.map(j => j.dept))];
  const filtered = jobs.filter(j =>
    (selectedDept === 'ALL' || j.dept === selectedDept) &&
    (j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleApply = (job: any) => {
    setSelectedJob(job);
  };

  const submitApplication = () => {
    if (selectedJob) {
      setAppliedJobs([...appliedJobs, selectedJob.id]);
      setSelectedJob(null);
    }
  };

  return (
    <main className="relative min-h-screen">
      <CursorEffect />
      <Navbar />
      
      {/* Hero with Futuristic Careers Scene */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden min-h-[650px] flex items-center">
        <CareersHeroScene />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">We're Hiring!</span>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
              Build the Future of <span className="text-gradient">Delivery</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-xl text-slate-400 max-w-2xl mb-8">
              Join 200+ passionate engineers, operators, and designers building India's most advanced hyperlocal delivery platform.
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Team Size", value: "200+" },
                { label: "Open Roles", value: "24" },
                { label: "Cities", value: "15+" },
                { label: "Avg Tenure", value: "2.5 yrs" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-4">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Stunning Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 mb-6"
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Life at Fleish</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Why <span className="text-gradient-animated">Join Us</span>?
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We believe happy teams build amazing products. Here's how we take care of ours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map((benefit, i) => {
              const gradients = [
                'from-emerald-500 to-teal-500',
                'from-cyan-500 to-blue-500',
                'from-violet-500 to-purple-500',
                'from-amber-500 to-orange-500',
                'from-rose-500 to-pink-500',
                'from-indigo-500 to-violet-500'
              ];
              const gradient = gradients[i % gradients.length];
              
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 40, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, type: "spring" }}
                  whileHover={{ 
                    y: -12, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative"
                  style={{ perspective: '1000px' }}
                >
                  {/* Animated gradient border */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-3xl opacity-0 group-hover:opacity-70 blur transition-all duration-500 group-hover:duration-200" />
                  
                  {/* Card */}
                  <div className="relative h-full bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all duration-300 overflow-hidden">
                    {/* Background glow on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {[...Array(3)].map((_, j) => (
                        <motion.div
                          key={j}
                          className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${gradient}`}
                          animate={{
                            y: [0, -30, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: j * 0.4,
                            repeat: Infinity,
                          }}
                          style={{
                            left: `${20 + j * 30}%`,
                            bottom: '20%',
                          }}
                        />
                      ))}
                    </div>

                    {/* Icon with animated gradient background */}
                    <motion.div 
                      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Animated ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-white/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <benefit.icon className="w-8 h-8 text-white relative z-10" />
                    </motion.div>

                    {/* Title with gradient text on hover */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient-animated transition-all duration-300">
                      {benefit.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                      {benefit.desc}
                    </p>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-slate-400 mb-4">Plus many more surprises...</p>
            <motion.div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-slate-300"
              whileHover={{ scale: 1.05, borderColor: 'rgba(16, 185, 129, 0.5)' }}
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Team outings • Annual retreats • Gym membership
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Job Listings - Futuristic Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-6"
            >
              <Briefcase className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-black text-violet-400 uppercase tracking-wider">Join Our Team</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Open <span className="text-gradient-animated">Positions</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Find your perfect role and help us build the future of delivery
            </p>
          </motion.div>
          
          {/* Search & Filter - Futuristic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search roles, skills, or keywords..." 
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all" 
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-slate-400 flex items-center justify-between"
              >
                Filters <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <div className={`flex gap-2 flex-wrap ${showFilters ? 'block' : 'hidden lg:flex'}`}>
                {departments.map((d, i) => {
                  const colors = [
                    'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
                    'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
                    'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
                    'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
                    'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
                  ];
                  const color = selectedDept === d ? colors[i % colors.length] : 'bg-white/5 text-slate-400 border-white/10';
                  return (
                    <motion.button 
                      key={d} 
                      onClick={() => setSelectedDept(d)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-3.5 rounded-2xl text-xs font-bold transition-all border ${color}`}
                    >
                      {d}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Job Cards - Futuristic */}
          <div className="space-y-6">
            <AnimatePresence>
              {filtered.map((job, i) => {
                const gradients = [
                  'from-emerald-500/20 via-cyan-500/20 to-violet-500/20',
                  'from-violet-500/20 via-fuchsia-500/20 to-rose-500/20',
                  'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
                  'from-amber-500/20 via-orange-500/20 to-rose-500/20',
                ];
                const gradient = gradients[i % gradients.length];
                
                return (
                  <motion.div 
                    key={job.id} 
                    initial={{ opacity: 0, y: 30, rotateX: -5 }} 
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ delay: i * 0.08, duration: 0.5, type: "spring" }}
                    className="group relative"
                    style={{ perspective: '1000px' }}
                  >
                    {/* Animated border glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-violet-500 rounded-3xl opacity-0 group-hover:opacity-60 blur transition-all duration-500" />
                    
                    <div 
                      className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 group-hover:border-white/20 transition-all cursor-pointer overflow-hidden"
                      onClick={() => handleApply(job)}
                    >
                      {/* Background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                      
                      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left side - Job info */}
                        <div className="flex-1">
                          {/* Title row */}
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h3 className="text-2xl font-black text-white group-hover:text-gradient-animated transition-all">{job.title}</h3>
                            <div className="flex gap-2">
                              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                                {job.dept}
                              </span>
                              <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-300 border border-violet-500/30 rounded-full">
                                {job.salary}
                              </span>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <p className="text-slate-400 leading-relaxed mb-5 max-w-2xl">{job.desc}</p>
                          
                          {/* Meta info */}
                          <div className="flex items-center gap-6 flex-wrap mb-4">
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                              </div>
                              {job.location}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-cyan-400" />
                              </div>
                              {job.type}
                            </span>
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-400">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <Award className="w-4 h-4 text-violet-400" />
                              </div>
                              {job.exp}
                            </span>
                          </div>
                          
                          {/* Skills */}
                          <div className="flex gap-2 flex-wrap">
                            {job.skills.map((s, j) => {
                              const skillColors = [
                                'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
                                'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300',
                                'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-300',
                                'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
                              ];
                              return (
                                <span 
                                  key={s} 
                                  className={`px-3 py-1.5 text-xs font-bold bg-gradient-to-r ${skillColors[j % skillColors.length]} rounded-lg border`}
                                >
                                  {s}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Right side - Apply button */}
                        <div className="flex items-center">
                          <motion.button 
                            disabled={appliedJobs.includes(job.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-8 py-4 rounded-2xl text-sm font-black transition-all flex items-center gap-3 ${
                              appliedJobs.includes(job.id) 
                                ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40' 
                                : 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 border border-white/10'
                            }`}
                          >
                            {appliedJobs.includes(job.id) ? (
                              <>
                                <CheckCircle2 className="w-5 h-5" /> Applied
                              </>
                            ) : (
                              <>
                                Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filtered.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-slate-500" />
                </div>
                <p className="text-xl text-slate-400 mb-2">No positions found</p>
                <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selectedJob && (
          <ApplicationModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
            onSubmit={submitApplication} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}

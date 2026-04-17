"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Car, Fish, Waves, Beef, Bird, UtensilsCrossed } from 'lucide-react';

// Peaceful Seashore Audio Hook
function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create peaceful wave noise buffer
  const createWaveBuffer = (ctx: AudioContext) => {
    const sampleRate = ctx.sampleRate;
    const duration = 4; // 4 seconds for wave cycle
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < buffer.length; i++) {
        // Create brown noise (deeper ocean sound)
        let white = Math.random() * 2 - 1;
        let brown = 0;
        const brownFilter = 0.99;
        
        if (i > 0) {
          brown = (data[i - 1] || 0) * brownFilter + white * (1 - brownFilter);
        }
        
        // Apply wave envelope (build up and fade like waves)
        const t = i / buffer.length;
        const waveEnvelope = Math.sin(t * Math.PI) * 0.5 + 0.5;
        const waveCycle = Math.sin(t * Math.PI * 2) * 0.3 + 0.7;
        
        data[i] = brown * waveEnvelope * waveCycle * 0.5;
      }
    }
    return buffer;
  };

  // Initialize and start peaceful seashore audio
  const initAudio = async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Create master gain for volume control
      const masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create wave sound loop
      const playWave = () => {
        if (!ctx || ctx.state === 'closed') return;
        
        const buffer = createWaveBuffer(ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = false;

        // Create filters for ocean sound
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 400;
        lowpass.Q.value = 0.5;

        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 80;

        // Connect: source -> filters -> gain -> destination
        source.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(masterGain);

        source.start();
        noiseNodeRef.current = source;

        // Schedule next wave with some randomness
        const nextWave = 3000 + Math.random() * 2000; // 3-5 seconds
        intervalRef.current = setTimeout(playWave, nextWave);
      };

      // Start playing
      playWave();
      setIsPlaying(true);

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch (e) {
      console.log('Audio init error:', e);
    }
  };

  // Stop audio
  const stopAudio = () => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    audioContextRef.current = null;
    gainNodeRef.current = null;
    setIsPlaying(false);
  };

  // Toggle audio
  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      initAudio();
    }
  };

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current?.currentTime || 0);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Auto-start audio on first user interaction - CRITICAL FIX
  useEffect(() => {
    let hasStarted = false;
    
    const handleFirstInteraction = async () => {
      if (hasStarted) return;
      hasStarted = true;
      
      // Always try to init audio on first interaction
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        // Create new context on user interaction
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // Resume immediately - REQUIRED by browser policy
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Create master gain for volume control
        const masterGain = ctx.createGain();
        masterGain.gain.value = volume;
        masterGain.connect(ctx.destination);
        gainNodeRef.current = masterGain;

        // Create wave sound loop
        const playWave = () => {
          if (!ctx || ctx.state === 'closed') return;
          
          const buffer = createWaveBuffer(ctx);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.loop = false;

          // Create filters for ocean sound
          const lowpass = ctx.createBiquadFilter();
          lowpass.type = 'lowpass';
          lowpass.frequency.value = 400;
          lowpass.Q.value = 0.5;

          const highpass = ctx.createBiquadFilter();
          highpass.type = 'highpass';
          highpass.frequency.value = 80;

          // Connect: source -> filters -> gain -> destination
          source.connect(highpass);
          highpass.connect(lowpass);
          lowpass.connect(masterGain);

          source.start();
          noiseNodeRef.current = source;

          // Schedule next wave with some randomness
          const nextWave = 3000 + Math.random() * 2000; // 3-5 seconds
          intervalRef.current = setTimeout(playWave, nextWave);
        };

        // Start playing immediately
        playWave();
        setIsPlaying(true);
        
        console.log('🌊 Seashore audio started!');
      } catch (e) {
        console.log('Audio init error:', e);
      }
      
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
    document.addEventListener('scroll', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return { isPlaying, toggleAudio, volume, setVolume };
}

// Animated Fish Component
function AnimatedFish({ delay = 0, color = "emerald" }: { delay?: number; color?: string }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ 
        x: ['0vw', '110vw'],
        y: [0, -20, 20, -10, 0],
      }}
      transition={{ 
        x: { duration: 25, repeat: Infinity, delay, ease: "linear" },
        y: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" }
      }}
      className="absolute"
      style={{ 
        top: `${20 + (delay * 15) % 60}%`,
        zIndex: 5 
      }}
    >
      <div className={`flex items-center gap-1 ${color === 'emerald' ? 'text-emerald-400/60' : color === 'cyan' ? 'text-cyan-400/60' : 'text-rose-400/60'}`}>
        <motion.div
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Fish className="w-6 h-6" />
        </motion.div>
        <motion.div 
          className="w-4 h-0.5 bg-current rounded-full opacity-50"
          animate={{ scaleX: [1, 0.5, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}

// Animated Car Component
function AnimatedCar({ delay = 0 }: { delay?: number }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ x: '-10vw', opacity: 0 }}
      animate={{ 
        x: ['-10vw', '110vw'],
      }}
      transition={{ 
        duration: 12 + delay * 2,
        repeat: Infinity,
        delay: delay * 3,
        ease: "linear"
      }}
      className="absolute bottom-[15%] z-10"
    >
      <div className="flex items-center gap-1">
        <motion.div
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
        >
          <Car className="w-8 h-8 text-slate-400/50" />
        </motion.div>
        {/* Headlights */}
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-400/40 to-transparent rounded-full" />
      </div>
    </motion.div>
  );
}

// Animated Wave Component
function AnimatedWave({ delay = 0, duration = 8 }: { delay?: number; duration?: number }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.3, 0.5, 0.3],
        y: [0, -10, 0]
      }}
      transition={{ 
        duration, 
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
        <motion.path
          fill="url(#waveGradient)"
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,181.3C96,203,192,245,288,261.3C384,277,480,267,576,234.7C672,203,768,149,864,154.7C960,160,1056,224,1152,234.7C1248,245,1344,203,1392,181.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

export default function HeroScene() {
  const { isPlaying, toggleAudio } = useAudio();
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Audio Control with Label */}
      <div className="fixed top-24 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showTooltip && !isPlaying && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-card px-3 py-2 rounded-lg text-xs text-slate-300 whitespace-nowrap"
            >
              🔊 Click to hear peaceful seashore sounds
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          onClick={() => {
            toggleAudio();
            setShowTooltip(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-12 h-12 rounded-full glass-card flex items-center justify-center group transition-all ${
            isPlaying ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/20' : 'hover:border-emerald-500/30'
          }`}
          title={isPlaying ? 'Mute Seashore Sounds' : 'Play Peaceful Seashore Sounds'}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="relative"
              >
                <Volume2 className="w-5 h-5 text-emerald-400" />
                {/* Audio wave animation */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  <span className="w-0.5 h-1 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="muted"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <VolumeX className="w-5 h-5 text-slate-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
          {isPlaying ? 'Sound On' : 'Sound Off'}
        </span>
      </div>

      {/* Animated Waves at bottom */}
      <AnimatedWave delay={0} duration={6} />
      <AnimatedWave delay={2} duration={8} />
      <AnimatedWave delay={4} duration={10} />

      {/* Animated Fish */}
      <AnimatedFish delay={0} color="emerald" />
      <AnimatedFish delay={5} color="cyan" />
      <AnimatedFish delay={10} color="rose" />
      <AnimatedFish delay={15} color="emerald" />

      {/* Animated Cars */}
      <AnimatedCar delay={0} />
      <AnimatedCar delay={2} />

      {/* Animated Food Icons floating */}
      <motion.div
        className="absolute top-[20%] right-[10%]"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Beef className="w-8 h-8 text-rose-500/20" />
      </motion.div>

      <motion.div
        className="absolute top-[40%] left-[5%]"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Fish className="w-10 h-10 text-cyan-500/20" />
      </motion.div>

      <motion.div
        className="absolute top-[60%] right-[20%]"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Bird className="w-6 h-6 text-amber-500/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] left-[15%]"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, -8, 8, 0]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <UtensilsCrossed className="w-10 h-10 text-rose-500/30" />
      </motion.div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  AlertTriangle,
  Shield,
  Navigation,
  ArrowUpDown,
  Monitor,
  MousePointerClick,
} from 'lucide-react';
import { useVoiceCommand, buildCommands, VoiceCommandEvent, VoiceCommand } from '@/hooks/useVoiceCommand';

type CommandCategory = 'navigation' | 'scroll' | 'page' | 'ui';

const categoryMeta: Record<CommandCategory, { label: string; icon: any; color: string }> = {
  navigation: { label: 'Navigate', icon: Navigation, color: '#10B981' },
  scroll:     { label: 'Scroll',   icon: ArrowUpDown, color: '#3B82F6' },
  page:       { label: 'Page',     icon: Monitor,     color: '#8B5CF6' },
  ui:         { label: 'Interface', icon: MousePointerClick, color: '#06B6D4' },
};

// ─── Waveform Visualizer ────────────────────────────────────
function WaveformVisualizer({ isActive, color }: { isActive: boolean; color: string }) {
  const bars = 24;
  return (
    <div className="flex items-center justify-center gap-[2px] h-8">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 2.5,
            backgroundColor: color,
            opacity: isActive ? 0.8 : 0.2,
          }}
          animate={
            isActive
              ? {
                  height: [4, 8 + Math.random() * 20, 4],
                  opacity: [0.4, 0.9, 0.4],
                }
              : { height: 3, opacity: 0.15 }
          }
          transition={
            isActive
              ? {
                  duration: 0.4 + Math.random() * 0.4,
                  repeat: Infinity,
                  repeatType: 'mirror' as const,
                  delay: i * 0.03,
                  ease: 'easeInOut',
                }
              : { duration: 0.5 }
          }
        />
      ))}
    </div>
  );
}

// ─── Listening Pulse Ring ───────────────────────────────────
function PulseRing({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;
  return (
    <>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: '2px solid rgba(16,185,129,0.4)' }}
        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: '2px solid rgba(6,182,212,0.3)' }}
        animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
      />
    </>
  );
}

// ─── Command Feedback Toast ─────────────────────────────────
function CommandFeedback({ command, visible }: { command: VoiceCommand | null; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && command && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-36 left-1/2 -translate-x-1/2 z-[10001] pointer-events-none"
        >
          <div
            className="px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
            style={{
              background: `linear-gradient(135deg, ${command.color}18 0%, ${command.color}08 100%)`,
              border: `1px solid ${command.color}40`,
              boxShadow: `0 0 40px ${command.color}20, 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`,
              backdropFilter: 'blur(20px)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-2xl"
            >
              {command.emoji}
            </motion.span>
            <div>
              <div className="flex items-center gap-2">
                <Volume2 size={16} style={{ color: command.color }} />
                <span className="text-white font-bold text-base">{command.action}</span>
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="h-0.5 rounded-full mt-1 origin-left"
                style={{ backgroundColor: command.color }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Voice Command UI ──────────────────────────────────
export function VoiceCommandUI() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CommandCategory>('navigation');
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCommand = useCallback((event: VoiceCommandEvent) => {
    setFeedbackVisible(true);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedbackVisible(false), 2000);
  }, []);

  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    lastCommand,
    confidence,
    error,
    toggleListening,
    stopListening,
  } = useVoiceCommand({
    onCommand: handleCommand,
    enabled: true,
  });

  // Keyboard shortcut: Ctrl+Shift+V to toggle voice
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'v' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleListening]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const allCommands = buildCommands();
  const filteredCommands = allCommands.filter(c => c.category === activeCategory);

  if (!isSupported) return null;

  return (
    <>
      {/* ─── Floating Mic Button ─── */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (!isListening) toggleListening();
          setPanelOpen(!panelOpen);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="fixed bottom-6 right-24 z-[9998] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: isListening
            ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
            : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          boxShadow: isListening
            ? '0 0 30px rgba(244,63,94,0.5), 0 8px 32px rgba(0,0,0,0.3)'
            : '0 0 20px rgba(99,102,241,0.3), 0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
        aria-label="Voice Commands"
        id="voice-command-btn"
      >
        <PulseRing isActive={isListening} />
        {isListening ? (
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <Mic size={24} className="text-white relative z-10" />
          </motion.div>
        ) : (
          <MicOff size={22} className="text-white/90 relative z-10" />
        )}
        {isListening && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 border-2 border-gray-900"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </motion.button>

      {/* ─── Tooltip ─── */}
      <AnimatePresence>
        {showTooltip && !panelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-40 z-[9997] px-3 py-2 rounded-lg text-xs text-white whitespace-nowrap"
            style={{
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Voice Commands
            <span className="ml-2 text-gray-400">(Ctrl+Shift+V)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Command Feedback Toast ─── */}
      <CommandFeedback command={lastCommand} visible={feedbackVisible} />

      {/* ─── Main Panel ─── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997]"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-24 z-[9998] w-[420px] max-w-[calc(100vw-48px)] max-h-[75vh] overflow-hidden rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(15,15,25,0.98) 0%, rgba(10,10,20,0.95) 100%)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* ── Header ── */}
              <div className="p-5 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.2) 100%)',
                        border: '1px solid rgba(99,102,241,0.2)',
                      }}
                    >
                      <Volume2 size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base tracking-tight">Voice Commands</h3>
                      <p className="text-gray-500 text-xs mt-0.5">Hands-free website control</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPanelOpen(false)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>

                {/* ── Microphone Control ── */}
                <div className="mt-4 p-4 rounded-2xl relative overflow-hidden" style={{
                  background: isListening
                    ? 'linear-gradient(135deg, rgba(244,63,94,0.08) 0%, rgba(168,85,247,0.06) 100%)'
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isListening ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <div className="flex items-center gap-4">
                    {/* Big mic button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleListening}
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: isListening
                          ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
                          : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        boxShadow: isListening
                          ? '0 0 25px rgba(244,63,94,0.4)'
                          : '0 0 15px rgba(99,102,241,0.3)',
                      }}
                    >
                      <PulseRing isActive={isListening} />
                      {isListening ? (
                        <Mic size={28} className="text-white relative z-10" />
                      ) : (
                        <MicOff size={26} className="text-white/80 relative z-10" />
                      )}
                    </motion.button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">
                          {isListening ? 'Listening...' : 'Tap to Start'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isListening
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {isListening ? '● LIVE' : 'OFF'}
                        </span>
                      </div>
                      <WaveformVisualizer isActive={isListening} color={isListening ? '#f43f5e' : '#6366f1'} />
                    </div>
                  </div>

                  {/* Transcript display */}
                  {(transcript || interimTranscript) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-3 p-3 rounded-xl overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Heard:</p>
                      <p className="text-sm text-white/90 font-medium">
                        {interimTranscript ? (
                          <span className="text-gray-400 italic">{interimTranscript}</span>
                        ) : (
                          <>
                            &ldquo;{transcript}&rdquo;
                            {confidence > 0 && (
                              <span className="ml-2 text-[10px] text-gray-500">
                                ({Math.round(confidence * 100)}% confident)
                              </span>
                            )}
                          </>
                        )}
                      </p>
                    </motion.div>
                  )}

                  {/* Error display */}
                  {error && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-2 flex items-center gap-2 p-2 rounded-lg"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}
                    >
                      <AlertTriangle size={14} className="text-red-400 shrink-0" />
                      <span className="text-[11px] text-red-300">{error}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ── Category Tabs ── */}
              <div className="flex px-5 pt-4 gap-1 overflow-x-auto no-scrollbar">
                {(Object.keys(categoryMeta) as CommandCategory[]).map((cat) => {
                  const meta = categoryMeta[cat];
                  const Icon = meta.icon;
                  const count = allCommands.filter(c => c.category === cat).length;
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap shrink-0"
                      style={{
                        color: isActive ? '#fff' : '#6b7280',
                        background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                      }}
                    >
                      <Icon size={12} />
                      {meta.label}
                      <span
                        className="px-1 py-0.5 rounded-full text-[8px] font-bold"
                        style={{
                          background: isActive ? `${meta.color}20` : 'rgba(255,255,255,0.05)',
                          color: isActive ? meta.color : '#6b7280',
                        }}
                      >
                        {count}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="voice-tab-indicator"
                          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                          style={{ background: `linear-gradient(90deg, ${meta.color}, #06b6d4)` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ── Command List ── */}
              <div className="px-5 py-3 overflow-y-auto max-h-[30vh] custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    {filteredCommands.map((cmd, index) => (
                      <motion.div
                        key={cmd.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 cursor-default"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${cmd.color}20`;
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                        }}
                      >
                        {/* Emoji */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                          style={{
                            background: `${cmd.color}10`,
                            border: `1px solid ${cmd.color}15`,
                          }}
                        >
                          {cmd.emoji}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{cmd.action}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                            Say: &ldquo;{cmd.phrases[0]}&rdquo;
                          </p>
                        </div>

                        {/* Try-it button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => cmd.handler()}
                          className="shrink-0 px-2 py-1 rounded-md text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `${cmd.color}15`,
                            color: cmd.color,
                            border: `1px solid ${cmd.color}20`,
                          }}
                        >
                          Try it
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── Footer ── */}
              <div className="px-5 py-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Shield size={12} />
                    <span>Voice processed locally</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">⇧</kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono">V</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

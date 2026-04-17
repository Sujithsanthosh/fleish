'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────
export interface VoiceCommand {
  id: string;
  phrases: string[];       // trigger phrases (lowercase)
  action: string;          // display label
  category: 'navigation' | 'scroll' | 'page' | 'ui';
  emoji: string;
  color: string;
  handler: () => void;
}

export interface VoiceCommandEvent {
  command: VoiceCommand;
  transcript: string;
  confidence: number;
}

interface UseVoiceCommandOptions {
  onCommand?: (event: VoiceCommandEvent) => void;
  enabled?: boolean;
  language?: string;
  continuous?: boolean;
}

interface UseVoiceCommandReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  lastCommand: VoiceCommand | null;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
}

// ─── Speech Recognition types ─────────────────────────────
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

// ─── Command definitions ───────────────────────────────────
function buildCommands(): VoiceCommand[] {
  return [
    // Navigation
    {
      id: 'nav-home',
      phrases: ['go home', 'go to home', 'home page', 'take me home', 'navigate home', 'homepage'],
      action: 'Go to Home',
      category: 'navigation',
      emoji: '🏠',
      color: '#10B981',
      handler: () => { window.location.href = '/'; },
    },
    {
      id: 'nav-about',
      phrases: ['go to about', 'about us', 'about section', 'show about', 'tell me about'],
      action: 'Go to About',
      category: 'navigation',
      emoji: 'ℹ️',
      color: '#3B82F6',
      handler: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-pricing',
      phrases: ['show pricing', 'go to pricing', 'pricing page', 'prices', 'how much', 'show prices', 'price'],
      action: 'Go to Pricing',
      category: 'navigation',
      emoji: '💰',
      color: '#F59E0B',
      handler: () => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-contact',
      phrases: ['contact us', 'go to contact', 'show contact', 'contact page', 'get in touch', 'reach out'],
      action: 'Go to Contact',
      category: 'navigation',
      emoji: '📞',
      color: '#8B5CF6',
      handler: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-how',
      phrases: ['how it works', 'how does it work', 'show how', 'explain how', 'go to how it works'],
      action: 'How It Works',
      category: 'navigation',
      emoji: '🔧',
      color: '#06B6D4',
      handler: () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-ecosystem',
      phrases: ['ecosystem', 'show ecosystem', 'go to ecosystem', 'order now', 'order', 'start ordering'],
      action: 'Go to Ecosystem',
      category: 'navigation',
      emoji: '🌐',
      color: '#10B981',
      handler: () => {
        document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-partner',
      phrases: ['partner with us', 'become partner', 'partner page', 'go to partner', 'delivery partner'],
      action: 'Partner Page',
      category: 'navigation',
      emoji: '🤝',
      color: '#EC4899',
      handler: () => { window.location.href = '/partner'; },
    },
    {
      id: 'nav-vendor',
      phrases: ['become vendor', 'vendor page', 'go to vendor', 'sell on fleish', 'become a vendor'],
      action: 'Vendor Page',
      category: 'navigation',
      emoji: '🏪',
      color: '#F97316',
      handler: () => { window.location.href = '/vendor'; },
    },
    {
      id: 'nav-jobs',
      phrases: ['show jobs', 'careers', 'go to jobs', 'job openings', 'join team', 'hiring', 'career page'],
      action: 'Careers Page',
      category: 'navigation',
      emoji: '💼',
      color: '#6366F1',
      handler: () => { window.location.href = '/jobs'; },
    },

    // Scroll commands
    {
      id: 'scroll-up',
      phrases: ['scroll up', 'go up', 'move up', 'page up'],
      action: 'Scroll Up',
      category: 'scroll',
      emoji: '⬆️',
      color: '#3B82F6',
      handler: () => { window.scrollBy({ top: -400, behavior: 'smooth' }); },
    },
    {
      id: 'scroll-down',
      phrases: ['scroll down', 'go down', 'move down', 'page down'],
      action: 'Scroll Down',
      category: 'scroll',
      emoji: '⬇️',
      color: '#10B981',
      handler: () => { window.scrollBy({ top: 400, behavior: 'smooth' }); },
    },
    {
      id: 'scroll-top',
      phrases: ['scroll to top', 'go to top', 'top of page', 'back to top', 'top'],
      action: 'Scroll to Top',
      category: 'scroll',
      emoji: '⏫',
      color: '#A855F7',
      handler: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    },
    {
      id: 'scroll-bottom',
      phrases: ['scroll to bottom', 'go to bottom', 'bottom of page', 'end of page', 'bottom'],
      action: 'Scroll to Bottom',
      category: 'scroll',
      emoji: '⏬',
      color: '#F97316',
      handler: () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); },
    },

    // Page actions
    {
      id: 'action-back',
      phrases: ['go back', 'previous page', 'back', 'navigate back'],
      action: 'Go Back',
      category: 'page',
      emoji: '◀️',
      color: '#EF4444',
      handler: () => { window.history.back(); },
    },
    {
      id: 'action-forward',
      phrases: ['go forward', 'next page', 'forward', 'navigate forward'],
      action: 'Go Forward',
      category: 'page',
      emoji: '▶️',
      color: '#22C55E',
      handler: () => { window.history.forward(); },
    },
    {
      id: 'action-reload',
      phrases: ['reload page', 'refresh page', 'reload', 'refresh'],
      action: 'Reload Page',
      category: 'page',
      emoji: '🔄',
      color: '#EF4444',
      handler: () => { window.location.reload(); },
    },

    // UI commands
    {
      id: 'ui-dark',
      phrases: ['dark mode', 'enable dark mode', 'switch to dark', 'night mode'],
      action: 'Dark Mode',
      category: 'ui',
      emoji: '🌙',
      color: '#6366F1',
      handler: () => {
        document.documentElement.classList.add('dark');
      },
    },
    {
      id: 'ui-light',
      phrases: ['light mode', 'enable light mode', 'switch to light', 'day mode'],
      action: 'Light Mode',
      category: 'ui',
      emoji: '☀️',
      color: '#F59E0B',
      handler: () => {
        document.documentElement.classList.remove('dark');
      },
    },
    {
      id: 'ui-search',
      phrases: ['open search', 'search', 'find', 'look for', 'command palette', 'open commands'],
      action: 'Open Search',
      category: 'ui',
      emoji: '🔍',
      color: '#06B6D4',
      handler: () => {
        // Simulate Ctrl+K to open command palette
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          ctrlKey: true,
          bubbles: true,
        });
        window.dispatchEvent(event);
      },
    },
    {
      id: 'ui-fullscreen',
      phrases: ['fullscreen', 'full screen', 'enter fullscreen', 'maximize'],
      action: 'Toggle Fullscreen',
      category: 'ui',
      emoji: '🖥️',
      color: '#14B8A6',
      handler: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      },
    },
    {
      id: 'ui-zoom-in',
      phrases: ['zoom in', 'make bigger', 'increase size', 'larger'],
      action: 'Zoom In',
      category: 'ui',
      emoji: '🔎',
      color: '#6366F1',
      handler: () => {
        const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = `${current * 1.15}px`;
      },
    },
    {
      id: 'ui-zoom-out',
      phrases: ['zoom out', 'make smaller', 'decrease size', 'smaller'],
      action: 'Zoom Out',
      category: 'ui',
      emoji: '🔍',
      color: '#F97316',
      handler: () => {
        const current = parseFloat(getComputedStyle(document.documentElement).fontSize);
        document.documentElement.style.fontSize = `${current * 0.85}px`;
      },
    },
    {
      id: 'ui-reset-zoom',
      phrases: ['reset zoom', 'normal size', 'default size', 'reset size'],
      action: 'Reset Zoom',
      category: 'ui',
      emoji: '↩️',
      color: '#64748B',
      handler: () => {
        document.documentElement.style.fontSize = '';
      },
    },
  ];
}

// ─── Fuzzy phrase matching ─────────────────────────────────
function matchCommand(transcript: string, commands: VoiceCommand[]): VoiceCommand | null {
  const normalized = transcript.toLowerCase().trim();
  if (!normalized) return null;

  // 1. Exact phrase match
  for (const cmd of commands) {
    for (const phrase of cmd.phrases) {
      if (normalized === phrase || normalized.includes(phrase)) {
        return cmd;
      }
    }
  }

  // 2. Fuzzy word-overlap match (≥70% of phrase words must be present)
  let bestMatch: VoiceCommand | null = null;
  let bestScore = 0;

  for (const cmd of commands) {
    for (const phrase of cmd.phrases) {
      const phraseWords = phrase.split(' ');
      const matchedWords = phraseWords.filter(w => normalized.includes(w));
      const score = matchedWords.length / phraseWords.length;
      if (score >= 0.7 && score > bestScore) {
        bestScore = score;
        bestMatch = cmd;
      }
    }
  }

  return bestMatch;
}

// ─── Hook ──────────────────────────────────────────────────
export function useVoiceCommand(options: UseVoiceCommandOptions = {}): UseVoiceCommandReturn {
  const {
    onCommand,
    enabled = true,
    language = 'en-US',
    continuous = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const commandsRef = useRef<VoiceCommand[]>(buildCommands());
  const cooldownRef = useRef(false);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldBeListeningRef = useRef(false);

  // Check support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !enabled) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return;
    }

    // Stop existing instance
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          final += text;
          setConfidence(result[0].confidence);
        } else {
          interim += text;
        }
      }

      if (interim) setInterimTranscript(interim);

      if (final) {
        setTranscript(final);
        setInterimTranscript('');

        // Match and execute command (with cooldown)
        if (!cooldownRef.current) {
          const matched = matchCommand(final, commandsRef.current);
          if (matched) {
            cooldownRef.current = true;
            setLastCommand(matched);

            // Execute the command
            matched.handler();

            // Notify via callback
            onCommand?.({
              command: matched,
              transcript: final,
              confidence: event.results[event.resultIndex][0].confidence,
            });

            // Cooldown to prevent rapid-fire
            setTimeout(() => {
              cooldownRef.current = false;
            }, 1500);
          }
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "aborted" is expected when we stop/restart
      if (event.error === 'aborted') return;
      if (event.error === 'no-speech') {
        // Not a real error, just no speech detected
        return;
      }
      setError(event.error);
      if (event.error === 'not-allowed') {
        setIsListening(false);
        shouldBeListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if we should still be listening
      if (shouldBeListeningRef.current && enabled) {
        restartTimerRef.current = setTimeout(() => {
          if (shouldBeListeningRef.current) {
            try {
              recognition.start();
            } catch {}
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;
    shouldBeListeningRef.current = true;

    try {
      recognition.start();
    } catch (err) {
      setError('Failed to start speech recognition');
    }
  }, [isSupported, enabled, language, continuous, onCommand]);

  const stopListening = useCallback(() => {
    shouldBeListeningRef.current = false;
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Stop when disabled
  useEffect(() => {
    if (!enabled && isListening) {
      stopListening();
    }
  }, [enabled, isListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    lastCommand,
    confidence,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}

export { buildCommands };
export type { VoiceCommand as VoiceCommandType };

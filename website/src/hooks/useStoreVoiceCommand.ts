'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import { Product } from '@/app/store/[id]/storeData';

interface SpeechRecognitionAlternativeLike {
  transcript?: string;
}

interface SpeechRecognitionResultLike {
  0?: SpeechRecognitionAlternativeLike;
  isFinal?: boolean;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: null | (() => void);
  onend: null | (() => void);
  onresult: null | ((event: SpeechRecognitionEventLike) => void);
  onerror: null | ((event: SpeechRecognitionErrorEventLike) => void);
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionLike;
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;

  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null;
}

function subscribeToSpeechRecognitionSupport(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => { };
  }

  window.addEventListener('load', onStoreChange);
  return () => window.removeEventListener('load', onStoreChange);
}

function getSpeechRecognitionSupportSnapshot() {
  return Boolean(getSpeechRecognitionConstructor());
}

export interface ParsedOrder {
  productId?: string;
  productName: string;
  amount?: number;
  weight?: number;
  quantity: number;
  variant?: string;
  cutType?: string;
}

const CUT_TYPE_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /\bsmall(?:\s+pieces?)?\b/, value: 'small' },
  { pattern: /\bmedium(?:\s+pieces?)?\b/, value: 'medium' },
  { pattern: /\blarge(?:\s+pieces?)?\b/, value: 'large' },
  { pattern: /\bcurry(?:\s+cut)?\b/, value: 'curry' },
  { pattern: /\bfry(?:\s+cut)?\b/, value: 'fry' },
  { pattern: /\bbiryani(?:\s+cut)?\b/, value: 'biryani' },
];

const VARIANT_PATTERNS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /\bwith\s+skin\b/, value: 'with-skin' },
  { pattern: /\bwithout\s+skin\b/, value: 'without-skin' },
  { pattern: /\bskinless\b/, value: 'without-skin' },
];

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/₹/g, ' rs ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildProductSearchTerms(product: Product): string[] {
  const terms = new Set<string>();

  terms.add(product.name.toLowerCase());
  if (product.subcategory) terms.add(product.subcategory.toLowerCase());
  product.tags?.forEach((tag) => terms.add(tag.toLowerCase()));
  product.variants?.forEach((variant) => terms.add(variant.name.toLowerCase()));

  product.name
    .toLowerCase()
    .split(/[\s()/-]+/)
    .filter((part) => part.length > 2)
    .forEach((part) => terms.add(part));

  return Array.from(terms).filter(Boolean);
}

function chooseProductFromTranscript(products: Product[], transcript: string): Product | null {
  let bestMatch: { product: Product; score: number } | null = null;

  for (const product of products) {
    let score = 0;

    for (const term of buildProductSearchTerms(product)) {
      if (!term) continue;
      if (transcript.includes(term)) {
        score = Math.max(score, term.length + (term === product.name.toLowerCase() ? 10 : 0));
      }
    }

    if (!score) continue;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { product, score };
    }
  }

  return bestMatch?.product || null;
}

function extractAmount(transcript: string): number | undefined {
  const amountMatch =
    transcript.match(/\b(?:for|worth|rs|rupees?)\s*(\d{2,4})\b/) ||
    transcript.match(/\b(\d{2,4})\s*(?:rs|rupees?)\b/);

  return amountMatch ? parseInt(amountMatch[1], 10) : undefined;
}

function extractWeight(transcript: string): number | undefined {
  const weightMatch = transcript.match(/\b(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilos|g|gm|grams?)\b/);
  if (!weightMatch) return undefined;

  const amount = parseFloat(weightMatch[1]);
  const unit = weightMatch[2];

  if (unit.startsWith('k')) {
    return Math.round(amount * 1000);
  }

  return Math.round(amount);
}

function extractQuantity(transcript: string): number {
  const quantityMatch = transcript.match(/\b(\d+)\s*(?:pieces?|items?|packs?|packets?)\b/);
  return quantityMatch ? parseInt(quantityMatch[1], 10) : 1;
}

function extractVariant(transcript: string): string | undefined {
  return VARIANT_PATTERNS.find(({ pattern }) => pattern.test(transcript))?.value;
}

function extractCutType(transcript: string): string | undefined {
  return CUT_TYPE_PATTERNS.find(({ pattern }) => pattern.test(transcript))?.value;
}

export function useStoreVoiceCommand(products: Product[]) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedOrder, setParsedOrder] = useState<ParsedOrder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const listeningRef = useRef(false);
  const isSupported = useSyncExternalStore(
    subscribeToSpeechRecognitionSupport,
    getSpeechRecognitionSupportSnapshot,
    () => false
  );

  const parseOrder = useCallback((text: string): ParsedOrder | null => {
    const normalized = normalizeText(text);
    const matchedProduct = chooseProductFromTranscript(products, normalized);

    if (!matchedProduct) return null;

    return {
      productId: matchedProduct.id,
      productName: matchedProduct.name,
      amount: extractAmount(normalized),
      weight: extractWeight(normalized),
      quantity: extractQuantity(normalized),
      variant: extractVariant(normalized),
      cutType: extractCutType(normalized),
    };
  }, [products]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listeningRef.current) return;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return;
    }

    listeningRef.current = true;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    listeningRef.current = false;
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      listeningRef.current = true;
      setIsListening(true);
    };

    recognition.onend = () => {
      listeningRef.current = false;
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const results = event.results;
      const lastResult = results[results.length - 1];
      const text = String(lastResult?.[0]?.transcript || '').trim();
      setTranscript(text);

      if (lastResult?.isFinal) {
        const order = parseOrder(text);
        if (order) {
          setParsedOrder(order);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      console.error('Speech recognition error:', event.error);
      listeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      listeningRef.current = false;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [parseOrder]);

  return {
    isListening,
    isSupported,
    transcript,
    parsedOrder,
    startListening,
    stopListening,
    toggleListening,
    parseOrder,
  };
}

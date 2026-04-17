'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, ShoppingCart, Sparkles, CheckCircle, AlertCircle, ChefHat } from 'lucide-react';
import { useStoreVoiceCommand, ParsedOrder } from '@/hooks/useStoreVoiceCommand';
import { Product, StoreData, PricingOption, ProductVariant } from '@/app/store/[id]/storeData';

interface StoreVoiceCommandUIProps {
  store: StoreData;
  products: Product[];
  onAddToCart: (product: Product, variant?: ProductVariant, pricingOption?: PricingOption, cutType?: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface LastOrderState {
  order: ParsedOrder;
  product: Product | null;
  success: boolean;
  message: string;
}

function WaveformVisualizer({ isActive }: { isActive: boolean }) {
  const bars = 20;

  return (
    <div className="flex items-center justify-center gap-[2px] h-6">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-emerald-400"
          animate={
            isActive
              ? { height: [4, 12 + Math.random() * 16, 4], opacity: [0.4, 0.9, 0.4] }
              : { height: 3, opacity: 0.2 }
          }
          transition={
            isActive
              ? { duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.03, ease: 'easeInOut' }
              : { duration: 0.5 }
          }
        />
      ))}
    </div>
  );
}

function formatOrderSummary(order: ParsedOrder) {
  const parts: string[] = [];

  if (order.amount) {
    parts.push(`Rs ${order.amount}`);
  } else if (order.weight) {
    parts.push(order.weight >= 1000 ? `${order.weight / 1000}kg` : `${order.weight}g`);
  }

  if (order.quantity > 1) {
    parts.push(`x${order.quantity}`);
  }

  if (order.variant) {
    parts.push(order.variant.replace(/-/g, ' '));
  }

  if (order.cutType) {
    parts.push(`${order.cutType} cut`);
  }

  return parts.join(' - ');
}

function pickPricingOption(product: Product, order: ParsedOrder) {
  if (!product.pricingOptions?.length) return undefined;

  if (order.amount) {
    const exactAmountOption = product.pricingOptions.find(
      (option) => option.type === 'calculated' && option.value === order.amount
    );
    if (exactAmountOption) return exactAmountOption;
  }

  if (order.weight) {
    const exactWeightOption = product.pricingOptions.find(
      (option) => option.type === 'fixed' && option.value === order.weight
    );
    if (exactWeightOption) return exactWeightOption;
  }

  if (product.pricingOptions.some((option) => option.type === 'fixed')) {
    return product.pricingOptions.find((option) => option.type === 'fixed');
  }

  return product.pricingOptions[0];
}

function pickVariant(product: Product, order: ParsedOrder) {
  if (!product.variants?.length) return undefined;

  if (order.variant) {
    const matchedVariant = product.variants.find(
      (variant) =>
        variant.id.toLowerCase().includes(order.variant!.toLowerCase()) ||
        variant.name.toLowerCase().includes(order.variant!.toLowerCase())
    );
    if (matchedVariant) return matchedVariant;
  }

  return product.variants.find((variant) => variant.isAvailable) || product.variants[0];
}

export function StoreVoiceCommandUI({ store, products, onAddToCart, isOpen, onClose }: StoreVoiceCommandUIProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [lastOrder, setLastOrder] = useState<LastOrderState | null>(null);

  const {
    isListening,
    isSupported,
    transcript,
    parsedOrder,
    stopListening,
    toggleListening,
  } = useStoreVoiceCommand(products);

  const executeOrder = useCallback((order: ParsedOrder) => {
    const matchedProduct =
      products.find((product) => product.id === order.productId) ||
      products.find(
        (product) =>
          product.name.toLowerCase().includes(order.productName.toLowerCase()) ||
          order.productName.toLowerCase().includes(product.name.toLowerCase())
      );

    if (!matchedProduct) {
      setLastOrder({
        order,
        product: null,
        success: false,
        message: 'Could not match that product. Try the exact product name shown in the store.',
      });
      return;
    }

    const pricingOption = pickPricingOption(matchedProduct, order);
    const variant = pickVariant(matchedProduct, order);

    for (let count = 0; count < Math.max(order.quantity, 1); count += 1) {
      onAddToCart(matchedProduct, variant, pricingOption, order.cutType);
    }

    const orderDetails = formatOrderSummary(order);
    setLastOrder({
      order,
      product: matchedProduct,
      success: true,
      message: orderDetails ? `${matchedProduct.name} - ${orderDetails}` : matchedProduct.name,
    });
  }, [onAddToCart, products]);

  useEffect(() => {
    if (!parsedOrder || !isOpen) return;
    executeOrder(parsedOrder);
  }, [executeOrder, isOpen, parsedOrder]);

  useEffect(() => {
    if (!lastOrder) return;

    const timeout = window.setTimeout(() => setLastOrder(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [lastOrder]);

  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
    }
  }, [isListening, isOpen, stopListening]);

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] bg-red-500/90 text-white px-4 py-2 rounded-lg">
        Voice not supported in your browser
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-[9998] w-[450px] max-w-[calc(100vw-24px)]"
          >
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              <div className="p-5 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Voice Order</h3>
                      <p className="text-slate-400 text-xs">Speak to order from {store.name}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleListening}
                    className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/30'
                        : 'bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30'
                    }`}
                  >
                    {isListening && (
                      <>
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-red-400"
                          animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-red-400"
                          animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                        />
                      </>
                    )}
                    {isListening ? (
                      <Mic className="w-8 h-8 text-white relative z-10" />
                    ) : (
                      <MicOff className="w-8 h-8 text-white relative z-10" />
                    )}
                  </motion.button>

                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">
                      {isListening ? 'Listening...' : 'Tap to speak'}
                    </p>
                    <p className="text-slate-400 text-xs mb-3">
                      {isListening ? 'Say something like "Buy chicken for 100 rupees"' : 'Click the mic to start ordering'}
                    </p>
                    <WaveformVisualizer isActive={isListening} />
                  </div>
                </div>

                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Heard:</p>
                    <p className="text-white text-sm">&ldquo;{transcript}&rdquo;</p>
                  </motion.div>
                )}

                {lastOrder && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
                      lastOrder.success
                        ? 'bg-emerald-500/10 border border-emerald-500/30'
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}
                  >
                    {lastOrder.success ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                    <div>
                      <p className={`font-semibold ${lastOrder.success ? 'text-emerald-400' : 'text-red-400'}`}>
                        {lastOrder.success ? 'Added to Cart!' : 'Voice Order Failed'}
                      </p>
                      <p className="text-slate-400 text-xs">{lastOrder.message}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="border-t border-white/5">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="w-full p-3 flex items-center justify-center gap-2 text-slate-400 text-xs hover:text-white transition-colors"
                >
                  <ChefHat className="w-4 h-4" />
                  {showHelp ? 'Hide examples' : 'Show voice command examples'}
                </button>

                <AnimatePresence>
                  {showHelp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 overflow-hidden"
                    >
                      <div className="space-y-2 text-xs">
                        <p className="text-slate-500 font-semibold uppercase tracking-wider mb-2">Try saying:</p>
                        {[
                          '"Buy broiler chicken for 100 rupees"',
                          '"Add naatu kozhi 200 rs with skin"',
                          '"Chicken breast 500 grams curry cut"',
                          '"Mutton 1 kg small pieces"',
                          '"Beef 300 rupees fry cut"',
                          '"Add 2 pieces chicken wings"',
                        ].map((example, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                          >
                            <Mic className="w-3 h-3 text-emerald-400" />
                            <span className="text-slate-300">{example}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-3 bg-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShoppingCart className="w-3 h-3" />
                <span>Items will be added to your cart automatically</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

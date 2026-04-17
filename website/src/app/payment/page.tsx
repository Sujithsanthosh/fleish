"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Shield, Lock, CheckCircle2, Crown, Zap, Sparkles, 
  ArrowLeft, Calendar, CreditCard as CardIcon, IndianRupee,
  Wallet, Building2, Gift, Percent, QrCode, ScanLine, Download, Smartphone
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// UPI Configuration - UPDATE THESE WITH REAL DETAILS
const UPI_CONFIG = {
  upiId: 'fleish@upi', // Replace with actual UPI ID
  name: 'Fleish Technologies',
  merchantCode: '1234',
};

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const billing = searchParams.get('billing') || 'monthly';
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showQR, setShowQR] = useState(false);

  const planDetails: Record<string, { name: string; price: number; color: string; icon: any; features: string[] }> = {
    free: {
      name: "Free",
      price: 0,
      color: "emerald",
      icon: Sparkles,
      features: ["Standard delivery", "Basic tracking", "All vendors"]
    },
    basic: {
      name: "Basic",
      price: billing === 'yearly' ? 950 : 99,
      color: "cyan",
      icon: Zap,
      features: ["Free delivery ₹199+", "5% discount", "Priority support"]
    },
    pro: {
      name: "Pro",
      price: billing === 'yearly' ? 1900 : 199,
      color: "orange",
      icon: Crown,
      features: ["Free delivery ALL", "10% discount", "24/7 Premium support", "Family sharing"]
    }
  };

  const currentPlan = planDetails[plan] || planDetails.pro;
  const ColorIcon = currentPlan.icon;

  const finalPrice = currentPlan.price - discount;
  const gst = Math.round(finalPrice * 0.18);
  const total = finalPrice + gst;

  // Generate UPI Deep Link
  const upiDeepLink = useMemo(() => {
    const amount = total.toFixed(2);
    const tn = encodeURIComponent(`Fleish ${currentPlan.name} Plan - ${billing}`);
    return `upi://pay?pa=${UPI_CONFIG.upiId}&pn=${encodeURIComponent(UPI_CONFIG.name)}&am=${amount}&cu=INR&tn=${tn}&mc=${UPI_CONFIG.merchantCode}`;
  }, [total, currentPlan.name, billing]);

  // Generate QR Code URL using QR Server API
  const qrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiDeepLink)}`;
  }, [upiDeepLink]);

  const handlePromoApply = () => {
    if (promoCode.toLowerCase() === 'fleish20') {
      setDiscount(Math.round(currentPlan.price * 0.2));
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-4">Payment Successful!</h2>
          <p className="text-slate-400 mb-8">
            Welcome to {currentPlan.name} plan. Your subscription is now active.
          </p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Plan</span>
              <span className="font-bold text-white">{currentPlan.name}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Billing</span>
              <span className="font-bold text-white capitalize">{billing}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-slate-400">Total Paid</span>
              <span className="font-black text-2xl text-emerald-400">₹{total}</span>
            </div>
          </motion.div>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:shadow-xl transition-all"
          >
            Start Ordering
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-300 font-medium">256-bit SSL Secure</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left - Payment Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-black text-white mb-2">Complete Your Subscription</h1>
              <p className="text-slate-400">Choose your preferred payment method</p>
            </div>

            {/* Payment Methods */}
            <div className="glass-card rounded-2xl p-6 mb-6 border border-white/10">
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => { setPaymentMethod('card'); setShowQR(false); }}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'card' 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' 
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-white' : 'text-slate-400'}`}>Card</span>
                </button>
                <button
                  onClick={() => { setPaymentMethod('upi'); setShowQR(true); }}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'upi' 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' 
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <QrCode className={`w-6 h-6 ${paymentMethod === 'upi' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${paymentMethod === 'upi' ? 'text-white' : 'text-slate-400'}`}>UPI QR</span>
                </button>
                <button
                  onClick={() => { setPaymentMethod('netbanking'); setShowQR(false); }}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === 'netbanking' 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' 
                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <Building2 className={`w-6 h-6 ${paymentMethod === 'netbanking' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${paymentMethod === 'netbanking' ? 'text-white' : 'text-slate-400'}`}>Net Banking</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === 'card' && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 mb-6 border border-white/10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-12 h-9 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md" />
                        <CreditCard className="w-8 h-8 text-white/50" />
                      </div>
                      <div className="text-white text-xl tracking-widest mb-6 font-mono">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-white/50 text-xs mb-1">Cardholder</div>
                          <div className="text-white font-medium uppercase">{cardName || 'YOUR NAME'}</div>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">Expires</div>
                          <div className="text-white font-medium">{expiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                        />
                        <CardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Expiry Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '');
                              if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                              setExpiry(v);
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">CVV</label>
                        <div className="relative">
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                            placeholder="123"
                            maxLength={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                          />
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {paymentMethod === 'upi' && (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* QR Code Section */}
                    <div className="bg-white rounded-2xl p-6 text-center">
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <ScanLine className="w-5 h-5 text-slate-800" />
                        <span className="font-bold text-slate-800">Scan to Pay</span>
                      </div>
                      <div className="relative inline-block">
                        <motion.img 
                          src={qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-64 h-64 mx-auto rounded-xl"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Smartphone className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-4">
                        Scan with any UPI app<br/>(GPay, PhonePe, Paytm, etc.)
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Paying to</p>
                        <p className="font-bold text-slate-800">{UPI_CONFIG.name}</p>
                        <p className="text-sm text-slate-600">{UPI_CONFIG.upiId}</p>
                      </div>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-slate-500 text-sm">OR</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Manual UPI Entry */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Enter UPI ID</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@upi"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                        />
                        <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      </div>
                    </div>

                    {/* Quick UPI Apps */}
                    <div className="grid grid-cols-4 gap-2">
                      {['GPay', 'PhonePe', 'Paytm', 'Amazon'].map((app) => (
                        <button 
                          key={app}
                          onClick={() => window.open(upiDeepLink, '_blank')}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-xs font-medium text-slate-300 flex flex-col items-center gap-1"
                        >
                          <Smartphone className="w-4 h-4" />
                          {app}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => window.open(qrCodeUrl, '_blank')}
                      className="w-full py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download QR Code
                    </button>
                  </motion.div>
                )}

                {paymentMethod === 'netbanking' && (
                  <motion.div
                    key="netbanking"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p className="text-slate-400 text-sm mb-4">Select your bank</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'Yes Bank', 'PNB', 'Bank of Baroda'].map((bank) => (
                        <button 
                          key={bank}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-sm font-medium text-slate-300 text-left flex items-center gap-3"
                        >
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {bank}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Promo Code */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Have a Promo Code?</h3>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code (try: FLEISH20)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
                />
                <button 
                  onClick={handlePromoApply}
                  className="px-6 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-all"
                >
                  Apply
                </button>
              </div>
              {discount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-emerald-400"
                >
                  <Percent className="w-4 h-4" />
                  <span className="text-sm font-medium">20% discount applied! You saved ₹{discount}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right - Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glass-card rounded-2xl p-6 sticky top-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-emerald-400" />
                Order Summary
              </h3>
              
              {/* Plan Card */}
              <div className={`p-4 rounded-xl mb-6 border ${
                currentPlan.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' :
                currentPlan.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/30' :
                'bg-orange-500/10 border-orange-500/30'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentPlan.color === 'emerald' ? 'bg-emerald-500/20' :
                      currentPlan.color === 'cyan' ? 'bg-cyan-500/20' :
                      'bg-orange-500/20'
                    }`}>
                      <ColorIcon className={`w-6 h-6 ${
                        currentPlan.color === 'emerald' ? 'text-emerald-400' :
                        currentPlan.color === 'cyan' ? 'text-cyan-400' :
                        'text-orange-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{currentPlan.name}</h4>
                      <p className="text-xs text-slate-400 capitalize">{billing} billing</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-white">₹{currentPlan.price}</span>
                </div>
                <div className="space-y-2">
                  {currentPlan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 className={`w-4 h-4 ${
                        currentPlan.color === 'emerald' ? 'text-emerald-400' :
                        currentPlan.color === 'cyan' ? 'text-cyan-400' :
                        'text-orange-400'
                      }`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{currentPlan.price}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>Discount (20%)</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-400">₹{total}</span>
                </div>
              </div>

              {/* Pay Button */}
              {paymentMethod !== 'upi' ? (
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ₹{total}
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">Scan the QR code with any UPI app</p>
                  <p className="text-emerald-400 font-medium">Amount: ₹{total}</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-4 text-slate-500 text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

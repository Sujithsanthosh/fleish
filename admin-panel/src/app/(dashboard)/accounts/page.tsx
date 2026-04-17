"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
   Building2, Landmark, ArrowUpRight, ArrowDownRight,
   FileText, CheckCircle2, RefreshCcw, Search,
   DownloadCloud, Store, Truck, Users, Activity,
   Calculator, Calendar, ShieldCheck, Edit, Plus, X,
   Key, Send, Briefcase, FileSpreadsheet, Download,
   Phone, MapPin, ExternalLink, Loader2, FilePlus, ReceiptText, Percent, PiggyBank, FolderOpen
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000') : 'http://localhost:3000';

async function api(path: string) {
   const r = await fetch(BASE + path);
   return r.ok ? r.json() : [];
}

// Type Definitions
type PartyType = 'Fleish_MASTER' | 'VENDOR' | 'RIDER' | 'CUSTOMER' | 'GOVERNMENT_TAX';
type TransactionType = 'INBOUND_REVENUE' | 'VENDOR_PAYOUT' | 'RIDER_WAGE' | 'CUSTOMER_REFUND' | 'GST_REMITTANCE' | 'TDS_HOLD';

interface BankDetails {
   type: 'UPI' | 'BANK';
   target: string;
   ifsc?: string;
}

interface LedgerEntry {
   id: string;
   invoiceNo: string;
   date: string;
   partyName: string;
   partyType: PartyType;
   transactionType: TransactionType;
   grossAmount: number;
   platformFee: number;
   tdsHold: number;
   netAmount: number;
   status: 'CLEARED' | 'PROCESSING' | 'ON_HOLD' | 'DISPUTED';
   bankRef: string;
   recipientBankDetails?: BankDetails;
}

export default function AccountsPage() {
   const router = useRouter();
   const [ledger, setLedger] = useState<LedgerEntry[]>([]);
   const [activeTab, setActiveTab] = useState<'MASTER' | 'VENDORS' | 'RIDERS' | 'TAX_COMPLIANCE' | 'PNL_STATEMENT'>('MASTER');
   const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Modals
   const [isBankSettingsOpen, setIsBankSettingsOpen] = useState(false);
   const [activeAuditEntry, setActiveAuditEntry] = useState<LedgerEntry | null>(null);
   const [isManualSettlementOpen, setIsManualSettlementOpen] = useState(false);

   // Custom CA Settlement Execution States
   const [settlementMethod, setSettlementMethod] = useState<'API_PUSH' | 'MANUAL_RTGS' | 'CASH_SETTLED'>('API_PUSH');
   const [customAmountStr, setCustomAmountStr] = useState<string>('');
   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
   const [paymentSuccess, setPaymentSuccess] = useState(false);

   const [manualSettleObj, setManualSettleObj] = useState({
      partyName: '',
      partyType: 'VENDOR' as PartyType,
      amount: '',
      applyPlatformFee: true,
      applyTds: true,
      bankAccount: ''
   });

   const fetchLedger = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const data = await api('/ledger');
         if (Array.isArray(data)) {
            setLedger(data);
         } else {
            setLedger([]);
         }
      } catch (e) {
         setError('Failed to load ledger data. Check your connection.');
         setLedger([]);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      void fetchLedger();
   }, [fetchLedger]);

   useEffect(() => {
      if (activeAuditEntry) {
         setCustomAmountStr(Math.abs(activeAuditEntry.netAmount).toString());
         setPaymentSuccess(false);
         setIsProcessingPayment(false);
      }
   }, [activeAuditEntry]);

   const [masterConfig, setMasterConfig] = useState({
      bankName: 'HDFC Corporate Master',
      accNumber: '501009123812',
      ifsc: 'HDFC0001812',
      masterUpi: 'Fleishliquidity@hdfcbank'
   });

   const { hasPermission } = useAuthStore();
   const canEdit = hasPermission('ACCOUNTS', 'EDIT');

   // Logic: Closing an existing pending audit
   const executeFinalAudit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeAuditEntry) return;

      setIsProcessingPayment(true);
      setTimeout(() => {
         const finalCustomAmount = parseFloat(customAmountStr) || 0;

         setLedger(ledger.map(entry => {
            if (entry.id === activeAuditEntry.id) {
               return {
                  ...entry,
                  status: 'CLEARED',
                  netAmount: entry.netAmount > 0 ? finalCustomAmount : -finalCustomAmount,
                  bankRef: settlementMethod === 'API_PUSH' ? `TRX_BNK_${Math.floor(Math.random() * 1000000)}` : `MNL_REF_${Math.floor(Math.random() * 100000)}`
               };
            }
            return entry;
         }));

         setIsProcessingPayment(false);
         setPaymentSuccess(true);
         setTimeout(() => { setActiveAuditEntry(null); setPaymentSuccess(false); }, 3000);
      }, 2000);
   };

   // Logic: Manual Journal Entry / Sending Money Arbitrarily directly from Dashboard
   const executeDirectSettlement = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessingPayment(true);

      setTimeout(() => {
         const gross = parseFloat(manualSettleObj.amount) || 0;
         const comm = manualSettleObj.applyPlatformFee ? gross * 0.03 : 0;
         const tds = manualSettleObj.applyTds ? gross * 0.01 : 0;
         const net = gross - comm - tds;

         const newEntry: LedgerEntry = {
            id: `LEDG-00${ledger.length + 1}`,
            invoiceNo: `MNL-SETT-${Math.floor(Math.random() * 10000)}`,
            date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }),
            partyName: manualSettleObj.partyName,
            partyType: manualSettleObj.partyType,
            transactionType: manualSettleObj.partyType === 'VENDOR' ? 'VENDOR_PAYOUT' : manualSettleObj.partyType === 'RIDER' ? 'RIDER_WAGE' : 'CUSTOMER_REFUND',
            grossAmount: -gross,
            platformFee: comm,
            tdsHold: tds,
            netAmount: -net,
            status: 'CLEARED',
            bankRef: `API_LIVESENT_${Math.floor(Math.random() * 100000)}`,
            recipientBankDetails: { type: 'BANK', target: manualSettleObj.bankAccount }
         };

         setLedger([newEntry, ...ledger]);
         setIsProcessingPayment(false);
         setPaymentSuccess(true);

         setTimeout(() => { setIsManualSettlementOpen(false); setPaymentSuccess(false); }, 3000);
         setManualSettleObj({ partyName: '', partyType: 'VENDOR', amount: '', applyPlatformFee: true, applyTds: true, bankAccount: '' });
      }, 2000);
   };

   const executeMockDownload = (type: 'PDF' | 'EXCEL' | 'GSTR1') => {
      alert(`[ENTERPRISE SYSTEM]: Commencing strict generation of statutory ${type} ledger package... Local save triggered.`);
   };

   const traverseToProfile = (party: PartyType) => {
      if (party === 'VENDOR') router.push('/vendors');
      else if (party === 'RIDER') router.push('/riders');
      else if (party === 'CUSTOMER') router.push('/customers');
      else if (party === 'Fleish_MASTER' || party === 'GOVERNMENT_TAX') router.push('/analytics');
   };

   // CA Advanced Math calculations
   const totalHandling = ledger.filter(l => l.status === 'CLEARED');
   const FleishNetBalance = totalHandling.filter(l => l.netAmount > 0).reduce((acc, curr) => acc + curr.netAmount, 0) - Math.abs(totalHandling.filter(l => l.netAmount < 0).reduce((acc, curr) => acc + curr.netAmount, 0));
   const totalPendingLiabilities = ledger.filter(l => l.status !== 'CLEARED' && l.netAmount < 0).reduce((acc, curr) => acc + Math.abs(curr.netAmount), 0);
   const totalRealizedProfit = ledger.reduce((a, c) => a + c.platformFee, 0);

   let displayedLedger = ledger;
   if (activeTab === 'VENDORS') displayedLedger = displayedLedger.filter(l => l.partyType === 'VENDOR');
   if (activeTab === 'RIDERS') displayedLedger = displayedLedger.filter(l => l.partyType === 'RIDER');
   if (activeTab === 'TAX_COMPLIANCE') displayedLedger = displayedLedger.filter(l => l.tdsHold > 0 || l.partyType === 'GOVERNMENT_TAX');

   if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      displayedLedger = displayedLedger.filter(l =>
         l.partyName.toLowerCase().includes(term) || l.invoiceNo.toLowerCase().includes(term)
      );
   }

   // Active derived Manual net calculation
   const getManualNetCalc = () => {
      const g = parseFloat(manualSettleObj.amount) || 0;
      const c = manualSettleObj.applyPlatformFee ? g * 0.03 : 0;
      const t = manualSettleObj.applyTds ? g * 0.01 : 0;
      return g - c - t;
   };

   return (
      <div className="space-y-6 animate-in fade-in duration-300 pb-12">

         {/* 1. Global Navigation Bar */}
         <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
               <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">Chartered Accounting Hub</h1>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-indigo-200">Ultimate Edition</span>
               </div>
               <p className="text-gray-500 text-sm mt-1">GSTR Filing, P&L Statements, Direct Settlements, and Enterprise Banking Control.</p>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={fetchLedger} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-100 transition-all disabled:opacity-50">
                  <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
               </button>
               <button onClick={() => setIsBankSettingsOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-100 transition-all">
                  <Landmark className="w-4 h-4" />
                  Configure Liquidity Setup
               </button>
               <button onClick={() => setIsManualSettlementOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 border border-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                  <FilePlus className="w-4 h-4" />
                  Create New Settlement (Transfer)
               </button>
            </div>
         </div>

         {/* 1.5. Advanced Enterprise SaaS Hub */}
         <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden relative group">
            <div className="absolute right-0 top-0 p-16 bg-indigo-500 opacity-20 blur-3xl rounded-full" />
            <div className="relative z-10">
               <h3 className="text-white font-black flex items-center gap-2 mb-4 tracking-tight"><Building2 className="w-5 h-5 text-indigo-400" /> Linked C.A. Operations Chamber & SaaS Ext.</h3>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                     { name: 'Client CRM', sub: 'Business logic', icon: Users, path: '/ca-clients' },
                     { name: 'Compliance Engine', sub: 'Auto-tracking', icon: ShieldCheck, path: '/ca-compliance' },
                     { name: 'DMS Vault', sub: 'AWS S3 files', icon: FolderOpen, path: '/ca-documents' },
                     { name: 'GST & GSTR', sub: 'Tax reporting', icon: Calculator, path: '/ca-gst' },
                     { name: 'Workflows', sub: 'Kanban tasks', icon: CheckCircle2, path: '/ca-tasks' },
                  ].map((app, i) => (
                     <div key={i} onClick={() => router.push(app.path)} className="bg-slate-800/80 hover:bg-indigo-600 cursor-pointer transition-all border border-slate-700 hover:border-indigo-500 p-4 rounded-xl flex flex-col items-center justify-center text-center group/btn shadow-sm">
                        <app.icon className="w-6 h-6 text-slate-400 group-hover/btn:text-white mb-2" />
                        <h4 className="text-white font-bold text-sm">{app.name}</h4>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-indigo-200 mt-1">{app.sub}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* 2. Top Tier Metrics Engine */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Live Operating Capital */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-black p-8 rounded-2xl shadow-xl border border-gray-800 relative overflow-hidden group">
               <div className="absolute right-8 top-8 opacity-20"><Building2 className="w-24 h-24 text-white" /></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                     <span className="flex items-center gap-2 text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-1">
                        Operating Capital
                     </span>
                     <div className="flex items-end gap-3 mt-1">
                        <h2 className="text-4xl font-black text-white font-mono tracking-tight">₹{FleishNetBalance.toLocaleString()}</h2>
                     </div>
                     <p className="text-xs font-semibold text-emerald-400 mt-2 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Routed via {masterConfig.masterUpi}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mt-10">
                     <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Liabilities</p>
                        <p className="text-xl font-bold text-amber-400 flex items-center gap-1 font-mono tracking-tight">- ₹{totalPendingLiabilities.toLocaleString()}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
               <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4"><PiggyBank className="w-5 h-5" /></div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">P&L Platform Profit (Retained Earn)</p>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">₹{totalRealizedProfit.toLocaleString()}</h3>
               </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><ReceiptText className="w-5 h-5" /></div>
                  </div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Items Awaiting Clearance</p>
                  <h3 className="text-3xl font-black text-amber-600 tracking-tight">{ledger.filter(l => l.status !== 'CLEARED').length} Nodes</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-2">Open active ledgers below to finalize processing.</p>
               </div>
            </div>
         </div>

         {/* 3. Deep Tab Systems */}
         <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 p-2 gap-2 overflow-x-auto">
            {[
               { id: 'MASTER', label: 'Complete Ledger', icon: Briefcase },
               { id: 'VENDORS', label: 'Vendor Books', icon: Store },
               { id: 'RIDERS', label: 'Fleet Books', icon: Truck },
               { id: 'TAX_COMPLIANCE', label: 'TDS/GST Tracker', icon: Landmark },
               { id: 'PNL_STATEMENT', label: 'P&L Analytics', icon: Calculator },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                     ? 'bg-indigo-600 text-white shadow-md'
                     : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                     }`}
               >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
               </button>
            ))}
         </div>

         {activeTab === 'PNL_STATEMENT' ? (
            // Advanced P&L View
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
               <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-8">
                  <h2 className="text-2xl font-black text-gray-900">Profit & Loss Summary (Q1 2026)</h2>
                  <button onClick={() => executeMockDownload('GSTR1')} className="flex items-center gap-2 px-5 py-2 bg-gray-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-50 border border-gray-200">
                     <DownloadCloud className="w-4 h-4" /> Export GSTR-1 File
                  </button>
               </div>

               <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                     <span className="text-sm font-bold text-gray-600">Total Topline Inbound Revenue</span>
                     <span className="text-xl font-black text-emerald-600">₹{ledger.filter(l => l.transactionType === 'INBOUND_REVENUE').reduce((a, c) => a + c.grossAmount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                     <span className="text-sm font-bold text-gray-600">Cost of Goods / Payouts Sent (COGS)</span>
                     <span className="text-xl font-black text-red-500">- ₹{(ledger.filter(l => l.transactionType === 'VENDOR_PAYOUT' || l.transactionType === 'RIDER_WAGE').reduce((a, c) => a + Math.abs(c.netAmount), 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                     <span className="text-sm font-black text-indigo-900 uppercase">Gross Retained Margin (Pre-Tax)</span>
                     <span className="text-2xl font-black text-indigo-600 font-mono tracking-tight">₹{totalRealizedProfit.toLocaleString()}</span>
                  </div>
               </div>
            </div>
         ) : (
            // General Embedded Ledger Tables
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="relative w-[400px]">
                     <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                     <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={`Search ${activeTab.toLowerCase()} by Invoice No or Party...`} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
               </div>

               {loading ? (
                  <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                     <Loader2 className="w-8 h-8 animate-spin mb-3" />
                     <p className="text-sm font-semibold">Loading ledger data...</p>
                  </div>
               ) : error ? (
                  <div className="p-12 text-center">
                     <p className="text-sm text-red-600 font-semibold">{error}</p>
                     <button onClick={fetchLedger} className="mt-3 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">Try Again</button>
                  </div>
               ) : displayedLedger.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                     <p className="text-sm font-semibold">{searchTerm ? 'No ledger entries match your search.' : 'No ledger entries found.'}</p>
                  </div>
               ) : (
                  <div className="overflow-x-auto">
                     <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white border-b border-gray-100">
                           <tr>
                              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Document Target</th>
                              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Receiving Method</th>
                              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Net Calculus</th>
                              <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right pr-6">Action & Audit</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {displayedLedger.map((entry) => (
                              <tr key={entry.id} className="hover:bg-indigo-50/30 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                       <span className="font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => traverseToProfile(entry.partyType)}>{entry.partyName} <ExternalLink className="inline w-3 h-3 text-gray-300 group-hover:text-indigo-600" /></span>
                                       <span className="text-xs font-bold text-gray-500 flex gap-2">
                                          {entry.invoiceNo} • <span className="text-indigo-600">{entry.partyType}</span>
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {entry.recipientBankDetails ? (
                                       <div className="flex flex-col gap-1 text-xs font-bold text-gray-600">
                                          <span>{entry.recipientBankDetails.type === 'UPI' ? 'UPI Route' : 'RTGS/NEFT'}: {entry.recipientBankDetails.target}</span>
                                          {entry.recipientBankDetails.ifsc && <span>IFSC: {entry.recipientBankDetails.ifsc}</span>}
                                       </div>
                                    ) : <span className="text-xs text-gray-400 font-bold">Internal Processing Node</span>}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <span className={`text-base font-black font-mono flex flex-col items-end ${entry.netAmount > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                                       {entry.netAmount > 0 ? '+' : '-'}₹{Math.abs(entry.netAmount).toLocaleString()}
                                    </span>
                                    {(entry.tdsHold > 0 || entry.platformFee > 0) && (
                                       <span className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1">
                                          *Includes Tax Deductions
                                       </span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 text-right pr-6">
                                    <div className="flex flex-col items-end gap-2">
                                       <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${entry.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                          'bg-amber-50 text-amber-700 border-amber-200'
                                          }`}>
                                          {entry.status === 'CLEARED' && <CheckCircle2 className="w-3 h-3" />}
                                          {entry.status}
                                       </span>

                                       {canEdit && (
                                          <button onClick={() => setActiveAuditEntry(entry)} className="text-[10px] font-black text-indigo-700 uppercase tracking-widest hover:underline flex items-center gap-1">
                                             Open Case Details <ArrowUpRight className="w-3 h-3" />
                                          </button>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               )}
            </div>
         )}

         {/* 4. Slide-over: Send Direct Ad-Hoc Money (Journal Entry) */}
         {isManualSettlementOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
               <form onSubmit={executeDirectSettlement} className="w-[600px] h-full bg-gray-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                  <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-start">
                     <div>
                        <h2 className="text-xl font-black text-gray-900 flex gap-2 items-center">
                           <FilePlus className="w-5 h-5 text-emerald-600" /> Create Settlement Transact
                        </h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Send Arbitrary Capital to Entities</p>
                     </div>
                     <button type="button" onClick={() => setIsManualSettlementOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* PAYMENT SUCCESS OVERLAY */}
                  {paymentSuccess && (
                     <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 space-y-4">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/50">
                           <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-emerald-600 uppercase tracking-widest">Remittance Successful</h2>
                        <p className="text-sm font-bold text-gray-600 text-center max-w-sm">₹{getManualNetCalc().toLocaleString()} has been securely dispatched directly from the Master Corporate account to {manualSettleObj.partyName}.</p>
                     </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-8 space-y-6 relative">

                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Transfer Targeting Requirements</h3>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Destination Node Type</label>
                           <select required value={manualSettleObj.partyType} onChange={e => setManualSettleObj({ ...manualSettleObj, partyType: e.target.value as PartyType })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                              <option value="VENDOR">Vendor Settlement / Butcher Shop</option>
                              <option value="RIDER">Delivery Rider Wage Transfer</option>
                              <option value="CUSTOMER">Customer Refund Generation</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Exact Recipient / Shop Name</label>
                           <input required type="text" value={manualSettleObj.partyName} onChange={e => setManualSettleObj({ ...manualSettleObj, partyName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Royal Fresh Chicken" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Recipient Banking Route / UPI ID</label>
                           <input required type="text" value={manualSettleObj.bankAccount} onChange={e => setManualSettleObj({ ...manualSettleObj, bankAccount: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Target UPI or Bank Acc" />
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2">Financial Calculus Engine</h3>

                        <div>
                           <label className="block text-xs font-black text-gray-900 uppercase mb-2">Base Gross Transfer Amount (₹)</label>
                           <input required type="number" value={manualSettleObj.amount} onChange={e => setManualSettleObj({ ...manualSettleObj, amount: e.target.value })} className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xl font-black font-mono focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0.00" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                           <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Percent className="w-4 h-4" /> Apply Platform Operational Fee (3%)</span>
                           <input type="checkbox" checked={manualSettleObj.applyPlatformFee} onChange={e => setManualSettleObj({ ...manualSettleObj, applyPlatformFee: e.target.checked })} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                           <span className="text-sm font-bold text-gray-700 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Deduct Statutory TDS Section 194-O (1%)</span>
                           <input type="checkbox" checked={manualSettleObj.applyTds} onChange={e => setManualSettleObj({ ...manualSettleObj, applyTds: e.target.checked })} className="w-5 h-5 accent-red-600 rounded cursor-pointer" />
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center bg-emerald-50 p-4 rounded-xl">
                           <span className="text-sm font-black text-emerald-900 uppercase">Live Calculated Net Dispatch</span>
                           <span className="text-3xl font-black text-emerald-600 font-mono tracking-tight">₹{getManualNetCalc().toLocaleString()}</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-200 bg-white">
                     <button type="submit" disabled={isProcessingPayment} className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-xl hover:bg-emerald-700 transition-colors disabled:bg-emerald-400">
                        {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        {isProcessingPayment ? 'Executing Encrypted Over-Air Transfer...' : `Direct Master Push ₹${getManualNetCalc().toLocaleString()}`}
                     </button>
                  </div>
               </form>
            </div>
         )}

         {/* 5. Existing Final Close Slide-over */}
         {activeAuditEntry && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
               <form onSubmit={executeFinalAudit} className="w-[600px] h-full bg-gray-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                  <div className="px-8 py-6 bg-white border-b border-gray-200 flex justify-between items-start">
                     <div>
                        <h2 className="text-xl font-black text-gray-900 flex gap-2 items-center">
                           <ShieldCheck className="w-5 h-5 text-indigo-600" /> Payment & Audit Matrix
                        </h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">{activeAuditEntry.invoiceNo}</p>
                     </div>
                     <div className="flex gap-2">
                        <button type="button" onClick={() => executeMockDownload('EXCEL')} className="p-2 border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg">
                           <FileSpreadsheet className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => executeMockDownload('PDF')} className="p-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                           <FileText className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setActiveAuditEntry(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                           <X className="w-5 h-5" />
                        </button>
                     </div>
                  </div>

                  {paymentSuccess && (
                     <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 space-y-4">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                           <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-emerald-600 uppercase tracking-widest">Remittance Successful</h2>
                        <p className="text-sm font-bold text-gray-600 text-center max-w-sm">₹{parseFloat(customAmountStr).toLocaleString()} Dispatched from <strong>{masterConfig.bankName}</strong>.</p>
                     </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-8 space-y-6 relative">
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                           <Users className="w-4 h-4" /> Target Entity Information
                        </h3>
                        <div className="flex items-center gap-4 mb-6">
                           <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-indigo-50 text-indigo-700`}>
                              {activeAuditEntry.partyName.charAt(0)}
                           </div>
                           <div>
                              <p className="text-xl font-black text-gray-900">{activeAuditEntry.partyName}</p>
                              <p className="text-xs font-black text-indigo-600 tracking-widest uppercase mt-0.5">{activeAuditEntry.partyType.replace('_', ' ')} NODE</p>
                           </div>
                        </div>
                        <button type="button" onClick={() => traverseToProfile(activeAuditEntry.partyType)} className="w-full mt-6 py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-indigo-600 rounded-lg border border-gray-100 flex justify-center items-center gap-2">
                           Open Full {activeAuditEntry.partyType.replace('_', ' ')} Profile <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                     </div>

                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Capital Constraints & Settle Amount</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
                              <span>Gross Authorization</span>
                              <span>₹{Math.abs(activeAuditEntry.grossAmount).toLocaleString()}</span>
                           </div>
                           {activeAuditEntry.platformFee > 0 && (
                              <div className="flex justify-between items-center text-sm font-semibold text-indigo-600">
                                 <span>Platform Revenue Component (-cut)</span>
                                 <span>- ₹{activeAuditEntry.platformFee.toLocaleString()}</span>
                              </div>
                           )}
                           <div className="pt-4 border-t border-gray-200">
                              <label className="block text-xs font-black text-gray-900 uppercase mb-2">Final Remittance Amount Dispatched (₹)</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-3 text-gray-500 font-bold">₹</span>
                                 <input type="number" required value={customAmountStr} onChange={e => setCustomAmountStr(e.target.value)} disabled={activeAuditEntry.status === 'CLEARED'} className="w-full pl-8 pr-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-2xl font-black font-mono focus:ring-2 focus:ring-emerald-500 outline-none" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 border-t border-gray-200 bg-white z-20">
                     {activeAuditEntry.status !== 'CLEARED' ? (
                        <button type="submit" disabled={isProcessingPayment} className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-400">
                           {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                           {isProcessingPayment ? 'Transmitting...' : `Execute ₹${parseFloat(customAmountStr) || 0} Payment`}
                        </button>
                     ) : (
                        <button type="button" onClick={() => setActiveAuditEntry(null)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-sm hover:bg-gray-800 transition-colors">
                           Close Inspected File
                        </button>
                     )}
                  </div>
               </form>
            </div>
         )}

         {/* 6. Settings Modal */}
         {isBankSettingsOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-gray-100 bg-indigo-50/50">
                     <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5 text-indigo-600" /> Authorized Liquidity Nodes
                     </h3>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setIsBankSettingsOpen(false); }} className="p-6 space-y-6">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Master Bank Identifier</label>
                        <input required value={masterConfig.bankName} onChange={e => setMasterConfig({ ...masterConfig, bankName: e.target.value })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Current Account No.</label>
                           <input required value={masterConfig.accNumber} onChange={e => setMasterConfig({ ...masterConfig, accNumber: e.target.value })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Node Route (IFSC)</label>
                           <input required value={masterConfig.ifsc} onChange={e => setMasterConfig({ ...masterConfig, ifsc: e.target.value })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-semibold focus:ring-2 focus:ring-indigo-500 outline-none uppercase" />
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Automated Master UPI Gateway</label>
                        <input required value={masterConfig.masterUpi} onChange={e => setMasterConfig({ ...masterConfig, masterUpi: e.target.value })} type="text" className="w-full px-4 py-3 bg-indigo-50/50 border border-indigo-200 text-indigo-900 rounded-xl text-sm font-mono font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="business@bank" />
                     </div>

                     <div className="flex gap-3 pt-6 border-t border-gray-100">
                        <button type="button" onClick={() => setIsBankSettingsOpen(false)} className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors">Discard</button>
                        <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">Inject Keys to Network</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}

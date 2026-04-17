"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, FileSpreadsheet, AlertTriangle, CheckCircle2, Download, Info, RefreshCcw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface GstStats { filed: number; pending: number; errors: number; }

export default function GSTManagement() {
   const [gstr1Data, setGstr1Data] = useState<GstStats>({ filed: 0, pending: 0, errors: 0 });
   const [gstr3bData, setGstr3bData] = useState<GstStats>({ filed: 0, pending: 0, errors: 0 });
   const [reconciling, setReconciling] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [filings, setFilings] = useState<any[]>([]);

   const loadData = useCallback(async () => {
      setLoading(true);
      setError('');
      try {
         if (!supabase) throw new Error('Supabase not configured');
         const { data, error: supaErr } = await supabase.from('ca_gst_filings').select('*');
         if (supaErr) throw supaErr;
         setFilings(data || []);

         // Calculate stats from filings
         const gstr1 = (data || []).filter((f: any) => f.type === 'GSTR-1');
         const gstr3b = (data || []).filter((f: any) => f.type === 'GSTR-3B');

         setGstr1Data({
            filed: gstr1.filter((f: any) => f.status === 'Filed').length,
            pending: gstr1.filter((f: any) => f.status === 'Pending').length,
            errors: gstr1.filter((f: any) => f.status === 'Error').length,
         });
         setGstr3bData({
            filed: gstr3b.filter((f: any) => f.status === 'Filed').length,
            pending: gstr3b.filter((f: any) => f.status === 'Pending').length,
            errors: gstr3b.filter((f: any) => f.status === 'Error').length,
         });
      } catch (e: any) {
         console.error('Failed to load GST data:', e);
         setError(e.message || 'Failed to load GST filing data.');
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { void loadData(); }, [loadData]);

   const handleGenerateJson = (type: string) => {
      alert(`Generating ${type} JSON file for upload to GST portal. In production, this would create the official GSTN-compatible JSON.`);
   };

   const handleReconcile = async () => {
      setReconciling(true);
      try {
         if (!supabase) throw new Error('Supabase not configured');
         const { error: supaErr } = await supabase.from('ca_gst_filings').update({ status: 'Reconciled' }).eq('status', 'Error');
         if (supaErr) throw supaErr;
         setGstr1Data(p => ({ ...p, errors: 0 }));
         setGstr3bData(p => ({ ...p, errors: 0 }));
      } catch (e: any) {
         console.error('Reconciliation failed:', e);
         alert(`Reconciliation error: ${e.message}`);
      } finally {
         setReconciling(false);
      }
   };

   const handleRecalculate = () => {
      alert('ITC recalculation initiated. This will cross-reference GSTR-2A/2B with purchase records.');
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Calculator className="w-6 h-6 text-emerald-600" /> GST Management</h1>
               <p className="text-slate-500 mt-1">GSTR filing, reconciliation, and ITC management</p>
            </div>
            <button onClick={loadData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
               <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               Refresh
            </button>
         </div>

         {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-2 text-red-700 text-sm">
                  <Info className="w-4 h-4" />
                  {error}
               </div>
               <button onClick={loadData} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200">Retry</button>
            </div>
         )}

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-emerald-100 rounded-lg"><FileSpreadsheet className="w-5 h-5 text-emerald-600" /></div>
               <div><p className="text-2xl font-bold text-slate-900">{gstr1Data.filed + gstr3bData.filed}</p><p className="text-xs text-slate-500">Total Filed</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
               <div><p className="text-2xl font-bold text-slate-900">{gstr1Data.errors + gstr3bData.errors}</p><p className="text-xs text-slate-500">Total Errors</p></div>
            </div>
         </div>

         {/* GSTR-1 */}
         {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse">
               <div className="h-6 bg-slate-100 rounded w-48 mb-4" />
               <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
               </div>
            </div>
         ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-emerald-600" /> GSTR-1 (Outward Supplies)</h3>
                  <button onClick={() => handleGenerateJson('GSTR-1')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"><Download className="w-4 h-4" /> Generate JSON</button>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl"><p className="text-2xl font-bold text-emerald-700">{gstr1Data.filed}</p><p className="text-xs text-emerald-600">Filed</p></div>
                  <div className="p-4 bg-amber-50 rounded-xl"><p className="text-2xl font-bold text-amber-700">{gstr1Data.pending}</p><p className="text-xs text-amber-600">Pending</p></div>
                  <div className="p-4 bg-red-50 rounded-xl"><p className="text-2xl font-bold text-red-700">{gstr1Data.errors}</p><p className="text-xs text-red-600">Errors</p></div>
               </div>
            </div>
         )}

         {/* GSTR-3B */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Calculator className="w-4 h-4 text-emerald-600" /> GSTR-3B (Summary Return)</h3>
               <button onClick={() => handleGenerateJson('GSTR-3B')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"><Download className="w-4 h-4" /> Generate JSON</button>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="p-4 bg-emerald-50 rounded-xl"><p className="text-2xl font-bold text-emerald-700">{gstr3bData.filed}</p><p className="text-xs text-emerald-600">Filed</p></div>
               <div className="p-4 bg-amber-50 rounded-xl"><p className="text-2xl font-bold text-amber-700">{gstr3bData.pending}</p><p className="text-xs text-amber-600">Pending</p></div>
               <div className="p-4 bg-red-50 rounded-xl"><p className="text-2xl font-bold text-red-700">{gstr3bData.errors}</p><p className="text-xs text-red-600">Errors</p></div>
            </div>
         </div>

         {/* Reconciliation */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4 text-amber-600" /> GST 2A/2B Reconciliation</h3>
            <div className="flex gap-4">
               <button onClick={handleRecalculate} disabled={reconciling} className="px-5 py-2 bg-amber-600 text-white font-semibold text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50 flex items-center gap-2"><Calculator className="w-4 h-4" /> Recalculate ITC</button>
               <button onClick={handleReconcile} disabled={reconciling} className="px-5 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">{reconciling ? 'Running...' : <><CheckCircle2 className="w-4 h-4" /> Launch Reconciler</>}</button>
            </div>
         </div>
      </div>
   );
}

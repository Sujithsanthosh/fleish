"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, ExternalLink, Shield, MapPin, UserX, AlertCircle } from 'lucide-react';

const FALLBACK_CUSTOMERS = [
   { id: 'CUS-819', fullName: 'Rahul Verma', phone: '+91 9884100912', email: 'rahul.v@gmail.com', status: 'ACTIVE', location: 'Delhi NCR', issues: 4, isActive: true },
   { id: 'CUS-411', fullName: 'Priya Sharma', phone: '+91 9910244192', email: 'priya.sharma99@yahoo.com', status: 'FLAGGED', location: 'Mumbai Central', issues: 12, isActive: true },
   { id: 'CUS-911', fullName: 'Karan Singh', phone: '+91 8810291921', email: 'karan.s202@outlook.com', status: 'ACTIVE', location: 'Bangalore', issues: 0, isActive: true },
];

export default function CustomersPage() {
   const [customers, setCustomers] = useState<any[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [stats, setStats] = useState({ total: 0, active: 0, flagged: 0 });

   const loadCustomers = async () => {
      try {
         setLoading(true);
         setError('');
         const data = await api.getCustomers();
         const customerArr = Array.isArray(data) ? data : [];
         setCustomers(customerArr);

         setStats({
            total: customerArr.length,
            active: customerArr.filter((c: any) => c.isActive !== false && c.status !== 'FLAGGED').length,
            flagged: customerArr.filter((c: any) => c.status === 'FLAGGED' || c.isActive === false).length,
         });
      } catch (e: any) {
         console.error('Failed to load customers:', e);
         setError(`Failed to load customers: ${e.message}`);
         setCustomers([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      loadCustomers();
   }, []);

   const handleBan = async (id: string, currentStatus: boolean) => {
      try {
         await api.banCustomer(id, !currentStatus);
         setCustomers(prev => prev.map(c => c.id === id ? { ...c, isActive: !currentStatus, status: !currentStatus ? 'FLAGGED' : 'ACTIVE' } : c));
      } catch (e: any) {
         console.error('Failed to ban customer:', e);
         setError(`Failed to update customer: ${e.message}`);
         loadCustomers();
      }
   };

   const filtered = customers.filter(c =>
      !searchTerm ||
      c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   if (loading) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div><h1 className="text-2xl font-bold text-slate-900">Customer Directory</h1><p className="text-slate-500 mt-1">Manage customer accounts and moderation</p></div>
            <div className="flex gap-3">
               <button onClick={loadCustomers} disabled={loading} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
                  {loading ? 'Loading...' : 'Refresh'}
               </button>
               <div className="relative w-72">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search customers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
               </div>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
               <p className="text-xs font-semibold text-slate-500 uppercase">Total Customers</p>
               <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
               <p className="text-xs font-semibold text-emerald-600 uppercase">Active</p>
               <p className="text-2xl font-black text-emerald-900 mt-1">{stats.active}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
               <p className="text-xs font-semibold text-red-600 uppercase">Flagged/Banned</p>
               <p className="text-2xl font-black text-red-900 mt-1">{stats.flagged}</p>
            </div>
         </div>

         {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-2 text-red-700"><AlertCircle className="w-4 h-4" />{error}<button onClick={loadCustomers} className="ml-auto text-sm font-bold underline hover:text-red-900">Retry</button></div>}

         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Contact</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                     <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filtered.map(c => (
                     <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">{(c.fullName || c.phone || '?').charAt(0)}</div>
                              <div><p className="text-sm font-bold text-slate-900">{c.fullName || 'Unknown'}</p><p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{c.location || 'N/A'}</p></div>
                           </div>
                        </td>
                        <td className="px-6 py-4 space-y-1">
                           <p className="text-xs text-slate-600">{c.phone || 'N/A'}</p><p className="text-xs text-slate-600">{c.email || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                           {c.status === 'FLAGGED' || !c.isActive ? (
                              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 w-max"><Shield className="w-3 h-3" /> Flagged</span>
                           ) : (
                              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 w-max">Active</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleBan(c.id, c.isActive !== false)} className="p-2 border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg" title={c.isActive === false ? 'Unban' : 'Ban'}><UserX className="w-4 h-4" /></button>
                        </td>
                     </tr>
                  ))}
                  {filtered.length === 0 && !loading && <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm">No customers found</td></tr>}
               </tbody>
            </table>
         </div>
      </div>
   );
}

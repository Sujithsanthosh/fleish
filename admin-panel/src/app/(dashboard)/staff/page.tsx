"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Shield, AlertCircle } from 'lucide-react';

const BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000') : 'http://localhost:3000';

async function api(path: string) {
   const r = await fetch(BASE + path);
   return r.ok ? r.json() : [];
}

export default function GlobalIAMStaffing() {
   const [users, setUsers] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [search, setSearch] = useState('');
   const [showForm, setShowForm] = useState(false);
   const [newUser, setNewUser] = useState({ phone: '', fullName: '', email: '', role: 'CUSTOMER' });

   const fetchData = async () => {
      try {
         setLoading(true);
         const [c, r, v] = await Promise.all([api('/customers'), api('/riders'), api('/vendors')]);
         const all = [
            ...(Array.isArray(c) ? c : []).map((u: any) => ({ ...u, panelType: 'CUSTOMER' })),
            ...(Array.isArray(r) ? r : []).map((u: any) => ({ ...u, panelType: 'RIDER' })),
            ...(Array.isArray(v) ? v : []).map((x: any) => ({ id: x.id, phone: x.owner?.phone || '', fullName: x.shopName || '', role: 'VENDOR', panelType: 'VENDOR' })),
         ];
         setUsers(all);
         setError('');
      } catch (e: any) { setError(String(e)); setUsers([]); }
      finally { setLoading(false); }
   };

   useEffect(() => { void fetchData(); }, []);

   const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await fetch(BASE + '/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
         setNewUser({ phone: '', fullName: '', email: '', role: 'CUSTOMER' });
         setShowForm(false);
         void fetchData();
      } catch (e: any) { alert(`Failed: ${e}`); }
   };

   const filtered = search ? users.filter(u => u.phone?.includes(search) || u.fullName?.toLowerCase().includes(search.toLowerCase())) : users;

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-slate-900">Global IAM Staffing</h1>
               <p className="text-slate-500 mt-1">Manage users across all panels</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
               <Plus className="w-4 h-4" /> Create User
            </button>
         </div>
         {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm">{error} <button onClick={() => void fetchData()} className="ml-2 underline">Retry</button></div>}
         {showForm && (
            <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="Phone" value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                  <input type="text" placeholder="Name" value={newUser.fullName} onChange={e => setNewUser(p => ({ ...p, fullName: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                     <option value="CUSTOMER">Customer</option><option value="VENDOR">Vendor</option><option value="RIDER">Rider</option><option value="ADMIN">Admin</option>
                  </select>
               </div>
               <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg">Create</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg">Cancel</button>
               </div>
            </form>
         )}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
               <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
               </div>
            </div>
            {loading ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div> : (
               <div className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                     <div key={u.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-600" /></div>
                           <div><p className="text-sm font-semibold text-slate-900">{u.fullName || u.phone || 'Unknown'}</p><p className="text-xs text-slate-500">{u.role} • {u.panelType} • {u.phone}</p></div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">{u.isActive !== false ? 'Active' : 'Inactive'}</span>
                     </div>
                  ))}
                  {filtered.length === 0 && <div className="p-12 text-center text-slate-500">No users found</div>}
               </div>
            )}
         </div>
      </div>
   );
}

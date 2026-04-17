"use client";

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, AlertCircle, DollarSign } from 'lucide-react';

const BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000') : 'http://localhost:3000';

async function api(path: string, opts?: RequestInit) {
   const r = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
   return r.ok ? r.json() : [];
}

export default function MasterHRControl() {
   const [employees, setEmployees] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [search, setSearch] = useState('');
   const [showForm, setShowForm] = useState(false);
   const [newEmp, setNewEmp] = useState({ fullName: '', phone: '', email: '', role: 'ADMIN', fcmToken: '' });

   const fetchData = async () => {
      try {
         setLoading(true);
         const data = await api('/customers');
         const riders = await api('/riders');
         const all = [
            ...(Array.isArray(data) ? data : []).map((u: any) => ({ ...u, department: 'Customers', position: 'Customer' })),
            ...(Array.isArray(riders) ? riders : []).map((u: any) => ({ ...u, department: 'Delivery', position: 'Rider' })),
         ];
         setEmployees(all);
         setError('');
      } catch (e: any) { setError(String(e)); setEmployees([]); }
      finally { setLoading(false); }
   };

   useEffect(() => { void fetchData(); }, []);

   const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await api('/customers', { method: 'POST', body: JSON.stringify(newEmp) });
         setNewEmp({ fullName: '', phone: '', email: '', role: 'ADMIN', fcmToken: '' });
         setShowForm(false);
         void fetchData();
      } catch (e: any) { alert(`Failed: ${e}`); }
   };

   const handleSalaryOverride = async (id: string) => {
      const amount = prompt('Enter new monthly compensation:');
      if (!amount) return;
      alert(`Salary override of ₹${amount} recorded for user ${id}. In production, this would update the payroll system.`);
   };

   const filtered = search ? employees.filter(e => e.fullName?.toLowerCase().includes(search.toLowerCase()) || e.phone?.includes(search)) : employees;

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-slate-900">Master HR Control</h1>
               <p className="text-slate-500 mt-1">Employee management, compensation, and org structure</p>
            </div>
            <div className="flex gap-3">
               <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
                  <Users className="w-4 h-4" /> Add Employee
               </button>
               <button onClick={() => void fetchData()} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200">
                  <RefreshCw className="w-4 h-4" /> Sync
               </button>
            </div>
         </div>

         {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm">{error} <button onClick={() => void fetchData()} className="ml-2 underline">Retry</button></div>}

         {showForm && (
            <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
               <h3 className="text-sm font-bold text-slate-900">New Employee</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Full Name" value={newEmp.fullName} onChange={e => setNewEmp(p => ({ ...p, fullName: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  <input type="text" placeholder="Phone" value={newEmp.phone} onChange={e => setNewEmp(p => ({ ...p, phone: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                  <input type="email" placeholder="Email" value={newEmp.email} onChange={e => setNewEmp(p => ({ ...p, email: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
               </div>
               <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg">Create</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg">Cancel</button>
               </div>
            </form>
         )}

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
               { label: 'Total Staff', value: employees.length, color: 'bg-slate-100 text-slate-700' },
               { label: 'Customers', value: employees.filter(e => e.department === 'Customers').length, color: 'bg-blue-100 text-blue-700' },
               { label: 'Riders', value: employees.filter(e => e.department === 'Delivery').length, color: 'bg-emerald-100 text-emerald-700' },
               { label: 'Active', value: employees.filter(e => e.isActive !== false).length, color: 'bg-green-100 text-green-700' },
            ].map(s => (
               <div key={s.label} className={`p-4 rounded-xl ${s.color}`}>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs font-semibold">{s.label}</p>
               </div>
            ))}
         </div>

         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
               <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
               </div>
            </div>

            {loading ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" /></div> : (
               <div className="divide-y divide-slate-100">
                  {filtered.map((emp) => (
                     <div key={emp.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-emerald-600" /></div>
                           <div>
                              <p className="text-sm font-semibold text-slate-900">{emp.fullName || emp.phone || 'Unknown'}</p>
                              <p className="text-xs text-slate-500">{emp.department} • {emp.position} • {emp.phone}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className={`text-xs font-semibold px-2 py-1 rounded-full ${emp.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{emp.isActive !== false ? 'Active' : 'Inactive'}</span>
                           <button onClick={() => handleSalaryOverride(emp.id)} className="p-2 text-slate-400 hover:text-emerald-600" title="Override Compensation"><DollarSign className="w-4 h-4" /></button>
                        </div>
                     </div>
                  ))}
                  {filtered.length === 0 && <div className="p-12 text-center text-slate-500">No employees found</div>}
               </div>
            )}
         </div>
      </div>
   );
}

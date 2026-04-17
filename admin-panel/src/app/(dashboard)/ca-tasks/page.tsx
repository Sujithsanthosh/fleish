"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CheckSquare, Plus, Clock, User, Trash2, Info, RefreshCcw, Loader2, Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRealtime } from '@/hooks/useRealtime';

interface Task { id: string; title: string; assignee: string; due: string; status: 'TODO' | 'IN_PROGRESS' | 'DONE'; priority: string; }

export default function TaskManagement() {
   const [tasks, setTasks] = useState<Task[]>([]);
   const [showForm, setShowForm] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [newTask, setNewTask] = useState({ title: '', assignee: '', due: '', priority: 'MEDIUM' });
   const [useRealtimeData, setUseRealtimeData] = useState(false);

   const { data: realtimeData, loading: rtLoading, error: rtError } = useRealtime({
      table: 'ca_tasks',
      enabled: useRealtimeData,
      onInsert: (payload) => console.log('New item added'),
      onUpdate: (payload) => console.log('Item updated'),
   });

   useEffect(() => {
      if (useRealtimeData && realtimeData) {
         setTasks(realtimeData.map((row: any) => ({
            id: row.id || `TSK-${Math.random().toString(36).slice(2, 5)}`,
            title: row.title || '',
            assignee: row.assignee || 'Unassigned',
            due: row.due || '',
            status: row.status || 'TODO',
            priority: row.priority || 'MEDIUM',
         })));
      }
   }, [useRealtimeData, realtimeData]);

   const loadTasks = useCallback(async () => {
      setLoading(true);
      setError('');
      try {
         if (!supabase) throw new Error('Supabase not configured');
         const { data, error: supaErr } = await supabase.from('ca_tasks').select('*');
         if (supaErr) throw supaErr;
         setTasks((data || []).map((row: any) => ({
            id: row.id || `TSK-${Math.random().toString(36).slice(2, 5)}`,
            title: row.title || '',
            assignee: row.assignee || 'Unassigned',
            due: row.due || '',
            status: row.status || 'TODO',
            priority: row.priority || 'MEDIUM',
         })));
      } catch (e: any) {
         console.error('Failed to load CA tasks:', e);
         setError(e.message || 'Failed to load task data.');
         setTasks([]);
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => { void loadTasks(); }, [loadTasks]);

   const moveTask = async (id: string, status: Task['status']) => {
      try {
         if (!supabase) throw new Error('Supabase not configured');
         const { error: supaErr } = await supabase.from('ca_tasks').update({ status }).eq('id', id);
         if (supaErr) throw supaErr;
         setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      } catch (e: any) {
         console.error('Failed to move task:', e);
         setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      }
   };

   const deleteTask = async (id: string) => {
      try {
         if (!supabase) throw new Error('Supabase not configured');
         const { error: supaErr } = await supabase.from('ca_tasks').delete().eq('id', id);
         if (supaErr) throw supaErr;
      } catch (e: any) {
         console.error('Failed to delete task:', e);
      }
      setTasks(prev => prev.filter(t => t.id !== id));
   };

   const createTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTask.title) return;
      try {
         if (!supabase) throw new Error('Supabase not configured');
         const { data, error: supaErr } = await supabase.from('ca_tasks').insert([{
            ...newTask, status: 'TODO',
         }]).select();
         if (supaErr) throw supaErr;
         if (data && data[0]) {
            setTasks(prev => [...prev, {
               id: data[0].id || `TSK-${Math.random().toString(36).slice(2, 5)}`,
               title: data[0].title || newTask.title,
               assignee: data[0].assignee || newTask.assignee || 'Unassigned',
               due: data[0].due || newTask.due || '',
               status: 'TODO',
               priority: data[0].priority || newTask.priority || 'MEDIUM',
            }]);
         }
         setNewTask({ title: '', assignee: '', due: '', priority: 'MEDIUM' });
         setShowForm(false);
      } catch (e: any) {
         console.error('Failed to create task:', e);
         alert(`Failed: ${e.message}`);
      }
   };

   const columns = [
      { status: 'TODO' as const, title: 'To Do', bg: 'bg-slate-50/50', border: 'border-slate-100', count: 'bg-slate-200 text-slate-600' },
      { status: 'IN_PROGRESS' as const, title: 'In Progress', bg: 'bg-indigo-50/30', border: 'border-indigo-50', count: 'bg-indigo-100 text-indigo-600' },
      { status: 'DONE' as const, title: 'Completed', bg: 'bg-emerald-50/30', border: 'border-emerald-50', count: 'bg-emerald-100 text-emerald-600' },
   ];

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><CheckSquare className="w-6 h-6 text-emerald-600" /> Task Management</h1>
               <p className="text-slate-500 mt-1">Assign tasks, track progress, and enforce deadlines</p>
            </div>
            <div className="flex gap-3">
               <button
                  onClick={() => setUseRealtimeData(!useRealtimeData)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${useRealtimeData ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                  {useRealtimeData ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  {useRealtimeData ? 'Live' : 'Offline'}
               </button>
               <button onClick={loadTasks} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
                  <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
               </button>
               <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"><Plus className="w-4 h-4" /> Create Task</button>
            </div>
         </div>

         {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-2 text-red-700 text-sm">
                  <Info className="w-4 h-4" />
                  {error}
               </div>
               <button onClick={loadTasks} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200">Retry</button>
            </div>
         )}

         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-slate-100 rounded-lg"><CheckSquare className="w-5 h-5 text-slate-600" /></div>
               <div><p className="text-2xl font-bold text-slate-900">{tasks.length}</p><p className="text-xs text-slate-500">Total Tasks</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-amber-100 rounded-lg"><Clock className="w-5 h-5 text-amber-600" /></div>
               <div><p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status !== 'DONE').length}</p><p className="text-xs text-slate-500">Pending</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="p-3 bg-emerald-100 rounded-lg"><CheckSquare className="w-5 h-5 text-emerald-600" /></div>
               <div><p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === 'DONE').length}</p><p className="text-xs text-slate-500">Completed</p></div>
            </div>
         </div>

         {showForm && (
            <form onSubmit={createTask} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input type="text" placeholder="Task title" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} className="md:col-span-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
                  <input type="text" placeholder="Assignee" value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                  <input type="text" placeholder="Due date" value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
               </div>
               <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg">Create</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg">Cancel</button>
               </div>
            </form>
         )}

         {loading ? (
            <div className="flex justify-center py-20">
               <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {columns.map(col => (
                  <div key={col.status} className={`${col.bg} rounded-3xl border ${col.border} p-4`}>
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                        {col.title}
                        <span className={`${col.count} px-2 py-0.5 rounded-full`}>{tasks.filter(t => t.status === col.status).length}</span>
                     </h3>
                     <div className="space-y-4">
                        {tasks.filter(t => t.status === col.status).map(t => (
                           <div key={t.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-2">
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${t.priority === 'CRITICAL' ? 'bg-red-50 text-red-600' : t.priority === 'HIGH' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>{t.priority}</span>
                                 <span className="text-[10px] font-bold text-slate-400">{t.id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">{t.title}</h4>
                              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"><User className="w-3 h-3" />{t.assignee}</span>
                                 <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1"><Clock className="w-3 h-3" />{t.due}</span>
                              </div>
                              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                 {t.status !== 'TODO' && <button onClick={() => moveTask(t.id, 'TODO')} className="flex-1 py-1 text-[10px] font-bold text-slate-500 bg-slate-50 rounded hover:bg-slate-100">← To Do</button>}
                                 {t.status !== 'IN_PROGRESS' && <button onClick={() => moveTask(t.id, 'IN_PROGRESS')} className="flex-1 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100">In Progress</button>}
                                 {t.status !== 'DONE' && <button onClick={() => moveTask(t.id, 'DONE')} className="flex-1 py-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded hover:bg-emerald-100">Done →</button>}
                                 <button onClick={() => deleteTask(t.id)} className="py-1 px-2 text-[10px] font-bold text-red-600 bg-red-50 rounded hover:bg-red-100"><Trash2 className="w-3 h-3" /></button>
                              </div>
                           </div>
                        ))}
                        {tasks.filter(t => t.status === col.status).length === 0 && <div className="h-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center"><p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No tasks</p></div>}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

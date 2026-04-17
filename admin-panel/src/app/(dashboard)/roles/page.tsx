"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Plus, RefreshCcw, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DEFAULT_ROLES = [
  { id: '1', name: 'Super Admin' },
  { id: '2', name: 'Manager' },
  { id: '3', name: 'Agent' },
  { id: '4', name: 'Auditor' },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.from('roles').select('*').order('name');
        if (!error && data && data.length > 0) {
          setRoles(data.map((r: any) => ({ id: r.id.toString(), name: r.name })));
          return;
        }
      }
      setRoles(DEFAULT_ROLES);
    } catch (e) {
      setRoles(DEFAULT_ROLES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadRoles(); }, [loadRoles]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & RBAC</h1>
          <p className="text-slate-500 mt-1">Manage roles and permissions</p>
        </div>
        <button onClick={loadRoles} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-900">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

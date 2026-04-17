"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Globe, Briefcase, Users, Search, Plus, CheckCircle2, XCircle, AlertCircle, RefreshCcw, Loader2 } from 'lucide-react';

const BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000') : 'http://localhost:3000';

async function api(path: string, options?: RequestInit) {
  const r = await fetch(BASE + path, options);
  return r.ok ? r.json() : null;
}

interface Job { id: string; title: string; department: string; type: string; applicants: number; status: string; posted: string; }
interface Application { id: string; jobId: string; candidate: string; status: string; appliedDate: string; }

export default function WebsiteJobsManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', department: '', type: 'Full-time' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobsData, appsData] = await Promise.all([
        api('/jobs').catch(() => null),
        api('/applications').catch(() => null),
      ]);
      if (Array.isArray(jobsData)) setJobs(jobsData);
      if (Array.isArray(appsData)) setApplications(appsData);
    } catch (e) {
      setError('Failed to load data. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await api('/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      if (result) {
        setJobs(prev => [...prev, result]);
      } else {
        // Fallback: add locally
        setJobs(prev => [...prev, { id: `JOB-${Date.now().toString().slice(-3)}`, ...newJob, applicants: 0, status: 'Open', posted: new Date().toISOString().split('T')[0] }]);
      }
      setNewJob({ title: '', department: '', type: 'Full-time' });
      setShowJobForm(false);
    } catch (e) {
      // Fallback: add locally
      setJobs(prev => [...prev, { id: `JOB-${Date.now().toString().slice(-3)}`, ...newJob, applicants: 0, status: 'Open', posted: new Date().toISOString().split('T')[0] }]);
      setNewJob({ title: '', department: '', type: 'Full-time' });
      setShowJobForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await api(`/jobs/${id}`, { method: 'DELETE' });
    } catch (e) { /* ignore backend error */ }
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleAppAction = async (appId: string, action: string) => {
    try {
      await api(`/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
    } catch (e) { /* ignore backend error */ }
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: action } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website & Jobs Manager</h1>
          <p className="text-slate-500 mt-1">Manage job postings and candidate applications</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button onClick={() => setShowJobForm(!showJobForm)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700">
            <Plus className="w-4 h-4" /> Post Job
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
          <button onClick={fetchData} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200">Retry</button>
        </div>
      )}

      {showJobForm && (
        <form onSubmit={handleCreateJob} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">New Job Posting</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Job Title" value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" required />
            <input type="text" placeholder="Department" value={newJob.department} onChange={e => setNewJob(p => ({ ...p, department: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            <select value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
              <option>Full-time</option><option>Part-time</option><option>Contract</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-5 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-lg disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Publishing...' : 'Publish'}
            </button>
            <button type="button" onClick={() => setShowJobForm(false)} className="px-5 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-pulse">
                <div className="h-10 bg-slate-100 rounded-lg mb-2" />
                <div className="h-4 bg-slate-100 rounded w-20" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg"><Globe className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{jobs.length}</p><p className="text-xs text-slate-500">Active Postings</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{applications.length}</p><p className="text-xs text-slate-500">Applications</p></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg"><Briefcase className="w-5 h-5 text-amber-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{applications.filter(a => a.status === 'Interview').length}</p><p className="text-xs text-slate-500">Interviews Scheduled</p></div>
            </div>
          </>
        )}
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200"><h3 className="text-sm font-bold text-slate-900">Job Postings</h3></div>
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="space-y-2"><div className="h-4 bg-slate-100 rounded w-40" /><div className="h-3 bg-slate-100 rounded w-60" /></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No job postings yet.</p>
            <button onClick={() => setShowJobForm(true)} className="mt-2 text-emerald-600 text-sm font-semibold hover:underline">Create your first job posting</button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {jobs.map(j => (
              <div key={j.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{j.title}</p>
                  <p className="text-xs text-slate-500">{j.department} • {j.type} • {j.applicants} applicants • Posted {j.posted}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">{j.status}</span>
                  <button onClick={() => handleDeleteJob(j.id)} className="p-2 text-slate-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applications */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200"><h3 className="text-sm font-bold text-slate-900">Applications</h3></div>
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="space-y-2"><div className="h-4 bg-slate-100 rounded w-32" /><div className="h-3 bg-slate-100 rounded w-48" /></div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold">No applications received yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map(a => (
              <div key={a.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.candidate}</p>
                  <p className="text-xs text-slate-500">{a.jobId} • Applied {a.appliedDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${a.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-700' : a.status === 'Interview' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>{a.status}</span>
                  {a.status === 'Under Review' && (
                    <>
                      <button onClick={() => handleAppAction(a.id, 'Shortlisted')} className="p-2 text-slate-400 hover:text-emerald-600" title="Shortlist"><CheckCircle2 className="w-4 h-4" /></button>
                      <button onClick={() => handleAppAction(a.id, 'Rejected')} className="p-2 text-slate-400 hover:text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

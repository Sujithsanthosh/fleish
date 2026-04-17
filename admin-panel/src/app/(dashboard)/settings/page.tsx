"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Shield, Bell, CreditCard, Globe, Mail, Key, AlertCircle, CheckCircle2, RefreshCcw, Loader2 } from 'lucide-react';

const BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000') : 'http://localhost:3000';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        autoAssign: true,
        codEnabled: true,
        pushNotifications: true,
        twoFactorEnabled: false,
        sessionTimeout: 30,
        deliveryRadius: 10,
        riderPayoutPerDelivery: 40,
        adminEmail: 'admin@fleish.com',
        smtpHost: '',
        smtpPort: '587',
        razorpayKeyId: '',
        firebaseConfig: '',
        webhookUrl: '',
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dataSource, setDataSource] = useState<string>('local');

    const loadSettings = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Try backend API first
            const r = await fetch(`${BASE}/settings`);
            if (r.ok) {
                const data = await r.json();
                setSettings(prev => ({ ...prev, ...data }));
                setDataSource('backend');
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem('admin_settings');
                if (saved) {
                    try { setSettings(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) { /* ignore */ }
                }
                setDataSource('local');
            }
        } catch (e) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_settings');
            if (saved) {
                try { setSettings(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) { /* ignore */ }
            }
            setDataSource('local');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            // Try backend first
            const r = await fetch(`${BASE}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (r.ok) {
                setDataSource('backend');
            } else {
                // Fallback to localStorage
                localStorage.setItem('admin_settings', JSON.stringify(settings));
                setDataSource('local');
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) {
            // Fallback to localStorage
            localStorage.setItem('admin_settings', JSON.stringify(settings));
            setDataSource('local');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        finally { setSaving(false); }
    };

    const update = (key: string, value: any) => setSettings((p: any) => ({ ...p, [key]: value }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Settings className="w-6 h-6" /> System Settings</h1>
                        {dataSource === 'backend' && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border bg-blue-100 text-blue-700 border-blue-200">
                                Backend API
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 mt-1">Configuration, integrations, and feature toggles</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={loadSettings} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button onClick={handleSave} disabled={saving || loading} className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
                        {saved ? <CheckCircle2 className="w-4 h-4" /> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {saved ? 'Saved' : saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-slate-600">Loading settings...</p>
                    </div>
                </div>
            ) : (
                <>

                    {error && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
                    {saved && !error && <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-700 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Settings saved {dataSource === 'backend' ? 'to backend' : 'locally'}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Feature Toggles */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-emerald-600" /> Feature Toggles</h3>
                            <div className="space-y-4">
                                {[
                                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put app in maintenance mode' },
                                    { key: 'autoAssign', label: 'Auto-Assign Orders', desc: 'Automatically assign orders to nearest vendor' },
                                    { key: 'codEnabled', label: 'Cash on Delivery', desc: 'Allow COD payments' },
                                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send push notifications for order updates' },
                                    { key: 'twoFactorEnabled', label: 'Two-Factor Auth (2FA)', desc: 'Require OTP for admin login' },
                                ].map(toggle => (
                                    <div key={toggle.key} className="flex items-center justify-between">
                                        <div><p className="text-sm font-semibold text-slate-900">{toggle.label}</p><p className="text-xs text-slate-500">{toggle.desc}</p></div>
                                        <button onClick={() => update(toggle.key, !(settings as any)[toggle.key])}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${(settings as any)[toggle.key] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${(settings as any)[toggle.key] ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Settings */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-emerald-600" /> Delivery Config</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Delivery Radius (km)</label>
                                    <input type="number" value={settings.deliveryRadius} onChange={e => update('deliveryRadius', parseInt(e.target.value))} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500">Rider Payout per Delivery (₹)</label>
                                    <input type="number" value={settings.riderPayoutPerDelivery} onChange={e => update('riderPayoutPerDelivery', parseInt(e.target.value))} className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Email/SMTP */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><Mail className="w-4 h-4 text-emerald-600" /> Email / SMTP</h3>
                            <div className="space-y-3">
                                <input type="email" placeholder="Admin email" value={settings.adminEmail} onChange={e => update('adminEmail', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                                <input type="text" placeholder="SMTP host" value={settings.smtpHost} onChange={e => update('smtpHost', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                                <input type="text" placeholder="SMTP port" value={settings.smtpPort} onChange={e => update('smtpPort', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                            </div>
                        </div>

                        {/* Payment Gateway */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-emerald-600" /> Payment Gateway</h3>
                            <div className="space-y-3">
                                <input type="text" placeholder="Razorpay Key ID" value={settings.razorpayKeyId} onChange={e => update('razorpayKeyId', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                            </div>
                        </div>

                        {/* Webhooks */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><Key className="w-4 h-4 text-emerald-600" /> Webhooks</h3>
                            <div className="space-y-3">
                                <input type="text" placeholder="Webhook URL" value={settings.webhookUrl} onChange={e => update('webhookUrl', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono" />
                            </div>
                        </div>

                        {/* Firebase */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-emerald-600" /> Firebase (Push Notifications)</h3>
                            <textarea placeholder="Firebase config JSON" value={settings.firebaseConfig} onChange={e => update('firebaseConfig', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono h-24" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

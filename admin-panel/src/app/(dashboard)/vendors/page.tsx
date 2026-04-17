"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Search, Store, MapPin, Star, Edit2, Trash2, Plus, AlertCircle, RefreshCcw, ExternalLink, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VendorsPage() {
   const [vendors, setVendors] = useState<any[]>([]);
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState('');
   const [showForm, setShowForm] = useState(false);
   const [editingVendor, setEditingVendor] = useState<any>(null);
   const [formData, setFormData] = useState({ shopName: '', address: '', latitude: 17.4, longitude: 78.4 });
   const [stats, setStats] = useState({ total: 0, available: 0, unavailable: 0 });

   const loadVendors = async () => {
      try {
         setLoading(true);
         setError('');
         const data = await api.getVendors();
         const vendorArr = Array.isArray(data) ? data : [];
         setVendors(vendorArr);
         setStats({
            total: vendorArr.length,
            available: vendorArr.filter((v: any) => v.isAvailable).length,
            unavailable: vendorArr.filter((v: any) => !v.isAvailable).length,
         });
      } catch (e: any) {
         console.error('Failed to fetch vendors:', e);
         setError(`Failed to load vendors: ${e.message}`);
         // Fallback mock data
         setVendors([
            { id: 'v1', shopName: 'Fresh Meat & Seafood', address: '123 Market Street, Hyderabad', latitude: 17.4065, longitude: 78.4772, rating: 4.8, isAvailable: true },
            { id: 'v2', shopName: 'Organic Chicken Farm', address: '456 Farm Road, Hyderabad', latitude: 17.3616, longitude: 78.4747, rating: 4.5, isAvailable: true },
            { id: 'v3', shopName: 'Premium Seafood Hub', address: '789 Coastal Road, Hyderabad', latitude: 17.4439, longitude: 78.4983, rating: 4.2, isAvailable: false },
         ]);
         setStats({ total: 3, available: 2, unavailable: 1 });
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { loadVendors(); }, []);

   const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         const newVendor = await api.createVendor(formData);
         setVendors(prev => [newVendor, ...prev]);
      } catch {
         setVendors(prev => [{ id: `VND-${Date.now()}`, ...formData, rating: 0, isAvailable: true }, ...prev]);
      }
      setFormData({ shopName: '', address: '', latitude: 17.4, longitude: 78.4 });
      setShowForm(false);
   };

   const handleEdit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingVendor) return;
      try {
         const updated = await api.updateVendor(editingVendor.id, formData);
         setVendors(prev => prev.map(v => v.id === editingVendor.id ? updated : v));
         setEditingVendor(null);
         setFormData({ shopName: '', address: '', latitude: 17.4, longitude: 78.4 });
      } catch (err: any) {
         console.error('Failed to update vendor:', err);
         // Optimistic update
         setVendors(prev => prev.map(v => v.id === editingVendor.id ? { ...v, ...formData } : v));
         setEditingVendor(null);
      }
   };

   const startEdit = (vendor: any) => {
      setEditingVendor(vendor);
      setFormData({
         shopName: vendor.shopName || '',
         address: vendor.address || '',
         latitude: vendor.latitude || 17.4,
         longitude: vendor.longitude || 78.4,
      });
      setShowForm(false);
   };

   const cancelEdit = () => {
      setEditingVendor(null);
      setFormData({ shopName: '', address: '', latitude: 17.4, longitude: 78.4 });
   };

   const handleDelete = async (id: string) => {
      if (!confirm('Delete this vendor?')) return;
      try { await api.deleteVendor(id); } catch { /* optimistic */ }
      setVendors(prev => prev.filter(v => v.id !== id));
   };

   const filtered = vendors.filter(v => !search || v.shopName?.toLowerCase().includes(search.toLowerCase()) || v.address?.toLowerCase().includes(search.toLowerCase()));

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-black bg-gradient-to-r from-[#1a3c28] via-[#234836] to-[#2d5a42] bg-clip-text text-transparent flex items-center gap-3">
                  <Store className="w-8 h-8 text-[#2d5a42]" />
                  Vendor Management
               </h1>
               <p className="text-[#5c3d1f] mt-1">Manage vendor shops, availability, and locations</p>
            </div>
            <div className="flex gap-3">
               <button 
                  onClick={loadVendors} 
                  disabled={loading} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] rounded-xl text-sm font-semibold hover:bg-[#e8f5ed] transition-all disabled:opacity-50"
               >
                  <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                  {loading ? 'Loading...' : 'Refresh'}
               </button>
               <button 
                  onClick={() => setShowForm(!showForm)} 
                  className="px-4 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] rounded-xl text-sm font-semibold hover:shadow-lg flex items-center gap-2 transition-all"
               >
                  <Plus className="w-4 h-4" /> Add Vendor
               </button>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-5 bg-[#faf9f6]/90 backdrop-blur-xl rounded-2xl border border-[#dbc4a4]/40 shadow-lg shadow-[#2d5a42]/5"
            >
               <p className="text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Total Vendors</p>
               <p className="text-3xl font-black text-[#1a3c28] mt-2">{stats.total}</p>
               <div className="mt-2 h-1 bg-[#f0e6d3] rounded-full">
                  <div className="h-full w-full bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-full" />
               </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="p-5 bg-[#e8f5ed]/80 backdrop-blur-xl rounded-2xl border border-[#9dd4b3]/40 shadow-lg"
            >
               <p className="text-xs font-bold text-[#2d5a42] uppercase tracking-wider">Available</p>
               <p className="text-3xl font-black text-[#1a3c28] mt-2">{stats.available}</p>
               <div className="mt-2 h-1 bg-[#f0e6d3] rounded-full">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] rounded-full" />
               </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="p-5 bg-[#fff5f5]/80 backdrop-blur-xl rounded-2xl border border-[#fecaca]/40 shadow-lg"
            >
               <p className="text-xs font-bold text-[#9b2335] uppercase tracking-wider">Unavailable</p>
               <p className="text-3xl font-black text-[#9b2335] mt-2">{stats.unavailable}</p>
               <div className="mt-2 h-1 bg-[#fecaca] rounded-full">
                  <div className="h-full w-1/4 bg-gradient-to-r from-[#9b2335] to-[#c44569] rounded-full" />
               </div>
            </motion.div>
         </div>

         {error && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#fff5f5] border border-[#fecaca] p-4 rounded-2xl flex items-center gap-3 text-[#9b2335]"
            >
               <AlertCircle className="w-5 h-5" />
               <span className="font-medium">{error}</span>
               <button 
                  onClick={loadVendors} 
                  className="ml-auto text-sm font-bold underline hover:text-[#c44569] flex items-center gap-1"
               >
                  <RefreshCcw className="w-4 h-4" /> Retry
               </button>
            </motion.div>
         )}

         {/* Search */}
         <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#a67c52]" />
            <input 
               type="text" 
               placeholder="Search vendors by name or address..." 
               value={search} 
               onChange={e => setSearch(e.target.value)} 
               className="w-full pl-11 pr-4 py-3 bg-[#faf9f6]/80 border border-[#dbc4a4]/50 rounded-xl text-sm text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30 focus:border-[#2d5a42]/50 transition-all"
            />
         </div>

         {/* Add Form */}
         {showForm && !editingVendor && (
            <motion.form 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               onSubmit={handleCreate} 
               className="p-6 bg-[#faf9f6]/90 backdrop-blur-xl rounded-2xl border border-[#dbc4a4]/40 shadow-lg space-y-4"
            >
               <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#2d5a42]" />
                  New Vendor
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                     type="text" 
                     placeholder="Shop Name" 
                     value={formData.shopName} 
                     onChange={e => setFormData(p => ({ ...p, shopName: e.target.value }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                     required 
                  />
                  <input 
                     type="text" 
                     placeholder="Full Address" 
                     value={formData.address} 
                     onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28] placeholder-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                  />
                  <input 
                     type="number" 
                     step="0.0001" 
                     placeholder="Latitude" 
                     value={formData.latitude} 
                     onChange={e => setFormData(p => ({ ...p, latitude: parseFloat(e.target.value) }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                  />
                  <input 
                     type="number" 
                     step="0.0001" 
                     placeholder="Longitude" 
                     value={formData.longitude} 
                     onChange={e => setFormData(p => ({ ...p, longitude: parseFloat(e.target.value) }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/50 border border-[#c49a6c]/40 rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#2d5a42]/30"
                  />
               </div>
               <div className="flex gap-3">
                  <button 
                     type="submit" 
                     className="px-6 py-2.5 bg-gradient-to-r from-[#2d5a42] to-[#3d7a58] text-[#e8f5ed] font-semibold text-sm rounded-xl hover:shadow-lg transition-all"
                  >
                     Create Vendor
                  </button>
                  <button 
                     type="button" 
                     onClick={() => setShowForm(false)} 
                     className="px-6 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] font-semibold text-sm rounded-xl hover:bg-[#e8f5ed] transition-all"
                  >
                     Cancel
                  </button>
               </div>
            </motion.form>
         )}

         {/* Edit Form */}
         {editingVendor && (
            <motion.form 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               onSubmit={handleEdit} 
               className="p-6 bg-gradient-to-br from-[#f0e6d3]/50 to-[#faf9f6]/80 backdrop-blur-xl rounded-2xl border border-[#c49a6c]/40 shadow-lg space-y-4"
            >
               <h3 className="text-lg font-bold text-[#1a3c28] flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-[#8b6914]" />
                  Edit Vendor: {editingVendor.shopName}
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                     type="text" 
                     placeholder="Shop Name" 
                     value={formData.shopName} 
                     onChange={e => setFormData(p => ({ ...p, shopName: e.target.value }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/70 border border-[#c49a6c]/50 rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#8b6914]/30"
                     required 
                  />
                  <input 
                     type="text" 
                     placeholder="Address" 
                     value={formData.address} 
                     onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/70 border border-[#c49a6c]/50 rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#8b6914]/30"
                  />
                  <input 
                     type="number" 
                     step="0.0001" 
                     placeholder="Latitude" 
                     value={formData.latitude} 
                     onChange={e => setFormData(p => ({ ...p, latitude: parseFloat(e.target.value) }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/70 border border-[#c49a6c]/50 rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#8b6914]/30"
                  />
                  <input 
                     type="number" 
                     step="0.0001" 
                     placeholder="Longitude" 
                     value={formData.longitude} 
                     onChange={e => setFormData(p => ({ ...p, longitude: parseFloat(e.target.value) }))} 
                     className="px-4 py-3 bg-[#f0e6d3]/70 border border-[#c49a6c]/50 rounded-xl text-sm text-[#1a3c28] focus:outline-none focus:ring-2 focus:ring-[#8b6914]/30"
                  />
               </div>
               <div className="flex gap-3">
                  <button 
                     type="submit" 
                     className="px-6 py-2.5 bg-gradient-to-r from-[#8b6914] to-[#c49a6c] text-[#faf6f0] font-semibold text-sm rounded-xl hover:shadow-lg transition-all"
                  >
                     Save Changes
                  </button>
                  <button 
                     type="button" 
                     onClick={cancelEdit} 
                     className="px-6 py-2.5 bg-[#f0e6d3] text-[#5c3d1f] font-semibold text-sm rounded-xl hover:bg-[#e8f5ed] transition-all"
                  >
                     Cancel
                  </button>
               </div>
            </motion.form>
         )}

         {/* Vendors Table */}
         <div className="bg-[#faf9f6]/90 backdrop-blur-xl rounded-3xl border border-[#dbc4a4]/40 shadow-xl shadow-[#2d5a42]/10 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-[#f0e6d3]/50 border-b border-[#dbc4a4]/40">
                     <tr>
                        <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Shop</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-[#5c3d1f] uppercase tracking-wider text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dbc4a4]/30">
                     {filtered.map((v, index) => (
                        <motion.tr 
                           key={v.id} 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.05 }}
                           className="hover:bg-[#f0e6d3]/30 transition-colors"
                        >
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2d5a42] to-[#3d7a58] flex items-center justify-center text-[#e8f5ed] font-bold shadow-md">
                                    {v.shopName?.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="font-bold text-[#1a3c28]">{v.shopName}</p>
                                    <p className="text-xs text-[#a67c52]">ID: {v.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-sm text-[#5c3d1f] flex items-center gap-1.5">
                                 <MapPin className="w-4 h-4 text-[#8b6914]" />
                                 {v.address || 'No address'}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                 <Star className="w-4 h-4 text-[#8b6914] fill-[#8b6914]" />
                                 <span className="font-semibold text-[#1a3c28]">{v.rating || 'N/A'}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={cn(
                                 "text-xs font-bold px-3 py-1.5 rounded-full",
                                 v.isAvailable 
                                    ? "bg-[#e8f5ed] text-[#2d5a42]" 
                                    : "bg-[#fff5f5] text-[#9b2335]"
                              )}>
                                 {v.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                 <Link 
                                    href={`/vendors/${v.id}`}
                                    className="p-2 text-[#2d5a42] hover:text-[#e8f5ed] bg-[#e8f5ed] hover:bg-gradient-to-r hover:from-[#2d5a42] hover:to-[#3d7a58] rounded-xl transition-all"
                                    title="View Store"
                                 >
                                    <ExternalLink className="w-4 h-4" />
                                 </Link>
                                 <Link 
                                    href={`https://www.google.com/maps?q=${v.latitude},${v.longitude}`}
                                    target="_blank"
                                    className="p-2 text-[#8b6914] hover:text-[#faf6f0] bg-[#f0e6d3] hover:bg-gradient-to-r hover:from-[#8b6914] hover:to-[#c49a6c] rounded-xl transition-all"
                                    title="View on Map"
                                 >
                                    <Navigation className="w-4 h-4" />
                                 </Link>
                                 <button 
                                    onClick={() => startEdit(v)} 
                                    className="p-2 text-[#5c3d1f] hover:text-[#8b6914] bg-[#f0e6d3] hover:bg-[#faf6f0] rounded-xl transition-all"
                                    title="Quick Edit"
                                 >
                                    <Edit2 className="w-4 h-4" />
                                 </button>
                                 <button 
                                    onClick={() => handleDelete(v.id)} 
                                    className="p-2 text-[#9b2335] hover:text-[#fff5f5] bg-[#fff5f5] hover:bg-[#9b2335] rounded-xl transition-all"
                                    title="Delete"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                     {filtered.length === 0 && !loading && (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center">
                              <Store className="w-12 h-12 text-[#a67c52]/50 mx-auto mb-3" />
                              <p className="text-[#5c3d1f] font-medium">No vendors found</p>
                              <p className="text-sm text-[#a67c52]">Try adjusting your search or add a new vendor</p>
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

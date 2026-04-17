"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Send, Search, Users, Phone, Video, MoreVertical, Paperclip, RefreshCcw, Loader2 } from 'lucide-react';

const BASE = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000') : 'http://localhost:3000';

async function api(path: string) {
   const r = await fetch(BASE + path);
   return r.ok ? r.json() : [];
}

interface Channel { id: string; name: string; type: 'channel' | 'dm'; unread: number; online?: boolean; }
interface Message { id: string | number; sender: string; content: string; time: string; isSelf: boolean; }

export default function CommsHub() {
   const [channels, setChannels] = useState<Channel[]>([]);
   const [activeChannel, setActiveChannel] = useState<string | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [inputMsg, setInputMsg] = useState('');
   const [users, setUsers] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [sending, setSending] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const loadChannels = useCallback(async () => {
      setLoading(true);
      try {
         const [customers, riders] = await Promise.all([api('/customers'), api('/riders')]);
         const cList = Array.isArray(customers) ? customers : [];
         const rList = Array.isArray(riders) ? riders : [];
         const allUsers = [...cList, ...rList];

         // Build channels from backend data
         const ch: Channel[] = [
            { id: 'general', name: '# general', type: 'channel', unread: 0 },
            { id: 'ops', name: '# operations', type: 'channel', unread: 0 },
            { id: 'hr', name: '# hr-announcements', type: 'channel', unread: 0 },
         ];

         // Add DMs for first few users
         allUsers.slice(0, 5).forEach(u => {
            ch.push({
               id: `dm-${u.id}`,
               name: u.fullName || u.phone || u.name || 'Unknown',
               type: 'dm',
               unread: 0,
               online: u.isOnline || false,
            });
         });

         setChannels(ch);
         if (ch.length > 0 && !activeChannel) {
            setActiveChannel(ch[0].id);
         }
      } catch (e) {
         // Fallback to basic channels
         setChannels([
            { id: 'general', name: '# general', type: 'channel', unread: 0 },
            { id: 'ops', name: '# operations', type: 'channel', unread: 0 },
            { id: 'hr', name: '# hr-announcements', type: 'channel', unread: 0 },
         ]);
      } finally {
         setLoading(false);
      }
   }, [activeChannel]);

   const loadMessages = useCallback(async (channelId: string) => {
      try {
         const msgs = await api(`/messages?channel=${channelId}`);
         if (Array.isArray(msgs)) {
            setMessages(msgs.map((m: any) => ({
               id: m.id,
               sender: m.sender || m.userName || 'Unknown',
               content: m.content || m.message || '',
               time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
               isSelf: m.isSelf || false,
            })));
         } else {
            setMessages([]);
         }
      } catch (e) {
         setMessages([]);
      }
   }, []);

   useEffect(() => {
      void loadChannels();
   }, [loadChannels]);

   useEffect(() => {
      if (activeChannel) {
         void loadMessages(activeChannel);
      }
   }, [activeChannel, loadMessages]);

   useEffect(() => {
      const loadUsers = async () => {
         try {
            const [c, r] = await Promise.all([api('/customers'), api('/riders')]);
            setUsers([...(Array.isArray(c) ? c : []), ...(Array.isArray(r) ? r : [])]);
         } catch (e) { /* ignore */ }
      };
      void loadUsers();
   }, []);

   useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

   const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputMsg.trim() || !activeChannel) return;
      setSending(true);
      try {
         const msg = inputMsg.trim();
         // Add to local state optimistically
         setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'You',
            content: msg,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isSelf: true,
         }]);
         setInputMsg('');
      } catch (e) {
         // Still add locally if backend fails
         setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'You',
            content: inputMsg.trim(),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isSelf: true,
         }]);
         setInputMsg('');
      } finally {
         setSending(false);
      }
   };

   const active = channels.find(c => c.id === activeChannel);

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold text-slate-900">Communication Hub</h1>
               <p className="text-slate-500 mt-1">Team chat, direct messages, and announcements</p>
            </div>
            <button onClick={loadChannels} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 disabled:opacity-50">
               <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
               Refresh
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" style={{ height: 'calc(100vh - 220px)' }}>
            {/* Sidebar */}
            <div className="bg-slate-900 rounded-2xl p-4 flex flex-col text-white">
               <div className="flex items-center gap-2 mb-6"><MessageSquare className="w-5 h-5 text-emerald-400" /><h2 className="text-sm font-bold">Fleish Network</h2></div>

               {loading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-emerald-400" /></div>
               ) : (
                  <>
                     <div className="mb-4">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Channels</h3>
                        {channels.filter(c => c.type === 'channel').map(c => (
                           <button key={c.id} onClick={() => setActiveChannel(c.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${activeChannel === c.id ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}>
                              <span>{c.name}</span>
                              {c.unread > 0 && <span className="w-5 h-5 bg-emerald-600 rounded-full text-[10px] flex items-center justify-center">{c.unread}</span>}
                           </button>
                        ))}
                     </div>

                     <div className="mb-4">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Direct Messages</h3>
                        {channels.filter(c => c.type === 'dm').map(c => (
                           <button key={c.id} onClick={() => setActiveChannel(c.id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${activeChannel === c.id ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}>
                              <span className={`w-2 h-2 rounded-full ${c.online ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                              <span>{c.name}</span>
                           </button>
                        ))}
                     </div>

                     <div className="mt-auto pt-4 border-t border-slate-800">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Online Now</h3>
                        <div className="space-y-1">
                           {users.slice(0, 5).map(u => (
                              <div key={u.id} className="flex items-center gap-2 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-400" />{u.fullName || u.phone}</div>
                           ))}
                        </div>
                     </div>
                  </>
               )}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
               <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div>
                     <h2 className="text-sm font-bold text-slate-900">{active?.name || 'Select a channel'}</h2>
                     <p className="text-xs text-slate-500">{messages.length} messages</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-slate-400 hover:text-emerald-600"><Phone className="w-4 h-4" /></button>
                     <button className="p-2 text-slate-400 hover:text-emerald-600"><Video className="w-4 h-4" /></button>
                     <button className="p-2 text-slate-400 hover:text-emerald-600"><MoreVertical className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                     <div className="flex items-center justify-center h-full text-slate-400">
                        <p className="text-sm font-semibold">No messages yet. Start the conversation!</p>
                     </div>
                  ) : (
                     messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.isSelf ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'}`}>
                              {!msg.isSelf && <p className="text-[10px] font-bold text-slate-500 mb-1">{msg.sender}</p>}
                              <p>{msg.content}</p>
                              <p className={`text-[10px] mt-1 ${msg.isSelf ? 'text-emerald-200' : 'text-slate-400'}`}>{msg.time}</p>
                           </div>
                        </div>
                     ))
                  )}
                  <div ref={messagesEndRef} />
               </div>

               <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-3">
                  <button type="button" className="p-2 text-slate-400 hover:text-emerald-600"><Paperclip className="w-5 h-5" /></button>
                  <input type="text" value={inputMsg} onChange={e => setInputMsg(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button type="submit" disabled={!inputMsg.trim() || sending} className="px-6 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
                     {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}

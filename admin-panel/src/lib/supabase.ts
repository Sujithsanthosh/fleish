import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.'
    );
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        realtime: { params: { eventsPerSecond: 10 } },
        global: { headers: { 'x-backend-url': backendUrl } },
    })
    : null;

export const backendApi = {
    async request(endpoint: string, options: RequestInit = {}) {
        const url = `${backendUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }

        return response.json();
    },

    async get(endpoint: string) {
        return this.request(endpoint);
    },

    async post(endpoint: string, data: any) {
        return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) });
    },

    async put(endpoint: string, data: any) {
        return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) });
    },

    async delete(endpoint: string) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};

export { backendUrl };

'use client';

import { create } from 'zustand';

export type Permission = 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'ALL';

export type Module =
  | 'DASHBOARD'
  | 'ORDERS'
  | 'VENDORS'
  | 'CUSTOMERS'
  | 'RIDERS'
  | 'PRODUCTS'
  | 'PAYMENTS'
  | 'SUPPORT_TICKETS'
  | 'ANALYTICS'
  | 'ACCOUNTS'
  | 'ROLES'
  | 'SETTINGS';

export interface UserRole {
  id: string;
  name: string;
  permissions: Record<Module, Permission[]>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string | UserRole;
  avatar?: string;
}

export const DEFAULT_ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: {
    id: '1', name: 'Super Admin',
    permissions: {
      DASHBOARD: ['ALL'], ORDERS: ['ALL'], VENDORS: ['ALL'],
      CUSTOMERS: ['ALL'], RIDERS: ['ALL'], PRODUCTS: ['ALL'],
      PAYMENTS: ['ALL'], ACCOUNTS: ['ALL'], SUPPORT_TICKETS: ['ALL'],
      ANALYTICS: ['ALL'], ROLES: ['ALL'], SETTINGS: ['ALL'],
    },
  },
  MANAGER: {
    id: '2', name: 'Operations Manager',
    permissions: {
      DASHBOARD: ['VIEW'], ORDERS: ['VIEW', 'EDIT'], VENDORS: ['VIEW', 'EDIT'],
      CUSTOMERS: ['VIEW'], RIDERS: ['VIEW', 'EDIT'], PRODUCTS: ['VIEW', 'EDIT'],
      PAYMENTS: ['VIEW'], ACCOUNTS: ['VIEW'], SUPPORT_TICKETS: ['VIEW', 'EDIT'],
      ANALYTICS: ['VIEW'], ROLES: [], SETTINGS: ['VIEW'],
    },
  },
  SUPPORT: {
    id: '3', name: 'Support Staff',
    permissions: {
      DASHBOARD: ['VIEW'], ORDERS: ['VIEW'], VENDORS: ['VIEW'],
      CUSTOMERS: ['VIEW'], RIDERS: ['VIEW'], PRODUCTS: ['VIEW'],
      PAYMENTS: [], ACCOUNTS: [], SUPPORT_TICKETS: ['VIEW', 'CREATE', 'EDIT'],
      ANALYTICS: [], ROLES: [], SETTINGS: [],
    },
  },
};

function resolveRole(role: string | UserRole): UserRole {
  if (typeof role === 'string') return DEFAULT_ROLES[role] || DEFAULT_ROLES.SUPER_ADMIN;
  return role;
}

// Restore auth state from localStorage on init
function getInitialAuth() {
  if (typeof window === 'undefined') {
    return { user: null as User | null, token: null as string | null, isAuthenticated: false };
  }
  const token = localStorage.getItem('admin_token');
  const userStr = localStorage.getItem('admin_user');
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr) as User;
      return { user, token, isAuthenticated: true };
    } catch {
      return { user: null, token: null, isAuthenticated: false };
    }
  }
  return { user: null, token: null, isAuthenticated: false };
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initial = getInitialAuth();
  return {
    user: initial.user,
    token: initial.token,
    isAuthenticated: initial.isAuthenticated,

    login: (user, token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict`;
      }
      set({ user, token, isAuthenticated: true });
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        document.cookie = 'admin_token=; path=/; max-age=0';
      }
      set({ user: null, token: null, isAuthenticated: false });
    },

    hasPermission: (module, action) => {
      const user = get().user;
      if (!user) return false;
      const role = resolveRole(user.role);
      const perms = role.permissions[module];
      if (!perms) return false;
      return perms.includes('ALL') || perms.includes(action);
    },
  };
});

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (module: Module, action: Permission) => boolean;
}

"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

// Types for all data entities
export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  fssaiNumber: string;
  submittedAt: string;
  approvedAt?: string;
  commissionRate: number;
  monthlyRevenue: number;
  totalOrders: number;
  rating: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'bicycle' | 'bike' | 'scooter';
  vehicleNumber: string;
  licenseNumber: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  submittedAt: string;
  approvedAt?: string;
  totalDeliveries: number;
  rating: number;
  earnings: number;
  weeklyHours: number;
}

export interface JobApplication {
  id: string;
  jobId: number;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  linkedin: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  appliedAt: string;
  experience: string;
  skills: string[];
  notes: string;
}

export interface Job {
  id: number;
  title: string;
  dept: string;
  location: string;
  type: 'Full-Time' | 'Part-Time' | 'Contract';
  desc: string;
  skills: string[];
  salary: string;
  exp: string;
  status: 'active' | 'paused' | 'closed';
  postedAt: string;
  applicants: number;
  views: number;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  category: 'order' | 'payment' | 'delivery' | 'refund' | 'account' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  responses: TicketResponse[];
  rating?: number;
}

export interface TicketResponse {
  id: string;
  sender: 'customer' | 'support';
  message: string;
  timestamp: string;
  attachments?: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscription: 'free' | 'basic' | 'pro';
  totalOrders: number;
  totalSpent: number;
  lastOrderAt: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'blocked';
  rating: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  partnerId?: string;
  partnerName?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  deliveredAt?: string;
  deliveryAddress: string;
  deliveryNotes?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  discount: number;
  features: string[];
  color: string;
  active: boolean;
  subscribers: number;
  revenue: number;
}

export interface FinancialTransaction {
  id: string;
  type: 'subscription' | 'vendor_commission' | 'delivery_payout' | 'refund' | 'promo_discount';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  from: string;
  to: string;
  description: string;
  createdAt: string;
  completedAt?: string;
}

// Context Type
interface RealTimeDataContextType {
  vendors: Vendor[];
  deliveryPartners: DeliveryPartner[];
  jobApplications: JobApplication[];
  jobs: Job[];
  supportTickets: SupportTicket[];
  customers: Customer[];
  orders: Order[];
  pricingPlans: PricingPlan[];
  transactions: FinancialTransaction[];
  
  // Actions
  updateVendor: (id: string, data: Partial<Vendor>) => void;
  updatePartner: (id: string, data: Partial<DeliveryPartner>) => void;
  updateJob: (id: number, data: Partial<Job>) => void;
  updateJobApplication: (id: string, data: Partial<JobApplication>) => void;
  updateTicket: (id: string, data: Partial<SupportTicket>) => void;
  addTicketResponse: (ticketId: string, response: TicketResponse) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  updatePricingPlan: (id: string, data: Partial<PricingPlan>) => void;
  addTransaction: (transaction: FinancialTransaction) => void;
  
  // Stats
  stats: DashboardStats;
}

interface DashboardStats {
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  totalPartners: number;
  activePartners: number;
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingTickets: number;
  openJobs: number;
  totalApplications: number;
  conversionRate: number;
}

// Create Context
const RealTimeDataContext = createContext<RealTimeDataContextType | null>(null);

// Initial Mock Data
const initialVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Rajesh Kumar',
    email: 'rajesh@meatking.com',
    phone: '+91 98765 43210',
    shopName: 'Meat King',
    location: 'Hyderabad',
    status: 'approved',
    fssaiNumber: '12345678901234',
    submittedAt: '2024-01-15',
    approvedAt: '2024-01-16',
    commissionRate: 12,
    monthlyRevenue: 450000,
    totalOrders: 1200,
    rating: 4.8
  },
  {
    id: 'v2',
    name: 'Priya Sharma',
    email: 'priya@freshcuts.com',
    phone: '+91 98765 43211',
    shopName: 'Fresh Cuts',
    location: 'Bangalore',
    status: 'approved',
    fssaiNumber: '12345678901235',
    submittedAt: '2024-02-10',
    approvedAt: '2024-02-11',
    commissionRate: 8,
    monthlyRevenue: 320000,
    totalOrders: 850,
    rating: 4.6
  },
  {
    id: 'v3',
    name: 'Amit Patel',
    email: 'amit@shop.com',
    phone: '+91 98765 43212',
    shopName: 'Premium Meats',
    location: 'Mumbai',
    status: 'pending',
    fssaiNumber: '12345678901236',
    submittedAt: '2024-04-12',
    commissionRate: 0,
    monthlyRevenue: 0,
    totalOrders: 0,
    rating: 0
  }
];

const initialPartners: DeliveryPartner[] = [
  {
    id: 'p1',
    name: 'Ramesh K.',
    email: 'ramesh@email.com',
    phone: '+91 98765 43220',
    vehicleType: 'bike',
    vehicleNumber: 'TS 09 AB 1234',
    licenseNumber: 'DL1234567890',
    location: 'Hyderabad',
    status: 'approved',
    submittedAt: '2024-01-20',
    approvedAt: '2024-01-21',
    totalDeliveries: 1500,
    rating: 4.9,
    earnings: 675000,
    weeklyHours: 48
  },
  {
    id: 'p2',
    name: 'Suresh P.',
    email: 'suresh@email.com',
    phone: '+91 98765 43221',
    vehicleType: 'scooter',
    vehicleNumber: 'KA 01 CD 5678',
    licenseNumber: 'DL0987654321',
    location: 'Bangalore',
    status: 'approved',
    submittedAt: '2024-02-15',
    approvedAt: '2024-02-16',
    totalDeliveries: 2100,
    rating: 4.7,
    earnings: 780000,
    weeklyHours: 52
  },
  {
    id: 'p3',
    name: 'Vikram S.',
    email: 'vikram@email.com',
    phone: '+91 98765 43222',
    vehicleType: 'bicycle',
    vehicleNumber: 'N/A',
    licenseNumber: 'N/A',
    location: 'Chennai',
    status: 'pending',
    submittedAt: '2024-04-12',
    totalDeliveries: 0,
    rating: 0,
    earnings: 0,
    weeklyHours: 0
  }
];

const initialJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Full-Stack Developer',
    dept: 'Engineering',
    location: 'Hyderabad',
    type: 'Full-Time',
    desc: 'Build and scale our real-time delivery infrastructure using Next.js, Node.js, and PostgreSQL.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    salary: '₹20-35 LPA',
    exp: '4-8 years',
    status: 'active',
    postedAt: '2024-03-01',
    applicants: 45,
    views: 1250
  },
  {
    id: 2,
    title: 'Operations Manager',
    dept: 'Operations',
    location: 'Hyderabad',
    type: 'Full-Time',
    desc: 'Oversee daily delivery operations across multiple cities.',
    skills: ['Logistics', 'Analytics', 'Team Management'],
    salary: '₹12-18 LPA',
    exp: '5-10 years',
    status: 'active',
    postedAt: '2024-03-15',
    applicants: 28,
    views: 890
  },
  {
    id: 3,
    title: 'Customer Support Lead',
    dept: 'Support',
    location: 'Remote',
    type: 'Full-Time',
    desc: 'Lead our 24/7 customer support team.',
    skills: ['CX Strategy', 'Team Leadership', 'Zendesk'],
    salary: '₹8-14 LPA',
    exp: '3-6 years',
    status: 'active',
    postedAt: '2024-03-20',
    applicants: 62,
    views: 1560
  }
];

const initialApplications: JobApplication[] = [
  {
    id: 'ja1',
    jobId: 1,
    jobTitle: 'Senior Full-Stack Developer',
    name: 'Arun Kumar',
    email: 'arun@email.com',
    phone: '+91 98765 43230',
    resume: 'resume_arun.pdf',
    coverLetter: 'I am excited to apply for this position...',
    linkedin: 'linkedin.com/in/arunkumar',
    status: 'shortlisted',
    appliedAt: '2024-04-10',
    experience: '5 years',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    notes: 'Strong technical background, good cultural fit'
  },
  {
    id: 'ja2',
    jobId: 2,
    jobTitle: 'Operations Manager',
    name: 'Sneha Reddy',
    email: 'sneha@email.com',
    phone: '+91 98765 43231',
    resume: 'resume_sneha.pdf',
    coverLetter: 'With 7 years of logistics experience...',
    linkedin: 'linkedin.com/in/snehareddy',
    status: 'new',
    appliedAt: '2024-04-12',
    experience: '7 years',
    skills: ['Logistics', 'Analytics', 'Team Management'],
    notes: ''
  }
];

const initialTickets: SupportTicket[] = [
  {
    id: 't1',
    customerId: 'c1',
    customerName: 'Vikram Rao',
    customerEmail: 'vikram@email.com',
    subject: 'Order not delivered',
    message: 'My order was supposed to be delivered 2 hours ago but still not received.',
    category: 'delivery',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2024-04-12T10:30:00',
    assignedTo: 'Support Agent 1',
    responses: [
      {
        id: 'r1',
        sender: 'customer',
        message: 'My order was supposed to be delivered 2 hours ago but still not received.',
        timestamp: '2024-04-12T10:30:00'
      },
      {
        id: 'r2',
        sender: 'support',
        message: 'I apologize for the delay. Let me check with the delivery partner and get back to you.',
        timestamp: '2024-04-12T10:35:00'
      }
    ]
  },
  {
    id: 't2',
    customerId: 'c2',
    customerName: 'Priya Patel',
    customerEmail: 'priya@email.com',
    subject: 'Payment failed but amount deducted',
    message: 'I tried to pay for my order but it failed, yet ₹500 was deducted from my account.',
    category: 'payment',
    priority: 'urgent',
    status: 'open',
    createdAt: '2024-04-12T14:15:00',
    responses: [
      {
        id: 'r3',
        sender: 'customer',
        message: 'I tried to pay for my order but it failed, yet ₹500 was deducted from my account.',
        timestamp: '2024-04-12T14:15:00'
      }
    ]
  },
  {
    id: 't3',
    customerId: 'c3',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@email.com',
    subject: 'How to upgrade subscription?',
    message: 'I want to upgrade from Basic to Pro plan. How do I do that?',
    category: 'account',
    priority: 'low',
    status: 'resolved',
    createdAt: '2024-04-11T09:00:00',
    resolvedAt: '2024-04-11T09:30:00',
    assignedTo: 'Support Agent 2',
    responses: [
      {
        id: 'r4',
        sender: 'customer',
        message: 'I want to upgrade from Basic to Pro plan. How do I do that?',
        timestamp: '2024-04-11T09:00:00'
      },
      {
        id: 'r5',
        sender: 'support',
        message: 'You can upgrade by going to Settings > Subscription and selecting the Pro plan.',
        timestamp: '2024-04-11T09:15:00'
      },
      {
        id: 'r6',
        sender: 'customer',
        message: 'Thank you, I have upgraded successfully!',
        timestamp: '2024-04-11T09:30:00'
      }
    ],
    rating: 5
  }
];

const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Vikram Rao',
    email: 'vikram@email.com',
    phone: '+91 98765 43300',
    subscription: 'pro',
    totalOrders: 45,
    totalSpent: 28500,
    lastOrderAt: '2024-04-12',
    joinedAt: '2024-01-10',
    status: 'active',
    rating: 4.8
  },
  {
    id: 'c2',
    name: 'Priya Patel',
    email: 'priya@email.com',
    phone: '+91 98765 43301',
    subscription: 'basic',
    totalOrders: 23,
    totalSpent: 12500,
    lastOrderAt: '2024-04-10',
    joinedAt: '2024-02-15',
    status: 'active',
    rating: 4.5
  },
  {
    id: 'c3',
    name: 'Rahul Sharma',
    email: 'rahul@email.com',
    phone: '+91 98765 43302',
    subscription: 'pro',
    totalOrders: 67,
    totalSpent: 42300,
    lastOrderAt: '2024-04-11',
    joinedAt: '2023-12-20',
    status: 'active',
    rating: 4.9
  }
];

const initialOrders: Order[] = [
  {
    id: 'o1',
    customerId: 'c1',
    customerName: 'Vikram Rao',
    vendorId: 'v1',
    vendorName: 'Meat King',
    partnerId: 'p1',
    partnerName: 'Ramesh K.',
    items: [
      { id: 'i1', name: 'Chicken Breast', quantity: 2, price: 250, total: 500 },
      { id: 'i2', name: 'Mutton Curry Cut', quantity: 1, price: 450, total: 450 }
    ],
    total: 950,
    status: 'delivered',
    paymentStatus: 'paid',
    createdAt: '2024-04-12T12:00:00',
    deliveredAt: '2024-04-12T13:15:00',
    deliveryAddress: '123 Main St, Hyderabad'
  },
  {
    id: 'o2',
    customerId: 'c2',
    customerName: 'Priya Patel',
    vendorId: 'v2',
    vendorName: 'Fresh Cuts',
    items: [
      { id: 'i3', name: 'Fish Fillet', quantity: 3, price: 300, total: 900 }
    ],
    total: 900,
    status: 'preparing',
    paymentStatus: 'paid',
    createdAt: '2024-04-12T15:00:00',
    deliveryAddress: '456 Park Ave, Bangalore'
  }
];

const initialPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    discount: 0,
    features: ['Standard delivery', 'Basic tracking', 'All vendors'],
    color: 'emerald',
    active: true,
    subscribers: 15420,
    revenue: 0
  },
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 99,
    yearlyPrice: 950,
    discount: 20,
    features: ['Free delivery ₹199+', '5% discount', 'Priority support'],
    color: 'cyan',
    active: true,
    subscribers: 8750,
    revenue: 866250
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 199,
    yearlyPrice: 1900,
    discount: 20,
    features: ['Free delivery ALL', '10% discount', '24/7 Premium support', 'Family sharing'],
    color: 'orange',
    active: true,
    subscribers: 3420,
    revenue: 680580
  }
];

const initialTransactions: FinancialTransaction[] = [
  {
    id: 'tx1',
    type: 'subscription',
    amount: 199,
    status: 'completed',
    from: 'Customer: Vikram Rao',
    to: 'Fleish Technologies',
    description: 'Pro Plan Monthly Subscription',
    createdAt: '2024-04-12T00:00:00',
    completedAt: '2024-04-12T00:00:01'
  },
  {
    id: 'tx2',
    type: 'vendor_commission',
    amount: 54000,
    status: 'completed',
    from: 'Vendor: Meat King',
    to: 'Fleish Technologies',
    description: 'Monthly Commission (12%)',
    createdAt: '2024-04-01T00:00:00',
    completedAt: '2024-04-01T00:00:01'
  },
  {
    id: 'tx3',
    type: 'delivery_payout',
    amount: 45000,
    status: 'completed',
    from: 'Fleish Technologies',
    to: 'Partner: Ramesh K.',
    description: 'Weekly Payout',
    createdAt: '2024-04-10T00:00:00',
    completedAt: '2024-04-10T00:00:01'
  }
];

// Provider Component
export function RealTimeDataProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(initialPartners);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(initialApplications);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialTickets);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(initialPricingPlans);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions);

  // Calculate stats
  const stats: DashboardStats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'approved').length,
    pendingVendors: vendors.filter(v => v.status === 'pending').length,
    totalPartners: deliveryPartners.length,
    activePartners: deliveryPartners.filter(p => p.status === 'approved').length,
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalOrders: orders.length,
    todayOrders: orders.filter(o => o.createdAt.startsWith(new Date().toISOString().split('T')[0])).length,
    totalRevenue: transactions.filter(t => t.status === 'completed' && (t.type === 'subscription' || t.type === 'vendor_commission')).reduce((sum, t) => sum + t.amount, 0),
    monthlyRevenue: pricingPlans.reduce((sum, p) => sum + p.revenue, 0),
    pendingTickets: supportTickets.filter(t => t.status === 'open' || t.status === 'in-progress').length,
    openJobs: jobs.filter(j => j.status === 'active').length,
    totalApplications: jobApplications.length,
    conversionRate: Math.round((jobApplications.filter(ja => ja.status === 'hired').length / jobApplications.length) * 100) || 0
  };

  // Update functions
  const updateVendor = useCallback((id: string, data: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  }, []);

  const updatePartner = useCallback((id: string, data: Partial<DeliveryPartner>) => {
    setDeliveryPartners(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const updateJob = useCallback((id: number, data: Partial<Job>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
  }, []);

  const updateJobApplication = useCallback((id: string, data: Partial<JobApplication>) => {
    setJobApplications(prev => prev.map(ja => ja.id === id ? { ...ja, ...data } : ja));
  }, []);

  const updateTicket = useCallback((id: string, data: Partial<SupportTicket>) => {
    setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const addTicketResponse = useCallback((ticketId: string, response: TicketResponse) => {
    setSupportTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { ...t, responses: [...t.responses, response] }
        : t
    ));
  }, []);

  const updateOrder = useCallback((id: string, data: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
  }, []);

  const updateCustomer = useCallback((id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const updatePricingPlan = useCallback((id: string, data: Partial<PricingPlan>) => {
    setPricingPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const addTransaction = useCallback((transaction: FinancialTransaction) => {
    setTransactions(prev => [transaction, ...prev]);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random order updates
      if (Math.random() > 0.7) {
        const randomOrder = orders[Math.floor(Math.random() * orders.length)];
        if (randomOrder && randomOrder.status !== 'delivered' && randomOrder.status !== 'cancelled') {
          const statuses: Order['status'][] = ['pending', 'confirmed', 'preparing', 'ready', 'picked', 'delivered'];
          const currentIndex = statuses.indexOf(randomOrder.status);
          if (currentIndex < statuses.length - 1) {
            updateOrder(randomOrder.id, { status: statuses[currentIndex + 1] });
          }
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [orders, updateOrder]);

  const value: RealTimeDataContextType = {
    vendors,
    deliveryPartners,
    jobs,
    jobApplications,
    supportTickets,
    customers,
    orders,
    pricingPlans,
    transactions,
    updateVendor,
    updatePartner,
    updateJob,
    updateJobApplication,
    updateTicket,
    addTicketResponse,
    updateOrder,
    updateCustomer,
    updatePricingPlan,
    addTransaction,
    stats
  };

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
}

// Custom Hook
export function useRealTimeData() {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
}

export default useRealTimeData;

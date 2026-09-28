export type Language = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark';

export type ServiceType = 
  | 'electric' 
  | 'plumbing' 
  | 'ac' 
  | 'computer' 
  | 'repair' 
  | 'other';

export type OrderStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: ServiceType;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  price: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}

export interface TechnicianProfile {
  name: string;
  phone: string;
  specialty: string;
  workHours: string;
  currency: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type ActiveTab = 'dashboard' | 'customers' | 'orders' | 'schedule' | 'revenue' | 'settings';
